# Phase 3: Data Layer (Crime + Geo)

## 1. Phase Overview

**Objective:** Build the data ingestion, storage, and query infrastructure for crime incident data and geographic boundary data — the raw fuel that powers risk scoring, heatmaps, and safe route selection.

**Why This Phase Matters:**  
SafeRoute AI's intelligence is only as good as its data. This phase transforms raw, messy crime datasets and geographic boundaries into a clean, indexed, queryable data layer. Without it, the risk engine has nothing to score and the heatmap has nothing to render.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Crime Data ETL Pipeline** | Python/Node script to parse, clean, geocode, and load crime CSV data into PostgreSQL |
| 2 | **Crime Data Schema** | Normalized tables for incidents, categories, locations with PostGIS spatial columns |
| 3 | **Geographic Boundaries** | Ward/zone/neighborhood GeoJSON files loaded into PostGIS for spatial queries |
| 4 | **Spatial Indexing** | GiST indexes on geometry columns for fast radius and polygon queries |
| 5 | **Crime Query API** | Endpoints to query crimes by bounding box, radius, category, and time range |
| 6 | **Data Refresh Service** | Scheduled job to re-ingest updated crime data (daily/weekly) |
| 7 | **Data Validation Layer** | Schema validation and deduplication logic during ingestion |

---

## 3. Code Deliverables

### New Files

```
server/src/
├── models/
│   ├── crime.model.js            # Prisma/Sequelize model for crime incidents
│   └── boundary.model.js         # Model for geographic boundaries (wards/zones)
├── routes/
│   └── crime.routes.js           # /api/v1/crime/* endpoints
├── controllers/
│   └── crime.controller.js       # Query logic for crime data
├── services/
│   ├── crime.service.js          # Business logic: spatial queries, aggregation
│   └── boundary.service.js       # GeoJSON boundary lookups
└── jobs/
    └── crimeDataIngestion.js     # Scheduled ETL job

data/
├── raw/
│   ├── bangalore_crime_2023.csv   # Raw crime dataset (Karnataka Open Data)
│   ├── bangalore_crime_2024.csv
│   └── ncrb_data.csv             # National Crime Records Bureau data
├── processed/
│   └── crimes_geocoded.json       # Cleaned + geocoded output
├── geo/
│   ├── bangalore_wards.geojson   # Ward boundaries
│   ├── bangalore_zones.geojson   # Zone boundaries
│   └── police_stations.geojson   # Police station locations
└── scripts/
    ├── etl_crime_data.py         # Main ETL pipeline (Python)
    ├── geocode_addresses.py      # Batch geocoding script
    └── load_geojson.py           # Load GeoJSON into PostGIS
```

### Database Schema Additions

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Crime incidents table
CREATE TABLE crime_incidents (
    id            SERIAL PRIMARY KEY,
    fir_number    VARCHAR(50) UNIQUE,
    category      VARCHAR(100) NOT NULL,   -- 'robbery', 'assault', 'harassment', etc.
    subcategory   VARCHAR(100),
    description   TEXT,
    severity      INTEGER CHECK (severity BETWEEN 1 AND 5),
    occurred_at   TIMESTAMP NOT NULL,
    reported_at   TIMESTAMP,
    location      GEOGRAPHY(POINT, 4326) NOT NULL,
    address       TEXT,
    ward_id       INTEGER REFERENCES wards(id),
    source        VARCHAR(50),             -- 'ncrb', 'open_data', 'crowdsourced'
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Spatial index
CREATE INDEX idx_crime_location ON crime_incidents USING GIST(location);
CREATE INDEX idx_crime_category ON crime_incidents(category);
CREATE INDEX idx_crime_time ON crime_incidents(occurred_at);

-- Geographic wards/zones
CREATE TABLE wards (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    zone        VARCHAR(100),
    geometry    GEOGRAPHY(POLYGON, 4326) NOT NULL,
    population  INTEGER,
    area_sq_km  FLOAT
);

CREATE INDEX idx_ward_geometry ON wards USING GIST(geometry);

-- Police stations
CREATE TABLE police_stations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    phone       VARCHAR(20),
    location    GEOGRAPHY(POINT, 4326) NOT NULL,
    ward_id     INTEGER REFERENCES wards(id),
    jurisdiction_radius_km FLOAT DEFAULT 5.0
);
```

---

## 4. API Contracts

### Query Crimes by Bounding Box

```
GET /api/v1/crime/bbox?sw_lat=12.90&sw_lon=77.55&ne_lat=13.00&ne_lon=77.65&category=harassment&from=2024-01-01&to=2024-12-31

Response 200:
{
  "count": 142,
  "incidents": [
    {
      "id": 1023,
      "category": "harassment",
      "severity": 3,
      "lat": 12.9421,
      "lon": 77.5834,
      "occurred_at": "2024-06-15T22:30:00Z",
      "address": "Near Forum Mall, Koramangala"
    }
  ]
}
```

### Query Crimes by Radius

```
GET /api/v1/crime/radius?lat=12.9716&lon=77.5946&radius_km=2&limit=100

Response 200:
{
  "count": 67,
  "center": { "lat": 12.9716, "lon": 77.5946 },
  "radius_km": 2,
  "incidents": [...]
}
```

### Crime Statistics by Ward

```
GET /api/v1/crime/stats/ward/:wardId?from=2024-01-01&to=2024-12-31

Response 200:
{
  "ward": "Koramangala",
  "total_incidents": 234,
  "by_category": {
    "harassment": 89,
    "robbery": 45,
    "assault": 32,
    ...
  },
  "severity_avg": 2.8,
  "trend": "declining"
}
```

### Get Ward Boundaries

```
GET /api/v1/geo/wards

