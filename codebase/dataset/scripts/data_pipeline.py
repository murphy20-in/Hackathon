import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

"""
SurakṣāMārga.ai -- Crime Data Processing Pipeline
===============================================
Processes all raw crime datasets into a unified final.csv
with schema: id, latitude, longitude, crime_type, timestamp, area_name

Data sources:
  1. South Crime Details.xlsx -- Individual incident records with lat/lon (9241 rows)
  2. CRIME_REVIEW_*.csv (8 files) — Monthly aggregated crime statistics for Bangalore
  3. bm_all_data-checkpoint.txt — Bangalore Mirror news articles (2601 records)

Strategy:
  - XLSX: Direct extraction (has lat/lon, date, crime type, police station)
  - CSVs: Expand aggregate counts into synthetic individual records within Bangalore bounds
  - TXT/JSON: Extract crime type from title, date from auth_datetime, assign area from content
"""

import pandas as pd
import numpy as np
import json
import re
import os
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(r"D:\Hackathon\dataset")
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
SCRIPTS_DIR = BASE_DIR / "scripts"
FINAL_OUTPUT = BASE_DIR / "final.csv"

# Bangalore bounding box (for synthetic coordinate generation)
BLR_LAT_MIN, BLR_LAT_MAX = 12.85, 13.10
BLR_LON_MIN, BLR_LON_MAX = 77.45, 77.78
BLR_CENTER = (12.9716, 77.5946)

# Police station approximate coordinates (South Bangalore)
STATION_COORDS = {
    "banashankari":      (12.9255, 77.5468),
    "basavanagudi":      (12.9430, 77.5737),
    "c k achuktu":       (12.9500, 77.5750),
    "girinagar":         (12.9360, 77.5560),
    "hanumantha nagar":  (12.9450, 77.5650),
    "j p nagar":         (12.9070, 77.5850),
    "jayanagar":         (12.9300, 77.5840),
    "k g nagar":         (12.9410, 77.5580),
    "k s layout":        (12.9080, 77.5510),
    "konanakunte":       (12.8950, 77.5670),
    "puttenahalli":      (12.9000, 77.5750),
    "shankarapua":       (12.9550, 77.5800),
    "siddapura":         (12.9350, 77.5960),
    "subramanyapura":    (12.8880, 77.5450),
    "thalaghtappura":    (12.9100, 77.5400),
    "v v puram":         (12.9480, 77.5700),
}

# Bangalore area coordinates for distributing synthetic data
BANGALORE_AREAS = {
    "koramangala":       (12.9352, 77.6245),
    "indiranagar":       (12.9784, 77.6408),
    "whitefield":        (12.9698, 77.7500),
    "electronic city":   (12.8399, 77.6770),
    "hsr layout":        (12.9116, 77.6389),
    "marathahalli":      (12.9591, 77.7009),
    "btm layout":        (12.9166, 77.6101),
    "jayanagar":         (12.9299, 77.5838),
    "jp nagar":          (12.9077, 77.5854),
    "banashankari":      (12.9255, 77.5468),
    "malleshwaram":      (12.9970, 77.5707),
    "rajajinagar":       (12.9870, 77.5550),
    "hebbal":            (13.0358, 77.5970),
    "yelahanka":         (13.1007, 77.5963),
    "kr puram":          (13.0098, 77.6952),
    "majestic":          (12.9767, 77.5713),
    "shivajinagar":      (12.9857, 77.6050),
    "mg road":           (12.9756, 77.6063),
    "brigade road":      (12.9720, 77.6070),
    "cubbon park":       (12.9763, 77.5929),
    "vijayanagar":       (12.9700, 77.5330),
    "basaveshwaranagar": (12.9880, 77.5400),
    "peenya":            (13.0287, 77.5184),
    "yeshwanthpur":      (13.0220, 77.5500),
    "sadashivanagar":    (13.0060, 77.5800),
    "wilson garden":     (12.9490, 77.5930),
    "richmond town":     (12.9630, 77.5930),
    "frazer town":       (12.9980, 77.6130),
    "ulsoor":            (12.9820, 77.6210),
    "domlur":            (12.9610, 77.6380),
    "sarjapur road":     (12.9100, 77.6800),
    "bommanahalli":      (12.9020, 77.6180),
    "begur":             (12.8750, 77.6200),
    "silk board":        (12.9172, 77.6225),
    "madiwala":          (12.9220, 77.6170),
    "bannerghatta road": (12.8870, 77.5970),
    "kanakapura road":   (12.8900, 77.5550),
}

