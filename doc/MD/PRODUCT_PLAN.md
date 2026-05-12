# SurakṣāMārga.ai — Product Plan

## Feature Roadmap, User Experience Design, and Product Strategy

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Product Strategy Reference  
**Status:** Active Development

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1 — see §12A for the implementation baseline). Where the V1.0 MVP table below marks features "Complete", that means **a working prototype implementation exists in `/codebase`** (and screenshots in `doc/PDF/Images/`); production hardening of those features is still scheduled in the 12-week roadmap.

---

# 1. Product Vision

## 1.1 Product Definition

SurakṣāMārga.ai is a mobile navigation application that provides safety-first routing for women, leveraging real-time crime data analysis and 5G edge computing to deliver the safest possible routes between any two points.

**Core Value Proposition:** "Google Maps tells you the fastest route. We tell you the safest."

## 1.2 Product Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Safety First** | All routes scored primarily on safety, not speed |
| **Proactive Protection** | Warn users before entering dangerous areas |
| **Instant Emergency** | One-tap SOS with automatic contact notification |
| **Transparent Scoring** | Users understand why routes are marked as safe/risky |
| **Privacy by Design** | Location data encrypted, user control over data |
| **Inclusive** | Works on entry-level phones, multiple languages |

## 1.3 Product Differentiation

| Feature | SurakṣāMārga.ai | Google Maps | Safety Apps |
|---------|-----------------|-------------|--------------|
| Safety-first routing | ✓ | ✗ | ✗ |
| Crime data integration | ✓ 157K+ | ✗ | ✗ |
| Time-of-day risk | ✓ | ✗ | ✗ |
| One-tap SOS | ✓ | ✗ | ✓ (basic) |
| 5G edge computing | ✓ | ✗ | ✗ |
| Predictive alerts | ✓ | ✗ | ✗ |
| Transparent scoring | ✓ | ✗ | ✗ |

---

# 2. User Personas

## 2.1 Primary Persona: College Student

**Name:** Priya Sharma  
**Age:** 20  
**Location:** Bengaluru  
**Education:** B.Tech 2nd Year

**Profile:**
- Travels daily from PG hostel to college (3 km)
- Returns home on weekends (25 km)
- Uses public transport and walking
- Active smartphone user with moderate data plan

**Goals:**
- Reach college safely without incidents
- Find the safest route even if it takes longer
- Stay connected with family during commute
- Feel confident walking alone, especially at night

**Pain Points:**
- Google Maps often suggests shortcuts through isolated areas
- No way to know if an area is safe at night
- No quick way to alert family in emergencies
- Afraid to report safety concerns

**Product Relationship:**
- Primary target user
- Will use app daily for commute
- Highest engagement during night hours
- Potential brand ambassador

**Key Features Needed:**
- Safety-scored routes with clear explanations
- Escort mode for family monitoring
- One-tap SOS with auto-notification
- Works offline for route caching

---

## 2.2 Secondary Persona: Working Professional

**Name:** Anjali Menon  
**Age:** 28  
**Location:** Bengaluru  
**Job:** Software Engineer, IT Company

**Profile:**
- Commutes from apartment to office (8 km)
- Works late shifts occasionally
- Uses cabs and metro
- Tech-savvy with latest smartphone

**Goals:**
- Safe commute to office, especially for night shifts
- Ability to share route with family
- Quick emergency response if needed
- Integration with cab booking apps

**Pain Points:**
- Night cab routes sometimes go through dark areas
- No visibility into neighborhood safety
- Hard to trust unknown areas
- Want more safety options than just sharing location

**Product Relationship:**
- Secondary target user
- High-value user (willing to pay for premium)
- Potential enterprise client through company

**Key Features Needed:**
- Multi-modal safety routing (cab, metro, walk)
- Corporate safety integration
- Premium features (detailed analytics)
- Integration with Ola/Uber

---

## 2.3 Tertiary Persona: Parent

**Name:** Meera Krishnan  
**Age:** 45  
**Location:** Bengaluru  
**Role:** Mother of college-going daughter

**Profile:**
- Concerned about daughter's safety
- Tech-competent but not expert
- Willing to pay for daughter's safety
- Wants to stay informed without being intrusive

