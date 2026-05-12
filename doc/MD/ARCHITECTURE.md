# SurakṣāMārga.ai — Architecture Document

## Technical System Architecture, Integration Design, and Infrastructure

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Technical Architecture Reference  
**Status:** Active Development

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1, see §6, §7, §12A and the Appendix invariants). The current prototype lives in `/codebase/backend` (FastAPI) and `/codebase/frontend` (React Native/Expo). Dev uses **SQLite** (`saferoute.db`); **PostgreSQL 15 + PostGIS 3.4** is the production target — the schema below targets PostGIS, with SQLite as a drop-in for local dev.

---

# 1. System Architecture Overview

## 1.1 Architectural Principles

The SurakṣāMārga.ai architecture is designed around five fundamental principles:

| Principle | Implementation |
|-----------|----------------|
| **Low Latency** | Edge computing for sub-50ms response times |
| **High Availability** | Multi-region deployment with automatic failover |
| **Security First** | End-to-end encryption, JWT authentication, role-based access |
| **Scalability** | Microservices architecture with horizontal scaling |
| **Observability** | Comprehensive logging, metrics, and tracing |

## 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SURAKṢĀMĀRGA.AI ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                    React Native / Expo App                        │  │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │  │   │
│  │  │  │MapScreen │ │Emergency │ │Analytics │ │Settings  │ │Onboarding│ │  │   │
│  │  │  │          │ │  Screen   │ │ Dashboard│ │          │ │   Flow   │ │  │   │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘ │  │   │
│  │  │       │            │            │            │              │        │  │   │
│  │  │       └────────────┴────────────┴────────────┴──────────────┘        │  │   │
│  │  │                                    │                                     │  │   │
│  │  │                    ┌─────────────┴─────────────┐                       │  │   │
│  │  │                    │   API Client Service    │                       │  │   │
│  │  │                    │   (axios + retry)        │                       │  │   │
│  │  │                    └─────────────┬───────────────┘                       │  │   │
│  │  └──────────────────────────────────┼──────────────────────────────────────┘   │   │
│  │                                     │ HTTPS/WSS                             │   │
│  └─────────────────────────────────────┼────────────────────────────────────────┘   │
│                                        │                                         │
│  ┌─────────────────────────────────────┴────────────────────────────────────────┐   │
│  │                         5G NETWORK EDGE                                     │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐    │   │
│  │  │                    Edge Computing Node                             │    │   │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │    │   │
│  │  │  │  Risk Engine   │  │ Threat Detect │  │ Route Optimize │     │    │   │
│  │  │  │  (Python/Fast) │  │  (ONNX)        │  │ (Graph Search) │     │    │   │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘     │    │   │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │    │   │
│  │  │  │  SOS Pipeline  │  │ Location Track │  │  Data Plane    │     │    │   │
│  │  │  │  (<10ms)       │  │ (2s interval)  │  │  (User Data)   │     │    │   │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘     │    │   │
│  │  └────────────────────────────────────────────────────────────────────┘    │   │
│  │                                                                              │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                         │
│                                        ▼                                         │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │                        CLOUD SERVICES LAYER                                 │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐    │   │
│  │  │                      API Gateway (FastAPI)                         │    │   │
│  │  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │    │   │
│  │  │   │  Routes  │ │  Crime   │ │   SOS    │ │  Auth    │ │ Analytics │  │    │   │
│  │  │   │ Endpoint │ │ Endpoint │ │ Endpoint │ │ Endpoint │ │  Endpoint │  │    │   │
│  │  │   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │    │   │
│  │  │        │           │           │           │              │        │    │   │
│  │  │        └───────────┴───────────┴───────────┴──────────────┘        │    │   │
│  │  └──────────────────────────────────┬──────────────────────────────────────┘    │   │
│  │                                     │                                        │   │
│  │  ┌──────────────────────────────────┼──────────────────────────────────────┐    │   │
│  │  │                    SERVICES LAYER                                     │    │   │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │    │   │
│  │  │  │Risk Engine  │ │Time Risk   │ │  Routing   │ │ Alert Engine    │   │    │   │
│  │  │  │(5-Factor)   │ │Processor   │ │  Service   │ │   (SOS)         │   │    │   │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘   │    │   │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │    │   │
│  │  │  │Geo Utils    │ │ML Predictor │ │Notification│ │ Auth Service    │   │    │   │
│  │  │  │(PostGIS)   │ │ (XGBoost)   │ │ (Twilio)   │ │   (JWT)         │   │    │   │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘   │    │   │
│  │  └──────────────────────────────────┬──────────────────────────────────────┘    │   │
│  │                                     │                                        │   │
└───────────────────────────────────────┼────────────────────────────────────────────┘   │
                                        │                                            │
                                        ▼                                            │
