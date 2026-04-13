Act as a senior AI engineer + backend engineer + geospatial analytics expert.

Implement PHASE 5 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Build the complete RISK SCORING ENGINE that:

- Evaluates safety of each route
- Computes a risk score using geo-spatial crime data
- Ranks routes from safest → riskiest
- Returns a recommended safe route

---

### 🔧 TECH STACK (STRICT)

Backend:
- FastAPI (Python)

Database:
- PostgreSQL + PostGIS

Libraries:
- numpy
- shapely (for geo calculations)
- geopy (optional)

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. CORE LOGIC OVERVIEW

Implement a system that:

1. Receives multiple routes (from Phase 2)
2. Breaks each route into coordinate points
3. Evaluates risk at each point
4. Aggregates total risk score per route
5. Ranks routes
6. Returns safest route

---

---

## 2. RISK MODEL (FORMULA)

Define and implement:

Risk Score =
  w1 * Crime Density +
  w2 * Time Risk +
  w3 * Isolation Factor

---

### Explain + Implement:

#### Crime Density:
- Based on nearby crime clusters
- Use radius-based query (e.g., 200m)

#### Time Risk:
- Day → lower risk
- Night → higher risk

#### Isolation Factor:
- Fewer nearby points → higher risk (simulate for POC)

---

---

## 3. ROUTE SAMPLING

Implement:

- Decode polyline → list of coordinates
- Sample every N meters (e.g., 50m)

---

### Provide:
- Python function to decode polyline
- Sampling logic

---

---

## 4. GEO-SPATIAL QUERY

Implement:

- Query nearby crimes using PostGIS:

Example:
- ST_DWithin()

---

### Provide:
- SQL query
- Python integration

---

---

## 5. RISK COMPUTATION PER POINT

For each coordinate:

- Fetch nearby crimes
- Compute density score
- Apply time multiplier

---

---

## 6. AGGREGATE ROUTE SCORE

Implement:

- Sum or average risk across route
- Normalize score (0–100)

---

---

## 7. API IMPLEMENTATION

### Endpoint:

POST /safe-route

---

### Request:

{
  "source": "Indiranagar, Bangalore",
  "destination": "MG Road, Bangalore",
  "time_of_day": "day"
}

---

### Response:

{
  "recommended_route": {
    "route_id": 2,
    "risk_score": 23.5
  },
  "alternatives": [
    {
      "route_id": 1,
      "risk_score": 45.2
    }
  ]
}

---

---

## 8. INTEGRATION WITH EXISTING ROUTES

- Use /get-routes internally
- Evaluate all returned routes

---

---

## 9. CODE STRUCTURE

Backend:

app/
- services/
  - risk_engine.py
  - geo_utils.py
- routes/
  - safe_route.py

---

---

## 10. PERFORMANCE OPTIMIZATION

Include:

- Cache repeated queries
- Limit sampling points
- Efficient DB queries

---

---

## 11. SETUP INSTRUCTIONS

Provide:

- Dependencies
- How to run API
- Example test request (Postman)

---

---

## 12. OUTPUT FORMAT

- FULL WORKING CODE
- No pseudo code
- Separate:
  - Risk engine logic
  - API route
  - Utility functions

---

---

### ⚠️ CONSTRAINTS

- Keep it POC-friendly
- Use simple heuristics (no heavy ML yet)
- Focus on correctness + clarity

---

---

### 🎯 FINAL RESULT

- System returns safest route
- Each route has a risk score
- Backend fully evaluates routes intelligently

---

This is the core intelligence layer of the system, so ensure accuracy, clean implementation, and logical correctness.