**Goals:**
- Ensure daughter's safe commute
- Get notified only in real emergencies
- Understand which routes are safe
- Quick access to emergency contacts

**Pain Points:**
- Cannot monitor daughter's commute in real-time
- Phone calls during commute are distracting
- Not sure which app to trust for safety
- Worried about privacy implications

**Product Relationship:**
- Secondary user (monitoring features)
- May pay for family plan
- Can recommend to other parents

**Key Features Needed:**
- Guardian/monitoring mode
- Non-intrusive alerts
- Clear safety explanations
- Family safety dashboard

---

# 3. Feature Roadmap

## 3.1 Version 1.0 — MVP (Hackathon)

**Target:** Hackathon demo, basic functionality

### Core Features

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Safe Route Search | Enter source/destination, get safest routes | P0 | Complete |
| Risk Score Display | Show safety score (0-10) for each route | P0 | Complete |
| Color-Coded Routes | Green/yellow/red for safe/moderate/risky | P0 | Complete |
| Crime Heatmap | Toggle to see crime hotspots on map | P0 | Complete |
| Time-of-Day Risk | Automatic risk adjustment based on time | P0 | Complete |
| SOS Emergency | One-tap emergency trigger | P0 | Complete |
| Emergency Screen | Live tracking, timer, contact status | P0 | Complete |
| 5G/4G Toggle | Demonstrate network difference | P1 | Complete |
| Network Metrics | Show response time by network type | P1 | Complete |

### User Experience

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              MVP USER FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. App Launch                                                                   │
│     ├── Map centered on Bengaluru                                               │
│     ├── Search bar visible at top                                               │
│     └── SOS button visible at bottom-right                                      │
│                                                                                  │
│  2. Route Search                                                                 │
│     ├── User enters source and destination                                      │
│     ├── Taps "Find Safe Routes" button                                          │
│     └── Loading indicator shows                                                 │
│                                                                                  │
│  3. Route Results                                                                │
│     ├── 3 route alternatives displayed                                          │
│     ├── Each shows: distance, time, safety score                                │
│     ├── Routes color-coded on map                                               │
│     └── User can tap to select different route                                  │
│                                                                                  │
│  4. Safety Details                                                               │
│     ├── Tapping route shows segment-by-segment breakdown                        │
│     ├── Crime details near each segment                                         │
│     └── Time-of-day impact explained                                           │
│                                                                                  │
│  5. Emergency (if needed)                                                        │
│     ├── Long-press SOS button                                                   │
│     ├── Confirmation dialog appears                                             │
│     ├── User confirms                                                            │
│     └── Emergency screen opens                                                  │
│                                                                                  │
│  6. Emergency Screen                                                             │
│     ├── Dark red theme                                                          │
│     ├── Live location coordinates displayed                                     │
│     ├── Timer shows elapsed time                                                │
│     ├── Contacts notification status                                            │
│     └── "I'm Safe" button to cancel                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Advanced / "Future" Features — Scaffolded as Demo Mocks Today

Beyond the core MVP, the prototype already exposes deterministic mock endpoints (`/api/v1/*`, in `advanced_safety.py`) that demonstrate the next wave of features. These are demo-ready but **not production implementations**; they are listed here so the product roadmap and the demo narrative stay aligned.

| Feature (demoable now via mock) | Endpoint(s) | Maps to use case | Production target |
|---------------------------------|-------------|------------------|-------------------|
| Identity-verified onboarding | `POST /api/v1/auth/verify-identity` (UI: `IdentityOnboarding.web.js`) | Trust / accountability | Real JWT auth + optional gov-ID/liveness — V1.1 |
| Offline / no-coverage SOS | `POST /api/v1/sos/offline-alert`, `GET·POST /api/v1/sos/retry-queue[/flush]` | Rural Emergency Response | Durable queue + backoff retry + SMS fallback — Week 6 |
| Enhanced SOS safety loop | `POST /api/v1/sos/trigger` · `/api/v1/sos/complete` | Night-commute, escort, "I'm Safe" closure | Real-time WSS tracking + arrival confirmation — Weeks 6–9 |
| Safe stops along route | `GET /api/v1/maps/emergency-stops` | Public transport / corridor safety | Live POI data (police, hospitals, 24h shops) — V1.1 |
| Ride-app hand-off | `POST /api/v1/rides/share-route` | Working-women night cabs | Ola/Uber deep-link/API integration — V2 |
| Proximity / nearby-help scan | `POST /api/v1/proximity/scan` | Drone-assist / community help | Edge-to-edge multi-user coordination — V2/V3 |
| Behavioural threat assessment | `POST /api/v1/threat/assess` | Predictive unsafe-zone detection | XGBoost→ONNX edge model — Week 5 |
| 4G-vs-5G SOS comparison | `GET /api/v1/simulation/compare-5g`, `GET /api/simulation/compare` | 5G flexibility demo | Real measurements on college 5G lab — Weeks 10–11 |

