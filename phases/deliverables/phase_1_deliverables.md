# Phase 1: System Architecture

## 1. Phase Overview

**Objective:** Define the end-to-end system architecture for SafeRoute AI, establishing the foundational blueprint that all subsequent phases will build upon.

**Why This Phase Matters:**  
Without a well-defined architecture, every downstream phase risks misalignment, integration failures, and scope creep. This phase locks in the technology stack, communication protocols, data flow patterns, and deployment topology — ensuring the entire team operates from a single source of truth.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Architecture Diagram (C4 Model)** | Context, Container, Component, and Code-level diagrams covering frontend, backend, 5G simulation layer, and external services |
| 2 | **Technology Stack Document** | Finalized choices for frontend (React/Next.js), backend (Node.js/Express or FastAPI), database (PostgreSQL + Redis), mapping (Leaflet/Mapbox), and 5G simulation |
| 3 | **API Gateway Design** | Central routing layer with rate limiting, auth middleware, and request logging |
| 4 | **Database Schema (ERD)** | Entity-Relationship Diagram covering users, crime data, routes, SOS events, and risk scores |
| 5 | **Authentication & Authorization Flow** | JWT-based auth with role-based access control (user, admin, responder) |
| 6 | **Deployment Architecture** | Docker Compose setup for local dev; cloud deployment topology (AWS/GCP) |
| 7 | **Communication Protocol Spec** | REST for CRUD, WebSocket for real-time SOS/location, Server-Sent Events for heatmap updates |

---

## 3. Code Deliverables

### Folder Structure

```
saferoute-ai/
├── client/                    # Frontend (React/Next.js)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # API client modules
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── server/                    # Backend (Node.js/Express or FastAPI)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── prisma/               # Database schema & migrations
│   │   └── schema.prisma
│   ├── package.json
│   └── server.js
├── simulation/               # 5G simulation layer
│   ├── latency_simulator.js
│   └── bandwidth_mock.js
├── data/                     # Static datasets (crime CSVs, geojson)
├── docs/                     # Architecture diagrams, specs
├── docker-compose.yml
├── .env.example
└── README.md
```

### Key Files Created in This Phase

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Multi-service orchestration (client, server, db, redis) |
| `server/src/config/database.js` | Database connection pooling and configuration |
| `server/src/config/env.js` | Environment variable validation and defaults |
| `server/src/middleware/auth.js` | JWT verification middleware |
| `server/src/middleware/rateLimiter.js` | API rate limiting (express-rate-limit) |
| `server/src/middleware/errorHandler.js` | Centralized error handling |
| `server/prisma/schema.prisma` | Complete database schema |
| `client/src/services/api.js` | Axios instance with interceptors |
| `.env.example` | Template for all environment variables |

---

## 4. API Contracts

### Health Check

```
GET /api/v1/health

Response 200:
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-04-11T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "maps": "reachable"
  }
}
```

### Authentication

```
POST /api/v1/auth/register
Body: { "name": "string", "email": "string", "password": "string", "phone": "string" }
Response 201: { "token": "jwt_token", "user": { "id", "name", "email" } }

POST /api/v1/auth/login
Body: { "email": "string", "password": "string" }
Response 200: { "token": "jwt_token", "user": { "id", "name", "email" } }
```

### API Versioning Convention

All endpoints use `/api/v1/` prefix. Future breaking changes increment version.

---

## 5. Data Flow

```
┌──────────┐     HTTPS/WSS      ┌──────────────┐     Internal      ┌──────────┐
│  Client   │ ◄──────────────► │  API Gateway  │ ◄──────────────► │  Backend │
│  (React)  │                   │  (Nginx/Express)│                │  Services│
└──────────┘                   └──────────────┘                   └────┬─────┘
                                                                       │
                                      ┌────────────────────────────────┤
                                      ▼                                ▼
                               ┌──────────┐                    ┌──────────┐
                               │ PostgreSQL│                    │  Redis   │
                               │ (Primary) │                    │ (Cache)  │
                               └──────────┘                    └──────────┘
```