# Crime type normalization mapping
CRIME_TYPE_MAP = {
    # IPC Major heads → simplified types
    "murder": "murder",
    "attempt to murder": "attempted_murder",
    "culpable homicide": "culpable_homicide",
    "kidnapping": "kidnapping",
    "kidnap": "kidnapping",
    "abduction": "kidnapping",
    "dacoity": "dacoity",
    "robbery": "robbery",
    "burglary": "burglary",
    "theft": "theft",
    "2 wheeler theft": "vehicle_theft",
    "4 wheeler theft": "vehicle_theft",
    "motor vehicle theft": "vehicle_theft",
    "chain snatching": "chain_snatching",
    "riot": "rioting",
    "assault": "assault",
    "hurt": "assault",
    "rape": "rape",
    "molestation": "molestation",
    "sexual harassment": "sexual_harassment",
    "dowry": "dowry_crime",
    "cruelty by husband": "domestic_violence",
    "cheating": "cheating",
    "counterfeiting": "counterfeiting",
    "forgery": "forgery",
    "arson": "arson",
    "criminal breach of trust": "breach_of_trust",
    "cyber crime": "cyber_crime",
    "stalking": "stalking",
    "acid attack": "acid_attack",
    "chain-snatching": "chain_snatching",
    "narcotics": "narcotics",
    "ndps": "narcotics",
    "arms act": "arms_violation",
    "gambling": "gambling",
    "prohibition": "prohibition",
    "excise": "excise_violation",
    "missing": "missing_person",
    "unnatural death": "unnatural_death",
    "accident": "accident",
    "negligent": "negligence",
    "affray": "affray",
    "trespass": "trespass",
    "criminal intimidation": "criminal_intimidation",
    "eve teasing": "eve_teasing",
    "abetment": "abetment",
    "pocso": "child_abuse",
    "protection of children": "child_abuse",
}

# Women-safety relevant crime types (for severity marking)
WOMEN_SAFETY_CRIMES = {
    "rape", "molestation", "sexual_harassment", "stalking",
    "kidnapping", "acid_attack", "domestic_violence",
    "dowry_crime", "eve_teasing", "chain_snatching",
    "child_abuse", "assault", "murder", "attempted_murder",
    "robbery", "dacoity",
}


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def ensure_dirs():
    """Create directory structure."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    print("[SETUP] Directory structure ready")


def normalize_crime_type(raw_type):
    """Map raw crime type string to standardized category."""
    if pd.isna(raw_type) or not isinstance(raw_type, str):
        return "other"
    raw_lower = raw_type.lower().strip()
    # Direct match
    for key, val in CRIME_TYPE_MAP.items():
        if key in raw_lower:
            return val
    return "other"


def add_jitter(lat, lon, radius_m=500):
    """Add random jitter within radius (meters) to coordinates."""
    # ~111,000 meters per degree latitude
    lat_jitter = np.random.uniform(-radius_m, radius_m) / 111000
    lon_jitter = np.random.uniform(-radius_m, radius_m) / (111000 * np.cos(np.radians(lat)))
    return lat + lat_jitter, lon + lon_jitter


def is_valid_bangalore_coord(lat, lon):
    """Check if coordinates are within Bangalore bounds."""
    return (BLR_LAT_MIN <= lat <= BLR_LAT_MAX and
            BLR_LON_MIN <= lon <= BLR_LON_MAX)


def random_bangalore_coord():
    """Generate random coordinate within Bangalore."""
    area_name, (lat, lon) = list(BANGALORE_AREAS.items())[
        np.random.randint(0, len(BANGALORE_AREAS))
    ]
    jittered_lat, jittered_lon = add_jitter(lat, lon, radius_m=800)
    return jittered_lat, jittered_lon, area_name


def parse_dms_to_decimal(dms_str):
    """Parse DMS string like '12°55'3.65\"N' to decimal degrees."""
    try:
        # Handle various DMS formats
        cleaned = str(dms_str).replace('°', ' ').replace("'", ' ').replace('"', ' ')
        cleaned = cleaned.replace('�', ' ')  # Handle encoding issues
        parts = cleaned.strip().split()
        if len(parts) >= 3:
            deg = float(parts[0])
            mins = float(parts[1])
            secs = float(parts[2].rstrip('NSEW'))
            decimal = deg + mins / 60 + secs / 3600
            if any(c in str(dms_str).upper() for c in ['S', 'W']):
                decimal = -decimal
            return decimal
    except (ValueError, IndexError):
        pass
    return None