┌──────────────────────────────────────────────────────────────────────────────────┐  │
│                         DATA LAYER (PostgreSQL + PostGIS)                         │  │
│  ┌────────────────────────────────────────────────────────────────────────────┐   │  │
│  │  crime_incidents  │  sos_events  │  user_profiles  │  route_history        │   │  │
│  │  157,160 rows     │  Events      │  Auth data     │  Saved routes         │   │  │
│  │  GiST indexed     │  + tracking  │  Preferences   │  Analytics            │   │  │
│  └────────────────────────────────────────────────────────────────────────────┘   │  │
└──────────────────────────────────────────────────────────────────────────────────┘  │
```

---

# 2. 5G Integration Architecture

## 2.1 College 5G Lab Components

The architecture leverages the college's 5G laboratory infrastructure:

### 2.1.1 Component Mapping

| 5G Lab Component | SurakṣāMārga.ai Integration | Function |
|-----------------|-----------------------------|----------|
| **G-Node B (WISIG)** | Primary radio access | Provides 5G connectivity to mobile devices |
| **CU (Central Unit)** | Core network processing | Handles signaling for emergency priority sessions |
| **DU (Distributed Unit)** | Edge compute offload | Hosts AI inference for real-time risk calculation |
| **LPRU (Lumped Radio Unit)** | Radio transmission | Enables high-bandwidth location streaming |
| **Network Slicing** | Emergency slice | Dedicated slice for SOS traffic with priority |
| **Edge Computing** | Docker container | Deploys risk engine within lab network |

## 2.2 Edge Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    5G EDGE DEPLOYMENT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  COLLEGE 5G LAB                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                            │ │
│  │   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │ │
│  │   │   G-Node B   │────▶│   CU/DU Unit │────▶│   LPRU Unit  │              │ │
│  │   │ (WISIG Net)  │     │ (Centralized)│     │ (Radio Unit) │              │ │
│  │   └──────────────┘     └──────────────┘     └──────────────┘              │ │
│  │          │                    │                    │                       │ │
│  │          │                    │                    │                       │ │
│  │          ▼                    ▼                    ▼                       │ │
│  │   ┌────────────────────────────────────────────────────────────────────┐  │ │
│  │   │                  5G Radio Coverage Zone                             │  │ │
│  │   │   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐            │  │ │
│  │   │   │ Mobile  │   │Mobile   │   │  Edge   │   │  IoT    │            │  │ │
│  │   │   │ Device  │   │ Device  │   │ Server  │   │Sensor   │            │  │ │
│  │   │   │ (App)   │   │ (App)   │   │(Docker) │   │(Future) │            │  │ │
│  │   │   └─────────┘   └─────────┘   └─────────┘   └─────────┘            │  │ │
│  │   └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                             │
│                                    │ S1/N2 Interface                            │
│                                    ▼                                             │
│  SURAKṢĀMĀRGA.AI EDGE DEPLOYMENT                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │                    Edge AI Container                                       │ │
│  │                                                                            │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │  Risk Engine   │  │ Threat Detect │  │ Route Optimize│             │ │
│  │  │  (Python/Fast) │  │  (ONNX)        │  │ (Graph Search)│             │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘             │ │
│  │                                                                            │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │ │
│  │  │  SOS Pipeline  │  │ Location Track │  │  Data Plane   │             │ │
│  │  │  (<10ms)       │  │ (2s interval)  │  │  (User Data)  │             │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘             │ │
│  │                                                                            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. API Architecture

## 3.1 API Gateway Design

The API Gateway (FastAPI) handles all incoming requests:

### 3.1.1 Endpoint Overview

**Implemented today** (mirrors `app/main.py` + `app/routes/*`):

| Endpoint | Method | Description | Auth | Status |
|----------|--------|-------------|------|--------|
| `/api/health` | GET | Health check | None | Built |
| `/` | GET | API info / endpoint index | None | Built |
| `/api/get-routes` | POST | Fetch route alternatives (OSRM/Google) | Optional | Built |
| `/api/safe-route` | POST | Safety-scored route alternatives (5-factor) | Optional | Built |
| `/api/crime-zones` | GET | Crime heatmap cells | Optional | Built |
| `/api/send-sos` | POST | Trigger emergency alert | Anonymous OK | Built |
| `/api/sos/resolve` | POST | Resolve SOS event | — | Built |
| `/api/sos/active` | GET | List active SOS events | — | Built |
| `/api/simulation/status` | GET | Network simulation status | None | Built |
| `/api/simulation/set-mode` | POST | Switch network mode (3G/4G/5G) | None | Built |
| `/api/simulation/crowd-density` | GET | Simulated crowd density | None | Built |
| `/api/simulation/realtime-risk` | GET | Simulated real-time risk | None | Built |
| `/api/simulation/compare` | GET | 3G/4G/5G latency comparison | None | Built |

**Advanced-safety mocks** (`app/routes/advanced_safety.py`, prefix `/api/v1`) — deterministic, seeded, demo-ready scaffolding for the "future" 5G/societal use cases; to be replaced by real implementations per the roadmap:

| Endpoint | Method | Backs which use case |
|----------|--------|----------------------|
| `/api/v1/auth/verify-identity` | POST | Identity verification (mock; real JWT auth is V1.1) |
| `/api/v1/sos/offline-alert` | POST | Rural / no-coverage SOS (queues when offline) |
| `/api/v1/sos/retry-queue` · `/api/v1/sos/retry-queue/flush` | GET · POST | Offline alert retry queue |
| `/api/v1/sos/trigger` · `/api/v1/sos/complete` | POST | Enhanced SOS loop (START → tracking → arrival → safe confirmation) |
| `/api/v1/maps/emergency-stops` | GET | Nearest safe stops along a route |
| `/api/v1/rides/share-route` | POST | Hand-off route to ride apps (Ola/Uber) |
| `/api/v1/proximity/scan` | POST | Proximity / nearby-help scan |
| `/api/v1/threat/assess` | POST | Behavioural threat assessment (ThreatDetector mock → trained XGBoost/ONNX) |
| `/api/v1/simulation/compare-5g` | GET | 4G-vs-5G SOS latency comparison |

**Planned (not yet built):** `/api/auth/register`, `/api/auth/login` (real JWT) — V1.1; `/api/route-history`, `/api/contacts` — V1.1.

### 3.1.2 Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           API REQUEST FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Client Request                                                                  │
│       │                                                                           │
│       ▼                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                       │
│  │  Rate Limit │────▶│  Auth Check │────▶│  Validate   │                       │
│  │  (100/min)  │     │  (JWT)      │     │  Request    │                       │
│  └─────────────┘     └─────────────┘     └─────────────┘                       │
│       │                    │                   │                                │
│       ▼                    ▼                   ▼                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                     Service Handler                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│  │  │Risk Engine  │  │Route Service│  │ SOS Service │  │Analytics    │     │   │
│  │  │             │  │             │  │             │  │             │     │   │
│  │  │5-Factor     │  │OSRM/Google  │  │Alert Engine │  │Aggregation  │     │   │
│  │  │Scoring      │  │Fetching     │  │Pipeline     │  │             │     │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│       │                                                                           │
│       ▼                                                                           │
│  ┌─────────────┐     ┌─────────────┐                                           │
│  │  Transform  │────▶│  Response   │                                           │
│  │  Response   │     │  (JSON)     │                                           │
│  └─────────────┘     └─────────────┘                                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Service Layer Architecture

### 3.2.1 Service Components

| Service | Responsibility | Key Functions |
|---------|---------------|---------------|
| **RiskEngine** | Calculate route safety scores | 5-factor scoring, time multipliers, segment analysis |
| **TimeRisk** | Handle time-of-day risk logic | Period detection, multiplier application |
| **Routing** | Fetch and process route data | OSRM/Google integration, polyline decoding |
| **GeoUtils** | Spatial queries and calculations | PostGIS queries, haversine distance, point sampling |
| **AlertEngine** | Manage SOS emergency lifecycle | Trigger, notify, track, resolve |
| **MLPredictor** | ML-based threat detection | XGBoost inference, ONNX runtime |
| **Notification** | Send alerts and notifications | Twilio SMS, push notifications |
| **AuthService** | Handle user authentication | JWT tokens, user management |

---

# 4. Database Architecture

## 4.1 Database Schema

### 4.1.1 Core Tables

```sql
-- Crime Incidents Table
CREATE TABLE crime_incidents (
    id VARCHAR(20) PRIMARY KEY,           -- "SR000001"
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    area_name VARCHAR(200) NOT NULL,
    location GEOMETRY(POINT, 4326)        -- PostGIS spatial column
);

-- Indexes
CREATE INDEX idx_crime_location ON crime_incidents USING GIST(location);
CREATE INDEX idx_crime_type ON crime_incidents (crime_type);
CREATE INDEX idx_crime_timestamp ON crime_incidents (timestamp);

-- SOS Events Table
CREATE TABLE sos_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL DEFAULT 'anonymous',
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    location GEOMETRY(POINT, 4326),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    resolved_at TIMESTAMP,
    contacts_notified TEXT,
    notes TEXT
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Contacts Table
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(50)
);

-- Route History Table
CREATE TABLE route_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    source_lat FLOAT NOT NULL,
    source_lng FLOAT NOT NULL,
    dest_lat FLOAT NOT NULL,
    dest_lng FLOAT NOT NULL,
    risk_score FLOAT,
    safety_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 4.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  DATA SOURCES                                                                    │
│  │                                                                               │
│  ├── Crime Data CSV (157K records)                                              │
│  │   └── ETL Pipeline → PostgreSQL                                             │
│  │       └── PostGIS Geometry Column                                           │
│  │                                                                            │
│  ├── User Data (App)                                                             │
│  │   └── Registration → User Table                                              │
│  │       └── Emergency Contacts → Contact Table                                │
│  │       └── Route History → History Table                                     │
│  │                                                                            │
│  └── Real-time Data (Location)                                                  │
│      └── GPS Coordinates → SOS Events                                           │
│                                                                                  │
│  DATA PROCESSING                                                                 │
│  │                                                                               │
│  ├── Route Calculation                                                           │
│  │   └── Input: Source, Destination                                            │
│  │       └── Process: OSRM/Google → Polyline                                   │
│  │       └── Output: Route alternatives                                        │
│  │                                                                            │
│  ├── Risk Scoring                                                                │
│  │   └── Input: Route polyline                                                  │
│  │       └── Process: Sample points → Query crimes → Calculate 5-factor       │
│  │       └── Output: Risk scores per segment                                   │
│  │                                                                            │
│  └── Crime Aggregation                                                           │
│      └── Input: All crime records                                               │
│          └── Process: Group by grid cell, calculate intensity                  │
│          └── Output: Crime zones (800 cells)                                   │
│                                                                                  │
│  DATA CONSUMPTION                                                               │
│  │                                                                               │
│  ├── Mobile App                                                                  │
│  │   └── Routes, Crime Heatmap, SOS Management                                 │
│  │                                                                            │
│  ├── Analytics Dashboard                                                         │
│  │   └── Usage patterns, Safety metrics, User activity                         │
│  │                                                                            │
│  └── API Consumers                                                               │
│      └── Partner systems, Research                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 5. Security Architecture

## 5.1 Security Layers

| Layer | Implementation | Details |
|-------|---------------|---------|
| **Transport** | TLS 1.3 | All API communication encrypted |
| **API** | JWT Authentication | Token-based user identification |
| **Database** | Row-level security | User-specific data isolation |
| **PII** | AES-256 encryption | Location history encrypted at rest |
| **Edge** | Container isolation | Docker network segmentation |
| **Application** | Input validation | Sanitization, parameterized queries |

## 5.2 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  User Registration                                                               │
│       │                                                                           │
│       ▼                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                       │
│  │  Validate   │────▶│  Hash       │────▶│  Store      │                       │
│  │  Input      │     │  Password   │     │  User       │                       │
│  │  (email,    │     │  (bcrypt)   │     │  (DB)       │                       │
│  │   password) │     │             │     │             │                       │
│  └─────────────┘     └─────────────┘     └─────────────┘                       │
│                                                                                  │
│  User Login                                                                     │
│       │                                                                           │
│       ▼                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                       │
│  │  Validate   │────▶│  Compare     │────▶│  Generate   │                       │
│  │  Input      │     │  Password   │     │  JWT Token  │                       │
│  │             │     │  (bcrypt)   │     │             │                       │
│  └─────────────┘     └─────────────┘     └─────────────┘                       │
│                                            │                                      │
│                                            ▼                                      │
│  Token Structure:                                                                    │
│  {                                                                         │
│    "sub": "user_id",                                                           │
│    "exp": "expiry_timestamp",                                                  │
│    "role": "user|admin"                                                       │
│  }                                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Cloud + Edge Hybrid Architecture

## 6.1 Component Distribution

| Component | Location | Rationale |
|-----------|----------|-----------|
| User authentication | Cloud | Centralized user management |
| Route calculation | Edge | <50ms latency requirement |
| Risk scoring | Edge | Real-time computation |
| Crime database | Cloud | Centralized PostGIS, 157K records |
| SOS trigger | Edge | Critical low latency |
| Location streaming | Edge | 2-second intervals, bandwidth optimization |
| Notification service | Cloud | Twilio integration |
| Analytics pipeline | Cloud | Historical data aggregation |
| ML model updates | Cloud | Model training and version management |

## 6.2 Edge Computing Strategy

### 6.2.1 Why Edge?

1. **Latency Reduction:** Sub-50ms response times critical for safety
2. **Bandwidth Optimization:** Reduces cloud bandwidth costs
3. **Privacy Preservation:** Location data stays on edge
4. **Reliability:** Works even during cloud outages
5. **Priority Processing:** Network slicing for emergency traffic

### 6.2.2 Edge Deployment Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         EDGE COMPUTING MODEL                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  DEPLOYMENT TIERS                                                                │
│  │                                                                               │
│  ├─ Tier 1: On-Premise Edge (College 5G Lab)                                    │
│  │   ├── Docker container deployment                                            │
│  │   ├── Risk scoring engine                                                     │
│  │   ├── SOS pipeline                                                            │
│  │   └── Latency: <10ms                                                          │
│  │                                                                            │
│  ├─ Tier 2: Regional Edge (Telecom edge node)                                   │
│  │   ├── Kubernetes deployment                                                   │
│  │   ├── Full service stack                                                      │
│  │   └── Latency: <20ms                                                          │
│  │                                                                            │
│  └─ Tier 3: Cloud (AWS/GCP)                                                     │
│      ├── Full service deployment                                                 │
│      ├── Database                                                                │
│      ├── ML training                                                             │
│      └── Latency: 50-200ms                                                       │
│                                                                                  │
│  FAILOVER STRATEGY                                                              │
│  │                                                                               │
│  User Request → Edge Available?                                                 │
│       │                                                                          │
│       ├── Yes → Process on Edge (<50ms)                                          │
│       │                                                                          │
│       └── No → Fallback to Cloud (50-200ms)                                     │
│                    └── Log for monitoring                                       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 7. Scalability Architecture

## 7.1 Horizontal Scaling Strategy

| Component | Scaling Approach | Trigger |
|-----------|-----------------|---------|
| API Gateway | Add instances | CPU > 70% |
| Risk Engine | Add edge nodes | Request queue > 100 |
| Database | Read replicas | Read QPS > 1000 |
| Cache | Redis cluster | Hit rate < 80% |

## 7.2 Performance Targets

| Metric | Target | Scale |
|--------|--------|-------|
| API P99 Latency | <200ms | 10K users |
| Database QPS | <1000 | Single instance |
| Concurrent Connections | <500 | Per instance |
| SOS Processing | <20s E2E | 100 concurrent |

---

# 8. Integration Points

## 8.1 External Integrations

| Service | Integration | Data Flow |
|---------|-------------|-----------|
| OSRM | Route fetching | HTTPS REST |
| Google Maps | Route, Geocoding | HTTPS REST |
| Twilio | SMS notifications | HTTPS REST |
| Police API | Emergency alert (mock) | HTTPS REST |

## 8.2 Future Integration Roadmap

| Integration | Timeline | Priority |
|-------------|----------|----------|
| Ola/Uber | V2 | High |
| Metro API | V2 | Medium |
| Police System | V3 | High |
| Smart City | V3 | Medium |
| Wearables | V3 | Medium |

---

# 9. Disaster Recovery

## 9.1 Backup Strategy

| Data Type | Backup Frequency | Retention | Storage |
|-----------|-----------------|-----------|---------|
| Database | Daily | 30 days | S3 |
| User Data | Real-time | 90 days | S3 |
| Logs | Hourly | 7 days | CloudWatch |
| ML Models | Weekly | 12 months | S3 |

## 9.2 Recovery Procedures

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|------------|
| Database failure | 1 hour | 24 hours | Restore from backup |
| Cloud region down | 15 minutes | 0 (edge) | Failover to backup region |
| Edge node down | 5 minutes | 0 | Fallback to cloud |
| Data corruption | 1 hour | 1 hour | Restore from point-in-time |

---

# 10. Appendix

## 10.1 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| FastAPI over Flask | Async support, better performance, auto-docs |
| PostgreSQL + PostGIS | Best spatial query performance |
| React Native over Flutter | Larger ecosystem, better 5G support |
| Edge-first architecture | Critical for safety features |
| JWT over Session | Stateless, better scaling |

## 10.2 Technology Stack Summary

| Category | Technology |
|----------|------------|
| API Framework | FastAPI |
| Database (prod / dev) | PostgreSQL 15 + PostGIS 3.4 / SQLite (`saferoute.db`) |
| ORM | SQLAlchemy + GeoAlchemy2 |
| Frontend | React Native (Expo) + parallel `.web.js` track (webpack) |
| Maps | react-native-maps + Google Maps (web: custom canvas) |
| Routing | OSRM (primary) + Google Directions (fallback) |
| Notifications | Twilio SMS (mock → live) |
| ML Runtime | ONNX Runtime (XGBoost ThreatDetector — mock today) |
| Container | Docker (edge deployment) |
| Cloud | AWS (planned) |

## 10.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial architecture from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: corrected endpoint table to the implemented routes, added `/api/v1/*` advanced-safety mock catalog, clarified SQLite-dev / PostGIS-prod, expanded stack summary |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Weekly during sprint
- Owner: Technical Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Architecture Document provides the technical foundation for the SurakṣāMārga.ai system. All implementation decisions should align with this architecture.*