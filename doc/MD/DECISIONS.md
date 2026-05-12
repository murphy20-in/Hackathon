# SurakṣāMārga.ai — Decisions Log

## Key Architectural and Product Decisions with Rationale

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Decision Management Reference  
**Status:** Active Decision Tracking

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1). v1.1 records decisions already embodied in `/codebase` (deterministic demo mocks, SQLite-dev/PostGIS-prod, dual frontend track, mock identity verification) — see §3.5 and §4.4.

---

# 1. Decision Framework

## 1.1 Decision Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Technology** | Tech stack, framework choices | Backend framework, database |
| **Architecture** | System design, component placement | Edge vs cloud, API design |
| **Product** | Feature priorities, user experience | MVP features, UI approach |
| **Process** | Workflow, methodology | Development process, testing |
| **Partnership** | External integrations, vendors | API providers, services |

## 1.2 Decision Process

```
Decision Needed
       │
       ▼
Research Options (2-3 alternatives)
       │
       ▼
Evaluate Pros/Cons (technical, business, timeline)
       │
       ▼
Consult Stakeholders (if needed)
       │
       ▼
Make Decision (document rationale)
       │
       ▼
Implement & Monitor
       │
       ▼
Review & Update (if needed)
```

---

# 2. Technology Decisions

## 2.1 Backend Framework: FastAPI over Flask

| Property | Details |
|----------|---------|
| **Decision ID** | T-001 |
| **Decision** | Use FastAPI as the backend API framework |
| **Alternatives Considered** | Flask, Django, Express.js |
| **Selection** | FastAPI |
| **Rationale** | 1) Native async support for high performance 2) Auto-generated API documentation 3) Built-in validation with Pydantic 4) Growing ecosystem and community 5) Better performance than Flask for I/O-heavy operations |
| **Trade-offs** | - Less mature than Django for complex apps - Smaller community than Flask |
| **Timeline Impact** | Positive - faster development |
| **Status** | Approved |

---

## 2.2 Database: PostgreSQL + PostGIS

| Property | Details |
|----------|---------|
| **Decision ID** | T-002 |
| **Decision** | Use PostgreSQL with PostGIS extension for spatial data |
| **Alternatives Considered** | MongoDB with GeoJSON, MySQL spatial, SQLite |
| **Selection** | PostgreSQL + PostGIS |
| **Rationale** | 1) Best-in-class spatial query performance 2) GiST indexing for efficient spatial searches 3) Mature, stable, well-documented 4) Support for 157K+ crime records with complex queries 5) Good ORM support (SQLAlchemy/GeoAlchemy) |
| **Trade-offs** | - More complex setup than MongoDB - Slightly higher resource usage |
| **Timeline Impact** | Neutral - standard setup |
| **Status** | Approved |

---

## 2.3 Frontend Framework: React Native (Expo)

| Property | Details |
|----------|---------|
| **Decision ID** | T-003 |
| **Decision** | Use React Native with Expo for mobile development |
| **Alternatives Considered** | Flutter, Swift (iOS), Kotlin (Android) |
| **Selection** | React Native (Expo) |
| **Rationale** | 1) Cross-platform (iOS + Android) from single codebase 2) Large ecosystem and community 3) JavaScript/TypeScript - familiar to most developers 4) Expo provides easy setup and build 5) Good 5G support and performance |
| **Trade-offs** | - Less performant than native - Larger app size |
| **Timeline Impact** | Positive - faster development |
| **Status** | Approved |

---

## 2.4 Routing Provider: OSRM over Google

| Property | Details |
|----------|---------|
| **Decision ID** | T-004 |
| **Decision** | Use OSRM as primary routing provider, with Google as fallback |
| **Alternatives Considered** | Google Directions API only, Mapbox |
| **Selection** | OSRM primary, Google fallback |
| **Rationale** | 1) OSRM is free and open-source 2) No API key required for basic use 3) Sufficient for demo purposes 4) Google as backup for production reliability 5) Easy to switch between providers |
| **Trade-offs** | - OSRM has rate limits - Less polished routes than Google |
| **Timeline Impact** | Positive - reduces dependency on API keys |
| **Status** | Approved |

---

## 2.5 ML Runtime: ONNX for Edge Deployment

| Property | Details |
|----------|---------|
| **Decision ID** | T-005 |
| **Decision** | Use ONNX Runtime for ML model deployment on edge |
| **Alternatives Considered** | TensorFlow Lite, PyTorch Mobile, native Python |
| **Selection** | ONNX Runtime |
| **Rationale** | 1) Framework-agnostic (works with XGBoost, PyTorch, etc.) 2) Excellent performance optimization 3) Cross-platform (cloud, edge, mobile) 4) Small model size with quantization support 5) Good integration with Python and edge deployment |
| **Trade-offs** | - Additional conversion step from training - Less mature than TF Lite |
| **Timeline Impact** | Neutral - standard process |
| **Status** | Approved |