def extract_month_year_from_filename(filename):
    """Extract month and year from CRIME_REVIEW filename."""
    months = {
        'january': 1, 'february': 2, 'march': 3, 'april': 4,
        'may': 5, 'june': 6, 'july': 7, 'august': 8,
        'september': 9, 'october': 10, 'november': 11, 'december': 12
    }
    fname_lower = filename.lower()
    month_num = None
    year = None
    for month_name, num in months.items():
        if month_name in fname_lower:
            month_num = num
            break
    year_match = re.search(r'(20\d{2})', filename)
    if year_match:
        year = int(year_match.group(1))
    return month_num, year


def generate_id(row_data):
    """Generate deterministic unique ID from row data."""
    data_str = str(row_data)
    return hashlib.md5(data_str.encode()).hexdigest()[:12]


# ============================================================
# PROCESSOR 1: South Crime Details.xlsx
# ============================================================

def process_xlsx():
    """Process South Crime Details.xlsx — the richest dataset with real lat/lon."""
    print("\n" + "=" * 60)
    print("[XLSX] Processing South Crime Details.xlsx")
    print("=" * 60)

    filepath = BASE_DIR / "South Crime Details.xlsx"
    df = pd.read_excel(filepath, sheet_name="Sheet1")
    print(f"  Raw rows: {len(df)}")

    records = []
    skipped = 0

    for idx, row in df.iterrows():
        # Parse latitude
        lat = None
        lon = None
        try:
            lat = float(row['Latitude'])
            lon = float(row['Longitude'])
        except (ValueError, TypeError):
            # Try DMS parsing
            lat = parse_dms_to_decimal(row.get('Latitude'))
            lon = parse_dms_to_decimal(row.get('Longitude'))

        # Validate coordinates
        if lat is not None and lon is not None:
            if not is_valid_bangalore_coord(lat, lon):
                # Try if lat/lon are strings with embedded coordinates
                if lat > 1000 or lon > 1000:
                    lat, lon = None, None

        # Fallback to station coordinates
        station = str(row.get('Police Station', '')).lower().strip()
        area_name = row.get('Police Station', 'Unknown')
        if lat is None or lon is None or not is_valid_bangalore_coord(lat, lon):
            if station in STATION_COORDS:
                lat, lon = add_jitter(*STATION_COORDS[station], radius_m=1000)
                area_name = row.get('Police Station', 'Unknown')
            else:
                lat, lon, area_name = random_bangalore_coord()

        # Parse crime type
        crime_type = normalize_crime_type(str(row.get('Type', 'other')))

        # Parse timestamp
        timestamp = None
        date_val = row.get('Date')
        time_val = row.get('Time')
        try:
            if pd.notna(date_val):
                if isinstance(date_val, str):
                    # Try common formats
                    for fmt in ['%d/%m/%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%d-%m-%Y']:
                        try:
                            timestamp = datetime.strptime(date_val.strip(), fmt)
                            break
                        except ValueError:
                            continue
                elif isinstance(date_val, (pd.Timestamp, datetime)):
                    timestamp = pd.Timestamp(date_val).to_pydatetime()
        except Exception:
            pass

        if timestamp is None:
            # Use year as fallback
            year = row.get('Year')
            if pd.notna(year):
                try:
                    year = int(float(year))
                    month = np.random.randint(1, 13)
                    day = np.random.randint(1, 29)
                    timestamp = datetime(year, month, day)
                except (ValueError, TypeError):
                    timestamp = datetime(2018, 1, 1)  # Default
            else:
                skipped += 1
                continue

        # Add time component if available
        if time_val and pd.notna(time_val):
            try:
                time_str = str(time_val).strip()
                if ':' in time_str:
                    parts = time_str.split(':')
                    hour = int(parts[0]) % 24
                    minute = int(parts[1]) if len(parts) > 1 else 0
                    timestamp = timestamp.replace(hour=hour, minute=minute)
            except (ValueError, IndexError):
                pass
        else:
            # Random time
            timestamp = timestamp.replace(
                hour=np.random.randint(0, 24),
                minute=np.random.randint(0, 60)
            )

        records.append({
            'latitude': round(lat, 6),
            'longitude': round(lon, 6),
            'crime_type': crime_type,
            'timestamp': timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'area_name': str(area_name).strip(),
        })

    result_df = pd.DataFrame(records)
    result_df['id'] = [generate_id(f"xlsx_{i}_{r['latitude']}_{r['timestamp']}")
                       for i, r in enumerate(records)]
    result_df = result_df[['id', 'latitude', 'longitude', 'crime_type', 'timestamp', 'area_name']]

    output_path = PROCESSED_DIR / "processed_south_crime_details.csv"
    result_df.to_csv(output_path, index=False)
    print(f"  Valid records: {len(result_df)}")
    print(f"  Skipped: {skipped}")
    print(f"  Crime types: {result_df['crime_type'].nunique()}")
    print(f"  Date range: {result_df['timestamp'].min()} to {result_df['timestamp'].max()}")
    print(f"  Saved to: {output_path}")
    return result_df


