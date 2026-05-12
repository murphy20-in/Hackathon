# SurakṣāMārga.ai — Execution Tracker

## Sprint Progress, Deliverables, and Team Performance Tracking

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Execution Management Reference  
**Status:** Active Tracking

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1). **Read this first:** a working prototype already exists (Week 0 baseline — see §2.0 below and `Plan.md` §12A). The Week 1–12 plan below is *harden-and-productionize* work on top of that baseline, not a build from zero — so many week tasks read as "harden / replace mock / wire up" rather than "create".

---

# 1. Execution Overview

## 1.1 Project Timeline

**Total Duration:** 12 weeks (3 months) on top of an existing prototype  
**Start Date:** Week 1 of Hackathon (Week 0 = prototype already in `/codebase`)  
**End Date:** Hackathon Submission

## 1.2 Phase Breakdown

| Phase | Weeks | Focus | Deliverables |
|-------|-------|-------|---------------|
| **Phase 0 (done)** | — | Prototype baseline | FastAPI backend + RN/Expo frontend + 157K dataset (see §2.0) |
| **Phase 1** | 1-3 | Infrastructure & Core API hardening | SQLite→PostGIS migration, edge containerisation, latency benchmarks, CI/CD |
| **Phase 2** | 4-6 | AI Pipeline & ML | Train ThreatDetector/CrowdPredictor (replace mocks), productionise 5-factor engine, live Twilio SOS |
| **Phase 3** | 7-9 | Mobile App | Wire native (non-`.web`) screens to hardened API, auth/profile screens, accessibility |
| **Phase 4** | 10-11 | Integration & Testing | E2E testing, security, performance, real 5G-lab demo |
| **Phase 5** | 12 | Demo & Polish | Final demo, documentation, pitch |

---

# 2.0 Week 0 — Baseline (Already Complete)

This is what exists in `/codebase` before Week 1. Treat these as **done** when reporting progress.

| Area | Item | Status |
|------|------|--------|
| Backend | FastAPI app, CORS, `/api/health`, `/docs`, `/redoc` | ✅ Done |
| Backend | `POST /api/get-routes`, `POST /api/safe-route` (OSRM/Google + 5-factor scoring) | ✅ Done |
| Backend | `GET /api/crime-zones` (aggregated heatmap) | ✅ Done |
| Backend | `POST /api/send-sos`, `/api/sos/resolve`, `/api/sos/active` (Twilio mock) | ✅ Done |
| Backend | `/api/simulation/*` (status, set-mode, crowd-density, realtime-risk, compare) | ✅ Done |
| Backend | `/api/v1/*` advanced-safety mocks (identity, offline SOS, retry-queue, enhanced SOS loop, emergency-stops, ride-share, proximity, threat-assess, 4G/5G compare) | ✅ Done (mock) |
| Backend | `risk_engine.py` (5-factor + `CRIME_WEIGHTS`), `time_risk.py`, `geo_utils.py`, `routing.py`, `alert_engine.py`, `crowd_simulator.py`, `realtime_simulator.py` | ✅ Done |
| Backend | DB layer (SQLite dev), models (`crime`, `sos`), `init_db.py`, config/`.env.example` | ✅ Done |
| Backend | `tests/test_api.py` smoke tests | 🟡 Partial (expand in W4 & W10) |
| Frontend | `MapScreen`, `EmergencyScreen`, `RouteDetailsPanel` (+ `.web.js`), `IdentityOnboarding.web.js` | ✅ Done |
| Frontend | Map/heatmap, search, route cards, SOS button (long-press), network badge, metrics panel; web landing site | ✅ Done |
| Frontend | `services/api.js`, `services/locationService.js`, `ErrorBoundary` | ✅ Done |
| Data | `dataset/final.csv` (157,160 rows) + processed + pipeline scripts | ✅ Done |
| Docs | `Plan.md` + nine supporting docs, `implementation.md`, `SuraksaMarga_Overview.md`, research paper, presentations, UI screenshots | ✅ Done |

**Baseline gaps the 12-week plan closes:** PostGIS migration · trained ML models (replace mocks) · live Twilio · real JWT auth · native-screen↔API wiring · edge containerisation · real 5G-lab measurements · >80% test coverage · accessibility pass.

---

# 2. Weekly Milestones

