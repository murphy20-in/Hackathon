# SafeRoute AI

**5G-Powered Women Safety Navigation System**

> "Google Maps tells you the fastest route. We tell you the safest."

SafeRoute AI is an intelligent navigation system that recommends the **safest walking routes** by analyzing real crime data, time-of-day risk patterns, and crowd density. It leverages 5G capabilities for ultra-low latency real-time safety monitoring and instant SOS emergency response.

---

## Features

- **Multi-route risk scoring** — 5-factor AI engine scores every route segment using 157K+ real crime records
- **Crime heatmap overlay** — Visualize crime hotspots across Bangalore
- **Time-based intelligence** — Risk scores adapt to morning/afternoon/evening/night conditions
- **5G simulation layer** — Compare 5G vs 4G/3G performance for real-time safety features
- **SOS emergency system** — One-tap emergency alert with live location sharing
- **Dynamic route recommendations** — Safest route highlighted with color-coded segments

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.11+) |
| Database | PostgreSQL 15+ with PostGIS |
| Frontend | React Native (Expo) |
| Maps | Google Maps SDK + react-native-maps |
| Routing | Google Directions API / OSRM (free) |
| Risk Engine | Custom 5-factor weighted scoring |

---

## Project Structure

```
saferoute-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config/settings.py   # Environment configuration
│   │   ├── database/
│   │   │   ├── connection.py    # DB connection + session
│   │   │   └── init_db.py      # Schema + CSV data loader
│   │   ├── models/
│   │   │   ├── crime.py         # Crime incidents model
│   │   │   └── sos.py           # SOS events model
│   │   ├── routes/
│   │   │   ├── routes.py        # /get-routes, /safe-route
│   │   │   ├── crime.py         # /crime-zones
│   │   │   ├── sos.py           # /send-sos
│   │   │   └── simulation.py    # 5G simulation endpoints
│   │   ├── services/
│   │   │   ├── risk_engine.py   # Core risk scoring engine
│   │   │   ├── time_risk.py     # Time-based multipliers
│   │   │   ├── geo_utils.py     # Spatial queries + helpers
│   │   │   ├── routing.py       # Google/OSRM route fetching
│   │   │   ├── crowd_simulator.py
│   │   │   ├── realtime_simulator.py
│   │   │   └── alert_engine.py  # SOS lifecycle
│   │   └── utils/
│   │       └── polyline_decoder.py
│   ├── tests/test_api.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── App.js                   # Entry point + navigation
│   ├── src/
│   │   ├── screens/
│   │   │   ├── MapScreen.js     # Main map + route display
│   │   │   ├── RouteDetailsPanel.js
│   │   │   └── EmergencyScreen.js
│   │   ├── components/
│   │   │   ├── SearchInput.js
│   │   │   ├── RouteCard.js
│   │   │   ├── HeatmapToggle.js
│   │   │   ├── Legend.js
│   │   │   ├── SOSButton.js
│   │   │   ├── NetworkBadge.js
│   │   │   └── MetricsPanel.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── locationService.js
│   │   ├── hooks/
│   │   │   ├── useLocation.js
│   │   │   └── useRoutes.js
│   │   ├── constants/
│   │   │   ├── colors.js
│   │   │   └── config.js
│   │   └── utils/
│   │       └── polyline.js
│   ├── package.json
│   └── app.json
├── dataset/
│   └── final.csv                # 157,160 crime records
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with PostGIS extension
- Expo CLI (`npm install -g expo-cli`)

### 1. Database Setup (PostgreSQL + PostGIS)

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name saferoute-db \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saferoute \
  postgis/postgis:16-3.4
```

**Option B: Local PostgreSQL**
```bash
# Install PostGIS extension via Stack Builder or:
# Ubuntu: sudo apt install postgresql-15-postgis-3
# macOS: brew install postgis
createdb saferoute
psql saferoute -c "CREATE EXTENSION postgis;"
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Initialize database and load crime data
python -m app.database.init_db

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API documentation.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Update API URL in src/constants/config.js
# Change API_BASE_URL to your backend server IP

# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go app on your phone, or press `a` for Android emulator.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/get-routes` | Fetch route alternatives |
| POST | `/api/safe-route` | Get safety-scored routes with recommendation |
| GET | `/api/crime-zones` | Crime heatmap data |
| POST | `/api/send-sos` | Trigger emergency alert |
| GET | `/api/simulation/status` | Network simulation status |
| POST | `/api/simulation/set-mode` | Switch 3G/4G/5G mode |
| GET | `/api/simulation/realtime-risk` | Real-time risk assessment |
| GET | `/api/simulation/crowd-density` | Crowd density data |
| GET | `/api/simulation/compare` | Network comparison demo |

### Example: Get Safe Route

```bash
curl -X POST http://localhost:8000/api/safe-route \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Koramangala, Bangalore",
    "destination": "MG Road, Bangalore",
    "time_of_day": "night"
  }'
```

---

## Risk Scoring Engine

The engine uses a **5-factor weighted model**:

| Factor | Weight | Description |
|--------|--------|-------------|
| Crime Density | 30% | Number of crimes within 200m |
| Severity Average | 25% | Mean severity of nearby crimes |
| Category Weight | 20% | Women-safety relevance (molestation=1.0, theft=0.5) |
| Recency | 15% | Fraction of crimes in last 2 years |
| Infrastructure | 10% | Proxy based on area density |

Time-of-day multipliers:
- Morning (6-12): 0.6x
- Afternoon (12-18): 0.8x
- Evening (18-22): 1.2x
- Night (22-6): 1.5x

---

## Running Tests

```bash
cd backend

# Start the server first, then:
python tests/test_api.py
```

---

## Demo Script (5 minutes)

1. **0:00** - Open app, show map centered on Bangalore
2. **0:30** - Enter "Koramangala" → "MG Road", tap "Find Safe Routes"
3. **1:00** - Show 3 route alternatives with risk scores
4. **1:30** - Tap routes to compare — explain green/yellow/red color coding
5. **2:00** - Toggle heatmap ON — show crime hotspots
6. **2:30** - Change time to "Night" — watch scores increase
7. **3:00** - Toggle 4G → 5G — show latency difference
8. **3:30** - Long-press SOS button — show emergency screen
9. **4:00** - Show live location tracking, contact notifications
10. **4:30** - Show architecture diagram, explain 5G advantage

---

## Dataset

- **157,160** crime records from Bangalore (2014-2025)
- **37** crime categories
- **53** named areas/neighborhoods
- Columns: `id, latitude, longitude, crime_type, timestamp, area_name`

---

## Team

Built for hackathon submission - SafeRoute AI
