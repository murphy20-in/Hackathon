import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
import pandas as pd
import numpy as np

df = pd.read_csv(r'D:\Hackathon\dataset\final.csv')

# Clamp coordinates to Bangalore metro bounds
lat_min, lat_max = 12.83, 13.12
lon_min, lon_max = 77.45, 77.78

np.random.seed(42)
fix_count = 0
for idx in df.index:
    lat = df.loc[idx, 'latitude']
    lon = df.loc[idx, 'longitude']
    if lat < lat_min or lat > lat_max or lon < lon_min or lon > lon_max:
        df.loc[idx, 'latitude'] = np.clip(lat, lat_min, lat_max)
        df.loc[idx, 'longitude'] = np.clip(lon, lon_min, lon_max)
        fix_count += 1

print(f'Clamped {fix_count} coordinates')
df.to_csv(r'D:\Hackathon\dataset\final.csv', index=False)

# Final validation
lat_ok = ((df['latitude'] >= lat_min) & (df['latitude'] <= lat_max)).all()
lon_ok = ((df['longitude'] >= lon_min) & (df['longitude'] <= lon_max)).all()
null_lat = df['latitude'].isna().sum()
null_lon = df['longitude'].isna().sum()
null_ts = df['timestamp'].isna().sum()
null_ct = df['crime_type'].isna().sum()
dup_ids = df['id'].duplicated().sum()

def check(label, cond, detail=""):
    status = "PASS" if cond else "FAIL"
    extra = f" ({detail})" if detail else ""
    print(f"  {status}  {label}{extra}")

print("\n=== FINAL VALIDATION ===")
check("No null latitudes", null_lat == 0, str(null_lat))
check("No null longitudes", null_lon == 0, str(null_lon))
check("No null timestamps", null_ts == 0, str(null_ts))
check("No null crime types", null_ct == 0, str(null_ct))
check("Unique IDs", dup_ids == 0, str(dup_ids))
check("Min 500 records", len(df) >= 500, str(len(df)))
check("Lat in Bangalore range", lat_ok, f"{df['latitude'].min():.4f} to {df['latitude'].max():.4f}")
check("Lon in Bangalore range", lon_ok, f"{df['longitude'].min():.4f} to {df['longitude'].max():.4f}")

print(f"\nFinal dataset: {len(df):,} records | {df['crime_type'].nunique()} crime types | {df['area_name'].nunique()} areas")
print("Ready for Phase 3 (Data Layer), Phase 4 (Heatmap), Phase 5 (Risk Engine)")
