"""
Database initialization script.
- Enables PostGIS extension
- Creates all tables
- Loads crime data from dataset/final.csv into crime_incidents table
"""
import os
import sys
import pandas as pd
from datetime import datetime

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from app.database.connection import engine, SessionLocal, Base
from app.models.crime import CrimeIncident
from app.models.sos import SOSEvent


# Path to the CSV file
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "dataset", "final.csv")


def enable_extensions():
    """Enable any required PostgreSQL extensions."""
    # PostGIS not required - using Haversine-based lat/lng queries
    print("[OK] No special extensions required")


def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("[OK] All tables created")


def get_record_count():
    """Get current number of records in crime_incidents."""
    db = SessionLocal()
    try:
        count = db.query(CrimeIncident).count()
        return count
    finally:
        db.close()


def load_crime_data():
    """Load crime data from CSV into the database."""
    csv_path = os.path.abspath(CSV_PATH)
    if not os.path.exists(csv_path):
        print(f"[ERROR] CSV file not found at: {csv_path}")
        return

    # Check if data is already loaded
    existing_count = get_record_count()
    if existing_count >= 157000:
        print(f"[SKIP] Database already contains {existing_count} records. Skipping CSV load.")
        return

    # If there's partial data, clear it first
    if existing_count > 0:
        print(f"[INFO] Found {existing_count} partial records. Clearing and reloading...")
        db = SessionLocal()
        try:
            db.query(CrimeIncident).delete()
            db.commit()
        finally:
            db.close()

    print(f"[INFO] Loading crime data from: {csv_path}")

    chunk_size = 5000
    total_loaded = 0

    for chunk in pd.read_csv(csv_path, chunksize=chunk_size):
        db = SessionLocal()
        try:
            records = []
            for _, row in chunk.iterrows():
                try:
                    ts = datetime.fromisoformat(str(row["timestamp"]))
                except (ValueError, TypeError):
                    ts = datetime.now()

                record = CrimeIncident(
                    id=str(row["id"]),
                    latitude=float(row["latitude"]),
                    longitude=float(row["longitude"]),
                    crime_type=str(row["crime_type"]).strip().lower(),
                    timestamp=ts,
                    area_name=str(row["area_name"]).strip().lower(),
                )
                records.append(record)

            db.bulk_save_objects(records)
            db.commit()
            total_loaded += len(records)
            print(f"  Loaded {total_loaded} records...")
        except Exception as e:
            db.rollback()
            print(f"  [ERROR] Batch failed: {e}")
        finally:
            db.close()

    print(f"[OK] Total records loaded: {total_loaded}")

    print("[OK] Crime data loading complete")


def init_database():
    """Run full database initialization."""
    print("=" * 60)
    print("SurakṣāMārga.ai - Database Initialization")
    print("=" * 60)

    enable_extensions()
    create_tables()
    load_crime_data()

    # Verify
    count = get_record_count()
    print(f"\n[DONE] Database initialized with {count} crime records")
    print("=" * 60)


if __name__ == "__main__":
    init_database()
