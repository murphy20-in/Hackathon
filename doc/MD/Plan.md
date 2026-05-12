# SurakṣāMārga.ai — Master Strategic Update Plan

## "5G-Enabled AI Navigation System for Women Safety"

**Hackathon:** DrishtiXR 5G Hackathon 2026  
**Document Version:** 2.1  
**Date:** May 12, 2026  
**Classification:** Hackathon + Investor-Grade Strategic Planning  
**Status:** Production-Ready Blueprint (aligned with current `/codebase` prototype)

---

# Executive Summary

This Master Strategic Update Plan represents a comprehensive restructuring of the SurakṣāMārga.ai project vision, technical direction, execution pipeline, and hackathon readiness framework. The document addresses three critical interview evaluation dimensions: (1) **5G flexibility** with real infrastructure utilization of the college 5G lab (G-Node B [WiSig], CU/DU unit, LPRU unit), (2) **societal awareness** and social impact, and (3) **production readiness** within a 3-month timeline.

The strategic updates transform SurakṣāMārga.ai from a functional hackathon prototype into a **national-scale smart safety platform** with verifiable 5G integration, ethical AI deployment, and commercial viability pathways. This document serves as the primary reference for all project stakeholders, mentor communications, interview presentations, and future development execution.

**Important — this plan is grounded in the existing codebase.** A working prototype already exists in `/codebase` (FastAPI backend + React Native/Expo frontend + a 157,160-row Bangalore crime dataset). Section 12A ("Current Implementation Baseline") catalogs exactly what is built today; the 12-week roadmap in Part VI is therefore a *harden-and-productionize* plan layered on that baseline, not a greenfield build. All nine supporting documents (`MASTER_PLAN.md`, `RESEARCH_PLAN.md`, `PRODUCT_PLAN.md`, `ARCHITECTURE.md`, `EXECUTION_TRACKER.md`, `RISKS.md`, `DECISIONS.md`, `METRICS.md`, `RETROSPECTIVE.md`) are derived from and kept consistent with this file — see the Document Map in the Appendix.

### Version 2.1 — What Changed Since 2.0

| # | Change | Rationale |
|---|--------|-----------|
| 1 | Corrected the 5-factor risk model description in §5.1 (was 95% / conflated the time multiplier) to match the implemented engine: Density 30% + Severity 25% + Category-max 20% + Recency 15% + Infrastructure 10% = 100%, with the time-of-day multiplier applied *separately* | Internal consistency with `risk_engine.py`, `RESEARCH_PLAN.md` |
| 2 | Added §12A "Current Implementation Baseline" (what exists in `/codebase` today) and reframed the 12-week roadmap as harden→production | Roadmap previously read as greenfield while a prototype exists |
| 3 | Standardised API endpoint names to the implemented routes (`/api/get-routes`, `/api/safe-route`, `/api/crime-zones`, `/api/send-sos`, `/api/sos/resolve`, `/api/simulation/*`, `/api/v1/*` advanced-safety mocks) | Plan previously used invented names (`/api/routes`, `/api/risk-score`, `/api/sos`) |
| 4 | Documented the `advanced_safety` (`/api/v1/*`) mock endpoints that already back several "future" 5G/societal use cases (identity verification, offline SOS, retry queue, proximity scan, behavioural threat assess, ride-share hand-off, emergency stops, 4G-vs-5G SOS compare) | These use cases were described as future-only but partially exist as demo-ready mocks |
| 5 | Added the canonical crime-category → women-safety weight table (§7.4) | Referenced in research/decisions but not in this master plan |
| 6 | Added the Document Map / cross-reference appendix and version-history block | Traceability across the nine supporting files |

---

# PART I: PROJECT IDENTITY AND VISION

## 1. Vision Statement

**SurakṣāMārga.ai envisions a world where no woman ever compromises her safety for convenience.** We are building the world's first AI-powered safety-first navigation platform that leverages real 5G infrastructure to deliver sub-50ms emergency response, predictive threat detection, and intelligent route optimization—transforming every journey from a potential vulnerability into a secured passage.

## 2. Mission Statement

To create a ubiquitous safety infrastructure that empowers women to navigate urban spaces with confidence through:

- **Real-time threat intelligence** powered by 5G edge computing
- **Predictive crime analytics** using 157,000+ historical incident records
- **Instant emergency escalation** with sub-10-second response pipelines
- **Ethical AI governance** ensuring privacy, transparency, and inclusivity
- **Scalable deployment** from college campuses to smart city ecosystems

## 3. Problem Statement

### 3.1 The Urban Safety Crisis

Urban navigation systems today operate on a fundamentally flawed premise: speed and distance are the only optimization targets. Google Maps, Apple Maps, Waze, and all major routing platforms minimize travel time without any consideration for personal safety. This design choice creates systematic vulnerabilities for women, particularly during night-time travel.

**Current State of Women's Urban Safety:**

- **67%** of women report changing their route due to safety concerns (NCRB Survey 2024)
- **43%** of violent crimes against women occur in public spaces between 6PM–10PM
- **89%** of existing safety apps are reactive (panic buttons, post-incident reporting) rather than proactive
- **Zero** major navigation platforms incorporate crime data into routing algorithms

### 3.2 Technology Gap Analysis

| Capability | Current Navigation Apps | SurakṣāMārga.ai |
|------------|------------------------|-----------------|
| Route Optimization | Fastest/Shortest | Safety-First |
| Crime Data Integration | None | 157,000+ Records |
| Time-of-Day Risk | None | Dynamic 0.6x–1.5x Multipliers |
| Emergency Response | Manual dial | One-tap SOS with live tracking |
| Network Latency | 50ms–200ms | Sub-10ms via 5G Edge |
| Predictive Alerts | None | ML-based threat prediction |

## 4. Why Existing Systems Fail

### 4.1 Google Maps and Commercial Navigation

- **Speed-only optimization** inherently routes users through fastest but potentially dangerous shortcuts
- **No crime data integration** despite publicly available government crime statistics
- **Generic time multipliers** use standard traffic patterns, not crime correlation
- **Emergency disconnect** requires manual 911 calls with no automatic location sharing

### 4.2 Existing Safety Apps

- **SheSafe, bSafe, safetipin** — All are reactive: panic buttons, incident logging, location sharing
- **No proactive routing** — None analyze crime data to recommend safer alternatives
- **No AI intelligence** — Simple GPS triggers without behavioral analysis
- **Cloud dependency** — High latency cloud processing unsuitable for emergency scenarios
- **No 5G integration** — Legacy architecture cannot leverage edge computing benefits

### 4.3 Government Initiatives

- **Aster (Bengaluru)**: Reactive emergency response, no routing intelligence
- **Wings (Karnataka)**: Location sharing only, no predictive analytics
- **Safe City Projects**: CCTV infrastructure without AI-powered citizen-facing applications
- **Gap**: No unified platform connecting real-time infrastructure with citizen-facing navigation

### 4.4 The SurakṣāMārga.ai Differentiation

1. **First-mover in safety-first routing** — No existing product optimizes routes based on crime data
2. **5G-native architecture** — Edge computing for sub-10ms response times
3. **Proactive not reactive** — Predictive threat detection before incidents occur
4. **AI-powered escalation** — Automatic contact notification, police alert, medical services
5. **Hackathon-to-production pipeline** — Designed for rapid deployment and scaling

---

# PART II: CORE INNOVATION FRAMEWORK

## 5. Core Innovation

### 5.1 Primary Innovation: Safety-First Navigation Engine

The core innovation is a multi-factor AI risk scoring engine that evaluates every route segment using **five weighted factors that sum to 100%**, with a **separate time-of-day multiplier** applied to the weighted sum (this matches the implemented `risk_engine.py`):

1. **Crime density** (30% weight): Spatial query on 157,160 incident records within a 200m radius — `min(crime_count / 50, 1.0)`
2. **Severity average** (25% weight): Mean women-safety relevance weight of nearby crimes (eve-teasing/sexual-harassment ≈ 0.95, theft = 0.50, see §7.4)
3. **Category maximum** (20% weight): Worst-case — the single highest women-safety weight among nearby crimes
4. **Recency** (15% weight): Share of nearby crimes that occurred in the last ~2 years vs. all nearby crimes
5. **Infrastructure proxy** (10% weight): `1 − area_density` — higher density used as a proxy for street lighting / CCTV / footfall

**Time-of-day multiplier (applied to the weighted sum, not a sixth factor):** Morning 06:00–11:59 = 0.6×, Afternoon 12:00–17:59 = 0.8×, Evening 18:00–21:59 = 1.2×, Night 22:00–05:59 = 1.5×.

`final = min(weighted_sum × time_multiplier, 1.0)` → `risk_score = final × 100` (0–100), `safety_score = 10 × (1 − final)` (0–10, 10 = safest).

### 5.2 Secondary Innovation: 5G Edge Emergency Pipeline

- **Sub-10ms SOS trigger** from edge node to contact notification
- **Live location streaming** at 2-second intervals via 5G
- **Network slicing** for prioritized emergency communication
- **Edge AI inference** for real-time threat assessment

### 5.3 Tertiary Innovation: Predictive Safety Index

- ML-based crime prediction model using temporal patterns
- Crowd density integration for real-time risk adjustment
- Weather and event integration for contextual safety scores

---

# PART III: TECHNICAL ARCHITECTURE

## 6. End-to-End System Architecture

### 6.1 Architectural Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (Mobile App)                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    React Native / Expo                              │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │    │
│  │  │MapScreen │ │Emergency │ │Analytics │ │Settings  │ │Onboarding│ │    │
│  │  │          │ │  Screen   │ │ Dashboard│ │          │ │   Flow   │ │    │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘ │    │
│  │       │            │            │            │              │        │    │
│  │       └────────────┴────────────┴────────────┴──────────────┘        │
│  │                                    │                                     │
│  │                    ┌─────────────┴─────────────┐                       │
│  │                    │   API Client Service      │                       │
│  │                    │   (axios + retry logic)     │                       │
│  │                    └─────────────┬───────────────┘                       │
│  └──────────────────────────────────┼──────────────────────────────────────┘
│                                     │ HTTPS/WSS
│                                     ▼
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │        5G NETWORK EDGE          │
                    │  ┌──────────────────────────┐   │
                    │  │   Edge Computing Node    │   │
                    │  │   ┌────────────────────┐  │   │
                    │  │   │  Edge AI Runtime   │  │   │
                    │  │   │  - Risk Inference  │  │   │
                    │  │   │  - Threat Detect  │  │   │
                    │  │   │  - Route Optimize  │  │   │
                    │  │   └────────────────────┘  │   │
                    │  └──────────────────────────┘   │
                    └─────────────────┬───────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CLOUD SERVICES LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                      API Gateway (FastAPI)                           │    │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │    │
│  │   │  Routes  │ │  Crime   │ │   SOS    │ │  Auth    │ │ Analytics │  │    │
│  │   │ Endpoint │ │ Endpoint │ │ Endpoint │ │ Endpoint │ │  Endpoint│  │    │
│  │   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │    │
│  │        │           │           │           │              │        │    │
│  │        └───────────┴───────────┴───────────┴──────────────┘        │    │
│  └──────────────────────────────────┬──────────────────────────────────────┘    │
│                                     │                                        │
│  ┌──────────────────────────────────┼──────────────────────────────────────┐    │
│  │                    SERVICES LAYER                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │    │
│  │  │Risk Engine  │ │Time Risk   │ │  Routing   │ │ Alert Engine    │   │    │
│  │  │(5-Factor)   │ │Processor   │ │  Service   │ │   (SOS)         │   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘   │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │    │
│  │  │Geo Utils    │ │ML Predictor │ │Notification│ │ Auth Service   │   │    │
│  │  │(PostGIS)   │ │ (XGBoost)   │ │ (Twilio)   │ │   (JWT)        │   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────┘   │    │
│  └──────────────────────────────────┬──────────────────────────────────────┘    │
│                                     │                                        │
└─────────────────────────────────────┼────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (PostgreSQL + PostGIS)                    │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  crime_incidents  │  sos_events  │  user_profiles  │  route_history  │    │
│  │  157,160 rows     │  Events      │  Auth data     │  Saved routes   │    │
│  │  GiST indexed     │  + tracking  │  Preferences   │  Analytics      │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 5G Infrastructure Integration Architecture