Response 200:
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": 1, "name": "Koramangala", "zone": "South" },
      "geometry": { "type": "Polygon", "coordinates": [...] }
    }
  ]
}
```

---

## 5. Data Flow

```
Raw CSV / Open Data Portal
       │
       ▼
ETL Script (etl_crime_data.py)
  ├── Parse CSV → validate schema
  ├── Clean: normalize categories, remove duplicates
  ├── Geocode: address → lat/lon (batch, with rate limiting)
  ├── Enrich: assign ward_id via spatial join with ward polygons
  └── Load: INSERT INTO crime_incidents
       │
       ▼
PostgreSQL + PostGIS
       │
       ▼
Crime Query API ← Client requests (bounding box / radius / ward)
       │
       ▼
Response → used by Phase 4 (Heatmap) and Phase 5 (Risk Scoring)
```

**Integration with Previous Phases:**
- Phase 1: Uses PostgreSQL connection and Prisma schema
- Phase 2: Crime query results are spatially correlated with route geometries (used in Phase 5)

---

## 6. Dependencies

### Previous Phases
- **Phase 1:** Database connection, Prisma schema, Express server, auth middleware
- **Phase 2:** Map component (for visualizing crime data on the map in later phases)

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| PostGIS | Spatial queries and geometry types |
| `pg` / `prisma` (with PostGIS) | Database client |
| Python `pandas` | CSV parsing and data cleaning |
| Python `geopandas` | GeoJSON loading and spatial joins |
| Python `geopy` | Batch geocoding |
| `node-cron` | Scheduled data refresh jobs |
| Karnataka Open Data Portal | Crime dataset source |
| NCRB Data Portal | National crime statistics |

---

## 7. Setup Instructions

```bash
# 1. Enable PostGIS in PostgreSQL
docker exec -it saferoute_db psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# 2. Run database migrations
cd server && npx prisma migrate dev --name add_crime_tables

# 3. Load geographic boundaries
cd data/scripts
python load_geojson.py --file ../geo/bangalore_wards.geojson --table wards
python load_geojson.py --file ../geo/police_stations.geojson --table police_stations

# 4. Run crime data ETL
python etl_crime_data.py --input ../raw/bangalore_crime_2024.csv --output ../processed/crimes_geocoded.json

# 5. Verify data loaded
curl "http://localhost:5000/api/v1/crime/bbox?sw_lat=12.8&sw_lon=77.4&ne_lat=13.1&ne_lon=77.8"

# 6. (Optional) Schedule daily refresh
# Configured in server/src/jobs/crimeDataIngestion.js via node-cron
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | ETL script runs on sample CSV | Crime records inserted into PostgreSQL | ☐ |
| 2 | Duplicate FIR numbers rejected | No duplicates in database | ☐ |
| 3 | Spatial query: bounding box | Returns only crimes within bbox | ☐ |
| 4 | Spatial query: radius 1km | Returns correct count vs manual check | ☐ |
| 5 | Category filter works | Only "harassment" incidents returned | ☐ |
| 6 | Time range filter works | Only incidents in specified range | ☐ |
| 7 | Ward statistics aggregation | Correct counts per category | ☐ |
| 8 | GeoJSON boundaries load correctly | Ward polygons visible in PostGIS viewer | ☐ |
| 9 | Spatial join assigns correct ward_id | Incidents correctly mapped to wards | ☐ |
| 10 | API returns GeoJSON for ward boundaries | Valid FeatureCollection | ☐ |
| 11 | Empty bounding box returns `[]` | Graceful empty response | ☐ |
| 12 | Large query returns paginated results | Max 500 per page, pagination metadata present | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Minimum 500 crime incidents loaded for demo city (Bangalore)
- [ ] Bounding box query returns results in < 200ms
- [ ] Ward boundaries render as polygons on the map (integration with Phase 2)
- [ ] Crime categories include at least: harassment, robbery, assault, chain snatching
- [ ] Statistical summary API returns meaningful aggregations
- [ ] Police station locations queryable and returnable as GeoJSON

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Crime data not publicly available for target city | High | Use synthetic data generator with realistic distributions; demonstrate with NCRB state-level data |
| Geocoding rate limits during ETL | Medium | Pre-geocode offline; cache results; use batch geocoding |
| PostGIS extension not available | Medium | Use Docker image `postgis/postgis`; fallback to Haversine queries |
| Data quality issues (missing coordinates, duplicates) | Medium | Validation layer in ETL; data quality report |
| Large dataset slows queries | Low | Spatial indexes + query pagination; materialized views for aggregations |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Crime data sourcing and analysis | 3h |
| ETL pipeline (Python) | 5h |
| PostGIS schema + migrations | 3h |
| Crime query API endpoints | 4h |
| GeoJSON boundary loading | 2h |
| Spatial indexing and query optimization | 2h |
| Ward statistics aggregation | 2h |
| Data validation and deduplication | 2h |
| Testing | 2h |
| **Total** | **~25h** |

---

## 12. Deliverable Output Summary

- ✅ PostGIS-enabled PostgreSQL with crime_incidents, wards, and police_stations tables
- ✅ ETL pipeline to clean, geocode, and load crime CSV data
- ✅ Spatial indexes for fast bounding-box and radius queries
- ✅ Crime query APIs (bbox, radius, ward stats)
- ✅ GeoJSON endpoints for ward boundaries and police stations
- ✅ Minimum 500 geocoded crime records loaded for demo
- ✅ Data validation and deduplication logic
- ✅ Scheduled data refresh job scaffolding