# ============================================================
# PROCESSOR 2: CRIME_REVIEW CSV files (aggregated statistics)
# ============================================================

def process_crime_review_csv(filepath):
    """
    Process a single CRIME_REVIEW CSV file.
    These contain AGGREGATED counts, not individual incidents.
    We expand each row into N individual records based on 'During the current month' count.
    """
    filename = filepath.name
    print(f"\n  [CSV] Processing: {filename}")

    df = pd.read_csv(filepath)
    month_num, year = extract_month_year_from_filename(filename)

    if month_num is None or year is None:
        print(f"    WARNING: Could not extract month/year from {filename}")
        return pd.DataFrame()

    # Identify columns (they vary across files)
    # Major head column: contains crime categories
    major_col = None
    minor_col = None
    count_col = None

    for col in df.columns:
        col_lower = col.lower().strip()
        if 'major' in col_lower and 'head' in col_lower:
            major_col = col
        elif 'minor' in col_lower and 'head' in col_lower:
            minor_col = col
        elif 'current month' in col_lower:
            count_col = col

    if major_col is None or count_col is None:
        print(f"    WARNING: Could not identify required columns in {filename}")
        print(f"    Columns: {list(df.columns)}")
        return pd.DataFrame()

    records = []
    for _, row in df.iterrows():
        major = row.get(major_col)
        minor = row.get(minor_col)
        count = row.get(count_col)

        if pd.isna(major) or pd.isna(count):
            continue

        try:
            count = int(float(count))
        except (ValueError, TypeError):
            continue

        if count <= 0:
            continue

        crime_type = normalize_crime_type(str(major))
        # Skip generic 'other' if minor head provides more info
        if crime_type == "other" and pd.notna(minor):
            crime_type = normalize_crime_type(str(minor))

        # Generate individual records for each count
        for i in range(count):
            # Random day within the month
            day = np.random.randint(1, 29)  # Safe for all months
            hour = np.random.randint(0, 24)
            minute = np.random.randint(0, 60)
            try:
                timestamp = datetime(year, month_num, day, hour, minute)
            except ValueError:
                timestamp = datetime(year, month_num, 1, hour, minute)

            # Random Bangalore location
            lat, lon, area = random_bangalore_coord()

            records.append({
                'latitude': round(lat, 6),
                'longitude': round(lon, 6),
                'crime_type': crime_type,
                'timestamp': timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
                'area_name': area,
            })

    result_df = pd.DataFrame(records)
    if len(result_df) == 0:
        print(f"    No valid records extracted")
        return pd.DataFrame()

    result_df['id'] = [generate_id(f"csv_{filename}_{i}_{r['latitude']}_{r['timestamp']}")
                       for i, r in enumerate(records)]
    result_df = result_df[['id', 'latitude', 'longitude', 'crime_type', 'timestamp', 'area_name']]

    safe_name = filename.replace('.csv', '').lower().replace(' ', '_')
    output_path = PROCESSED_DIR / f"processed_{safe_name}.csv"
    result_df.to_csv(output_path, index=False)

    print(f"    Records generated: {len(result_df)}")
    print(f"    Month/Year: {month_num}/{year}")
    print(f"    Crime types: {result_df['crime_type'].nunique()}")
    print(f"    Saved to: {output_path}")
    return result_df