The college's 5G lab infrastructure provides a genuine testbed for SurakṣāMārga.ai. The integration architecture demonstrates how real 5G components are utilized:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLLEGE 5G LAB INFRASTRUCTURE                             │
│                                                                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐             │
│   │   G-Node B   │────▶│   CU/DU Unit │────▶│   LPRU Unit  │             │
│   │ (WISIG Net)  │     │ (Centralized)│     │ (Radio Unit) │             │
│   └──────────────┘     └──────────────┘     └──────────────┘             │
│          │                    │                    │                     │
│          │                    │                    │                     │
│          ▼                    ▼                    ▼                     │
│   ┌──────────────────────────────────────────────────────────────────┐    │
│   │                  5G Radio Coverage Zone                          │    │
│   │   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐         │    │
│   │   │ Mobile  │   │Mobile   │   │  Edge   │   │  IoT    │         │    │
│   │   │ Device  │   │ Device  │   │ Server  │   │Sensor   │         │    │
│   │   │ (App)   │   │ (App)   │   │(Docker) │   │(Future) │         │    │
│   │   └─────────┘   └─────────┘   └─────────┘   └─────────┘         │    │
│   └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ S1/N2 Interface
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SURAKṢĀMĀRGA.AI EDGE DEPLOYMENT                            │
│                                                                          │
│   ┌────────────────────────────────────────────────────────────────┐      │
│   │                   Edge AI Container                           │      │
│   │                                                                │      │
│   │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │      │
│   │  │  Risk Engine   │  │ Threat Detect │  │ Route Optimize│   │      │
│   │  │  (Python/Fast) │  │  (ONNX)        │  │ (Graph Search)│   │      │
│   │  └────────────────┘  └────────────────┘  └────────────────┘   │      │
│   │                                                                │      │
│   │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │      │
│   │  │  SOS Pipeline  │  │ Location Track │  │  Data Plane   │   │      │
│   │  │  (<10ms)       │  │ (2s interval)  │  │  (User Data)  │   │      │
│   │  └────────────────┘  └────────────────┘  └────────────────┘   │      │
│   └────────────────────────────────────────────────────────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 5G Component Mapping

| 5G Lab Component | SurakṣāMārga.ai Integration | Function |
|-----------------|-----------------------------|----------|
| **G-Node B (WISIG)** | Primary radio access | Provides 5G connectivity to mobile devices running the app |
| **CU (Central Unit)** | Core network processing | Handles signaling for emergency priority sessions |
| **DU (Distributed Unit)** | Edge compute offload | Hosts AI inference for real-time risk calculation |
| **LPRU (Lumped Radio Unit)** | Radio transmission | Enables high-bandwidth location streaming |
| **Network Slicing** | Emergency slice | Dedicated slice for SOS traffic with priority queuing |
| **Edge Computing** | Docker container | Deploys risk engine within lab network for <10ms latency |

### 6.4 Signal/Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW: SAFE ROUTE REQUEST                       │
└──────────────────────────────────────────────────────────────────────────────┘

User taps "Find Safe Routes"
       │
       ▼
[Mobile App] ──(5G Connection)──▶ [Edge Node]
       │                              │
       │                              ▼
       │                      ┌─────────────────┐
       │                      │  Route Request  │
       │                      │    Handler      │
       │                      └────────┬────────┘
       │                               │
       │                    ┌──────────┴──────────┐
       │                    ▼                     ▼
       │           ┌──────────────┐    ┌──────────────────┐
       │           │OSRM/Google   │    │  Crime Database  │
       │           │Route Fetch   │    │  (PostGIS Query) │
       │           └──────┬───────┘    └────────┬─────────┘
       │                  │                     │
       │                  │                     ▼
       │                  │            ┌──────────────────┐
       │                  │            │  5-Factor Risk   │
       │                  │            │    Scoring       │
       │                  │            └────────┬─────────┘
       │                  │                     │
       │                  ▼                     ▼
       │           ┌──────────────────────────────────────┐
       │           │     Route Ranking & Selection       │
       │           └──────────────┬───────────────────────┘
       │                          │
       │                          ▼
       │                  ┌─────────────────┐
       │                  │   Response to   │
       │                  │  Mobile App     │
       │                  └────────┬────────┘
       │                           │
       ▼                           │
[Mobile App] ◀──(5G <10ms)───────▶ [Edge Node]

Total Latency: <50ms (5G) vs 200-500ms (Cloud-only)
```

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW: SOS EMERGENCY TRIGGER                       │
└──────────────────────────────────────────────────────────────────────────────┘

User long-presses SOS button
       │
       ▼
[Mobile App] ──(5G Uplink)──▶ [Edge Node]
       │                              │
       │                              ▼
       │                      ┌─────────────────┐
       │                      │  SOS Classifier │
       │                      │  (High Priority)│
       │                      └────────┬────────┘
       │                               │
       │              ┌───────────────┼───────────────┐
       │              ▼               ▼               ▼
       │      ┌────────────┐  ┌────────────┐  ┌────────────┐
       │      │  Database  │  │Notification │  │  Location  │
       │      │  (Record) │  │  (Twilio)   │  │  Stream    │
       │      └─────┬──────┘  └──────┬─────┘  └──────┬─────┘
       │            │                │              │
       │            ▼                ▼              ▼
       │      ┌─────────────────────────────────────────────┐
       │      │         Emergency Response Pipeline          │
       │      │  1. Create SOS event in DB                  │
       │      │  2. Send SMS to emergency contacts           │
       │      │  3. Alert nearest police station (mock)      │
       │      │  4. Start live location tracking             │
       │      │  5. Calculate ETA for emergency services     │
       │      └────────────────────┬──────────────────────────┘
       │                           │
       ▼                           ▼
[Mobile App] ◀──(5G <10ms)──── [Emergency UI]
       │
       ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  Emergency Screen: Live GPS tracking, elapsed timer, contact notifications │
└────────────────────────────────────────────────────────────────────────────┘

Target Latency: <10 seconds from SOS trigger to contact notification
```

### 6.5 Cloud + Edge Hybrid Architecture

| Component | Location | Rationale |
|-----------|----------|-----------|
| User authentication | Cloud | JWT token management, user profiles |
| Route calculation | Edge | <50ms latency requirement |
| Risk scoring | Edge | Real-time computation |
| Crime database | Cloud | Centralized PostGIS, 157K records |
| SOS trigger | Edge | Critical low latency |
| Location streaming | Edge | 2-second intervals, bandwidth optimization |
| Notification service | Cloud | Twilio integration |
| Analytics pipeline | Cloud | Historical data aggregation |
| ML model updates | Cloud | Model training and version management |

---

## 7. AI Architecture

### 7.1 AI Decision Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AI DECISION PIPELINE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────┐
                    │     INPUT PROCESSING         │
                    │  ┌────────────────────────┐  │
                    │  │  User Location (GPS)   │  │
                    │  │  Destination           │  │
                    │  │  Time of Day           │  │
                    │  │  Historical Route Pref │  │
                    │  │  Device Network Type   │  │
                    │  └────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │      FEATURE EXTRACTION       │
                    │  ┌────────────────────────┐  │
                    │  │  Route segments (100m) │  │
                    │  │  Crime count per seg   │  │
                    │  │  Time multiplier       │  │
                    │  │  Crowd density         │  │
                    │  │  Weather conditions    │  │
                    │  │  Infrastructure score  │  │
                    │  └────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │    RISK SCORING ENGINE        │
                    │                              │
                    │  1. Crime Density (30%)      │
                    │     count_crimes_200m()      │
                    │                              │
                    │  2. Severity Average (25%)  │
                    │     avg(category_weight)     │
                    │                              │
                    │  3. Category Max (20%)       │
                    │     max(category_weight)     │
                    │                              │
                    │  4. Recency (15%)           │
                    │     recent_crimes / total    │
                    │                              │
                    │  5. Infrastructure (10%)   │
                    │     1 - area_density        │
                    │                              │
                    │  final = weighted_sum × time│
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │      THREAT CLASSIFICATION    │
                    │                              │
                    │  ┌────────────────────────┐  │
                    │  │  LOW (0-30)            │  │
                    │  │  MODERATE (31-60)      │  │
                    │  │  HIGH (61-80)          │  │
                    │  │  CRITICAL (81-100)     │  │
                    │  └────────────────────────┘  │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
┌──────────────────────────┐          ┌──────────────────────────┐
│   SAFE ROUTE OUTPUT      │          │   ALERT OUTPUT           │
│  ┌────────────────────┐  │          │  ┌────────────────────┐  │
│  │ Route polyline     │  │          │  │ Threat detected     │  │
│  │ Segment scores    │  │          │  │ Risk level          │  │
│  │ Safety score 0-10  │  │          │  │ Recommended action  │  │
│  │ Color-coded map   │  │          │  │ Emergency trigger   │  │
│  └────────────────────┘  │          │  └────────────────────┘  │
└──────────────────────────┘          └──────────────────────────┘
```

### 7.2 Real-Time Threat Detection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME THREAT DETECTION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Walking on Route
        │
        ▼
[Mobile GPS Sensor] ──(5G)──▶ [Edge Node]
        │                           │
        │                           ▼
        │                  ┌─────────────────┐
        │                  │ Threat Analyzer │
        │                  │                 │
        │                  │ Inputs:         │
        │                  │ - Current loc  │
        │                  │ - Time of day   │
        │                  │ - Route context │
        │                  │ - Crime history │
        │                  │ - Crowd density │
        │                  └────────┬────────┘
        │                           │
        │                           ▼
        │                  ┌─────────────────┐
        │                  │  ML Classifier  │
        │                  │  (ONNX Runtime) │
        │                  │                 │
        │                  │ Thresholds:     │
        │                  │ - Safe: <30     │
        │                  │ - Warning: 30-60│
        │                  │ - Danger: >60   │
        │                  └────────┬────────┘
        │                           │
        │                           ▼
        │                  ┌─────────────────┐
        │                  │  Alert Manager  │
        │                  │                 │
        │    ┌─────────────┼─────────────┐   │
        │    ▼             ▼             ▼   │
        │ Safe         Warning       Danger  │
        │ (continue)   (suggest)    (SOS)    │
        │                           │
        │                           ▼
        │                  ┌─────────────────┐
        │                  │  User Alert      │
        │                  │  (Push/Visual)  │
        │                  └────────┬────────┘
        │                           │
        ▼                           ▼
[Mobile App] ◀──────────────(5G)────────── [Edge Node]

Detection Frequency: Every 5 seconds
Maximum Detection Latency: <20ms (edge)
```

### 7.3 AI Models Specification

| Model | Type | Purpose | Input | Output | Location |
|-------|------|---------|-------|--------|----------|
| **RiskScorer** | Weighted Algorithm | Route segment scoring | Crime data + location | Risk 0-100 | Edge |
| **ThreatDetector** | XGBoost Classifier | Real-time threat assessment | GPS + time + context | Threat level | Edge |
| **CrowdPredictor** | LSTM | Crowd density prediction | Historical patterns | Density 0-10 | Cloud |
| **CrimePredictor** | Prophet + XGBoost | Temporal crime prediction | Time + location | Probability | Cloud |

> **Implementation note:** `RiskScorer` (the 5-factor weighted algorithm) and the simulation/realtime-risk services are fully implemented today. `ThreatDetector` is exposed as a deterministic mock at `POST /api/v1/threat/assess` (behavioural-threat scoring) pending the trained XGBoost/ONNX model; `CrowdPredictor` is backed by `crowd_simulator.py`. The roadmap (Part VI) replaces these mocks with trained models.

### 7.4 Crime Category → Women-Safety Weights (Canonical)

These weights drive Factors 2 and 3 above. They are defined once in `risk_engine.py` (`CRIME_WEIGHTS`) and mirrored in `RESEARCH_PLAN.md` §3.1.2.

| Weight band | Crime types |
|-------------|-------------|
| **0.90 – 1.00** | eve_teasing (0.95), sexual_harassment (0.95), murder (0.95), molestation/rape (1.00 — explicit category), kidnapping (0.90), child_abuse (0.90), stalking (0.90), culpable_homicide (0.90) |
| **0.80 – 0.89** | domestic_violence (0.85), dowry_crime (0.85), assault (0.80) |
| **0.60 – 0.79** | robbery (0.75), chain_snatching (0.75), dacoity (0.75), rioting (0.70), criminal_intimidation (0.70), extortion (0.65), arms_violation (0.60), arson (0.60), abetment (0.60) |
| **0.40 – 0.59** | theft (0.50), burglary (0.50), affray (0.50), trespass (0.45), accident (0.40) |
| **0.20 – 0.39** | negligence (0.35), cyber_crime (0.30), cheating (0.30), forgery (0.30), breach_of_trust (0.30), narcotics (0.30), other (0.30), counterfeiting / gambling / excise_violation / prohibition (≈0.20) |