**Step-by-step:**

1. Client authenticates via `/auth/login` → receives JWT
2. All subsequent requests include `Authorization: Bearer <token>`
3. API Gateway validates token, applies rate limiting
4. Request routes to appropriate service handler
5. Service queries PostgreSQL for persistent data, Redis for cached/session data
6. Response flows back through gateway to client

---

## 6. Dependencies

### Previous Phases
- None (this is the foundational phase)

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18.x | Runtime |
| PostgreSQL | ≥15.x | Primary database |
| Redis | ≥7.x | Caching and pub/sub |
| Docker | ≥24.x | Containerization |
| Prisma | ≥5.x | ORM and migrations |
| Express.js | ≥4.18 | HTTP framework |
| React | ≥18.x | Frontend framework |
| Vite | ≥5.x | Frontend build tool |
| jsonwebtoken | ≥9.x | JWT auth |
| bcryptjs | ≥2.4 | Password hashing |

---

## 7. Setup Instructions

```bash
# 1. Clone and install
git clone <repo-url> && cd saferoute-ai
cp .env.example .env          # Edit with your values

# 2. Start all services via Docker
docker-compose up -d

# 3. Run database migrations
cd server && npx prisma migrate dev --name init

# 4. Seed initial data (optional)
npm run seed

# 5. Start backend (dev mode)
npm run dev                    # Runs on http://localhost:5000

# 6. Start frontend (separate terminal)
cd ../client && npm install && npm run dev   # Runs on http://localhost:5173

# 7. Verify
curl http://localhost:5000/api/v1/health
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | `GET /api/v1/health` returns 200 | All services show "connected" | ☐ |
| 2 | Register a new user | Returns JWT and user object | ☐ |
| 3 | Login with valid credentials | Returns JWT | ☐ |
| 4 | Login with invalid password | Returns 401 | ☐ |
| 5 | Access protected route without token | Returns 403 | ☐ |
| 6 | Rate limiter blocks after threshold | Returns 429 after N requests | ☐ |
| 7 | Docker Compose brings up all services | All containers healthy | ☐ |
| 8 | Prisma migrations run cleanly | All tables created | ☐ |
| 9 | Frontend loads at localhost:5173 | React app renders | ☐ |
| 10 | WebSocket connection establishes | Handshake succeeds | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Architecture diagram displayed on opening slide
- [ ] Health endpoint live and returning all-green status
- [ ] User registration and login functional
- [ ] Docker Compose one-command startup works
- [ ] Frontend shows a login/landing page
- [ ] WebSocket connection indicator visible in browser console

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Docker not available on demo machine | High | Provide fallback `npm run dev` scripts without Docker |
| Port conflicts (5000, 5173, 5432) | Medium | Make all ports configurable via `.env` |
| Database migration failures | Medium | Include `prisma/migrations` in version control; provide reset script |
| JWT secret leaked in `.env` | Low | Use `.env.example` without real secrets; document rotation |
| Team members on different OS | Medium | Docker ensures parity; document platform-specific gotchas |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Architecture diagram creation | 2h |
| Technology stack finalization | 1h |
| Project scaffolding (folder structure) | 2h |
| Docker Compose setup | 2h |
| Database schema design (Prisma) | 3h |
| Auth middleware (JWT + bcrypt) | 3h |
| API Gateway + rate limiting | 2h |
| Health check + error handling | 1h |
| Frontend project setup | 1h |
| Documentation | 2h |
| **Total** | **~19h** |

---

## 12. Deliverable Output Summary

- ✅ Complete project folder structure created
- ✅ Docker Compose multi-service configuration
- ✅ PostgreSQL schema with Prisma ORM (users, routes, crime_data, sos_events, risk_scores)
- ✅ JWT authentication with registration and login
- ✅ API Gateway with rate limiting and error handling
- ✅ Health check endpoint with service status
- ✅ WebSocket server scaffolding for real-time features
- ✅ Environment configuration template
- ✅ C4 architecture diagrams documented
- ✅ Frontend project initialized with React + Vite