## 2.1 Week 1: Infrastructure Setup

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | 5G lab access verification | DevOps | Pending |
| Tue | PostgreSQL + PostGIS installation | Backend | Pending |
| Wed | Basic API server setup | Backend | Pending |
| Thu | CI/CD pipeline configuration | DevOps | Pending |
| Fri | Health check endpoint | Backend | Pending |
| Sat | Code repository organization | Team | Pending |
| Sun | Week 1 retrospective | All | Pending |

**Deliverables:**
- [ ] 5G edge node accessible
- [ ] Database schema deployed with 157K crime records
- [ ] Health check endpoint operational
- [ ] GitHub Actions for automated deployment

## 2.2 Week 2: Core API Development

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | OSRM/Google API integration | Backend | Pending |
| Tue | Route fetching endpoint | Backend | Pending |
| Wed | Crime zone aggregation endpoint | Backend | Pending |
| Thu | Basic risk calculation endpoint | Backend | Pending |
| Fri | Swagger documentation | Backend | Pending |
| Sat | API testing | QA | Pending |
| Sun | Week 2 retrospective | All | Pending |

**Deliverables:**
- [ ] GET /api/routes endpoint
- [ ] GET /api/crime-zones endpoint
- [ ] POST /api/risk-score endpoint
- [ ] API documentation (Swagger)

## 2.3 Week 3: 5G Edge Integration

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | Docker container creation | DevOps | Pending |
| Tue | Edge node deployment | DevOps | Pending |
| Wed | Latency benchmarking setup | DevOps | Pending |
| Thu | Network slicing configuration | DevOps | Pending |
| Fri | 4G/5G comparison metrics | DevOps | Pending |
| Sat | Edge deployment documentation | DevOps | Pending |
| Sun | Week 3 retrospective | All | Pending |

**Deliverables:**
- [ ] Risk engine running on edge
- [ ] <50ms response time achieved
- [ ] 4G/5G comparison metrics documented
- [ ] Edge deployment documentation

## 2.4 Week 4: Risk Engine Development

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | 5-factor scoring algorithm implementation | Backend | Pending |
| Tue | Time-of-day multiplier logic | Backend | Pending |
| Wed | Segment-level analysis | Backend | Pending |
| Thu | Route ranking algorithm | Backend | Pending |
| Fri | Unit tests (90%+ coverage) | Backend | Pending |
| Sat | Risk scoring API integration | Backend | Pending |
| Sunday | Week 4 retrospective | All | Pending |

**Deliverables:**
- [ ] Risk scoring service
- [ ] Time-based risk logic
- [ ] Route ranking algorithm
- [ ] Unit tests (90%+ coverage)

## 2.5 Week 5: ML Integration

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | ONNX model deployment | ML Engineer | Pending |
| Tue | Threat detection endpoint | ML Engineer | Pending |
| Wed | Alert pipeline integration | ML Engineer | Pending |
| Thu | Model performance metrics | ML Engineer | Pending |
| Fri | ML model optimization | ML Engineer | Pending |
| Sat | Model documentation | ML Engineer | Pending |
| Sunday | Week 5 retrospective | All | Pending |

**Deliverables:**
- [ ] ONNX model deployment
- [ ] Threat classification endpoint
- [ ] Alert pipeline integration
- [ ] Model performance metrics

## 2.6 Week 6: SOS Pipeline

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | Emergency trigger endpoint | Backend | Pending |
| Tue | Contact notification system | Backend | Pending |
| Wed | Location tracking flow | Backend | Pending |
| Thu | Emergency screen mockup | Frontend | Pending |
| Fri | End-to-end SOS test | QA | Pending |
| Sat | SOS documentation | Backend | Pending |
| Sunday | Week 6 retrospective | All | Pending |

**Deliverables:**
- [ ] POST /api/sos endpoint
- [ ] SMS notification (Twilio mock)
- [ ] Location streaming endpoint
- [ ] Emergency screen mockup

## 2.7 Week 7: Mobile App Core

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | React Native project setup | Frontend | Pending |
| Tue | Google Maps integration | Frontend | Pending |
| Wed | Search input component | Frontend | Pending |
| Thu | Location permissions | Frontend | Pending |
| Friday | Basic UI layout | Frontend | Pending |
| Saturday | App build verification | Frontend | Pending |
| Sunday | Week 7 retrospective | All | Pending |

**Deliverables:**
- [ ] Expo project running
- [ ] Google Maps/MapView display
- [ ] Location permissions
- [ ] Basic search UI