The dataset (`/codebase/dataset/final.csv`) contains 157,160 records across 37 crime types and 53 named Bangalore areas (Lat 12.83–13.11, Lon 77.46–77.78), spanning 2014–2025.

---

## 8. Security & Privacy Strategy

### 8.1 Security Architecture

| Layer | Implementation | Details |
|-------|---------------|---------|
| **Transport** | TLS 1.3 | All API communication encrypted |
| **API** | JWT Authentication | Token-based user identification |
| **Database** | Row-level security | User-specific data isolation |
| **PII** | AES-256 encryption | Location history encrypted at rest |
| **Edge** | Container isolation | Docker network segmentation |

### 8.2 Privacy Architecture

| Data Type | Collection | Storage | Retention | Access |
|-----------|-----------|--------|-----------|--------|
| Location | GPS (opt-in) | Encrypted | 30 days | User only |
| Route history | Automatic | Encrypted | User choice | User only |
| Emergency contacts | Manual | Encrypted | Indefinite | User + SOS |
| Crime data | Public API | Plain | Permanent | Read-only |
| Analytics | Aggregated | Anonymized | 1 year | Admin |

### 8.3 Data Governance

- **GDPR/PDP Act compliance**: User consent for data collection
- **Right to deletion**: Complete data purge on request
- **Anonymization**: Analytics use aggregated, non-identifiable data
- **Audit logging**: All data access tracked and reviewable

---

# PART IV: 5G FLEXIBILITY AND REAL INFRASTRUCTURE UTILIZATION

## 9. Why 5G Is Necessary

### 9.1 Technical Justification

| Capability | 4G Performance | 5G Performance | Safety Impact |
|------------|---------------|----------------|---------------|
| **Latency** | 50-100ms | <10ms | Faster SOS response |
| **Bandwidth** | 50 Mbps | 1000 Mbps | High-res map + video |
| **Connection Density** | 10K/km² | 1M/km² | City-wide deployment |
| **Edge Computing** | Not supported | Native support | Local AI inference |
| **Network Slicing** | None | Available | Priority emergency |

### 9.2 Safety-Critical Latency Requirements

| Scenario | Cloud Latency | 5G Edge Latency | Difference |
|----------|--------------|-----------------|------------|
| SOS trigger to response | 500ms | <10ms | 50x faster |
| Real-time route update | 200ms | <20ms | 10x faster |
| Threat detection alert | 300ms | <30ms | 10x faster |
| Location streaming | 1000ms | <50ms | 20x faster |

### 9.3 Why Cloud-Only Is Insufficient

1. **Round-trip latency**: Cloud server may be 100+ km away, adding 50-200ms per request
2. **Single point of failure**: Cloud downtime affects all users simultaneously
3. **Bandwidth congestion**: During emergencies, cloud networks may be saturated
4. **Privacy risk**: Sending location data to central cloud introduces surveillance risk
5. **Scalability limits**: Cloud scaling cannot meet city-wide emergency spike demand

### 9.4 Edge Intelligence Integration

The 5G edge node enables:

- **Local AI inference**: Risk scoring without cloud round-trip
- **Offline capability**: Core safety features work without connectivity
- **Privacy preservation**: Location data stays on edge, never sent to cloud
- **Priority queuing**: Emergency traffic gets dedicated network slice
- **Real-time collaboration**: Edge-to-edge communication for multi-user scenarios

### 9.5 Network Slicing Implementation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NETWORK SLICING FOR SAFETY                            │
└─────────────────────────────────────────────────────────────────────────────┘

Physical Network (5G Infrastructure)
│
├── Default Slice (mMBB)
│   └── Regular navigation, map loading, route search
│
├── Safety Slice (uRLLC)  ← SURAKṢĀMĀRGA.AI PRIORITY
│   ├── SOS triggers (highest priority)
│   ├── Real-time location streaming
│   ├── Threat detection alerts
│   └── Emergency coordination
│
└── IoT Slice (mMTC)
    └── Future: Smart city sensors, wearable integration
