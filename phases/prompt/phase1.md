Act as a senior system architect, AI engineer, and full-stack lead. Design the complete system architecture for a hackathon-grade, production-scalable POC:

Project Name:
"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Design a robust, implementation-ready architecture for a mobile system that recommends the SAFEST route (not fastest) using:

- Historical crime data
- Time-of-day risk patterns
- (Future) real-time crowd density via 5G IoT systems

Target Deployment:
- City: Bangalore, India
- Users: Women commuters, especially during night travel

---

### 🔧 TECH STACK (STRICT)

Frontend:
- React Native (Expo)

Backend:
- FastAPI (Python)

Database:
- PostgreSQL + PostGIS (for geospatial queries)

Maps & Routing:
- Google Maps SDK
- Google Directions API

AI / Risk Engine:
- Python modular service (rule-based first, upgradeable to LSTM)

Realtime Layer (POC optional):
- WebSockets or Firebase

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. HIGH-LEVEL ARCHITECTURE

- Provide a clean system diagram using ASCII
- Include:
  - Mobile App
  - Backend API Layer
  - Risk Engine
  - Database
  - External APIs (Google Maps)
  - (Optional) 5G Edge Layer

- Clearly show data flow between components

---

## 2. COMPONENT-BY-COMPONENT DESIGN

For EACH of the following components, define:

- Responsibility
- Inputs
- Outputs
- Internal logic
- Tech used
- Reason for choosing this tech

Components:
1. Mobile App (React Native)
2. API Server (FastAPI)
3. Routing Service (Google Directions API)
4. Risk Scoring Engine
5. Geo-Spatial Database (PostGIS)
6. Realtime Layer (optional)
7. 5G Integration Layer (conceptual)

---

## 3. API DESIGN (DETAILED + IMPLEMENTATION READY)

Define the following APIs with full details:

### A. POST /get-routes
Request:
{
  "source": "string",
  "destination": "string"
}

Response:
{
  "routes": [
    {
      "route_id": 1,
      "distance": "string",
      "duration": "string",
      "polyline": "string"
    }
  ]
}

---

### B. GET /crime-zones
Response:
{
  "zones": [
    {
      "lat": number,
      "lng": number,
      "risk_level": "low | medium | high"
    }
  ]
}

---

### C. POST /safe-route
Request:
{
  "source": "string",
  "destination": "string",
  "time_of_day": "day | night"
}

Response:
{
  "recommended_route": {},
  "alternatives": [],
  "risk_score": number
}

---

## 4. DATABASE DESIGN (PostgreSQL + PostGIS)

Design tables with fields and types:

Required tables:
- crime_data
- risk_zones
- route_cache (optional)

Include:
- Latitude/Longitude fields
- Timestamps
- Crime category

Also include:
- Spatial indexing (GiST)
- Sample SQL schema

---

## 5. RISK ENGINE DESIGN (CORE LOGIC)

Define:

### Risk Formula:
Risk Score =
  w1 * Crime Density +
  w2 * Time Risk +
  w3 * Isolation Factor

---

Explain:
- How each factor is computed
- How routes are broken into segments
- How final score is aggregated

---

## 6. FOLDER STRUCTURE (PRODUCTION-READY)

### Backend (FastAPI)
- app/
  - main.py
  - routes/
  - services/
  - models/
  - utils/
  - config/

---

### Frontend (React Native)
- src/
  - screens/
  - components/
  - services/
  - hooks/
  - constants/

---

---

## 7. DATA FLOW WALKTHROUGH (STEP-BY-STEP)

Explain:

1. User enters route
2. Request goes to backend
3. Backend fetches routes
4. Risk engine evaluates
5. Response sent back
6. UI renders safest route

---

## 8. 5G INTEGRATION (IMPORTANT FOR HACKATHON)

Explain clearly:

- Where 5G fits in architecture
- Role of:
  - Edge computing
  - IoT cameras
  - Real-time updates
- How system upgrades from POC → real deployment

---

## 9. TECH DECISIONS JUSTIFICATION

Explain WHY:

- FastAPI over Node.js
- PostGIS over MongoDB
- Google APIs for routing
- React Native for frontend

---

## 10. FUTURE SCALABILITY

Brief section covering:
- Multi-city deployment
- LSTM-based prediction
- Real-time crime ingestion
- Integration with police systems

---

### ⚠️ CONSTRAINTS

- Keep it IMPLEMENTATION-READY
- Avoid vague descriptions
- No overengineering
- Focus on clarity + hackathon feasibility

---

### 🎯 OUTPUT STYLE

- Use structured headings
- Use JSON where applicable
- Use diagrams where needed
- Keep it clean and developer-friendly

---

This architecture will be directly used for development AND hackathon submission, so accuracy and completeness are critical.