## 2.8 Week 8: Route Display

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | Polyline decoder integration | Frontend | Pending |
| Tue | Route color coding | Frontend | Pending |
| Wed | Route selection UI | Frontend | Pending |
| Thu | Bottom sheet with route cards | Frontend | Pending |
| Friday | Route API integration | Frontend | Pending |
| Saturday | UI testing | QA | Pending |
| Sunday | Week 8 retrospective | All | Pending |

**Deliverables:**
- [ ] Polyline decoder
- [ ] Color-coded route display
- [ ] Route selection UI
- [ ] Bottom sheet with route cards

## 2.9 Week 9: Emergency Features

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | SOS button component | Frontend | Pending |
| Tue | Emergency screen implementation | Frontend | Pending |
| Wed | GPS tracking integration | Frontend | Pending |
| Thu | Contact list management | Frontend | Pending |
| Friday | Emergency flow E2E test | QA | Pending |
| Saturday | Emergency features documentation | Frontend | Pending |
| Sunday | Week 9 retrospective | All | Pending |

**Deliverables:**
- [ ] Long-press SOS button
- [ ] Emergency UI with timer
- [ ] GPS tracking
- [ ] Contact list management

## 2.10 Week 10: Integration Testing

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | End-to-end flow testing | QA | Pending |
| Tue | Security audit | DevOps | Pending |
| Wed | Performance optimization | Backend | Pending |
| Thu | Bug fixing | Team | Pending |
| Friday | Integration test report | QA | Pending |
| Saturday | Performance benchmarks | DevOps | Pending |
| Sunday | Week 10 retrospective | All | Pending |

**Deliverables:**
- [ ] E2E test suite
- [ ] Security vulnerability scan
- [ ] Performance benchmarks
- [ ] Bug fixes

## 2.11 Week 11: 5G Demo Preparation

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | 5G lab demo environment setup | DevOps | Pending |
| Tue | 3G/4G/5G comparison demo | DevOps | Pending |
| Wed | Demo script creation | Project Lead | Pending |
| Thu | Metrics dashboard | Frontend | Pending |
| Friday | Dry run demo | Team | Pending |
| Saturday | Demo refinement | Team | Pending |
| Sunday | Week 11 retrospective | All | Pending |

**Deliverables:**
- [ ] Live 5G demo setup
- [ ] 3G/4G/5G comparison
- [ ] Demo script (5 min)
- [ ] Metrics dashboard

## 2.12 Week 12: Final Polish

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon | README documentation | Project Lead | Pending |
| Tue | Pitch deck creation | Project Lead | Pending |
| Wed | Demo recording | Team | Pending |
| Thursday | Deployment verification | DevOps | Pending |
| Friday | Final presentation prep | Team | Pending |
| Saturday | Hackathon submission | Team | Pending |
| Sunday | Project wrap-up | All | Pending |

**Deliverables:**
- [ ] README updated
- [ ] Pitch deck (10 slides)
- [ ] Demo recording
- [ ] Deployment verified

---

# 3. Sprint Structure

## 3.1 Sprint Planning

Each week is organized into 2 sprints:

| Sprint | Days | Focus | Goals |
|--------|------|-------|-------|
| Sprint A | Monday - Wednesday | Core tasks | 70% of week's deliverables |
| Sprint B | Thursday - Friday | Polish & Review | 30% of week's deliverables + retrospective |

## 3.2 Daily Standup Format

```
Standup (15 minutes)
├── What did I do yesterday?
├── What will I do today?
├── Any blockers?
└── Help needed from?
```

---

# 4. Deliverables Tracking

## 4.1 Current Sprint Status

**Sprint:** Week 1  
**Progress:** 0% complete  
**Days Remaining:** 7

| Deliverable | Status | Owner | Notes |
|-------------|--------|-------|-------|
| 5G edge node accessible | Not Started | DevOps | - |
| Database deployed | Not Started | Backend | - |
| API server running | Not Started | Backend | - |
| CI/CD pipeline | Not Started | DevOps | - |