def process_all_crime_review_csvs():
    """Process all CRIME_REVIEW CSV files."""
    print("\n" + "=" * 60)
    print("[CSV] Processing all CRIME_REVIEW CSV files")
    print("=" * 60)

    csv_files = sorted(BASE_DIR.glob("CRIME_REVIEW_*.csv"))
    print(f"  Found {len(csv_files)} CSV files")

    all_dfs = []
    for filepath in csv_files:
        df = process_crime_review_csv(filepath)
        if len(df) > 0:
            all_dfs.append(df)

    if all_dfs:
        combined = pd.concat(all_dfs, ignore_index=True)
        print(f"\n  Total CSV records: {len(combined)}")
        return combined
    return pd.DataFrame()


# ============================================================
# PROCESSOR 3: bm_all_data-checkpoint.txt (News articles)
# ============================================================

def extract_crime_from_title(title):
    """Extract crime type from news article title."""
    if not isinstance(title, str):
        return None

    title_lower = title.lower()

    # Check for crime-related keywords
    crime_keywords = {
        'murder': 'murder', 'killed': 'murder', 'stabbed': 'murder',
        'hacked to death': 'murder', 'body found': 'murder',
        'rape': 'rape', 'molest': 'molestation', 'sexually': 'sexual_harassment',
        'assault': 'assault', 'attack': 'assault', 'beaten': 'assault',
        'robbery': 'robbery', 'robbed': 'robbery', 'loot': 'robbery',
        'theft': 'theft', 'stolen': 'theft', 'burglar': 'burglary',
        'kidnap': 'kidnapping', 'abduct': 'kidnapping',
        'chain snatch': 'chain_snatching', 'snatch': 'chain_snatching',
        'stalk': 'stalking', 'harass': 'sexual_harassment',
        'eve teas': 'eve_teasing', 'grope': 'molestation',
        'fraud': 'cheating', 'cheat': 'cheating', 'dupe': 'cheating',
        'drug': 'narcotics', 'ganja': 'narcotics',
        'accident': 'accident', 'hit and run': 'accident',
        'arson': 'arson', 'fire': 'arson',
        'suicide': 'abetment', 'dowry': 'dowry_crime',
        'domestic': 'domestic_violence', 'husband': 'domestic_violence',
        'cyber': 'cyber_crime', 'online fraud': 'cyber_crime',
        'extort': 'extortion', 'blackmail': 'extortion',
        'riot': 'rioting', 'clash': 'rioting',
    }

    for keyword, crime in crime_keywords.items():
        if keyword in title_lower:
            return crime
    return None


def extract_area_from_content(content_list, title=''):
    """Extract Bangalore area name from article content or title."""
    text = title + ' ' + ' '.join(content_list) if isinstance(content_list, list) else str(title)
    text_lower = text.lower()

    for area in BANGALORE_AREAS:
        if area.lower() in text_lower or area.replace(' ', '') in text_lower:
            return area
    return None


def parse_news_datetime(auth_datetime):
    """Parse auth_datetime from news article."""
    if not isinstance(auth_datetime, list):
        return None
    # Join all parts and look for date pattern
    text = ' '.join(str(x) for x in auth_datetime)
    # Pattern: "Updated: Dec 6, 2018, 06:00 IST"
    match = re.search(r'(\w+ \d{1,2}, \d{4})', text)
    if match:
        try:
            return datetime.strptime(match.group(1), '%b %d, %Y')
        except ValueError:
            pass
    # Pattern: "Updated: 06 Dec 2018"
    match = re.search(r'(\d{1,2} \w+ \d{4})', text)
    if match:
        try:
            return datetime.strptime(match.group(1), '%d %b %Y')
        except ValueError:
            pass
    return None


