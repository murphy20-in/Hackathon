Act as a senior data engineer + backend engineer + geo-spatial systems expert.

Implement PHASE 3 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Build the complete DATA LAYER that powers safety intelligence.

The system must:
- Ingest crime data (real or sample)
- Convert it into geo-spatial format (lat/lng)
- Store it in PostgreSQL + PostGIS
- Generate risk zones (hotspots)
- Expose APIs for frontend + risk engine

---

### 🔧 TECH STACK (STRICT)

Backend:
- FastAPI (Python)

Database:
- PostgreSQL + PostGIS

Libraries:
- pandas
- geopandas
- scikit-learn (for clustering)

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. DATABASE SETUP (PostgreSQL + PostGIS)

Provide:

### SQL Setup:
- Enable PostGIS extension
- Create tables:

#### crime_data
Fields:
- id (PK)
- latitude (FLOAT)
- longitude (FLOAT)
- crime_type (TEXT)
- timestamp (TIMESTAMP)

#### risk_zones
Fields:
- id (PK)
- latitude (FLOAT)
- longitude (FLOAT)
- risk_level (LOW / MEDIUM / HIGH)
- density_score (FLOAT)

---

### Must Include:
- Spatial column (GEOGRAPHY or GEOMETRY)
- Spatial index (GiST)

---

---

## 2. DATA INGESTION PIPELINE

### Input:
- CSV dataset (crime data)

Provide:

- Sample CSV format
- Python script to:
  - Load CSV
  - Clean data
  - Convert to lat/lng
  - Insert into PostgreSQL

---

---

## 3. HOTSPOT DETECTION (CORE LOGIC)

Implement clustering using:

- DBSCAN or KMeans

---

### Output:
- Group crime points into clusters
- Assign:
  - High density → HIGH risk
  - Medium → MEDIUM
  - Low → LOW

---

### Provide:
- Python script for clustering
- Explanation of parameters (eps, min_samples)

---

---

## 4. API IMPLEMENTATION (FastAPI)

### Endpoint:

GET /crime-zones

---

### Response:

{
  "zones": [
    {
      "lat": 12.9716,
      "lng": 77.5946,
      "risk_level": "high",
      "density_score": 0.87
    }
  ]
}

---

### Requirements:
- Fetch from DB
- Return JSON
- Efficient query using spatial index

---

---

## 5. HEATMAP DATA FORMAT (FRONTEND READY)

Prepare data for:

- React Native heatmap rendering

---

### Output format:

[
  {
    "latitude": number,
    "longitude": number,
    "weight": number
  }
]

---

---

## 6. INTEGRATION HOOKS

Prepare backend for next phase:

- Risk engine will consume:
  - crime density
  - zone risk

---

### Add:
- Utility function:
  get_risk_score(lat, lng)

---

---

## 7. PROJECT STRUCTURE

Backend:

app/
- main.py
- database/
- models/
- services/
- routes/
- scripts/

---

---

## 8. SETUP INSTRUCTIONS

Provide:

### Database:
- Install PostgreSQL + PostGIS
- Create DB
- Run schema

---

### Backend:
- Install dependencies
- Run server

---

---

## 9. OUTPUT FORMAT

- Provide FULL WORKING CODE
- No pseudo code
- Separate:
  - SQL
  - Python scripts
  - FastAPI routes

---

---

### ⚠️ CONSTRAINTS

- Use sample/mock data if real dataset not available
- Keep it POC-friendly
- Focus on correctness over complexity
- No ML overengineering

---

---

### 🎯 FINAL RESULT

- Crime data stored in DB
- Risk zones generated
- API returns heatmap-ready data
- System ready for risk scoring phase

---

This module will power the AI intelligence of the system, so ensure correctness, efficiency, and clean implementation.