---

# 3. Architecture Decisions

## 3.1 Edge-First Architecture

| Property | Details |
|----------|---------|
| **Decision ID** | A-001 |
| **Decision** | Deploy risk scoring and SOS pipeline on 5G edge for sub-50ms latency |
| **Alternatives Considered** | Cloud-only, cloud-hybrid |
| **Selection** | Edge-first with cloud fallback |
| **Rationale** | 1) Safety-critical applications require <50ms response 2) 5G edge enables local processing 3) Reduces cloud bandwidth costs 4) Improves privacy (location stays local) 5) Network slicing for priority emergency traffic |
| **Trade-offs** | - More complex deployment - Requires 5G infrastructure |
| **Timeline Impact** | Negative in short term - more setup, positive in demo |
| **Status** | Approved |

---

## 3.2 API Design: REST over GraphQL

| Property | Details |
|----------|---------|
| **Decision ID** | A-002 |
| **Decision** | Use REST API design with FastAPI |
| **Alternatives Considered** | GraphQL, gRPC |
| **Selection** | REST |
| **Rationale** | 1) FastAPI native support 2) Simpler for this use case 3) Better documentation generation 4) Easier to test and debug 5) Sufficient for current needs |
| **Trade-offs** | - Less flexible than GraphQL for complex queries |
| **Timeline Impact** | Positive - faster development |
| **Status** | Approved |

---

## 3.3 Authentication: JWT over Session

| Property | Details |
|----------|---------|
| **Decision ID** | A-003 |
| **Decision** | Use JWT tokens for authentication |
| **Alternatives Considered** | Session-based auth, OAuth 2.0 |
| **Selection** | JWT |
| **Rationale** | 1) Stateless - better for scaling 2) Works well with microservices 3) Standard industry practice 4) FastAPI has built-in JWT support 5) No server-side session storage needed |
| **Trade-offs** | - Token invalidation more complex - Larger token size |
| **Timeline Impact** | Neutral - standard approach |
| **Status** | Approved |

---

## 3.4 5-Factor Risk Model over Single Metric

| Property | Details |
|----------|---------|
| **Decision ID** | A-004 |
| **Decision** | Use a 5-factor weighted algorithm for risk scoring — Crime Density 30% + Severity Average 25% + Category Maximum 20% + Recency 15% + Infrastructure 10% (= 100%), with a **separate** time-of-day multiplier (0.6× / 0.8× / 1.2× / 1.5×) applied to the weighted sum |
| **Alternatives Considered** | Simple crime count, single ML model, treating the time multiplier as a 6th factor |
| **Selection** | 5-factor weighted algorithm + separate time multiplier (implemented in `risk_engine.py`) |
| **Rationale** | 1) Comprehensive multi-aspect assessment 2) Each factor captures a distinct safety signal 3) Adjustable weights allow fine-tuning 4) Transparent and explainable 5) Keeping time as a multiplier (not a factor) keeps the weights normalised and the time effect interpretable |
| **Trade-offs** | - More complex than simple approach - Requires tuning |
| **Timeline Impact** | Positive - better results |
| **Status** | Approved — see `Plan.md` §5.1 / §7.4 and `RESEARCH_PLAN.md` §3.1 |

---

## 3.5 Edge Database: SQLite for Dev, PostgreSQL+PostGIS for Production

| Property | Details |
|----------|---------|
| **Decision ID** | A-005 |
| **Decision** | Run SQLite (`saferoute.db`) for local development and demos; target PostgreSQL 15 + PostGIS 3.4 (GiST-indexed) for production |
| **Alternatives Considered** | PostGIS everywhere (heavier local setup), SQLite + SpatiaLite, MongoDB GeoJSON |
| **Selection** | SQLite (dev) / PostGIS (prod), with spatial logic isolated behind `geo_utils.py` |
| **Rationale** | 1) Zero-setup local dev and reproducible demos 2) PostGIS needed for performant `ST_DWithin` over 157K rows at scale 3) Isolation layer makes the swap low-risk 4) Migration scheduled Week 1 so it never blocks late work |
| **Trade-offs** | - Two DB code paths until migration - Risk of PostGIS-only functions sneaking into dev (see RISK T-011) |
| **Timeline Impact** | Neutral - migration is a Week-1 task |
| **Status** | Approved |

---

# 4. Product Decisions

## 4.1 MVP Feature Scope