## 3.2 Version 1.1 — Enhanced MVP (Month 4)

**Target:** Private beta, initial user base

### New Features

| Feature | Description | Priority | Target |
|---------|-------------|----------|--------|
| User Authentication | Sign up, login, profile management | P0 | Week 14 |
| Saved Routes | Save frequent routes | P1 | Week 14 |
| Route History | View past routes with safety scores | P1 | Week 14 |
| Emergency Contacts | Manage list of emergency contacts | P0 | Week 14 |
| Offline Caching | Cache routes for offline access | P1 | Week 15 |
| Custom Risk Weights | User adjusts factor weights | P2 | Week 16 |

## 3.3 Version 2.0 — Production (Month 5-6)

**Target:** Public launch, broader user base

### New Features

| Feature | Description | Priority | Target |
|---------|-------------|----------|--------|
| Escort Mode | Real-time monitoring for guardians | P0 | Week 18 |
| Analytics Dashboard | Personal safety insights | P1 | Week 20 |
| Multi-City Support | Expand beyond Bengaluru | P0 | Week 20 |
| Wearable Integration | Smart watch panic button | P2 | Week 22 |
| Corporate Safety | Enterprise employee safety | P1 | Week 24 |
| Public Safety API | Data sharing with government | P2 | Week 24 |

## 3.4 Version 3.0 — Scale (Month 7-12)

**Target:** National presence, platform ecosystem

### New Features

| Feature | Description | Priority | Target |
|---------|-------------|----------|--------|
| Predictive Safety | ML-based threat prediction | P0 | Month 8 |
| Smart City Integration | Connect to city infrastructure | P1 | Month 9 |
| Voice Navigation | Voice-guided safety routing | P1 | Month 10 |
| AR Safety Overlay | Camera-based safety indicators | P2 | Month 11 |
| International Expansion | First international market | P1 | Month 12 |

---

# 4. UX Design Guidelines

## 4.1 Design Principles

### 4.1.1 Safety-Centric Design

All UI decisions prioritize user safety:

1. **Critical information at glance:** Safety scores visible within 2 seconds
2. **Clear emergency access:** SOS button always visible, reachable with one hand
3. **Minimal cognitive load:** Simple, focused interface during emergencies
4. **Accessible colors:** Color-blind friendly palette for route safety indicators

### 4.1.2 Trust-Building Design

1. **Transparency:** Show why routes are marked safe/risky
2. **Consistency:** Same UI patterns throughout
3. **Reliability:** App works when needed most
4. **Privacy control:** Clear privacy indicators and controls

## 4.2 UI Component Library

### 4.2.1 Navigation Components

| Component | States | Behavior |
|-----------|--------|----------|
| SearchInput | Empty, Typing, Loading, Results | Auto-complete, recent searches |
| RouteCard | Default, Selected, Loading | Tap to select, swipe for details |
| MapView | Default, Routing, Emergency | Zoom to route, show heatmap |
| BottomSheet | Collapsed, Expanded | Swipe up for route details |

### 4.2.2 Safety Indicators

| Component | States | Description |
|-----------|--------|-------------|
| RiskBadge | Safe (green), Moderate (yellow), High (red), Critical (dark red) | Shows route safety score |
| NetworkBadge | 3G, 4G, 5G, Edge | Current network indicator |
| TimeContextBadge | Morning, Afternoon, Evening, Night | Shows current time risk |
| AlertBanner | Info, Warning, Danger | Contextual safety alerts |