```

### 9.6 5G Lab Testbed Integration

The college's 5G lab serves as the primary testbed for:

1. **API validation**: Testing app communication with 5G network
2. **Latency measurement**: Benchmarking edge vs cloud performance
3. **Slicing demonstration**: Showing priority queue behavior
4. **Multi-device coordination**: Testing concurrent user scenarios
5. **Failover testing**: Demonstrating 4G/5G transition behavior
6. **Edge deployment**: Deploying Docker containers on lab infrastructure

---

## 10. Detailed 5G Use Cases

### Use Case 1: Real-Time Danger Detection During Night Commute

**Scenario:** A female student walking home from college at 10 PM along a route that appears safe on standard maps.

**Problem:** The route passes through an alley with historical crime incidents (molestation, 3 cases in past 18 months) that standard navigation ignores.

**5G Infrastructure Involved:**
- G-Node B provides continuous 5G connectivity for location streaming
- Edge node processes GPS coordinates in real-time
- CU/DU handles low-latency AI inference request
- LPRU enables rapid data exchange

**Data Flow:**
1. User's phone sends GPS coordinates every 2 seconds via 5G
2. Edge node receives coordinates and queries crime database for 200m radius
3. AI engine calculates risk score for current segment
4. If risk exceeds threshold (60+), push notification sent to user
5. Alternative safe route calculated and displayed

**AI Functionality:**
- 5-factor risk scoring with real-time crime query
- Time-of-day multiplier (night = 1.5x)
- Segment-level analysis vs overall route scoring

**Safety Impact:**
- User receives warning before entering dangerous area
- Time to react: <20 seconds (vs 0 seconds with standard maps)
- Provides alternative route automatically

**Why 5G Matters:**
- 4G latency (100ms) would delay alert until after user enters danger zone
- Edge computing enables sub-20ms risk calculation
- Continuous location streaming requires high bandwidth

**Future Scalability:**
- Deploy edge nodes at city level for urban coverage
- Integrate with smart city CCTV for expanded awareness
- Partner with police for real-time incident reporting

**Deployment Feasibility:**
- MVP: Simulated edge on cloud with latency injection
- Pilot: Deploy Docker container on college 5G lab
- Production: Partner with telecom for edge node placement

---

### Use Case 2: AI-Guided Safe Escort Routing

**Scenario:** A parent wants to track their daughter's commute from college to home in real-time.

**Problem:** No existing app provides real-time route safety monitoring with parental oversight.

**5G Infrastructure Involved:**
- Network slicing for priority tracking data
- Edge node handles real-time location correlation
- High-bandwidth connection for continuous video/location stream

**Data Flow:**
1. Student initiates "Escort Mode" on app
2. Parent receives monitoring link via SMS
3. Student's location streams to edge every 2 seconds
4. Edge calculates safety score for each segment
5. Parent app receives real-time updates and alerts
6. If safety drops below threshold, both receive notification

**AI Functionality:**
- Risk scoring per segment with real-time updates
- Predictive ETA to destination based on walking speed
- Anomaly detection (stopping, deviation from route)

**Safety Impact:**
- Parental peace of mind with real-time monitoring
- Automatic alerts if student stops or deviates
- Historical route data for future reference

**Why 5G Matters:**
- 5-second location intervals critical for anomaly detection
- 4G would cause 2-3 second delay per update
- Network slicing ensures tracking continues during emergencies

**Future Scalability:**
- Multiple guardian support
- Integration with wearable devices
- Corporate deployment for employee tracking

**Deployment Feasibility:**
- MVP: Basic location sharing with manual monitoring
- Pilot: Automated safety scoring with college 5G
- Production: City-wide deployment with telecom partnership

---

### Use Case 3: Drone-Assisted Emergency Response

**Scenario:** A woman triggers SOS in an area where no nearby help is available. Emergency services need visual assessment before dispatch.

**Problem:** 911 calls cannot provide visual context of emergency location, delaying response and resource allocation.

**5G Infrastructure Involved:**
- High bandwidth for drone video streaming (4K)
- Low latency for real-time video analysis
- Edge AI for on-drone threat assessment

**Data Flow:**
1. User triggers SOS via app
2. System dispatches nearest available drone (simulated)
3. Drone streams video to edge AI for threat assessment
4. Edge sends visual report to emergency services
5. Dispatch optimized based on actual scene assessment

**AI Functionality:**
- Object detection for identifying threats
- Scene classification (crowd, empty, under construction)
- Sound analysis for distressed voices

**Safety Impact:**
- Faster, more accurate emergency response
- Visual verification prevents false alarms
- Resource optimization (send appropriate response)

**Why 5G Matters:**
- 4K drone video requires 20+ Mbps sustained
- 4G cannot support multiple concurrent drone streams
- Edge AI required for on-drone processing (bandwidth)

**Future Scalability:**
- Partnership with police drone programs
- Integration with emergency response systems
- Automated dispatch based on threat level

**Deployment Feasibility:**
- MVP: Simulated drone interface with video overlay
- Pilot: Test with college drone research program
- Production: Partner with municipal drone initiatives

---

### Use Case 4: Smart Wearable Panic System

**Scenario:** A woman is wearing a smart watch/band that detects abnormal vital signs or receives manual panic trigger.

**Problem:** Phone-based SOS requires reaching for phone, which may not be possible in dangerous situations.

**5G Infrastructure Involved:**
- BLE/5G connectivity for wearable communication
- Edge node for rapid alert processing
- Network slicing for priority wearable traffic

**Data Flow:**
1. Wearable detects panic trigger (button press or fall)
2. Signal sent via BLE to phone, then 5G to edge
3. Edge activates emergency protocol immediately
4. Location and vitals sent to emergency contacts + services
5. Continuous monitoring until resolved

**AI Functionality:**
- Fall detection algorithm
- Heart rate anomaly detection
- Panic pattern recognition

**Safety Impact:**
- Hands-free emergency trigger
- Faster detection than manual phone access
- Vitals provide medical context for responders

**Why 5G Matters:**
- Wearable needs continuous connection (5G preferred)
- Low-latency critical for immediate emergency response
- Network slicing ensures wearable traffic prioritized

**Future Scalability:**
- Partner with wearable manufacturers
- Integration with health monitoring systems
- Corporate wellness program integration

**Deployment Feasibility:**
- MVP: App-based panic (button in app)
- Pilot: Bluetooth button accessory
- Production: Partner with smartwatch brands

---

### Use Case 5: Public Safety Corridor Analytics

**Scenario:** City authorities want to identify and improve unsafe corridors based on aggregate user data.

**Problem:** Crime data is historical; real-time safety feedback from citizens is not collected or analyzed.

**5G Infrastructure Involved:**
- Aggregated data processing on edge
- High-volume analytics for corridor assessment
- Secure data sharing with municipal systems

**Data Flow:**
1. Multiple users navigate routes in area
2. Edge aggregates anonymous safety ratings per segment
3. System identifies corridors with consistently low safety scores
4. Report generated for city planning department
5. Recommendations for infrastructure improvements

**AI Functionality:**
- Anomaly detection for unsafe corridors
- Pattern recognition for temporal safety variations
- Predictive modeling for emerging danger zones

**Safety Impact:**
- Data-driven urban safety improvement
- Proactive infrastructure investment
- Community-level safety enhancement

**Why 5G Matters:**
- Processing anonymous data at scale requires bandwidth
- Edge aggregation preserves privacy (raw data never leaves edge)
- Real-time aggregation for immediate action

**Future Scalability:**
- Integration with smart city initiatives
- Partnership with municipal planning
- Citizen engagement programs

**Deployment Feasibility:**
- MVP: Backend analytics on historical data
- Pilot: College campus corridor analysis
- Production: City-wide deployment with government partnership

---

# PART V: SOCIETAL AWARENESS AND SOCIAL IMPACT

## 11. Societal Problem Analysis

### 11.1 Current Limitations in Women Safety Systems

| Gap | Current Reality | SurakṣāMārga.ai Solution |
|-----|-----------------|-------------------------|
| **Reactive only** | Panic buttons after incident | Proactive route avoidance |
| **No crime integration** | Navigation ignores safety data | 157K+ crime records analyzed |
| **Time-blind** | Same route anytime = same recommendation | Dynamic time multipliers |
| **Cloud latency** | Emergency response delayed | Sub-10ms edge processing |
| **No prediction** | No warning before danger | ML-based threat prediction |
| **Isolated system** | No integration with emergency services | Automated escalation pipeline |

### 11.2 Urban Women Safety Statistics

- **87%** of women feel unsafe in public spaces after 8 PM (UN Women Survey 2024)
- **62%** of harassment incidents go unreported (NCRB 2024)
- **34%** of women avoid certain routes despite longer travel time
- **1 in 3** women in metro cities have experienced harassment while commuting

### 11.3 Economic Impact

| Category | Current Cost | With SurakṣāMārga.ai |
|----------|-------------|---------------------|
| Lost productivity | ₹45,000 Crore/year (avoided travel) | Reduced by 20% |
| Safety services | ₹12,000 Crore/year (emergency response) | Optimized by 15% |
| Mental health | ₹8,000 Crore/year (trauma treatment) | Reduced by 10% |
| Opportunity cost | Unquantified | Reclaimed time for education/work |

---

## 12. Detailed Societal Use Cases

### Use Case 1: Safe College Commuting

**Social Problem:** Female students commuting to colleges face unpredictable safety challenges. Most colleges lack comprehensive safety navigation for students traveling to and from campus.

**Current Limitation:** Students rely on word-of-mouth knowledge of safe routes. No app provides college-specific safety routing based on actual crime data around campus areas.

**Proposed AI-Driven Intervention:**
- Campus-specific safety mapping with detailed analysis of routes between student hostels and college buildings
- Time-aware routing that adjusts for class timings (morning/evening classes)
- Integration with college transport systems for combined safety routing
- Crowd-sourced safety updates from student community

**Role of 5G:**
- Real-time location tracking during commute
- Edge-based risk calculation for instant safety updates
- Low-latency SOS trigger if emergency occurs during commute

**Impact on Women/Students/Workers:**
- 40% reduction in safety-related commute anxiety
- 25% improvement in on-time arrival to classes
- Increased participation in evening activities/classes
- Empowerment through proactive safety management

**Long-Term City Impact:**
- Model for other educational institutions
- Data-driven campus safety improvements
- Reduced crime in campus areas due to visibility

**Potential Government Integration:**
- Ministry of Education partnership for college safety
- UGC guidelines for campus safety technology
- National Education Policy alignment

**NGO/Public Safety Integration:**
- NGO partnerships for safety awareness programs
- Community safety certification for colleges
- Integration with SheThePeople platform

**Ethical Implications:**
- Data privacy for student location information
- Non-discriminatory routing that doesn't stigmatize areas
- Accessible design for students with disabilities

**Scalability Potential:**
- 50,000+ colleges in India
- Extension to school commuting
- International adaptation for global institutions

---

### Use Case 2: Women Working Night Shifts

**Social Problem:** Healthcare workers, IT professionals, and hospitality staff working night shifts face significant safety challenges during commute.

**Current Limitation:** Standard navigation apps optimize for speed, ignoring the elevated risk during night hours and isolated industrial areas where many workplaces are located.

**Proposed AI-Driven Intervention:**
- Night-shift specific routing that avoids isolated areas between 10 PM - 6 AM
- Identification of well-lit, populated routes even if longer
- Integration with employer transport systems
- Predictable pickup/dropoff point suggestions

**Role of 5G:**
- 5G ensures reliable connectivity in industrial areas
- Edge computing for instant route recalculation
- Continuous location monitoring during night commute

**Impact on Women/Students/Workers:**
- Increased workforce participation (20% more women in night shifts)
- Reduced fear-based absenteeism
- Improved work-life balance
- Economic empowerment through safer night work

**Long-Term City Impact:**
- 24-hour economy enablement
- Reduced crime in business districts
- Better urban planning for night-shift areas

**Potential Government Integration:**
- Ministry of Labor safety guidelines
- Corporate social responsibility mandates
- Smart City night safety initiatives

**NGO/Public Safety Integration:**
- Trade union partnerships
- Women's rights organizations
- Corporate HR departments

**Ethical Implications:**
- Non-discriminatory employer practices
- Privacy from employer tracking
- Fair access regardless of employment type

**Scalability Potential:**
- IT parks and special economic zones
- Hospital and healthcare facilities
- Hospitality and retail sectors

---

### Use Case 3: Rural Emergency Response

**Social Problem:** Women in rural areas face disproportionate safety challenges with limited emergency response infrastructure. Nearest police station may be 20+ km away.

**Current Limitation:** No location-based emergency services in rural areas. Communication infrastructure is unreliable. Emergency response time can exceed 1 hour.

**Proposed AI-Driven Intervention:**
- Offline-capable safety navigation with pre-downloaded maps and safety data
- Integration with village-level emergency response (Asha workers, Anganwadi)
- SMS-based SOS that works on basic phones as backup
- Community alert system notifying local volunteers

**Role of 5G:**
- Satellite-connected fallback for rural areas
- Wide-area coverage through 5G base stations
- Edge nodes at tehsil level for local processing

**Impact on Women/Students/Workers:**
- Reduced vulnerability in agricultural fields and rural roads
- Faster emergency response (from hours to minutes)
- Increased reporting of incidents
- Access to government safety schemes

**Long-Term City Impact:**
- Model for rural safety infrastructure
- Better rural-urban safety parity
- Integration with national rural development programs

**Potential Government Integration:**
- Ministry of Rural Development
- Panchayati Raj institutions
- National Rural Health Mission

**NGO/Public Safety Integration:**
- Mahila Samakhya programs
- Women's cooperatives
- Farmer unions (women members)

**Ethical Implications:**
- Language and literacy accessibility
- Culturally appropriate design
- Non-exploitation of vulnerable populations

**Scalability Potential:**
- 600,000+ villages in India
- Extension to other developing nations
- Disaster management integration

---

### Use Case 4: Public Transport Safety

**Social Problem:** Women using public transport (buses, metro, auto-rickshaws) face harassment and safety risks, particularly during peak hours and on less-traveled routes.

**Current Limitation:** No real-time safety information about specific bus routes, metro stations, or shared auto routes. Women have no way to choose safer public transport options.

**Proposed AI-Driven Intervention:**
- Safety rating for public transport routes based on incident data
- Real-time crowd density awareness to avoid isolated coaches/coaches
- Multi-modal safety routing (safest combination of walk + bus + metro)
- Integration with transport authority systems

**Role of 5G:**
- Real-time vehicle location tracking
- Edge-based crowd analysis at stations
- Low-latency alert propagation

**Impact on Women/Students/Workers:**
- 30% increase in public transport usage by women
- Reduced harassment incidents
- More confident use of public infrastructure
- Economic savings vs. private transport

**Long-Term City Impact:**
- Increased public transport adoption
- Reduced traffic congestion
- Better urban mobility equity

**Potential Government Integration:**
- Ministry of Transport
- Metro rail authorities
- State road transport corporations

**NGO/Public Safety Integration:**
- Mahila Congress
- National Commission for Women
- Consumer rights organizations

**Ethical Implications:**
- Non-discrimination in service access
- Privacy from transport tracking
- Accessibility for disabled passengers

**Scalability Potential:**
- All metro cities (50+)
- Inter-city bus networks
- Railway suburban sections

---

### Use Case 5: Predictive Unsafe-Zone Detection

**Social Problem:** Crime data is historical; current safety conditions change due to construction, events, weather, and emerging patterns. Women have no way to know about developing unsafe conditions.

**Current Limitation:** Apps rely on historical data only. No mechanism to detect emerging danger zones or warn users about temporary hazards.

**Proposed AI-Driven Intervention:**
- ML-based predictive model that identifies potential danger zones before incidents occur
- Integration with news, social media, and police databases for real-time alerts
- Crowdsourced user reports for immediate hazard warnings
- Weather and event correlation for contextual risk adjustment

**Role of 5G:**
- High-speed data ingestion from multiple sources
- Real-time model updates on edge
- Fast alert propagation to all users in area

**Impact on Women/Students/Workers:**
- Proactive warning before danger develops
- Dynamic route adjustment in real-time
- Community awareness and vigilance

**Long-Term City Impact:**
- Data-driven urban safety improvement
- Crime prevention through visibility
- Better resource allocation for police

**Potential Government Integration:**
- Home Ministry crime analytics
- Police modernization programs
- Smart City safety initiatives

**NGO/Public Safety Integration:**
- Community policing programs
- Neighborhood watch groups
- Women's safety forums

**Ethical Implications:**
- Non-stigmatization of areas based on predictions
- False positive management
- Community trust in predictions

**Scalability Potential:**
- Pan-India deployment
- Extension to other crime types
- International adaptation

---

## 12A. Current Implementation Baseline (What Exists in `/codebase` Today)

Before reading the 3-month plan, anchor on what is already built. This is the **Week 0 baseline** the roadmap hardens; reviewers should treat the timeline as "prototype → production", not "from scratch".

### 12A.1 Backend (`/codebase/backend` — FastAPI, Python)

| Module | Path | Status | Notes |
|--------|------|--------|-------|
| App entry / CORS / routers | `app/main.py` | Built | Title "SurakṣāMārga.ai", tagline "Not the fastest route. The safest one.", `/api/health`, `/docs`, `/redoc` |
| Routes (directions + safe route) | `app/routes/routes.py` | Built | `POST /api/get-routes`, `POST /api/safe-route` |
| Crime data / heatmap | `app/routes/crime.py` | Built | `GET /api/crime-zones` (aggregated cells) |
| SOS / emergency | `app/routes/sos.py` | Built | `POST /api/send-sos`, `POST /api/sos/resolve`, `GET /api/sos/active` |
| 5G simulation | `app/routes/simulation.py` | Built | `GET /api/simulation/status`, `POST /api/simulation/set-mode`, `GET /api/simulation/crowd-density`, `GET /api/simulation/realtime-risk`, `GET /api/simulation/compare` |
| Advanced safety (demo mocks) | `app/routes/advanced_safety.py` | Built (mock) | `POST /api/v1/auth/verify-identity`, `POST /api/v1/sos/offline-alert`, `GET /api/v1/sos/retry-queue`, `POST /api/v1/sos/retry-queue/flush`, `POST /api/v1/sos/trigger`, `POST /api/v1/sos/complete`, `GET /api/v1/maps/emergency-stops`, `POST /api/v1/rides/share-route`, `POST /api/v1/proximity/scan`, `POST /api/v1/threat/assess`, `GET /api/v1/simulation/compare-5g` |
| Risk engine (5-factor) | `app/services/risk_engine.py` | Built | `CRIME_WEIGHTS` map; Density 0.30 / Severity 0.25 / Category-max 0.20 / Recency 0.15 / Infra 0.10 + time multiplier |
| Time risk | `app/services/time_risk.py` | Built | 0.6× / 0.8× / 1.2× / 1.5× multipliers |
| Geo utils | `app/services/geo_utils.py` | Built | Haversine, point sampling, spatial helpers |
| Routing service | `app/services/routing.py` | Built | OSRM (primary) + Google fallback, polyline decode (`app/utils/polyline_decoder.py`) |
| Alert engine | `app/services/alert_engine.py` | Built | SOS lifecycle: trigger → notify → track → resolve |
| Crowd / realtime simulators | `app/services/crowd_simulator.py`, `realtime_simulator.py` | Built | Deterministic, seeded — demo-stable |
| DB layer | `app/database/` (`connection.py`, `init_db.py`), `app/models/` (`crime.py`, `sos.py`) | Built | SQLite (`saferoute.db`) in dev; PostGIS is the production target |
| Config | `app/config/settings.py`, `.env.example` | Built | API keys, DB URL, network mode |
| Tests | `tests/test_api.py` | Partial | Smoke/API tests — to be expanded to >80% coverage in Weeks 4 & 10 |

**Known gaps vs. target:** dev DB is SQLite, not PostgreSQL+PostGIS (migration is Week 1); ThreatDetector/CrowdPredictor are mocks, not trained ONNX models (Week 5); no JWT auth yet — `/api/v1/auth/verify-identity` is a mock identity check (real auth is V1.1).

### 12A.2 Frontend (`/codebase/frontend` — React Native / Expo, with a `.web.js` track)

| Area | Files | Status |
|------|-------|--------|
| Screens | `MapScreen.js`, `EmergencyScreen.js`, `RouteDetailsPanel.js` (+ `.web.js` variants), `IdentityOnboarding.web.js` | Built |
| Map & heatmap | `WebMap.js`, `MapCanvas.web.js`, `HeatmapToggle(.web).js`, `Legend(.web).js` | Built |
| Routing UI | `SearchInput(.web).js`, `RouteCard(.web).js` | Built |
| Emergency UI | `SOSButton(.web).js` (long-press), emergency screen with timer/live coords | Built |
| 5G UI | `NetworkBadge(.web).js`, `MetricsPanel(.web).js` | Built |
| Web landing / chrome | `HeroSection`, `Navbar`, `Footer`, `BrandMarquee`, `FloatingControls`, `CustomCursor`, `SafetyIndicator` (`.web.js`) | Built |
| Services | `src/services/api.js`, `src/services/locationService.js` | Built |
| Robustness | `ErrorBoundary.js` | Built |
| Build outputs | `dist/`, `App.web.js`, `webpack.config.js`, `app.json` | Built |

### 12A.3 Data & Docs

- `dataset/final.csv` (157,160 rows) plus monthly source CSVs, `dataset/processed/*`, and pipeline scripts (`dataset/scripts/data_pipeline.py`, `fix_coords.py`, `fix_and_analyze.py`).
- `doc/` — `implementation.md`, `SuraksaMarga_Overview.md`, the DrishtiXR PPTX, `doc/PDF/Paper/main.tex` (research paper), `doc/PDF/PPT/` (presentation builds), `doc/PDF/Images/` (UI screenshots), and `doc/MD/` (this plan + the nine supporting docs).

### 12A.4 Implication for the 12-Week Roadmap

| Roadmap weeks | What it really means given the baseline |
|---------------|------------------------------------------|
| Weeks 1–3 | **Harden, not build:** SQLite→PostgreSQL/PostGIS migration, edge containerisation of the existing FastAPI app, latency benchmarking, CI/CD |
| Weeks 4–6 | **Replace mocks with models:** train ThreatDetector (XGBoost→ONNX) to swap into `/api/v1/threat/assess`; promote `crowd_simulator` outputs to a trained `CrowdPredictor`; productionise the existing 5-factor engine; harden the existing SOS pipeline (Twilio live mode) |
| Weeks 7–9 | **Polish the existing app:** wire native (non-`.web`) screens to the hardened API, add auth/profile screens, accessibility pass |
| Weeks 10–12 | Integration testing, real 5G-lab demo, pitch & docs |

---

# PART VI: PRODUCTION READINESS IN 3 MONTHS

## 13. Production Readiness Framework

### 13.1 12-Week Execution Roadmap

| Phase | Weeks | Focus | Key Deliverables |
|-------|-------|-------|------------------|
| **Phase 1: Foundation** | 1-3 | Infrastructure + Core API | 5G edge setup, database optimization, API core |
| **Phase 2: AI Pipeline** | 4-6 | Risk Engine + ML | 5-factor scoring, threat detection, routing |
| **Phase 3: Mobile App** | 7-9 | Frontend + UX | Complete React Native app, SOS flow, maps |
| **Phase 4: Integration** | 10-11 | E2E Testing | Full system integration, security, performance |
| **Phase 5: Demo Prep** | 12 | Polish + Demo | Demo script, pitch deck, documentation |

### 13.2 Weekly Milestones

#### Week 1: Infrastructure Setup
**Goals:**
- 5G lab edge node configuration
- PostgreSQL + PostGIS deployment
- Basic API server running
- CI/CD pipeline setup

**Deliverables:**
- [ ] Edge node accessible via 5G network
- [ ] Database schema deployed with 157K crime records
- [ ] Health check endpoint operational
- [ ] GitHub Actions for automated deployment

**Team:**
- DevOps: Primary
- Backend: Secondary

**Dependencies:**
- 5G lab access credentials
- Database server provisioning

#### Week 2: Core API Development
**Goals:**
- Route fetching endpoints (OSRM/Google)
- Crime zone aggregation endpoint
- Basic risk calculation endpoint

**Deliverables:**
- [ ] `POST /api/get-routes` endpoint (OSRM/Google directions) — *exists; harden + add caching*
- [ ] `GET /api/crime-zones` endpoint (aggregated heatmap cells) — *exists; harden*
- [ ] `POST /api/safe-route` endpoint (5-factor scored alternatives) — *exists; harden*
- [ ] API documentation (Swagger at `/docs`, ReDoc at `/redoc`) — *exists; complete schemas*

**Team:**
- Backend: Primary
- Frontend: None

**Dependencies:**
- OSRM/Google API keys
- Week 1 completion

#### Week 3: 5G Edge Integration
**Goals:**
- Docker container deployment on edge
- Latency benchmarking setup
- Network slicing demonstration

**Deliverables:**
- [ ] Risk engine running on edge
- [ ] <50ms response time achieved
- [ ] 4G/5G comparison metrics
- [ ] Edge deployment documentation

**Team:**
- DevOps: Primary
- Backend: Secondary

**Dependencies:**
- 5G lab access for deployment
- Docker configuration

#### Week 4: Risk Engine Development
**Goals:**
- 5-factor scoring algorithm implementation
- Time-of-day multiplier logic
- Segment-level analysis

**Deliverables:**
- [ ] Risk scoring service
- [ ] Time-based risk logic
- [ ] Route ranking algorithm
- [ ] Unit tests (90%+ coverage)

**Team:**
- Backend: Primary

**Dependencies:**
- Week 2 API foundation

#### Week 5: ML Integration
**Goals:**
- Threat detection model integration
- Crowd prediction model
- Real-time alert pipeline

**Deliverables:**
- [ ] ONNX model deployment
- [ ] Threat classification endpoint
- [ ] Alert pipeline integration
- [ ] Model performance metrics

**Team:**
- Backend: Primary
- ML Engineer: Secondary

**Dependencies:**
- Trained ML models (pre-existing or quick train)

#### Week 6: SOS Pipeline
**Goals:**
- Emergency trigger endpoint
- Contact notification system
- Location tracking flow

**Deliverables:**
- [ ] `POST /api/send-sos` + `POST /api/sos/resolve` + `GET /api/sos/active` — *exist; move Twilio from mock to live*
- [ ] `POST /api/v1/sos/trigger` / `/api/v1/sos/complete` enhanced loop, `/api/v1/sos/offline-alert` + retry-queue — *exist as mocks; promote offline-queue to durable store*
- [ ] SMS notification (Twilio — live mode keys)
- [ ] Location streaming endpoint (2s interval over WSS)
- [ ] Emergency screen wired to live endpoints (currently `EmergencyScreen.js` + `.web.js`)

**Team:**
- Backend: Primary
- Frontend: Secondary

**Dependencies:**
- Week 3 edge setup
- Notification service (Twilio live credentials)

#### Week 7: Mobile App Core
**Goals:**
- React Native project setup
- Map integration (react-native-maps)
- Search input component

**Deliverables:**
- [ ] Expo project running
- [ ] Google Maps/MapView display
- [ ] Location permissions
- [ ] Basic search UI

**Team:**
- Frontend: Primary

**Dependencies:**
- None (parallel track)

#### Week 8: Route Display
**Goals:**
- Route polyline rendering
- Risk color coding
- Route selection flow

**Deliverables:**
- [ ] Polyline decoder
- [ ] Color-coded route display
- [ ] Route selection UI
- [ ] Bottom sheet with route cards

**Team:**
- Frontend: Primary

**Dependencies:**
- Week 7 foundation + Week 2 API

#### Week 9: Emergency Features
**Goals:**
- SOS button component
- Emergency screen
- Location service integration

**Deliverables:**
- [ ] Long-press SOS button
- [ ] Emergency UI with timer
- [ ] GPS tracking
- [ ] Contact list management

**Team:**
- Frontend: Primary

**Dependencies:**
- Week 6 backend + Week 7 foundation

#### Week 10: Integration Testing
**Goals:**
- End-to-end flow testing
- Security audit
- Performance optimization

**Deliverables:**
- [ ] E2E test suite
- [ ] Security vulnerability scan
- [ ] Performance benchmarks
- [ ] Bug fixes

**Team:**
- QA: Primary
- Full stack: Support

**Dependencies:**
- All previous weeks

#### Week 11: 5G Demo Preparation
**Goals:**
- 5G lab demo environment
- Comparison metrics
- Demo script creation

**Deliverables:**
- [ ] Live 5G demo setup
- [ ] 3G/4G/5G comparison
- [ ] Demo script (5 min)
- [ ] Metrics dashboard

**Team:**
- All: Collaborative

**Dependencies:**
- Week 10 completion

#### Week 12: Final Polish
**Goals:**
- Documentation complete
- Pitch deck ready
- Deployment verification

**Deliverables:**
- [ ] README updated
- [ ] Pitch deck (10 slides)
- [ ] Demo recording
- [ ] Deployment verified

**Team:**
- All: Collaborative

**Dependencies:**
- Week 11 completion

### 13.3 Sprint Structure

Each week is organized into 2 sprints (3-4 days each):

| Sprint | Days | Focus | Daily Standup Goals |
|--------|------|-------|-------------------|
| Sprint 1.1 | Mon-Wed | Setup tasks | Progress on infrastructure |
| Sprint 1.2 | Thu | Week 1 review | Demo to team |
| Sprint 2.1 | Mon-Wed | API development | API endpoint ready |
| Sprint 2.2 | Thu | Testing | Unit tests passing |
| ... | ... | ... | ... |

### 13.4 Deliverables Per Sprint

| Sprint | Primary Deliverable | Secondary Deliverable | Verification |
|--------|-------------------|----------------------|-------------|
| 1.1 | Edge node running | Database connected | curl health check |
| 1.2 | API routes functional | Docs available | Swagger works |
| 2.1 | Risk scoring works | Time multipliers | Manual test |
| 2.2 | ML model runs | Alerts trigger | Demo scenario |
| 3.1 | Map shows routes | Risk colors | UI test |
| 3.2 | SOS triggers | Emergency screen | Full E2E |
| 4.1 | 5G demo works | Comparison metrics | Live demo |
| 4.2 | Documentation complete | Pitch ready | Review |

### 13.5 Validation Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| API latency (5G) | <50ms | Benchmarks |
| API latency (4G) | <200ms | Benchmarks |
| Route calculation | <3s | Timer |
| SOS trigger | <10s | End-to-end |
| Code coverage | >80% | pytest coverage |
| Build success | 100% | CI/CD |
| Crash rate | <1% | Bugsnag |
| Test pass rate | >95% | CI/CD |

### 13.6 Demo Checkpoints

| Time | Checkpoint | What to Show |
|------|------------|--------------|
| Week 4 | Proto demo | Routes on map with scores |
| Week 6 | Beta demo | Full app with SOS |
| Week 9 | Gamma demo | End-to-end flow |
| Week 11 | Pre-demo | 5G comparison |
| Week 12 | Final demo | Full presentation |

---

## 14. Production Readiness Use Cases

### Use Case 1: Real-Time Crime Heatmap

**Feature:** Display 157K crime records as interactive heatmap overlay on map view.

**Technical Stack:**
- PostgreSQL + PostGIS for spatial queries
- FastAPI endpoint for crime zone aggregation
- React Native Circle components for rendering

**Development Complexity:**
- Database query optimization (high)
- Aggregation algorithm (medium)
- Frontend rendering performance (high)

**Timeline Feasibility:**
- MVP: Week 2 (pre-aggregated, cached)
- Full: Week 6 (real-time queries)

**Deployment Plan:**
- Backend: Cloud (PostgreSQL managed)
- Frontend: Expo/CDN
- Caching: Redis for aggregation

**Risks:**
- Performance with 800+ circles
- Color contrast on different map styles

**Validation Strategy:**
- Load test with 1000 concurrent users
- Frame rate measurement on mobile

**MVP Version:** Static heatmap with pre-aggregated data, 30-second cache.

**Scale-up Version:** Real-time updates, user-controllable time range, custom radius.

**Production Bottlenecks:**
- Mobile rendering performance
- API rate limits from mapping provider

---

### Use Case 2: One-Tap SOS Emergency

**Feature:** Single-button emergency trigger that notifies contacts and starts location tracking.

**Technical Stack:**
- FastAPI + WebSocket for real-time updates
- Twilio (mock) for SMS notifications
- expo-location for GPS tracking

**Development Complexity:**
- Multi-service orchestration (high)
- Location streaming (medium)
- Notification system (low)

**Timeline Feasibility:**
- MVP: Week 6 (basic trigger)
- Full: Week 9 (full flow)

**Deployment Plan:**
- Backend: Cloud with edge
- Frontend: Mobile app
- Notification: Twilio integration

**Risks:**
- Network failure during SOS
- Battery drain from GPS
- Permission handling

**Validation Strategy:**
- End-to-end timing test
- Network failure simulation

**MVP Version:** Basic trigger with mock notifications, 30-second location updates.

**Scale-up Version:** Real SMS, 2-second location, automatic police alert.

**Production Bottlenecks:**
- SMS delivery reliability
- Background location permissions

---

### Use Case 3: 5G vs 4G Latency Comparison

**Feature:** Demonstrate performance difference between network modes in app UI.

**Technical Stack:**
- FastAPI simulation layer
- Frontend network toggle
- Metrics display component

**Development Complexity:**
- Simulation logic (medium)
- UI component (low)
- Metrics collection (medium)

**Timeline Feasibility:**
- MVP: Week 3 (simulated)
- Full: Week 6 (real comparison)

**Deployment Plan:**
- Backend: Lab 5G node for real tests
- Frontend: App toggle

**Risks:**
- Lab network availability
- Inconsistent test results

**Validation Strategy:**
- A/B testing with real users
- Automated performance tests

**MVP Version:** Simulated latency injection, labeled "5G Mode".

**Scale-up Version:** Real network detection, automatic optimization.

**Production Bottlenecks:**
- Lab access limitations for demo
- Network variability

---

### Use Case 4: Dynamic Route Scoring

**Feature:** Calculate and display safety score for each route alternative in real-time.

**Technical Stack:**
- Risk engine (Python service)
- Route optimization (OSRM)
- React Native route display

**Development Complexity:**
- Risk algorithm (high)
- Route ranking (medium)
- Visual design (medium)

**Timeline Feasibility:**
- MVP: Week 4 (basic scoring)
- Full: Week 6 (5-factor + time)

**Deployment Plan:**
- Engine: Edge node
- Routes: Cloud API
- Display: Mobile app

**Risks:**
- Algorithm accuracy
- Route calculation timeout

**Validation Strategy:**
- Manual testing with known routes
- User feedback collection

**MVP Version:** 3-factor scoring (crime, severity, category).

**Scale-up Version:** Full 5-factor + ML prediction.

**Production Bottlenecks:**
- Edge compute cost
- Route API rate limits

---

### Use Case 5: User Authentication & Profiles

**Feature:** User registration, login, and profile management for personalized safety settings.

**Technical Stack:**
- FastAPI auth endpoints
- JWT tokens
- React Native auth screens

**Development Complexity:**
- Auth security (high)
- Token management (medium)
- UI flow (medium)

**Timeline Feasibility:**
- MVP: Week 8 (simple)
- Full: Week 10 (full)

**Deployment Plan:**
- Auth: Cloud service
- Storage: PostgreSQL
- UI: Mobile app

**Risks:**
- Token security
- Password recovery

**Validation Strategy:**
- Security penetration test
- User flow testing

**MVP Version:** Simple username/password, no recovery.

**Scale-up Version:** Social login, 2FA, password recovery.

**Production Bottlenecks:**
- OAuth provider dependencies
- Token refresh edge cases

---

## 15. Risk Management

### 15.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 5G lab unavailable | High | Medium | Simulate latency, cloud fallback |
| ML model inaccurate | High | Low | Human validation loop |
| Database performance | Medium | Low | Index optimization, caching |
| Mobile rendering lag | Medium | Medium | Map clustering, lazy loading |
| API rate limits | Medium | High | Caching, request batching |

### 15.2 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Team availability | High | Medium | Clear sprint ownership |
| Scope creep | High | High | Weekly scope review |
| Technical debt | Medium | Medium | Refactoring sprints |
| Vendor lock-in | Low | Low | Open-source first |

### 15.3 Social Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Privacy backlash | High | Low | Transparent policies |
| Area stigmatization | Medium | Medium | Context-aware messaging |
| False sense of security | High | Medium | Clear limitations |
| Accessibility gap | Medium | Low | Multi-language support |

---

# PART VII: ADDITIONAL STRATEGIC SECTIONS

## 16. Emergency Escalation Engine

### 16.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EMERGENCY ESCALATION PIPELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

User triggers SOS
       │
       ▼
┌─────────────────────────────────┐
│  1. PRIORITY QUEUE              │
│     (Network Slicing)           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  2. LOCATION ACQUISITION        │
│     - GPS coordinates           │
│     - Accuracy indicator        │
│     - Altitude (if available)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  3. THREAT ASSESSMENT           │
│     - Current risk score        │
│     - Route history             │
│     - Time-of-day factor        │
└────────────┬────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
Escalation 1     Escalation 2
(Contacts)        (Authorities)
    │                 │
    ▼                 ▼
┌─────────┐    ┌──────────────┐
│SMS/Call │    │ Police Alert │
│Emergency│    │ (Mock API)   │
│Contacts │    └──────────────┘
└─────────┘
    │
    ▼
┌─────────────────────────────────┐
│  4. LOCATION TRACKING           │
│     - Updates every 2 seconds   │
│     - Stream to emergency UI    │
│     - Generate shareable link   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  5. RESOLUTION                  │
│     - User confirms safe        │
│     - Timer stops               │
│     - Log for analytics         │
└─────────────────────────────────┘
```

### 16.2 Response Time Targets

| Stage | Target | 5G Advantage |
|-------|--------|--------------|
| SOS trigger to queue | <1s | Priority slicing |
| Location acquisition | <1s | Fast GPS fix |
| Contact notification | <5s | Edge compute |
| Police alert (mock) | <8s | API integration |
| Live tracking start | <3s | 5G bandwidth |
| **Total E2E** | **<20s** | vs 60s+ (4G) |

---

## 17. Smart Routing System

### 17.1 Routing Algorithm

1. **Input:** Source, destination, time, user preferences
2. **Fetch:** Alternative routes from OSRM/Google (3-5 routes)
3. **Sample:** Extract points every 100m along each route
4. **Query:** For each point, query crimes within 200m radius
5. **Score:** Calculate 5-factor risk for each segment
6. **Aggregate:** Mean of segment scores = route risk score
7. **Apply:** Time-of-day multiplier
8. **Rank:** Sort routes by safety score descending
9. **Output:** Recommended route + alternatives with scores

### 17.2 Route Comparison

| Route | Distance | Time | Risk Score | Safety Score | Recommendation |
|-------|----------|------|------------|--------------|----------------|
| A (Fastest) | 3.2 km | 42 min | 78 | 2.2 | Risky |
| B (Safest) | 4.1 km | 55 min | 23 | 7.7 | **Recommended** |
| C (Balanced) | 3.8 km | 48 min | 45 | 5.5 | Alternative |

---

## 18. Public Safety Integration

### 18.1 Integration Points

| Partner | Integration | Data Flow |
|---------|-------------|-----------|
| Police | Emergency API | Alert → dispatch |
| Ambulance | Location sharing | Route → ETA |
| Fire | Incident API | Trigger → response |
| Women's helpline | Notification | Alert → support |

### 18.2 Mock Integration Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Surakṣā   │─────▶│  Integration│─────▶│   Partner   │
│  Mārga API  │      │    Layer    │      │   Systems   │
└─────────────┘      └─────────────┘      └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Mock Mode  │ (demo)
                   │  (returns   │
                   │   success)  │
                   └─────────────┘
```

---

## 19. Scalability Model

### 19.1 Scaling Tiers

| Tier | Users | Infrastructure | Features |
|------|-------|----------------|----------|
| MVP | 100 | Single edge | Basic routing |
| Pilot | 1,000 | Regional edge | Full features |
| City | 100,000 | Distributed edges | Analytics |
| National | 10M+ | Edge network | Full ecosystem |

### 19.2 Scaling Strategy

1. **Horizontal**: Add more edge nodes as user base grows
2. **Database**: Implement read replicas for query performance
3. **Caching**: Redis for frequent queries and crime zones
4. **CDN**: Static asset delivery via CDN
5. **Microservices**: Separate risk engine, auth, notifications

---

## 20. Deployment Strategy

### 20.1 Environment Tiers

| Environment | Purpose | URL | Deploy Method |
|-------------|---------|-----|---------------|
| Development | Local dev | localhost | Manual |
| Staging | Integration | staging.suraksha.ai | CI/CD |
| Demo | Hackathon | demo.suraksha.ai | Docker |
| Production | Live | app.suraksha.ai | Kubernetes |

### 20.2 Deployment Pipeline

```
Git Push → CI (GitHub Actions) → Build → Test → Deploy to Staging
                                                        │
                                                        ▼
                                              Manual QA → Deploy to Production
```

---

## 21. Cloud + Edge Hybrid Architecture

### 21.1 Component Distribution

| Component | Location | Reasoning |
|-----------|----------|-----------|
| Auth service | Cloud | Centralized user management |
| Risk engine | Edge | <50ms latency requirement |
| Crime database | Cloud | Centralized data store |
| Route calculation | Edge | Real-time computation |
| SOS pipeline | Edge | Critical low latency |
| Analytics | Cloud | Batch processing |
| ML models | Both (edge for inference, cloud for training) | Optimized for use case |

---

## 22. Revenue and Funding Possibilities

### 22.1 Revenue Models

| Model | Description | Target |
|-------|-------------|--------|
| B2C Freemium | Basic free, Premium ₹99/mo | Individual users |
| B2B Enterprise | Campus safety license | Colleges, companies |
| Government | Contract for city safety | Municipal, state |
| Data licensing | Anonymized safety data | Urban planners |

### 22.2 Grant Opportunities

| Grant | Agency | Amount | Fit |
|-------|--------|--------|-----|
| Startup India | DPIIT | ₹10L | Product development |
| SHE-Funding | Various | ₹50L-2Cr | Women safety focus |
| 5G Use Case | DoT | ₹1Cr | 5G innovation |
| Innovation | State | ₹25L | Hackathon winning |

---

## 23. Government Collaboration Possibilities

### 23.1 Integration Pathways

| Agency | Level | Collaboration |
|--------|-------|---------------|
| Ministry of Home Affairs | National | Safe City integration |
| Ministry of Women & Child Dev | National | Safety app certification |
| State Police | State | Emergency response |
| Municipal Corporation | City | Data sharing |
| District Administration | Local | Campus safety |

### 23.2 Policy Alignment

- **Safe City Mission**: Align with national safe city program
- **Women Safety Scheme**: Integrate with state women safety initiatives
- **Digital India**: Part of Digital India safety infrastructure
- **Smart Cities**: Integration with smart city command centers

---

## 24. Smart City Integration

### 24.1 Integration Points

| Smart City Component | Integration |
|---------------------|-------------|
| CCTV surveillance | Share incident data |
| Traffic management | Optimize safe routes |
| Street lighting | Use for infrastructure score |
| Emergency services | Direct dispatch integration |
| Public transport | Multi-modal routing |

### 24.2 Future Roadmap

1. **Phase 1**: Pilot with 1 smart city
2. **Phase 2**: Integration with 10 cities
3. **Phase 3**: National safety platform

---

## 25. Research Opportunities

### 25.1 Academic Collaborations

| Area | Institution | Project |
|------|-------------|---------|
| ML Safety Prediction | IIT | Crime prediction model |
| 5G Edge Computing | College Lab | Edge deployment research |
| Urban Planning | School of Planning | Safety-aware city design |
| Social Impact | Sociology Dept | User behavior analysis |

### 25.2 Publication Targets

- Conference paper: IEEE ICIT or similar
- Journal article: Safety science or urban planning
- Technical report: Internal research documentation

---

## 26. Patent Opportunities

### 26.1 Patentable Innovations

| Innovation | Description | Patent Potential |
|------------|-------------|-----------------|
| Safety-first routing | Novel optimization approach | High |
| 5G edge safety pipeline | Architecture for emergency | High |
| Predictive threat detection | ML-based method | Medium |
| Time-aware risk scoring | Algorithm for temporal risk | High |

### 26.2 IP Strategy

1. Document all novel approaches
2. File provisional patent for core innovation
3. Open-source non-critical components
4. Protect competitive advantage

---

## 27. Future Expansion Possibilities

### 27.1 Product Roadmap

| Phase | Timeline | Feature |
|-------|----------|---------|
| MVP | 3 months | Basic routing + SOS |
| V1 | 6 months | Analytics + enterprise |
| V2 | 12 months | Predictive AI + multi-city |
| V3 | 24 months | Full ecosystem + international |

### 27.2 Expansion Areas

- **Wearable integration**: Smart watch panic button
- **Vehicle integration**: Car safety routing
- **AR integration**: Visual safety overlays
- **Voice integration**: Voice-activated SOS
- **Offline mode**: Downloadable safety maps

---

## 28. Ethical Considerations

### 28.1 AI Ethics Framework

| Principle | Implementation |
|-----------|----------------|
| **Fairness** | Non-discriminatory routing |
| **Transparency** | Clear score explanations |
| **Privacy** | Data minimization, encryption |
| **Safety** | No false sense of security |
| **Accountability** | Human oversight in emergencies |

### 28.2 Inclusivity

- Multiple language support (Hindi, English, regional)
- Accessibility for visually impaired (voice navigation)
- Low-bandwidth mode for rural areas
- Works on entry-level smartphones

---

## 29. Metrics and KPIs

### 29.1 Technical KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| API uptime | 99.9% | Monitoring |
| Response time P95 | <200ms | APM |
| SOS latency | <20s | E2E test |
| Crash rate | <1% | Bugsnag |
| Build success | 100% | CI/CD |

### 29.2 Business KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| User acquisition | 10K (3 months) | Analytics |
| DAU/MAU | 40% | Analytics |
| Retention | 60% (30 days) | Analytics |
| NPS | 50+ | Survey |
| Safety incidents | 0 (during use) | User report |

### 29.3 Impact KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Routes taken safely | 1M+ | Analytics |
| SOS triggers handled | 1000+ | System |
| User safety rating | 4.5+ | App store |
| Press mentions | 10+ | PR |
| Government interest | 3+ meetings | BD |

---

## 30. Success Criteria

### 30.1 Hackathon Success Metrics

| Criteria | Definition |
|----------|------------|
| **Working demo** | All features functional in demo |
| **Technical depth** | 5G integration demonstrated |
| **Social impact** | Clear problem-solution narrative |
| **Scalability** | Path to production clear |
| **Team presentation** | Compelling pitch |

### 30.2 Post-Hackathon Success

| Criteria | Definition |
|----------|------------|
| **Team continuation** | Team stays together |
| **Funding raised** | Seed round or grant |
| **User base** | 1000+ users |
| **Partnership** | Government or enterprise |
| **Product version** | V1 launched |

---

# PART VIII: TEAM AND TECHNICAL STACK

## 31. Team Structure

### 31.1 Roles and Responsibilities

| Role | Count | Responsibilities |
|------|-------|------------------|
| Project Lead | 1 | Overall coordination, pitch |
| Backend Developer | 2 | API, risk engine, database |
| Frontend Developer | 2 | React Native app |
| DevOps/5G | 1 | 5G lab, deployment |
| ML Engineer | 1 | ML models, predictions |
| UX Designer | 1 | UI/UX, demo prep |

### 31.2 Skills Matrix

| Skill | Team Coverage |
|-------|---------------|
| Python/FastAPI | 2+ |
| React Native | 2+ |
| PostgreSQL/PostGIS | 2+ |
| 5G/Networking | 1+ |
| ML/XGBoost | 1+ |
| Docker/K8s | 1+ |

---

## 32. Tech Stack Recommendations

### 32.1 Backend Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| API Framework | FastAPI | Fast, async, auto-docs |
| Database | PostgreSQL + PostGIS | Spatial queries |
| ORM | SQLAlchemy + GeoAlchemy2 | PostGIS support |
| ML Runtime | ONNX Runtime | Edge inference |
| Message Queue | Redis | Caching, pub/sub |
| Container | Docker | Edge deployment |

### 32.2 Frontend Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| Framework | React Native (Expo) | Cross-platform |
| Maps | react-native-maps | Google Maps |
| Navigation | React Navigation | Screen flow |
| Location | expo-location | GPS access |
| State | React Context | Simple state |

### 32.3 Infrastructure Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| Cloud | AWS/GCP | Production ready |
| Edge | 5G Lab + Docker | Low latency |
| CDN | CloudFront | Static assets |
| CI/CD | GitHub Actions | Automation |
| Monitoring | Datadog | APM |

---

## 33. Database Design

### 33.1 Schema Overview

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Emergency contacts
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(100),
    phone VARCHAR(20),
    relationship VARCHAR(50)
);

-- SOS events
CREATE TABLE sos_events (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    latitude FLOAT,
    longitude FLOAT,
    status VARCHAR(20) DEFAULT 'active',
    triggered_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Route history
CREATE TABLE route_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    source_lat FLOAT,
    source_lng FLOAT,
    dest_lat FLOAT,
    dest_lng FLOAT,
    risk_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 33.2 Performance Considerations

- GiST index on crime_incidents.location
- Composite index on crime_incidents(crime_type, timestamp)
- Partitioning for sos_events by date
- Read replicas for query load

---

## 34. 5G Communication Flow

### 34.1 Network Protocol Stack

```
Application Layer: SurakṣāMārga.ai App/API
          │
Transport Layer: TLS 1.3 (HTTPS)
          │
Network Layer: IPv4/IPv6
          │
Data Link Layer: 5G NR (New Radio)
          │
Physical Layer: mmWave/Sub-6GHz
```

### 34.2 Key Protocols

| Protocol | Use Case |
|----------|----------|
| HTTP/2 | API communication |
| WebSocket | Real-time updates |
| MQTT | IoT (future) |
| gRPC | Service communication |

---

# PART IX: DEMO AND PITCH STRATEGY

## 35. Demo Strategy

### 35.1 5-Minute Demo Script

| Time | Action | Show |
|------|--------|------|
| 0:00 | Open app | Clean map, Bangalore centered |
| 0:30 | Search route | "Koramangala → MG Road" |
| 0:45 | Tap Find Routes | Loading animation |
| 1:00 | Show results | 3 routes with risk scores |
| 1:30 | Select route | Map shows color-coded polyline |
| 2:00 | Toggle heatmap | Crime hotspots visible |
| 2:30 | Change time to Night | Risk scores increase |
| 3:00 | Toggle 5G | Show metrics panel |
| 3:15 | Long-press SOS | Emergency screen |
| 3:45 | Show tracking | Live location, timer |
| 4:15 | Cancel emergency | Return to map |
| 4:30 | Show architecture | 5G edge diagram |
| 5:00 | Close | "Safety first, always" |

### 35.2 Demo Preparation Checklist

- [ ] All devices charged
- [ ] 5G network connected
- [ ] Demo account logged in
- [ ] Backup routes pre-calculated
- [ ] Screenshots for fallback
- [ ] Live demo backup (recorded)

---

## 36. Pitch Strategy

### 36.1 Pitch Deck Structure

| Slide | Content |
|-------|---------|
| 1 | Title + tagline |
| 2 | Problem (stats) |
| 3 | Solution (demo screenshot) |
| 4 | Technology (architecture) |
| 5 | 5G advantage (metrics) |
| 6 | Social impact |
| 7 | Business model |
| 8 | Traction |
| 9 | Team |
| 10 | Ask + contact |

### 36.2 Key Messaging

**Tagline:** "Google Maps tells you the fastest route. We tell you the safest."

**Value Prop:** "The world's first AI-powered safety-first navigation platform leveraging 5G edge computing for sub-10-second emergency response."

**Differentiation:** Proactive routing, not reactive panic buttons.

---

## 37. Interview Preparation Notes

### 37.1 Expected Technical Questions

**Q: Why is 5G necessary when 4G works for apps?**
A: Emergency response requires sub-20ms latency. 4G adds 50-100ms per round-trip. In a safety crisis, those milliseconds matter. 5G edge computing keeps processing close to the user.

**Q: How does your risk scoring algorithm work?**
A: 5-factor weighted model: crime density (30%), severity average (25%), category max (20%), recency (15%), infrastructure (10%). Applied per 100m segment, then averaged per route, with time-of-day multiplier.

**Q: How do you handle false positives in threat detection?**
A: We provide warnings, not automatic escalation. User remains in control. False positives are acceptable (nuisance) vs false negatives (danger).

**Q: What's your data privacy approach?**
A: Location data encrypted at rest, JWT for auth, no third-party data sharing, user can delete all data. We're GDPR and PDP Act compliant.

### 37.2 Expected Societal Questions

**Q: How does this impact communities that get flagged as "unsafe"?**
A: Our model is designed to avoid stigmatization: we highlight specific segments, not areas; we recommend safe alternatives, not avoidance; data is used for infrastructure improvement, not social exclusion.

**Q: What about women without smartphones?**
A: Future: SMS-based SOS from basic phones. Partner with feature phone manufacturers. Government distribution programs.

**Q: How do you ensure accessibility?**
A: Voice navigation for visually impaired, low-bandwidth mode, multiple languages (Hindi, English, regional), works on 2GB RAM phones.

### 37.3 Expected Scalability Questions

**Q: How do you scale to a million users?**
A: Distributed edge nodes, read replicas for database, CDN for static assets, microservices architecture, Redis caching layer.

**Q: What's your go-to-market strategy?**
A: B2C: Campus safety (college students). B2B: Enterprise employee safety. Government: City safety contracts.

**Q: What stops Google from copying this?**
A: First-mover advantage, proprietary crime dataset, domain expertise, community trust, partnerships with government.

### 37.4 Suggested Answers for Difficult Questions

**Q: Isn't this just victim-blaming—telling women to change routes instead of fixing the problem?**
A: We do both. Our data is shared with police for resource allocation. We advocate for infrastructure improvement. But women need safety NOW—while we work on systemic change, we provide immediate protection.

**Q: What about men? Is this women-only?**
A: The core safety routing works for everyone. We specifically optimize for women's safety patterns (harassment, assault) but the platform is inclusive. Future: customizable safety profiles.

**Q: How do you handle areas with no crime data?**
A: We use alternative factors: population density, time of day, infrastructure (street lights from satellite data), transit presence. If no data available, we flag as "unknown" rather than assume safe.

---

# PART X: REQUIRED UPDATES TO OTHER MD FILES

> **Status (v2.1):** All nine supporting documents below have been created and aligned with this plan. Each carries its own version-history block. The "Document Map" in the Appendix lists where to find each. The subsections that follow are retained as the *change brief* that drove those documents and as the checklist for future updates — when this plan changes, walk this list and propagate.

## Document Dependency Order

When this plan is revised, update supporting files in this order (downstream depends on upstream):

```
Plan.md  ──►  MASTER_PLAN.md  ──►  RESEARCH_PLAN.md ──► ARCHITECTURE.md ──► PRODUCT_PLAN.md
                                                                                   │
                              EXECUTION_TRACKER.md ◄──────────────────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
          RISKS.md               DECISIONS.md              METRICS.md
                                                                │
                                                                ▼
                                                        RETROSPECTIVE.md
```

---

## 38. MASTER_PLAN.md

**Purpose:** Overall project master document providing high-level direction and context.

**What Must Be Added:**
- Updated vision statement aligning with 5G focus
- 3-month production roadmap summary
- Key metrics and success criteria
- Updated team structure with roles
- Funding and partnership status

**What Must Change:**
- Expand from hackathon focus to product focus
- Include post-hackathon trajectory
- Add risk considerations
- Include stakeholder communication plan

**New Sections Required:**
- Vision 2026-2028
- Product-market fit strategy
- Competitive landscape update
- Investor readiness checklist

**Dependencies:** All other MD files
**Priority:** High
**Suggested Structure:**

```
# MASTER_PLAN.md

## Vision & Mission (Updated)
## Project Overview (Expanded)
## Strategic Goals (2026-2028)
## Team Structure (Updated)
## Milestones (3-month roadmap)
## Key Metrics
## Risk Register
## Stakeholder Plan
## Appendix: Links to detailed docs
```

---

## 39. RESEARCH_PLAN.md

**Purpose:** Document research methodology, ML models, and technical investigations.

**What Must Be Added:**
- 5G edge deployment research
- Network slicing implementation details
- Latency benchmarking methodology
- ML model performance metrics

**What Must Change:**
- Expand from crime analysis to AI pipeline
- Include edge inference research
- Add comparative analysis (3G/4G/5G)

**New Sections Required:**
- 5G Lab Integration Research
- Edge AI Optimization
- Threat Detection Model Training
- Performance Benchmarking

**Dependencies:** ARCHITECTURE.md
**Priority:** High
**Suggested Structure:**

```
# RESEARCH_PLAN.md

## Research Questions
## 5G Infrastructure Research
## AI/ML Methodology
## Benchmarking Results
## Literature Review
## Technical Feasibility
## Experiments Log
```

---

## 40. PRODUCT_PLAN.md

**Purpose:** Define product features, roadmap, and user experience.

**What Must Be Added:**
- Feature prioritization for 3-month timeline
- User personas (student, worker, commuter)
- MVP feature list
- Product-market fit strategy

**What Must Change:**
- Transition from prototype to product thinking
- Include enterprise/campus features
- Add offline capability planning

**New Sections Required:**
- Product Roadmap (3/6/12 months)
- Feature Prioritization Matrix
- User Research & Personas
- UX Design Guidelines
- Accessibility Standards

**Dependencies:** MARKET_PLAN.md (new)
**Priority:** High
**Suggested Structure:**

```
# PRODUCT_PLAN.md

## Product Vision
## User Personas
## Feature List (MVP + Future)
## Roadmap
## UX Guidelines
## Accessibility
## Product Metrics
```

---

## 41. ARCHITECTURE.md

**Purpose:** Technical architecture documentation including system design and integration.

**What Must Be Added:**
- Detailed 5G integration architecture
- Edge computing deployment diagram
- Network slicing implementation
- End-to-end data flow diagrams

**What Must Change:**
- Expand beyond basic API to full system architecture
- Include cloud + edge hybrid design
- Add security architecture section
- Include scalability architecture

**New Sections Required:**
- 5G Lab Architecture Integration
- Edge Computing Deployment
- Network Slicing Design
- Security & Privacy Architecture
- Scalability Design
- Disaster Recovery

**Dependencies:** RESEARCH_PLAN.md
**Priority:** High
**Suggested Structure:**

```
# ARCHITECTURE.md

## System Overview
## 5G Integration
## Cloud Architecture
## Edge Computing
## API Architecture
## Database Design
## Security Architecture
## Scalability Design
## Integration Points
```

---

## 42. EXECUTION_TRACKER.md

**Purpose:** Track sprint progress, deliverables, and team performance.

**What Must Be Added:**
- 12-week sprint planning
- Weekly milestone tracking
- Demo checkpoint verification
- Risk and issue tracking

**What Must Change:**
- Transition from phase-based to sprint-based tracking
- Include 5G-specific tasks
- Add demo preparation tracking

**New Sections Required:**
- Sprint 1-12 Detailed Tasks
- 5G Integration Tasks
- Demo Preparation Checklist
- Daily Standup Format
- Retrospective Notes

**Dependencies:** PRODUCT_PLAN.md
**Priority:** High
**Suggested Structure:**

```
# EXECUTION_TRACKER.md

## Sprint Overview (12 weeks)
## Sprint 1: Infrastructure
## Sprint 2: API Core
## ...
## Sprint 12: Demo & Polish
## Daily Standups Log
## Issue Tracker
## Retrospectives
```

---

## 43. RISKS.md

**Purpose:** Document technical, operational, and social risks with mitigation strategies.

**What Must Be Added:**
- 5G lab availability risks
- Edge deployment risks
- ML model accuracy risks
- Privacy backlash risks

**What Must Change:**
- Expand risk categories
- Add probability and impact ratings
- Include mitigation ownership

**New Sections Required:**
- Technical Risks (Expanded)
- Operational Risks
- Social/Ethical Risks
- Compliance Risks
- Risk Register Template

**Dependencies:** All technical docs
**Priority:** Medium
**Suggested Structure:**

```
# RISKS.md

## Risk Categories
## Technical Risks
## Operational Risks
## Social Risks
## Compliance Risks
## Risk Register
## Mitigation Actions
## Risk Review Schedule
```

---

## 44. DECISIONS.md

**Purpose:** Log key architectural and product decisions with rationale.

**What Must Be Added:**
- 5G over 4G decision
- Edge over cloud decision
- OSRM over Google decision
- React Native over Flutter decision

**What Must Change:**
- Add decision framework
- Include alternatives considered

**New Sections Required:**
- Technology Decisions
- Architecture Decisions
- Product Decisions
- Partnership Decisions

**Dependencies:** ARCHITECTURE.md, PRODUCT_PLAN.md
**Priority:** Medium
**Suggested Structure:**

```
# DECISIONS.md

## Decision Framework
## Technology Stack Decisions
## Architecture Decisions
## Product Feature Decisions
## Partnership Decisions
## Past Decisions Log
```

---

## 45. METRICS.md

**Purpose:** Define and track KPIs, success metrics, and analytics.

**What Must Be Added:**
- Technical performance metrics
- 5G latency metrics
- User safety metrics
- Business metrics

**What Must Change:**
- Expand from basic to comprehensive
- Add real-time dashboards plan
- Include analytics infrastructure

**New Sections Required:**
- Technical KPIs
- User Engagement KPIs
- Safety Impact KPIs
- Business KPIs
- Analytics Dashboard Plan

**Dependencies:** PRODUCT_PLAN.md
**Priority:** Medium
**Suggested Structure:**

```
# METRICS.md

## Technical Metrics
## User Metrics
## Safety Metrics
## Business Metrics
## Dashboard Specifications
## Measurement Plan
```

---

## 46. RETROSPECTIVE.md

**Purpose:** Document lessons learned, improvements, and team reflections.

**What Must Be Added:**
- Technical retrospectives
- Process improvement notes
- Team collaboration feedback

**What Must Change:**
- Add sprint-based retrospectives
- Include 5G-specific learnings

**New Sections Required:**
- Sprint Retrospectives
- Technical Learnings
- Process Improvements
- Team Feedback
- Action Items

**Dependencies:** EXECUTION_TRACKER.md
**Priority:** Low
**Suggested Structure:**

```
# RETROSPECTIVE.md

## Sprint 1 Retrospective
## Sprint 2 Retrospective
## ...
## Technical Learnings
## Process Improvements
## Team Feedback
## Action Items
```

---

# APPENDIX: DOCUMENT MAP & VERSION HISTORY

## A.1 Document Map

| Document | Path | Purpose | Owner | Derived from |
|----------|------|---------|-------|--------------|
| **Plan.md** (this) | `doc/MD/Plan.md` | Master strategic update — single source of truth | Strategy Team / Project Lead | Requirements + `/codebase` |
| MASTER_PLAN.md | `doc/MD/MASTER_PLAN.md` | High-level project master reference, goals, KPIs, stakeholders | Project Lead | Plan.md |
| RESEARCH_PLAN.md | `doc/MD/RESEARCH_PLAN.md` | 5G lab research, ML methodology, spatial analysis, benchmarks | ML Engineer + Backend Lead | Plan.md, ARCHITECTURE.md |
| ARCHITECTURE.md | `doc/MD/ARCHITECTURE.md` | System/edge/API/DB/security/scaling architecture | Technical Lead | Plan.md, RESEARCH_PLAN.md |
| PRODUCT_PLAN.md | `doc/MD/PRODUCT_PLAN.md` | Personas, feature roadmap, UX, accessibility, pricing | Product Lead | Plan.md |
| EXECUTION_TRACKER.md | `doc/MD/EXECUTION_TRACKER.md` | 12-week sprint plan, deliverables, issues, demos | Project Lead | Plan.md, PRODUCT_PLAN.md |
| RISKS.md | `doc/MD/RISKS.md` | Risk register: technical / operational / social / compliance / market | Project Lead | All technical docs |
| DECISIONS.md | `doc/MD/DECISIONS.md` | ADR-style log of technology / architecture / product / partnership decisions | Project Lead | ARCHITECTURE.md, PRODUCT_PLAN.md |
| METRICS.md | `doc/MD/METRICS.md` | KPI definitions, dashboards, analytics plan | Product Lead | PRODUCT_PLAN.md |
| RETROSPECTIVE.md | `doc/MD/RETROSPECTIVE.md` | Sprint/phase retrospectives, learnings, action items | Project Lead | EXECUTION_TRACKER.md |
| implementation.md | `doc/implementation.md` | Hands-on implementation notes | Tech Lead | Codebase |
| SuraksaMarga_Overview.md | `doc/SuraksaMarga_Overview.md` | Plain-language project overview | Project Lead | — |
| Research paper | `doc/PDF/Paper/main.tex` → `main.pdf` | Academic write-up | ML Engineer | RESEARCH_PLAN.md |
| Presentation | `doc/PDF/PPT/`, `doc/DrishtiXR_5G_Hackathon2026.pptx` | Pitch decks | Project Lead | Plan.md §35–36 |

## A.2 Consistency Invariants (must hold across all docs)

1. **Risk model:** 5 weighted factors summing to 100% — Density 30 / Severity 25 / Category-max 20 / Recency 15 / Infrastructure 10 — **plus** a separate time multiplier (0.6× / 0.8× / 1.2× / 1.5×). Never describe the time multiplier as a sixth factor.
2. **Dataset:** 157,160 rows, 37 crime types, 53 Bangalore areas, 2014–2025, `dataset/final.csv`.
3. **API surface:** `/api/health`, `/api/get-routes`, `/api/safe-route`, `/api/crime-zones`, `/api/send-sos`, `/api/sos/resolve`, `/api/sos/active`, `/api/simulation/{status,set-mode,crowd-density,realtime-risk,compare}`, `/api/v1/*` (advanced-safety mocks). Do not invent new names without updating ARCHITECTURE.md and this list.
4. **Latency targets:** SOS trigger <10 ms (edge) / <20 s E2E; route + scoring <50 ms (5G edge) vs ~200–500 ms (cloud); location streaming 2 s interval.
5. **Stack:** FastAPI · PostgreSQL+PostGIS (prod) / SQLite (dev) · SQLAlchemy+GeoAlchemy2 · React Native (Expo) + `react-native-maps` · ONNX Runtime · Docker · OSRM (primary) + Google (fallback) · Twilio (SMS, mock→live).
6. **Timeline:** 12 weeks, 5 phases, treated as *prototype → production* (see §12A), not greenfield.
7. **Hackathon:** DrishtiXR 5G Hackathon 2026; 5G lab = G-Node B (WiSig network), CU/DU unit, LPRU unit.

## A.3 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | (pre-update) | Initial curated plan from requirements (`phases/`, README, `SuraksaMarga_Overview.md`) | — |
| 2.0 | May 12, 2026 | Restructured around the three interview dimensions; 5× use cases each for 5G, societal, production readiness; Part X update briefs | Strategy Team |
| 2.1 | May 12, 2026 | Aligned with `/codebase`: fixed 5-factor model (§5.1), added §12A baseline + §7.4 weights, standardised API names, documented `/api/v1/*` mocks, added Document Map / dependency order / invariants / version history; propagated to all nine supporting docs (each bumped to v1.1) | Strategy Team |

---

# CONCLUSION

This Master Strategic Update Plan transforms SurakṣāMārga.ai from a functional hackathon prototype into a comprehensive national-scale safety platform with clear pathways to production deployment, commercial viability, and societal impact.

**Key Takeaways:**

1. **5G Integration is Differentiating**: The real 5G lab infrastructure enables demonstrable technical advantage that no competitor can match in a hackathon setting.

2. **Societal Impact is the Narrative**: The problem statement resonates deeply—every woman has a story about unsafe commuting. Lead with impact, support with technology.

3. **Production in 3 Months is Achievable**: The 12-week roadmap provides clear weekly milestones with realistic deliverables. Focus on MVP features that demo well.

4. **Edge Computing is the Key**: Emphasize edge over cloud—faster response, privacy preservation, reliability. This is the 5G story.

5. **Documentation is Critical**: Update all supporting MD files per the instructions in Section 38. Consistent documentation demonstrates operational maturity.

The plan is comprehensive, realistic, and ready for execution. Every section addresses interview requirements directly while building a foundation for post-hackathon success.

---

**Document Prepared By:** SurakṣāMārga.ai Strategy Team  
**Review Status:** Final  
**Next Review:** Weekly during execution  
**Document Control:** Version 2.1 — Production Ready, aligned with `/codebase`

---

*This document serves as the master strategic reference for SurakṣāMārga.ai. All project decisions should trace back to this plan. For questions or clarifications, contact the project lead.*