| Property | Details |
|----------|---------|
| **Decision ID** | P-001 |
| **Decision** | Focus MVP on core features: safe routing, crime heatmap, SOS |
| **Alternatives Considered** | Feature-rich MVP, Minimum viable |
| **Selection** | Minimum Viable MVP |
| **Rationale** | 1) Limited time (hackathon) 2) Focus on core value proposition 3) Easier to test and demonstrate 4) Clear differentiation 5) Can add features in post-hackathon |
| **Trade-offs** | - Less features than competitors - May need to cut some planned features |
| **Timeline Impact** | Positive - realistic scope |
| **Status** | Approved |

---

## 4.2 Color-Coded Safety Indicators

| Property | Details |
|----------|---------|
| **Decision ID** | P-002 |
| **Decision** | Use green/yellow/red color coding for route safety |
| **Alternatives Considered** | Numeric scores only, badges |
| **Selection** | Color-coded with numeric backup |
| **Rationale** | 1) Universal understanding of colors 2) Quick visual recognition 3) Works across languages 4) Clear differentiation 5) Industry standard for safety |
| **Trade-offs** | - Color-blind users may need alternative |
| **Timeline Impact** | Positive - faster user comprehension |
| **Status** | Approved |

---

## 4.3 Long-Press for SOS

| Property | Details |
|----------|---------|
| **Decision ID** | P-003 |
| **Decision** | Require long-press (1 second) to trigger SOS, with confirmation dialog |
| **Alternatives Considered** | Single tap, biometric |
| **Selection** | Long-press + confirmation |
| **Rationale** | 1) Prevents accidental triggers 2) Still quick enough for emergencies 3) Confirmation adds safety check 4) Standard pattern in safety apps 5) Easy to understand |
| **Trade-offs** | - Slightly slower than tap |
| **Timeline Impact** | Neutral - standard UX |
| **Status** | Approved |

---

## 4.4 Ship Deterministic Demo Mocks for Advanced/Future Features (`/api/v1/*`)

| Property | Details |
|----------|---------|
| **Decision ID** | P-004 |
| **Decision** | Build the next-wave features (identity verification, offline SOS + retry queue, enhanced SOS loop, emergency stops, ride-share hand-off, proximity scan, behavioural threat assess, 4G/5G compare) as deterministic, seeded **mock** endpoints under `/api/v1/*` for the hackathon, rather than half-built real implementations |
| **Alternatives Considered** | (a) Don't show these features at all; (b) build them for real now; (c) slideware only |
| **Selection** | Demo-ready mocks with a public replacement backlog |
| **Rationale** | 1) Lets the demo tell the full product story end-to-end 2) Deterministic ⇒ demo never flakes 3) Locks the API contract so real implementations slot in 4) Honest — every mock is labelled and roadmapped (`RESEARCH_PLAN.md` §9.2) 5) Fits the 3-month timeline |
| **Trade-offs** | - Must be communicated carefully or it looks like over-claiming (RISK T-010) - Tempting to leave as mocks |
| **Timeline Impact** | Positive short-term; the backlog (Weeks 5–6, V1.1, V2) carries the real work |
| **Status** | Approved |

---

## 4.5 Mock Identity Verification Now; Real JWT Auth in V1.1

| Property | Details |
|----------|---------|
| **Decision ID** | P-005 |
| **Decision** | Use a deterministic mock for `POST /api/v1/auth/verify-identity` (and `IdentityOnboarding.web.js`) in the hackathon build; defer real JWT auth, user table, and emergency-contact CRUD to V1.1 |
| **Alternatives Considered** | Full auth now, no auth/onboarding at all |
| **Selection** | Mock identity flow now, real auth V1.1 |
| **Rationale** | 1) Core safety value (routing + SOS) doesn't require accounts 2) Onboarding flow can be demoed without real auth infra 3) Real auth is well-scoped for V1.1 (JWT decision A-003 already made) 4) Avoids storing real PII before the privacy/compliance work is done |
| **Trade-offs** | - Can't demo cross-device sync or saved routes - Mock must be clearly labelled |
| **Timeline Impact** | Positive - removes auth from the critical path |
| **Status** | Approved |

---

## 4.6 Maintain a Parallel `.web.js` Frontend Track

| Property | Details |
|----------|---------|
| **Decision ID** | P-006 |
| **Decision** | Keep React Native (`.js`) and web (`.web.js` + webpack) implementations of screens/components side by side; share API/business logic via `src/services/*` and `src/utils/*` |
| **Alternatives Considered** | RN-only (Expo web), web-only, separate repos |
| **Selection** | Dual track with shared logic core |
| **Rationale** | 1) Web build is the easiest thing to demo on a projector / share a link 2) RN build is the real product 3) Shared services keep logic in one place 4) Already built and working |
| **Trade-offs** | - Two presentation layers can drift (RISK T-013) - Extra maintenance |
| **Timeline Impact** | Neutral now; Weeks 7–9 wire the native screens to the hardened API |
| **Status** | Approved |