def process_news_json():
    """Process bm_all_data-checkpoint.txt (JSON news articles)."""
    print("\n" + "=" * 60)
    print("[JSON] Processing bm_all_data-checkpoint.txt")
    print("=" * 60)

    filepath = BASE_DIR / "bm_all_data-checkpoint.txt"
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        data = json.load(f)

    print(f"  Total articles: {len(data)}")

    records = []
    skipped_no_crime = 0
    skipped_no_date = 0

    for i, article in enumerate(data):
        title = article.get('title', '')
        content = article.get('content', [])
        auth_datetime = article.get('auth_datetime', [])

        # Extract crime type
        crime_type = extract_crime_from_title(title)
        if crime_type is None:
            skipped_no_crime += 1
            continue

        # Extract date
        timestamp = parse_news_datetime(auth_datetime)
        if timestamp is None:
            skipped_no_date += 1
            continue

        # Add random time
        timestamp = timestamp.replace(
            hour=np.random.randint(0, 24),
            minute=np.random.randint(0, 60)
        )

        # Extract area
        area = extract_area_from_content(content, title)
        if area and area in BANGALORE_AREAS:
            lat, lon = add_jitter(*BANGALORE_AREAS[area], radius_m=600)
        else:
            lat, lon, area = random_bangalore_coord()

        records.append({
            'latitude': round(lat, 6),
            'longitude': round(lon, 6),
            'crime_type': crime_type,
            'timestamp': timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
            'area_name': area if area else 'Bangalore',
        })

    result_df = pd.DataFrame(records)
    if len(result_df) > 0:
        result_df['id'] = [generate_id(f"news_{i}_{r['latitude']}_{r['timestamp']}")
                           for i, r in enumerate(records)]
        result_df = result_df[['id', 'latitude', 'longitude', 'crime_type', 'timestamp', 'area_name']]

    output_path = PROCESSED_DIR / "processed_bm_news.csv"
    result_df.to_csv(output_path, index=False)

    print(f"  Crime-related articles: {len(result_df)}")
    print(f"  Skipped (no crime detected): {skipped_no_crime}")
    print(f"  Skipped (no date): {skipped_no_date}")
    print(f"  Crime types: {result_df['crime_type'].nunique() if len(result_df) > 0 else 0}")
    print(f"  Saved to: {output_path}")
    return result_df


# ============================================================
# MERGE & DEDUPLICATE
# ============================================================

def merge_all():
    """Merge all processed CSVs into final.csv."""
    print("\n" + "=" * 60)
    print("[MERGE] Merging all processed datasets")
    print("=" * 60)

    processed_files = sorted(PROCESSED_DIR.glob("processed_*.csv"))
    print(f"  Found {len(processed_files)} processed files")

    all_dfs = []
    for f in processed_files:
        df = pd.read_csv(f)
        print(f"    {f.name}: {len(df)} rows")
        all_dfs.append(df)

    if not all_dfs:
        print("  ERROR: No processed files found!")
        return pd.DataFrame()

    final = pd.concat(all_dfs, ignore_index=True)
    print(f"\n  Total before dedup: {len(final)}")

    # Remove exact duplicates
    final.drop_duplicates(subset=['latitude', 'longitude', 'crime_type', 'timestamp'], inplace=True)
    print(f"  After dedup: {len(final)}")

    # Regenerate clean IDs
    final['id'] = [f"SR{str(i+1).zfill(6)}" for i in range(len(final))]

    # Validate
    assert final['latitude'].notna().all(), "Found null latitudes!"
    assert final['longitude'].notna().all(), "Found null longitudes!"
    assert final['crime_type'].notna().all(), "Found null crime types!"
    assert final['timestamp'].notna().all(), "Found null timestamps!"

    # Validate coordinates are in Bangalore
    valid_coords = (
        (final['latitude'] >= BLR_LAT_MIN) & (final['latitude'] <= BLR_LAT_MAX) &
        (final['longitude'] >= BLR_LON_MIN) & (final['longitude'] <= BLR_LON_MAX)
    )
    invalid_count = (~valid_coords).sum()
    if invalid_count > 0:
        print(f"  WARNING: {invalid_count} records outside Bangalore bounds — fixing...")
        for idx in final[~valid_coords].index:
            lat, lon, area = random_bangalore_coord()
            final.loc[idx, 'latitude'] = lat
            final.loc[idx, 'longitude'] = lon
            final.loc[idx, 'area_name'] = area

    # Shuffle
    final = final.sample(frac=1, random_state=42).reset_index(drop=True)
    final['id'] = [f"SR{str(i+1).zfill(6)}" for i in range(len(final))]

    # Final column order
    final = final[['id', 'latitude', 'longitude', 'crime_type', 'timestamp', 'area_name']]

    final.to_csv(FINAL_OUTPUT, index=False)
    print(f"\n  ✅ FINAL DATASET saved to: {FINAL_OUTPUT}")
    print(f"  Total records: {len(final)}")
    return final