## 4.2 Overall Progress

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          EXECUTION PROGRESS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Phase 0 (Baseline)       ████████████████████████████████████████████ DONE     │
│  Phase 1 (Infra hardening)████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ~20%        │
│  Phase 2 (AI / ML)        ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ~30% (mocks  │
│                                                                       in place)  │
│  Phase 3 (Mobile App)     ████████████████████░░░░░░░░░░░░░░░░░░░░  ~50% (.web    │
│                                                                       track done) │
│  Phase 4 (Testing)        ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ~10%         │
│  Phase 5 (Demo)           ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ~20% (deck/   │
│                                                                       screenshots) │
│                                                                                  │
│  Note: % are relative to the *production-ready* target, not "from scratch".      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 5. Issue Tracker

## 5.1 Active Issues

| Issue | Priority | Owner | Status | Due Date |
|-------|----------|-------|--------|----------|
| 5G lab access credentials | High | DevOps | Not Started | Week 1 |
| OSRM API rate limits | Medium | Backend | Not Started | Week 2 |
| Google Maps API key | Medium | Frontend | Not Started | Week 2 |

## 5.2 Issue Resolution Workflow

```
Issue Identified
       │
       ▼
Triage (Priority, Owner)
       │
       ▼
Assign to Sprint
       │
       ▼
Development
       │
       ▼
Testing
       │
       ▼
Resolved & Closed
```

---

# 6. Dependencies

## 6.1 External Dependencies

| Dependency | Status | Impact | Owner |
|------------|--------|--------|-------|
| 5G Lab Access | Not Started | Critical | DevOps |
| OSRM API | Available | High | Backend |
| Google Maps API | Pending | High | Frontend |
| Twilio Account | Available | Medium | Backend |

## 6.2 Internal Dependencies

| Task | Depends On | Blocks |
|------|-----------|--------|
| Route API | OSRM integration | None |
| Risk Engine | Database setup | All scoring features |
| Mobile App | API ready | All UI features |
| SOS Pipeline | Location service | Emergency features |

---

# 7. Demo Checkpoints

## 7.1 Scheduled Demos

| Date | Checkpoint | What to Show | Target Audience |
|------|------------|--------------|-----------------|
| Week 4 | Proto Demo | Routes on map with scores | Internal team |
| Week 6 | Beta Demo | Full app with SOS | Mentors |
| Week 9 | Gamma Demo | End-to-end flow | Peers |
| Week 11 | Pre-demo | 5G comparison | Team |
| Week 12 | Final Demo | Full presentation | Judges |

## 7.2 Demo Preparation Checklist

- [ ] All devices charged
- [ ] 5G network connected
- [ ] Demo account logged in
- [ ] Backup routes pre-calculated
- [ ] Screenshots for fallback
- [ ] Live demo backup (recorded)

---

# 8. Team Workload Distribution

## 8.1 Weekly Capacity

| Role | Team Members | Hours/Week | Total Hours |
|------|-------------|------------|-------------|
| Project Lead | 1 | 20 | 20 |
| Backend Developer | 2 | 30 | 60 |
| Frontend Developer | 2 | 30 | 60 |
| DevOps/5G | 1 | 25 | 25 |
| ML Engineer | 1 | 20 | 20 |
| UX Designer | 1 | 15 | 15 |
| **Total** | **8** | **140** | **200** |

## 8.2 Sprint Velocity

- Target story points per sprint: 20
- Planned velocity: 18 (90% of target)
- Buffer for unexpected work: 2 points

---

# 9. Risk Mitigation Tracking

| Risk | Probability | Impact | Mitigation | Status |
|------|-------------|--------|-------------|--------|
| 5G lab unavailable | Medium | High | Simulate latency, cloud fallback | Not Started |
| ML model inaccurate | Low | High | Human validation loop | Not Started |
| Database performance | Low | Medium | Index optimization, caching | Not Started |
| Mobile rendering lag | Medium | Medium | Map clustering, lazy loading | Not Started |
| API rate limits | High | Medium | Caching, request batching | Not Started |

---

# 10. Retrospective Log

## 10.1 Week 1 Retrospective

**Date:** [To be filled]  
**Attendees:** [All team members]

**What went well:**
- [To be filled]

**What didn't go well:**
- [To be filled]

**Action items:**
- [To be filled]

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial 12-week tracker from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added §2.0 "Week 0 — Baseline (Already Complete)", reframed phases as harden→production, updated §4.2 overall-progress bars to be relative to the production target |

---

**Document Control:**

- Last Updated: May 12, 2026
- Update Frequency: Daily
- Owner: Project Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Execution Tracker provides the operational framework for tracking progress and managing the project execution.*