---

# 5. Process Decisions

## 5.1 Development Process: Agile Sprints

| Property | Details |
|----------|---------|
| **Decision ID** | PR-001 |
| **Decision** | Use 1-week sprint cycles with daily standups |
| **Alternatives Considered** | Kanban, Waterfall |
| **Selection** | Agile Sprints |
| **Rationale** | 1) Adaptable to changing requirements 2) Regular feedback loops 3) Clear progress tracking 4) Good for small team 5) Standard hackathon approach |
| **Trade-offs** | - Requires discipline |
| **Timeline Impact** | Positive - keeps team focused |
| **Status** | Approved |

---

## 5.2 Code Review Requirement

| Property | Details |
|----------|---------|
| **Decision ID** | PR-002 |
| **Decision** | Require code review for all commits to main branch |
| **Alternatives Considered** | No review, review only critical code |
| **Selection** | Mandatory review |
| **Rationale** | 1) Catches bugs early 2) Shares knowledge 3) Maintains code quality 4) Good practice for production code |
| **Trade-offs** | - Adds time to workflow |
| **Timeline Impact** | Slightly negative - more process |
| **Status** | Approved |

---

# 6. Partnership Decisions

## 6.1 Twilio for SMS (Mock for Demo)

| Property | Details |
|----------|---------|
| **Decision ID** | PT-001 |
| **Decision** | Use Twilio for SMS notifications (mock for demo) |
| **Alternatives Considered** | Other SMS providers, in-app only |
| **Selection** | Twilio (mock) |
| **Rationale** | 1) Industry standard 2) Easy integration 3) Good documentation 4) Free tier available 5) Can mock for demo |
| **Trade-offs** | - Real SMS needs verification |
| **Timeline Impact** | Positive - easy integration |
| **Status** | Approved |

---

## 6.2 5G Lab Partnership

| Property | Details |
|----------|---------|
| **Decision ID** | PT-002 |
| **Decision** | Use college 5G lab as primary testbed |
| **Alternatives Considered** | External 5G testing facility, simulation only |
| **Selection** | College 5G Lab |
| **Rationale** | 1) Free access 2) Real infrastructure 3) Good for hackathon demo 4) Partnership opportunity 5) Technical support available |
| **Trade-offs** | - May have availability constraints |
| **Timeline Impact** | Positive - real 5G demo |
| **Status** | Approved |

---

# 7. Deferred Decisions

## 7.1 Not Decided Yet

| Item | Status | Notes |
|------|--------|-------|
| Cloud provider | Deferred | Use local/dev for now, decide post-hackathon |
| Analytics platform | Deferred | Use basic analytics, decide post-hackathon |
| Mobile push notifications | Deferred | Implement in V2 |
| Offline maps | Deferred | Implement in V2 |

---

# 8. Decision Review Log

## 8.1 Review Schedule

- **Weekly:** During sprint retrospective
- **Monthly:** Phase gate review
- **As needed:** When new information changes context

## 8.2 Past Decisions Review

| Decision ID | Decision | Review Date | Still Valid? | Notes |
|-------------|----------|-------------|---------------|-------|
| T-001…PT-002, A-001…A-004, P-001…P-003, PR-001…PR-002 | Original decisions | 2026-05-12 | Yes | Carried over from v1.0 |
| A-004 | 5-factor risk model | 2026-05-12 | Yes (clarified) | Time multiplier is *separate*, not a 6th factor — see updated entry |
| A-005, P-004, P-005, P-006 | Baseline decisions formalised | 2026-05-12 | Yes | Newly documented in v1.1; already embodied in `/codebase` |

## 8.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial decision log from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: clarified A-004 (separate time multiplier); added A-005 (SQLite/PostGIS), P-004 (demo mocks for `/api/v1/*`), P-005 (mock identity / real auth V1.1), P-006 (dual `.web.js` track) |

---

# 9. Appendix

## 9.1 Decision Template

When documenting a new decision, include:

```
## [Decision Title]

| Property | Details |
|----------|---------|
| **Decision ID** | [ID] |
| **Decision** | [What was decided] |
| **Alternatives Considered** | [Options evaluated] |
| **Selection** | [What was chosen] |
| **Rationale** | [Why this choice] |
| **Trade-offs** | [What was sacrificed] |
| **Timeline Impact** | [How it affects timeline] |
| **Status** | [Approved/Deferred/Rejected] |
```

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Weekly during sprint
- Owner: Project Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Decisions Log provides a record of all key decisions and their rationale for future reference and learning.*