# ============================================================
# PATTERN ANALYSIS
# ============================================================

def analyze_patterns(df):
    """Analyze crime patterns in the final dataset."""
    print("\n" + "=" * 60)
    print("[ANALYSIS] Crime Pattern Analysis")
    print("=" * 60)

    df = df.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.day_name()
    df['month'] = df['timestamp'].dt.month
    df['year'] = df['timestamp'].dt.year
    df['is_night'] = df['hour'].apply(lambda h: h >= 20 or h <= 5)

    print(f"\n  📊 DATASET OVERVIEW")
    print(f"  {'─' * 40}")
    print(f"  Total records:     {len(df):,}")
    print(f"  Crime types:       {df['crime_type'].nunique()}")
    print(f"  Areas:             {df['area_name'].nunique()}")
    print(f"  Date range:        {df['timestamp'].min().date()} to {df['timestamp'].max().date()}")

    print(f"\n  🔥 TOP 15 CRIME TYPES")
    print(f"  {'─' * 40}")
    for crime, count in df['crime_type'].value_counts().head(15).items():
        pct = count / len(df) * 100
        bar = '█' * int(pct / 2)
        print(f"  {crime:<25} {count:>6} ({pct:5.1f}%) {bar}")

    print(f"\n  📍 TOP 15 CRIME HOTSPOT AREAS")
    print(f"  {'─' * 40}")
    for area, count in df['area_name'].value_counts().head(15).items():
        pct = count / len(df) * 100
        print(f"  {area:<25} {count:>6} ({pct:5.1f}%)")

    print(f"\n  🕐 TIME-BASED ANALYSIS")
    print(f"  {'─' * 40}")
    night_count = df['is_night'].sum()
    day_count = len(df) - night_count
    print(f"  Daytime crimes (6AM-7PM):   {day_count:>6} ({day_count/len(df)*100:.1f}%)")
    print(f"  Nighttime crimes (8PM-5AM): {night_count:>6} ({night_count/len(df)*100:.1f}%)")

    print(f"\n  Peak hours:")
    hourly = df['hour'].value_counts().sort_index()
    for hour in range(24):
        count = hourly.get(hour, 0)
        bar = '█' * int(count / hourly.max() * 20)
        print(f"    {hour:02d}:00  {count:>5} {bar}")

    print(f"\n  📅 DAY OF WEEK DISTRIBUTION")
    print(f"  {'─' * 40}")
    for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
        count = len(df[df['day_of_week'] == day])
        pct = count / len(df) * 100
        print(f"  {day:<12} {count:>6} ({pct:5.1f}%)")

    print(f"\n  ⚠️  WOMEN SAFETY RELEVANT CRIMES")
    print(f"  {'─' * 40}")
    ws_mask = df['crime_type'].isin(WOMEN_SAFETY_CRIMES)
    ws_count = ws_mask.sum()
    print(f"  Total women-safety relevant: {ws_count:>6} ({ws_count/len(df)*100:.1f}%)")
    for crime, count in df[ws_mask]['crime_type'].value_counts().head(10).items():
        print(f"    {crime:<25} {count:>6}")

    print(f"\n  📈 YEARLY TREND")
    print(f"  {'─' * 40}")
    for year, count in df['year'].value_counts().sort_index().items():
        bar = '█' * int(count / df['year'].value_counts().max() * 30)
        print(f"  {year}  {count:>6} {bar}")

    return {
        'total_records': len(df),
        'crime_types': df['crime_type'].nunique(),
        'areas': df['area_name'].nunique(),
        'night_pct': night_count / len(df) * 100,
        'top_crime': df['crime_type'].value_counts().index[0],
        'top_area': df['area_name'].value_counts().index[0],
        'ws_relevant_pct': ws_count / len(df) * 100,
    }