### 4.2.3 Emergency Components

| Component | States | Description |
|-----------|--------|-------------|
| SOSButton | Default, Pressed, Triggering, Active | Long-press to trigger |
| EmergencyTimer | Running, Stopped | Shows elapsed emergency time |
| ContactStatus | Pending, Sent, Delivered | Shows contact notification status |
| LocationDisplay | Updating, Fixed | Shows current GPS coordinates |

## 4.3 Color System

### 4.3.1 Safety Colors

| Level | Color | Hex Code | Meaning |
|-------|-------|----------|---------|
| Safe | Green | #4CAF50 | Safety score 7-10 |
| Moderate | Yellow | #FFC107 | Safety score 4-6.9 |
| High | Orange | #FF9800 | Safety score 2-3.9 |
| Critical | Red | #F44336 | Safety score 0-1.9 |

### 4.3.2 UI Colors

| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | Deep Blue | #1A237E |
| Secondary | Teal | #00695C |
| Background | White | #FFFFFF |
| Surface | Light Gray | #F5F5F5 |
| Text Primary | Dark Gray | #212121 |
| Text Secondary | Medium Gray | #757575 |
| Emergency | Dark Red | #B71C1C |

---

# 5. Accessibility Standards

## 5.1 Accessibility Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| Screen Reader | WCAG 2.1 AA | All interactive elements labeled |
| Color Contrast | 4.5:1 minimum | All text meets contrast ratio |
| Touch Targets | 48x48dp minimum | All buttons adequately sized |
| Text Scaling | 200% support | UI scales with system font size |
| Voice Output | TalkBack/VoiceOver | Route guidance spoken |

## 5.2 Device Compatibility

| Device Category | Support Level | Notes |
|----------------|---------------|-------|
| High-end (2022+) | Full | All features optimized |
| Mid-range (2020-21) | Full | May have slightly reduced animations |
| Entry-level (pre-2020) | Basic | Core features work, simplified UI |
| iOS 14+ | Full | iPhone 8 and newer |
| Android 8+ | Full | 2GB RAM minimum |

## 5.3 Language Support

| Language | Status | Coverage |
|----------|--------|----------|
| English | Primary | 100% UI |
| Hindi | Secondary | 80% UI (V2) |
| Kannada | Tertiary | 50% UI (V2) |
| Telugu | Future | Planned V3 |
| Tamil | Future | Planned V3 |

---

# 6. Product Metrics

## 6.1 User Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users (DAU) | 40% of MAU | Analytics |
| Session Length | >3 minutes | In-app tracking |
| Routes per User/Week | >10 | Database |
| SOS Awareness | 90% know where button is | User survey |

## 6.2 Conversion Metrics

| Metric | Target | Funnel |
|--------|--------|--------|
| App Install → Signup | >70% | Install → Signup |
| Signup → First Route | >60% | Signup → Route search |
| Route Search → SOS Knowledge | >80% | Demo walkthrough |
| NPS Score | >50 | Quarterly survey |

## 6.3 Safety Impact Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Routes Taken Safely | 1M+ | Analytics |
| SOS Triggers Handled | 100% | System |
| User-Reported Incidents | <0.1% of sessions | User reports |
| Emergency Response Time | <20s average | System logs |

---

# 7. Product-Market Fit Strategy

## 7.1 Initial Target Market

### 7.1.1 College Campus Safety (Primary)

**Market Size:**
- 50,000+ colleges in India
- 20M+ female college students
- Growing safety concerns post-pandemic

**Go-to-Market:**
1. Partner with 3-5 colleges in Bengaluru for pilot
2. Provide free or subsidized access
3. Gather usage data and feedback
4. Expand to more colleges

**Success Metrics:**
- 10,000 active users within 6 months
- 3+ college partnerships
- 80%+ daily usage among installed users

### 7.1.2 Working Women (Secondary)

**Market Size:**
- 15M+ working women in urban India
- High willingness to pay for safety
- Night shift workers particularly underserved

**Go-to-Market:**
1. Partner with IT companies for employee safety
2. Offer corporate licensing
3. Integrate with employee transport systems

