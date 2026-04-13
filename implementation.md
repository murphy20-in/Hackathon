# SafeRoute AI — Implementation Document

## 1. Project Overview

**SafeRoute AI** is a 5G-powered women safety navigation system that recommends the safest walking routes by analyzing 157,160+ real crime records from Bangalore. Unlike Google Maps which optimizes for speed, SafeRoute AI optimizes for safety — scoring every route segment using a multi-factor AI risk engine, adjusting for time-of-day, and leveraging 5G ultra-low latency for real-time safety monitoring.

**One-line pitch:** *"Google Maps tells you the fastest route. We tell you the safest."*

---

## 2. Architecture

### 2.1 System Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React Native / Expo)               │
│                                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ MapScreen│  │RouteDetails  │  │Emergency │  │  Components     │ │
│  │ (Google  │  │Panel         │  │Screen    │  │  SearchInput    │ │
│  │  Maps)   │  │(Route Cards) │  │(SOS Mode)│  │  SOSButton      │ │
│  │          │  │              │  │          │  │  HeatmapToggle  │ │
│  │ Polylines│  │ Risk Scores  │  │ Live GPS │  │  NetworkBadge   │ │
│  │ Circles  │  │ Time Context │  │ Tracking │  │  Legend         │ │
│  │ Markers  │  │ Trade-offs   │  │ Timer    │  │  MetricsPanel   │ │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └────────┬────────┘ │
│       │               │               │                  │          │
│       └───────────────┴───────┬───────┴──────────────────┘          │
│                               │                                      │
│                    ┌──────────┴──────────┐                           │
│                    │   services/api.js    │  (fetch + simulated      │
│                    │   (API Client)       │   network latency)       │
│                    └──────────┬───────────┘                          │
└───────────────────────────────┼──────────────────────────────────────┘
                                │ HTTP REST
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI / Python)                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                        app/main.py                             │  │
│  │   FastAPI + CORS Middleware + Router Registration              │  │
│  └────────────────────────┬───────────────────────────────────────┘  │
│                           │                                          │
│  ┌────────────┬───────────┼───────────┬───────────────┐              │
│  │            │           │           │               │              │
│  ▼            ▼           ▼           ▼               ▼              │
│ routes/     routes/     routes/     routes/        /api/health       │
│ routes.py   crime.py    sos.py     simulation.py                    │
│ POST        GET         POST       GET/POST                         │
│ /get-routes /crime-zones /send-sos  /simulation/*                   │
│ /safe-route              /sos/*                                     │
│  │            │           │           │                              │
│  ▼            ▼           ▼           ▼                              │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │                      SERVICES LAYER                          │    │
│ │                                                              │    │
│ │  risk_engine.py ──── 5-factor weighted scoring               │    │
│ │  time_risk.py ────── Time-of-day multipliers (0.6x - 1.5x)  │    │
│ │  geo_utils.py ────── PostGIS spatial queries, haversine      │    │
│ │  routing.py ──────── Google Directions / OSRM fallback       │    │
│ │  crowd_simulator.py─ Area-based crowd density model          │    │
│ │  realtime_simulator── Live alerts, 5G network profiles       │    │
│ │  alert_engine.py ─── SOS event lifecycle management          │    │
│ └──────────────────────────┬───────────────────────────────────┘    │
│                            │                                         │
│  ┌─────────────────────────┴───────────────────────────────────┐    │
│  │                   DATABASE LAYER                             │    │
│  │   SQLAlchemy + GeoAlchemy2 ORM                               │    │
│  │   models/crime.py → crime_incidents (157,160 rows)           │    │
│  │   models/sos.py   → sos_events                               │    │
│  └──────────────────────────┬──────────────────────────────────┘    │
└─────────────────────────────┼────────────────────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  PostgreSQL 15 + PostGIS │
                 │                         │
                 │  crime_incidents         │
                 │  ├─ id (PK)             │
                 │  ├─ latitude, longitude  │
                 │  ├─ crime_type           │
                 │  ├─ timestamp            │
                 │  ├─ area_name            │
                 │  └─ location (POINT 4326)│
                 │     └─ GiST spatial index│
                 │                         │
                 │  sos_events             │
                 │  ├─ id (PK, serial)     │
                 │  ├─ user_id, lat, lng   │
                 │  ├─ status, timestamp   │
                 │  └─ location (POINT 4326)│
                 └─────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Backend Framework | FastAPI | 0.109.0 | Async REST API with auto-generated docs |
| ORM | SQLAlchemy + GeoAlchemy2 | 2.0.25 / 0.14.3 | PostGIS-aware database models |
| Database | PostgreSQL + PostGIS | 15+ / 3.4+ | Spatial queries (ST_DWithin, ST_MakePoint) |
| HTTP Client | httpx | 0.26.0 | Async requests to Google/OSRM APIs |
| Data Processing | pandas + numpy | 2.1.4 / 1.26.3 | CSV ingestion and manipulation |
| Frontend Framework | React Native (Expo) | SDK 52 | Cross-platform mobile app |
| Maps | react-native-maps | 1.20.1 | Google Maps rendering with polylines/circles |
| Navigation | @react-navigation/native | 7.0.0 | Screen navigation (Map ↔ Emergency) |
| Location | expo-location | 18.0.0 | GPS tracking for SOS features |
| Routing Provider | OSRM (default) / Google Directions | — | Multi-route calculation with alternatives |

---

## 3. Data Layer

### 3.1 Dataset Profile

| Property | Value |
|----------|-------|
| Source file | `dataset/final.csv` |
| Total records | 157,160 |
| Columns | `id, latitude, longitude, crime_type, timestamp, area_name` |
| Geographic coverage | Bangalore metro — Lat 12.83–13.11, Lon 77.46–77.78 |
| Temporal range | 2014–2025 |
| Crime categories | 37 distinct types |
| Named areas | 53 neighborhoods |
| ID format | `SR000001` through `SR157160` |
| Timestamp format | ISO 8601 (`2025-02-07T12:20:00`) |

### 3.2 Crime Category Distribution (Top 10)

| Crime Type | Count | Women-Safety Weight |
|------------|-------|-------------------|
| accident | 28,831 | 0.40 |
| theft | 20,169 | 0.50 |
| other | 16,888 | 0.30 |
| cyber_crime | 12,997 | 0.30 |
| assault | 11,963 | 0.80 |
| gambling | 8,716 | 0.20 |
| molestation | 8,182 | **1.00** |
| excise_violation | 6,730 | 0.20 |
| kidnapping | 6,236 | **0.90** |
| murder | 4,935 | **0.95** |

### 3.3 Database Schema

**File:** `backend/app/models/crime.py`

```sql
CREATE TABLE crime_incidents (
    id          VARCHAR     PRIMARY KEY,   -- "SR000001"
    latitude    FLOAT       NOT NULL,
    longitude   FLOAT       NOT NULL,
    crime_type  VARCHAR(100) NOT NULL,
    timestamp   TIMESTAMP   NOT NULL,
    area_name   VARCHAR(200) NOT NULL,
    location    GEOMETRY(POINT, 4326)      -- PostGIS spatial column
);

-- Indexes for performance
CREATE INDEX idx_crime_location  ON crime_incidents USING GIST(location);
CREATE INDEX idx_crime_type      ON crime_incidents (crime_type);
CREATE INDEX idx_crime_timestamp ON crime_incidents (timestamp);
```

**File:** `backend/app/models/sos.py`

```sql
CREATE TABLE sos_events (
    id                SERIAL      PRIMARY KEY,
    user_id           VARCHAR(100) NOT NULL DEFAULT 'anonymous',
    latitude          FLOAT       NOT NULL,
    longitude         FLOAT       NOT NULL,
    location          GEOMETRY(POINT, 4326),
    timestamp         TIMESTAMP   NOT NULL DEFAULT NOW(),
    status            VARCHAR(20) NOT NULL DEFAULT 'active',
    resolved_at       TIMESTAMP,
    contacts_notified TEXT,       -- JSON string
    notes             TEXT
);
```

### 3.4 Data Loading (ETL)

**File:** `backend/app/database/init_db.py`

**Process:**
1. Enable PostGIS extension: `CREATE EXTENSION IF NOT EXISTS postgis`
2. Create tables via SQLAlchemy `Base.metadata.create_all()`
3. Check if data already loaded (skip if `count >= 157,000`)
4. Load CSV in chunks of 5,000 rows using `pandas.read_csv(chunksize=5000)`
5. Parse ISO timestamps, create `CrimeIncident` objects, bulk insert
6. Update geometry column: `UPDATE crime_incidents SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)`
7. Verify: `SELECT count(*) FROM crime_incidents` = 157,160

**Run command:**
```bash
cd backend
python -m app.database.init_db
```

---

## 4. Backend Services — Deep Dive

### 4.1 Risk Scoring Engine

**File:** `backend/app/services/risk_engine.py`

This is the core intelligence of the system. It implements a **5-factor weighted risk model** that scores every point along a route.

#### Risk Computation Pipeline

```
Input: Route polyline + time-of-day
                │
                ▼
   ┌─────────────────────────┐
   │  1. Decode polyline      │  Google encoded polyline → [(lat,lng), ...]
   │     into coordinates     │
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  2. Sample points every  │  Walk coordinate list, emit point every 100m
   │     100m along route     │  using linear interpolation + haversine
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  3. For each point:      │  PostGIS: ST_DWithin(location::geography,
   │     Query crimes within  │    ST_SetSRID(ST_MakePoint(lon,lat),4326)
   │     200m radius          │    ::geography, 200)
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  4. Compute 5-factor     │  See factor breakdown below
   │     weighted score       │
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  5. Apply time-of-day    │  Score × time_multiplier (0.6 – 1.5)
   │     multiplier           │
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  6. Aggregate segment    │  Average all point scores → route risk_score
   │     scores → route score │  Invert: safety_score = 10 × (1 - avg)
   └────────────┬─────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │  7. Rank all routes      │  Sort by risk_score ascending
   │     → recommend safest   │  Label: "Safest Route", "Route 2 (Risky)"
   └──────────────────────────┘
```

#### 5-Factor Risk Model

| # | Factor | Weight | Calculation | Range |
|---|--------|--------|-------------|-------|
| 1 | Crime Density | 0.30 | `min(nearby_crime_count / 50, 1.0)` | 0–1 |
| 2 | Severity Average | 0.25 | `mean(category_weight for each nearby crime)` | 0–1 |
| 3 | Category Max | 0.20 | `max(category_weight for each nearby crime)` | 0–1 |
| 4 | Recency | 0.15 | `count(crimes in last 2 years) / total_nearby` | 0–1 |
| 5 | Infrastructure | 0.10 | `1.0 - density` (proxy: denser areas = better lit) | 0–1 |

**Formula:**
```
raw_score = 0.30×density + 0.25×severity + 0.20×category + 0.15×recency + 0.10×infrastructure
final_score = min(raw_score × time_multiplier, 1.0)
risk_score = final_score × 100          (0–100 scale)
safety_score = 10 × (1 - final_score)   (0–10 scale, 10 = safest)
```

#### Crime Category Weights (37 types)

All 37 crime types in the dataset are mapped to a women-safety relevance weight:

| Weight Range | Crime Types |
|-------------|-------------|
| **0.90–1.00** | molestation, rape, eve_teasing, sexual_harassment, murder, kidnapping, child_abuse, stalking, culpable_homicide |
| **0.80–0.89** | domestic_violence, dowry_crime, assault |
| **0.60–0.79** | robbery, chain_snatching, dacoity, rioting, criminal_intimidation, extortion, arms_violation, arson, abetment |
| **0.40–0.59** | theft, burglary, affray, trespass, accident |
| **0.20–0.39** | negligence, cyber_crime, cheating, forgery, breach_of_trust, narcotics, other, counterfeiting, gambling, excise_violation, prohibition |

### 4.2 Time-Based Intelligence

**File:** `backend/app/services/time_risk.py`

| Time Period | Hours | Multiplier | Risk Level |
|-------------|-------|-----------|------------|
| Morning | 06:00–11:59 | 0.6x | LOW |
| Afternoon | 12:00–17:59 | 0.8x | MEDIUM |
| Evening | 18:00–21:59 | 1.2x | HIGH |
| Night | 22:00–05:59 | 1.5x | VERY HIGH |

**Impact example:** A route with base risk score of 40:
- Morning: 40 × 0.6 = **24** (Low risk)
- Night: 40 × 1.5 = **60** (High risk)

The same route can shift from "safe" to "risky" depending on when it's traveled.

### 4.3 Spatial Queries

**File:** `backend/app/services/geo_utils.py`

Three core functions:

1. **`haversine(lat1, lon1, lat2, lon2)`** — Great-circle distance in meters using the Haversine formula.

2. **`sample_points_along_route(coordinates, interval_m=100)`** — Walks a coordinate list and emits a point every 100m using linear interpolation. Handles variable-length segments by tracking accumulated distance.

3. **`get_crimes_near_point(db, lat, lon, radius_m=200)`** — PostGIS spatial query:
   ```sql
   SELECT crime_type, timestamp,
     ST_Distance(location::geography,
       ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) as distance_meters
   FROM crime_incidents
   WHERE ST_DWithin(location::geography,
     ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)
   ORDER BY distance_meters
   ```

4. **`get_aggregated_crime_zones(db)`** — Aggregates 157K records into ~800 grid cells for the heatmap:
   ```sql
   SELECT ROUND(latitude::numeric, 3) as lat,
          ROUND(longitude::numeric, 3) as lng,
          COUNT(*) as crime_count,
          SUM(CASE WHEN crime_type IN (...women-safety types...) THEN 1.0 ELSE 0.3 END) as weighted_score
   FROM crime_incidents
   GROUP BY ROUND(latitude::numeric, 3), ROUND(longitude::numeric, 3)
   HAVING COUNT(*) >= 3
   ```

### 4.4 Route Fetching

**File:** `backend/app/services/routing.py`

| Provider | Config | API Key Required | Walking Routes |
|----------|--------|-----------------|----------------|
| **OSRM** (default) | `ROUTING_PROVIDER=osrm` | No | Yes (foot profile) |
| **Google** | `ROUTING_PROVIDER=google` | Yes | Yes (walking mode) |

**OSRM flow:** Address → Nominatim geocoding → OSRM `/route/v1/foot/` → polyline + distance + duration
**Google flow:** Address → Google Directions API with `alternatives=true` → polyline + distance + duration

Both return a normalized list of route dicts:
```json
{
  "route_id": 1,
  "distance": "4.2 km",
  "distance_meters": 4200,
  "duration": "52 min",
  "duration_seconds": 3120,
  "polyline": "encoded_polyline_string",
  "start_location": {"lat": 12.9716, "lng": 77.5946},
  "end_location": {"lat": 12.9756, "lng": 77.6096},
  "provider": "osrm"
}
```

### 4.5 5G Simulation Layer

**File:** `backend/app/services/realtime_simulator.py`

| Network Mode | Latency | Bandwidth | Update Interval | Edge Computing | Slicing |
|-------------|---------|-----------|----------------|---------------|---------|
| **5G** | 5ms | 1000 Mbps | 2s | Yes | Yes |
| **4G** | 50ms | 50 Mbps | 15s | No | No |
| **3G** | 200ms | 5 Mbps | 30s | No | No |

**Real-time risk simulation (`simulate_real_time_risk`):**
- Uses deterministic hashing (`MD5(lat, lng, hour)`) to generate consistent alerts per location — same spot always shows same alerts during demo
- Produces 1–3 alerts per location, categorized as `info`, `warning`, or `danger`
- Alert severity determined by time period + crowd level:
  - Night + Low crowd → mostly `danger`
  - Day + High crowd → mostly `info`

**Crowd density simulation (`crowd_simulator.py`):**
- Areas classified as `commercial`, `transit_hub`, `residential`, or `general`
- Time-of-day density curves per area type (e.g., commercial peaks 10am–9pm, transit peaks at rush hours)
- Deterministic variation per grid cell using location hash

### 4.6 SOS Alert Engine

**File:** `backend/app/services/alert_engine.py`

**Lifecycle:** `trigger_sos()` → active → `resolve_sos()` → resolved

**Trigger flow:**
1. Create `SOSEvent` record with user_id, location, timestamp
2. Update PostGIS geometry column
3. Simulate contact notification (generate SMS message with Google Maps link)
4. Return SOS ID, tracking URL, notification status

---

## 5. API Reference

### 5.1 Core Endpoints

#### `POST /api/safe-route` — **Primary Endpoint**

The main endpoint that powers the app. Fetches routes, scores them, and returns the safest recommendation.

**Request:**
```json
{
  "source": "Koramangala, Bangalore",
  "destination": "MG Road, Bangalore",
  "time_of_day": "night"   // "morning" | "afternoon" | "evening" | "night" | null (auto)
}
```

**Response:**
```json
{
  "status": "success",
  "recommended_route": {
    "route_id": 2,
    "label": "Safest Route",
    "distance": "5.2 km",
    "duration": "18 min",
    "polyline": "encoded_string...",
    "risk_score": 23.5,
    "safety_score": 7.65,
    "risk_level": "low",
    "segment_scores": [0.1, 0.3, 0.2, ...],
    "segments": [
      {"index": 0, "lat": 12.935, "lng": 77.632, "score": 0.1, "risk_level": "low", "color": "#4CAF50"}
    ],
    "summary": {
      "total_segments": 23,
      "high_risk_segments": 2,
      "medium_risk_segments": 5,
      "low_risk_segments": 16
    },
    "message": "This route passes through mostly safe areas."
  },
  "alternatives": [...],
  "time_context": {
    "period": "night",
    "multiplier": 1.5,
    "risk_level": "VERY_HIGH",
    "label": "Night",
    "description": "Low visibility, minimal foot traffic, highest risk"
  },
  "trade_off_note": "The safest route has 21.7 lower risk score than the next alternative."
}
```

#### `POST /api/get-routes` — Raw Routes

Returns routes without risk scoring (faster, for initial display).

**Request:** `{"source": "...", "destination": "..."}`

#### `GET /api/crime-zones` — Heatmap Data

Returns ~800 pre-aggregated grid cells for crime heatmap overlay. Cached in memory after first computation.

**Response:**
```json
{
  "status": "success",
  "count": 823,
  "zones": [
    {"lat": 12.935, "lng": 77.632, "crime_count": 45, "weighted_score": 38.5, "risk_level": "high", "intensity": 0.87}
  ]
}
```

#### `POST /api/send-sos` — Emergency Alert

**Request:**
```json
{
  "user_id": "user_1",
  "location": {"lat": 12.9716, "lng": 77.5946},
  "contacts": [{"name": "Mom", "phone": "+91-9999999999"}]
}
```

**Response:** SOS ID, tracking URL, contact notification status.

### 5.2 Simulation Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/simulation/status` | GET | Current network mode + all profiles |
| `/api/simulation/set-mode` | POST | Switch 3G/4G/5G `{"mode": "5G"}` |
| `/api/simulation/crowd-density` | GET | Crowd level for lat/lng/hour |
| `/api/simulation/realtime-risk` | GET | Live alerts for lat/lng |
| `/api/simulation/compare` | GET | Side-by-side 3G vs 4G vs 5G timing |

---

## 6. Frontend Implementation

### 6.1 Navigation Structure

```
App.js (NavigationContainer)
├── MapScreen (home)       — Full-screen map + search + routes + heatmap + SOS
└── EmergencyScreen        — Dark emergency mode with live GPS tracking
```

### 6.2 Screen: MapScreen

**File:** `frontend/src/screens/MapScreen.js`

The main screen composing all features:

| Layer | Component | Z-Index | Position |
|-------|-----------|---------|----------|
| Map | `<MapView>` with Google provider | Base | Full screen |
| Search | `<SearchInput>` | 10 | Top overlay |
| Controls | `<HeatmapToggle>` + `<NetworkBadge>` | 5 | Top-right |
| Metrics | `<MetricsPanel>` | 5 | Top-left |
| Legend | `<Legend>` | 5 | Bottom-left |
| Routes | `<RouteDetailsPanel>` | 10 | Bottom sheet |
| SOS | `<SOSButton>` | 15 | Bottom-right |

**Map rendering:**
- Route polylines: Selected route gets risk-color (green/yellow/red) with `strokeWidth=6`, unselected routes gray with dash pattern and `strokeWidth=3`
- Heatmap: `<Circle>` components per crime zone — radius and color vary by risk level
- Markers: Green pin at start, red pin at destination

**State management:** Local `useState` for source, destination, routes, selectedRoute, heatmapVisible, crimeZones, networkMode, sosActive, responseTime.

### 6.3 Screen: EmergencyScreen

**File:** `frontend/src/screens/EmergencyScreen.js`

Dark red emergency UI activated when SOS is triggered:
- Vibration alert pattern on entry
- Elapsed time counter (MM:SS format)
- Live GPS coordinates updating every 5 seconds via `expo-location` watchPosition
- Status indicators: contacts notified, location tracking active, police alerted, network connected
- Simulated shareable tracking link
- "I'm Safe - Cancel Emergency" button to resolve

### 6.4 Component Breakdown

| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| **SearchInput** | `components/SearchInput.js` | source, destination, onSearch, loading | Two text fields + "Find Safe Routes" button |
| **RouteCard** | `components/RouteCard.js` | route, isSelected, onSelect | Single route card with score badge, distance, duration, risk summary |
| **HeatmapToggle** | `components/HeatmapToggle.js` | isActive, onToggle | Toggle button for crime heatmap overlay |
| **Legend** | `components/Legend.js` | — | Safe/Moderate/High Risk color legend |
| **SOSButton** | `components/SOSButton.js` | onTrigger, disabled | Red floating button, requires long-press + confirmation alert |
| **NetworkBadge** | `components/NetworkBadge.js` | currentMode, onToggle, responseTime | 3G/4G/5G cycle toggle with latency + edge badge |
| **MetricsPanel** | `components/MetricsPanel.js` | networkMode, responseTime, routeCount, timeContext | Black overlay with response time, route count, time period |

### 6.5 Service Layer

**`services/api.js`** — All backend API calls with:
- Simulated network latency for non-5G modes (`setTimeout(profile.latency)`)
- Functions: `getSafeRoute()`, `getCrimeZones()`, `sendSOS()`, `resolveSOS()`, `setNetworkMode()`, `getRealtimeRisk()`, `getCrowdDensity()`

**`services/locationService.js`** — expo-location wrapper:
- `requestLocationPermission()` — Foreground permission request
- `getCurrentLocation()` — One-shot high-accuracy position
- `watchPosition(callback, interval)` — Continuous tracking for SOS mode

### 6.6 Custom Hooks

**`useLocation()`** — Returns `{location, errorMsg, isLoading}`. Requests permission and fetches current position on mount.

**`useRoutes()`** — Returns `{routes, selectedRoute, setSelectedRoute, loading, error, timeContext, tradeOffNote, fetchRoutes, clearRoutes}`. Manages route fetching, selection state, and timing metrics.

---

## 7. Data Flow — End-to-End

### 7.1 Safe Route Request Flow

```
User types "Koramangala" → "MG Road", taps "Find Safe Routes"
    │
    ▼
[Frontend] useRoutes.fetchRoutes() → api.getSafeRoute()
    │
    ▼ POST /api/safe-route {source, destination, time_of_day}
    │
[Backend] routes.py → parse_time_of_day() → fetch_routes()
    │
    ├──[OSRM]──→ Nominatim geocode → OSRM /route/v1/foot/ → 3 alternatives
    │
    ▼
[Backend] rank_routes(db, routes, hour)
    │
    ├── For each route:
    │   ├── decode_polyline() → [(lat,lng), ...]
    │   ├── sample_points_along_route(coords, 100m) → ~50 points
    │   ├── For each point:
    │   │   ├── get_crimes_near_point(db, lat, lon, 200m) → PostGIS ST_DWithin
    │   │   ├── Compute 5 factors: density, severity, category, recency, infrastructure
    │   │   ├── Weighted sum → raw_score
    │   │   └── × time_multiplier → final_score
    │   ├── Aggregate: mean(scores) → risk_score, 10×(1-avg) → safety_score
    │   └── Generate message, classify risk_level
    │
    ├── Sort routes by risk_score ascending
    ├── Label: "Safest Route", "Route 2 (Moderate)", "Route 3 (Risky)"
    └── Return {recommended_route, alternatives, time_context}
    │
    ▼
[Frontend] setRoutes(), setSelectedRoute() → re-render
    │
    ├── MapView: Polylines (green/yellow/red), Markers
    ├── RouteDetailsPanel: RouteCards in horizontal scroll
    ├── MetricsPanel: Response time, route count, time period
    └── fitToCoordinates() to zoom map to route bounds
```

### 7.2 SOS Emergency Flow

```
User long-presses SOS button (1 second)
    │
    ▼
[Frontend] Alert.alert("Send emergency alert?")
    │ User confirms
    ▼
[Frontend] sendSOS(user_id, location, contacts)
    │
    ▼ POST /api/send-sos
    │
[Backend] alert_engine.trigger_sos()
    │
    ├── Create SOSEvent record in PostgreSQL
    ├── Update PostGIS geometry
    ├── Generate notification messages for contacts
    └── Return {sos_id, tracking_url, contacts_notified}
    │
    ▼
[Frontend] navigation.navigate('Emergency')
    │
    ├── Vibration pattern
    ├── Start watchPosition() → GPS every 5 seconds
    ├── Start elapsed timer
    └── Display emergency UI with live coordinates
```

---

## 8. 5G Demonstration Strategy

The 5G advantage is demonstrated through **simulated latency injection** on the frontend and **network profile comparison** on the backend:

### Frontend Simulation
In `services/api.js`, every API call passes through a simulated delay:
```javascript
if (profile.latency > 10) {
  await new Promise(r => setTimeout(r, profile.latency));
}
```
- **5G mode**: No added delay — responses feel instant
- **4G mode**: +50ms delay on every API call
- **3G mode**: +200ms delay — visibly sluggish

### Demo Scenarios

| Scenario | 3G | 4G | 5G |
|----------|-----|-----|-----|
| Route scoring response | ~700ms | ~250ms | ~50ms |
| SOS trigger to confirmation | ~400ms | ~150ms | ~10ms |
| Heatmap data load | ~500ms | ~200ms | ~30ms |
| Location update frequency | Every 30s | Every 15s | Every 2s |
| Edge computing | No | No | Yes (badge shown) |

### Backend Comparison Endpoint
`GET /api/simulation/compare?lat=12.97&lng=77.59` runs the same risk computation three times with injected delays, returning a side-by-side comparison.

---

## 9. File Inventory

### Backend — 20 source files

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI app, CORS, router registration
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py                  # Pydantic settings from .env
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py                # Engine, SessionLocal, get_db()
│   │   └── init_db.py                   # PostGIS setup + CSV loader
│   ├── models/
│   │   ├── __init__.py
│   │   ├── crime.py                     # CrimeIncident model (GiST indexed)
│   │   └── sos.py                       # SOSEvent model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── routes.py                    # POST /get-routes, /safe-route
│   │   ├── crime.py                     # GET /crime-zones
│   │   ├── sos.py                       # POST /send-sos, /sos/resolve
│   │   └── simulation.py               # 5G simulation endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── risk_engine.py               # 5-factor scoring + route ranking
│   │   ├── time_risk.py                 # Time-of-day multipliers
│   │   ├── geo_utils.py                 # PostGIS queries, haversine, sampling
│   │   ├── routing.py                   # Google/OSRM route fetching
│   │   ├── crowd_simulator.py           # Area-based crowd density
│   │   ├── realtime_simulator.py        # Live alerts + network profiles
│   │   └── alert_engine.py              # SOS lifecycle management
│   └── utils/
│       ├── __init__.py
│       └── polyline_decoder.py          # Google polyline decoder
├── tests/
│   ├── __init__.py
│   └── test_api.py                      # 10 automated API tests
├── requirements.txt
├── .env.example
└── .env
```

### Frontend — 17 source files

```
frontend/
├── App.js                               # Entry + navigation stack
├── app.json                             # Expo config + Google Maps key
├── package.json                         # Dependencies
└── src/
    ├── screens/
    │   ├── MapScreen.js                 # Main map + all integrations
    │   ├── RouteDetailsPanel.js         # Bottom sheet route cards
    │   └── EmergencyScreen.js           # SOS emergency mode
    ├── components/
    │   ├── SearchInput.js               # Source/destination inputs
    │   ├── RouteCard.js                 # Individual route summary
    │   ├── HeatmapToggle.js             # Crime overlay toggle
    │   ├── Legend.js                     # Color legend
    │   ├── SOSButton.js                 # Emergency trigger
    │   ├── NetworkBadge.js              # 3G/4G/5G toggle
    │   └── MetricsPanel.js              # Performance metrics
    ├── services/
    │   ├── api.js                       # Backend API client
    │   └── locationService.js           # GPS tracking
    ├── hooks/
    │   ├── useLocation.js               # Location hook
    │   └── useRoutes.js                 # Route management hook
    ├── constants/
    │   ├── colors.js                    # Theme + risk colors
    │   └── config.js                    # API URL, map center, profiles
    └── utils/
        └── polyline.js                  # JS polyline decoder
```

### Root files
```
.env.example                             # Environment template
README.md                                # Full setup + usage docs
implementation.md                        # This file
```

---

## 10. Setup & Deployment

### 10.1 Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with PostGIS 3.4+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on Android/iOS device

### 10.2 Database (Docker — Recommended)

```bash
docker run -d \
  --name saferoute-db \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saferoute \
  postgis/postgis:16-3.4
```

### 10.3 Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Edit DATABASE_URL if needed

# Load 157K crime records (~30-60 seconds)
python -m app.database.init_db

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Verify: open http://localhost:8000/docs
```

### 10.4 Frontend

```bash
cd frontend
npm install

# Edit src/constants/config.js — set API_BASE_URL to your machine's IP
# e.g., http://192.168.1.100:8000/api

npx expo start
# Scan QR code with Expo Go, or press 'a' for Android emulator
```

### 10.5 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/saferoute` | PostgreSQL connection string |
| `GOOGLE_MAPS_API_KEY` | *(empty)* | Optional — needed for Google routing |
| `ROUTING_PROVIDER` | `osrm` | `osrm` (free) or `google` (needs key) |
| `OSRM_BASE_URL` | `http://router.project-osrm.org` | OSRM server URL |
| `CORS_ORIGINS` | `*` | Allowed CORS origins |
| `CRIME_QUERY_RADIUS_METERS` | `200` | Spatial query radius per sample point |
| `ROUTE_SAMPLE_INTERVAL_METERS` | `100` | Distance between route sample points |

---

## 11. Testing

### 11.1 Automated API Tests

**File:** `backend/tests/test_api.py` — 10 tests covering all endpoints.

```bash
cd backend
python tests/test_api.py
```

| Test | Endpoint | Validates |
|------|----------|-----------|
| `test_health` | GET /api/health | Server is running |
| `test_crime_zones` | GET /api/crime-zones | Returns 800+ zones with lat/lng/risk |
| `test_get_routes` | POST /api/get-routes | Routes returned with polylines |
| `test_safe_route` | POST /api/safe-route (night) | Risk scoring, recommendation, time context |
| `test_safe_route_day` | POST /api/safe-route (morning) | Lower risk scores during daytime |
| `test_send_sos` | POST /api/send-sos | SOS created, contacts notified |
| `test_simulation_status` | GET /api/simulation/status | Network profiles returned |
| `test_simulation_set_mode` | POST /api/simulation/set-mode | Mode switching 3G↔4G↔5G |
| `test_realtime_risk` | GET /api/simulation/realtime-risk | Alerts generated for location |
| `test_crowd_density` | GET /api/simulation/crowd-density | Crowd level for area/time |

### 11.2 Manual Test Scenarios

**Scenario 1: Route comparison**
```bash
curl -X POST http://localhost:8000/api/safe-route \
  -H "Content-Type: application/json" \
  -d '{"source":"Koramangala, Bangalore","destination":"MG Road, Bangalore","time_of_day":"night"}'
```
Expected: 2-3 routes, recommended with lowest risk_score, night multiplier applied.

**Scenario 2: Time impact**
Run the same route with `"time_of_day": "morning"` vs `"night"` — night scores should be ~2.5x higher.

**Scenario 3: SOS trigger**
```bash
curl -X POST http://localhost:8000/api/send-sos \
  -H "Content-Type: application/json" \
  -d '{"user_id":"demo","location":{"lat":12.9716,"lng":77.5946},"contacts":[{"name":"Mom","phone":"+919999999999"}]}'
```

---

## 12. Demo Script (5 Minutes)

| Time | Action | What to Show |
|------|--------|-------------|
| 0:00 | Open app | Map centered on Bangalore, clean UI |
| 0:30 | Type "Koramangala" → "MG Road" | Search input with green/red dots |
| 0:45 | Tap "Find Safe Routes" | Loading state, then 3 routes appear |
| 1:00 | Point at routes | Green = safe, yellow = moderate, red = risky |
| 1:30 | Tap different routes | Route cards slide, map highlights selection |
| 2:00 | Toggle heatmap ON | Crime circles appear — red clusters visible |
| 2:30 | Explain time intelligence | "Same route, different time = different score" |
| 2:45 | Mention night mode | Higher risk scores, warning messages |
| 3:00 | Toggle 5G → 4G | Show latency increase in metrics panel |
| 3:15 | Toggle back to 5G | Instant response, "Edge" badge appears |
| 3:30 | Long-press SOS button | Confirmation dialog |
| 3:45 | Confirm SOS | Emergency screen — dark red, timer, live coords |
| 4:00 | Show tracking link | "Shareable with contacts" |
| 4:15 | Cancel emergency | Return to map |
| 4:30 | Show Swagger UI | `/docs` — all API endpoints documented |
| 5:00 | Closing | "Google Maps shows fastest. We show safest." |

---

## 13. Performance Characteristics

| Operation | Expected Latency | Notes |
|-----------|-----------------|-------|
| Crime zone aggregation | ~500ms first load, then cached | 157K rows → ~800 grid cells |
| Single point risk query | 1–5ms | GiST index on PostGIS geometry |
| Route scoring (50 points) | 50–250ms | 50 sequential spatial queries |
| Full safe-route (3 routes) | 1–3 seconds | Geocoding + routing + 3× scoring |
| Heatmap render (800 circles) | ~100ms | React Native `<Circle>` batch |

---

## 14. Known Limitations & Future Work

| Limitation | Mitigation | Future |
|-----------|-----------|--------|
| Infrastructure factor is a proxy (density inverse) | Acceptable for POC | Integrate street light + CCTV datasets |
| OSRM public server is rate-limited | Cache route responses for demo | Self-host OSRM or use Google |
| No real SMS delivery | Simulated contact notification | Integrate Twilio/MSG91 |
| No user authentication | All users are "anonymous" | Add JWT auth with user profiles |
| Heatmap uses circles, not true density | Acceptable for React Native | Use `react-native-maps` Heatmap on Android |
| 5G is simulated, not real | Latency injection demonstrates the concept | Test on actual 5G networks |
| No offline support | Requires network connectivity | Cache routes + crime data locally |