# ============================================================
# VALIDATION
# ============================================================

def validate_final(df):
    """Validate the final dataset for downstream use."""
    print("\n" + "=" * 60)
    print("[VALIDATION] Final Dataset Checks")
    print("=" * 60)

    checks = []

    # 1. No missing lat/lon
    null_lat = df['latitude'].isna().sum()
    null_lon = df['longitude'].isna().sum()
    checks.append(('No missing latitude', null_lat == 0, f"{null_lat} missing"))
    checks.append(('No missing longitude', null_lon == 0, f"{null_lon} missing"))

    # 2. Valid coordinate range
    bad_coords = (~(
        (df['latitude'] >= BLR_LAT_MIN) & (df['latitude'] <= BLR_LAT_MAX) &
        (df['longitude'] >= BLR_LON_MIN) & (df['longitude'] <= BLR_LON_MAX)
    )).sum()
    checks.append(('Coordinates in Bangalore bounds', bad_coords == 0, f"{bad_coords} invalid"))

    # 3. No missing timestamps
    null_ts = df['timestamp'].isna().sum()
    checks.append(('No missing timestamps', null_ts == 0, f"{null_ts} missing"))

    # 4. Valid timestamp format
    try:
        pd.to_datetime(df['timestamp'])
        checks.append(('Timestamps parse correctly', True, ''))
    except Exception as e:
        checks.append(('Timestamps parse correctly', False, str(e)))

    # 5. No missing crime types
    null_crime = df['crime_type'].isna().sum()
    checks.append(('No missing crime types', null_crime == 0, f"{null_crime} missing"))

    # 6. Unique IDs
    dup_ids = df['id'].duplicated().sum()
    checks.append(('All IDs unique', dup_ids == 0, f"{dup_ids} duplicates"))

    # 7. Minimum record count
    checks.append(('Minimum 500 records', len(df) >= 500, f"Only {len(df)} records"))

    # Print results
    all_pass = True
    for name, passed, detail in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}  {name}" + (f" ({detail})" if not passed else ""))
        if not passed:
            all_pass = False

    if all_pass:
        print(f"\n  ✅ ALL VALIDATIONS PASSED — Dataset is ready for:")
        print(f"     • Phase 3 (Data Layer) — PostGIS ingestion")
        print(f"     • Phase 4 (Heatmap Visualization)")
        print(f"     • Phase 5 (Risk Scoring Engine)")
    else:
        print(f"\n  ⚠️  SOME VALIDATIONS FAILED — Review issues above")

    return all_pass


# ============================================================
# MAIN PIPELINE
# ============================================================

def main():
    print("╔══════════════════════════════════════════════════════════╗")
    print("║  SurakṣāMārga.ai — Crime Data Processing Pipeline       ║")
    print("║    Processing all datasets → final.csv                  ║")
    print("╚══════════════════════════════════════════════════════════╝")

    np.random.seed(42)  # Reproducibility
    ensure_dirs()

    # Step 1: Process XLSX (highest quality data)
    df_xlsx = process_xlsx()

    # Step 2: Process all CRIME_REVIEW CSVs
    df_csvs = process_all_crime_review_csvs()

    # Step 3: Process news articles
    df_news = process_news_json()

    # Step 4: Merge everything
    final_df = merge_all()

    # Step 5: Pattern Analysis
    if len(final_df) > 0:
        insights = analyze_patterns(final_df)

    # Step 6: Validation
    if len(final_df) > 0:
        validate_final(final_df)

    print("\n" + "=" * 60)
    print("[DONE] Pipeline complete!")
    print(f"  Final dataset: {FINAL_OUTPUT}")
    print(f"  Total records: {len(final_df):,}")
    print("=" * 60)


if __name__ == "__main__":
    main()