**Success Metrics:**
- 5 enterprise pilot programs
- 5,000+ corporate users

## 7.2 Pricing Strategy

### 7.2.1 Consumer Pricing

| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | Basic routing, heatmap, basic SOS |
| Premium | ₹49/month | Full analytics, offline, priority support |
| Family | ₹99/month | Up to 5 family members, escort mode |

### 7.2.2 Enterprise Pricing

| Tier | Price | Features |
|------|-------|----------|
| Campus | ₹10/student/year | College branding, admin panel, analytics |
| Corporate | ₹50/employee/month | Employee safety, integrations, support |
| Government | Custom | City-wide deployment, API access, SLA |

---

# 8. Competitive Landscape

## 8.1 Competitive Analysis

| Competitor | Strengths | Weaknesses | SurakṣāMārga.ai Advantage |
|------------|-----------|------------|--------------------------|
| Google Maps | Scale, accuracy | No safety focus | Safety-first routing |
| Apple Maps | iOS integration | Limited safety features | Dedicated safety features |
| Safetipin | Safety focus | No routing, reactive | Proactive routing |
| bSafe | Emergency features | No AI, basic tech | AI-powered, 5G edge |
| SheSafe | Women-focused | Limited features | Full platform |

## 8.2 Moat (Competitive Advantage)

1. **First-mover in safety-first routing** — No existing product does this
2. **Proprietary crime dataset** — 157K+ records uniquely processed
3. **5G edge infrastructure** — No competitor has this
4. **Domain expertise** — Deep understanding of women's safety
5. **Community trust** — Built for women, by women

---

# 9. Roadmap Timeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             PRODUCT ROADMAP TIMELINE                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Q2 2026 (Hackathon)                                                            │
│  ├── Month 1: MVP Development                                                   │
│  ├── Month 2: Integration & Testing                                             │
│  └── Month 3: Demo & Launch                                                    │
│                                                                                  │
│  Q3 2026 (Beta)                                                                 │
│  ├── Month 4: User Authentication, Saved Routes                                 │
│  ├── Month 5: Beta Launch (1000 users)                                          │
│  └── Month 6: Iterate Based on Feedback                                         │
│                                                                                  │
│  Q4 2026 (Launch)                                                               │
│  ├── Month 7: Public Launch                                                     │
│  ├── Month 8: Predictive Safety Features                                        │
│  ├── Month 9: Multi-City Expansion (3 cities)                                  │
│  └── Month 10: Corporate Pilots                                                │
│                                                                                  │
│  2027 (Scale)                                                                   │
│  ├── Q1: 10+ Cities, Enterprise Launch                                          │
│  ├── Q2: Wearable Integration                                                  │
│  ├── Q3: Smart City Integration                                                │
│  └── Q4: International Expansion (pilot)                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 10. Appendix

## 10.1 Product Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Master strategic plan | /doc/MD/Plan.md (v2.1) | Source of truth — incl. §12A implementation baseline |
| User Stories / features | /doc/MD/PRODUCT_PLAN.md | This document |
| UI screenshots | /doc/PDF/Images/ | Captured prototype screens (landing, login, map, route cards, safe-route, safety-loop) |
| API Specs | /codebase/backend → `/docs` (Swagger), `/redoc` | Live backend endpoints |
| Architecture | /doc/MD/ARCHITECTURE.md | Endpoint table incl. `/api/v1/*` mocks |
| Analytics Plan | /doc/MD/METRICS.md | Metrics & dashboards |

## 10.2 Feature Dependencies

| Feature | Depends On | Blocks |
|---------|-----------|--------|
| Safe Route Search | Route API, Risk Engine | All other features |
| SOS Emergency | Location Service, Contacts | Escort Mode |
| User Authentication | Database | Saved Routes, History |
| Escort Mode | SOS Emergency | - |
| Analytics | User Auth, Route History | - |

---

## 10.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial product plan from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: clarified "Complete" = prototype exists, added "Advanced/Future Features — Scaffolded as Demo Mocks" table mapping `/api/v1/*` to use cases, refreshed §10.1 doc references |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Monthly
- Owner: Product Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Product Plan aligns with the execution roadmap and technical architecture from the master planning documents.*