# SurakṣāMārga.ai — Master Plan

## 5G-Enabled AI Navigation System for Women Safety

**Hackathon:** DrishtiXR 5G Hackathon 2026  
**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Project Master Document  
**Status:** Active Reference

> **Source of truth:** This document is derived from `doc/MD/Plan.md` (v2.1). If the two ever disagree, `Plan.md` wins — see its Appendix "Document Map & Consistency Invariants".

---

# 1. Executive Summary

This Master Plan serves as the definitive reference document for the SurakṣāMārga.ai project. It establishes the overarching strategic direction, defines key objectives, and provides a comprehensive roadmap for transforming the project from a hackathon prototype into a production-ready national safety platform.

SurakṣāMārga.ai represents a groundbreaking initiative in women's urban safety—a problem that affects millions of women daily but has been inadequately addressed by existing technology solutions. By leveraging the transformative capabilities of 5G edge computing combined with sophisticated AI-driven risk assessment, this project aims to fundamentally change how women navigate urban spaces.

**This is not a greenfield project.** A working prototype already exists in `/codebase` — a FastAPI backend (routing, crime heatmap, SOS, 5G simulation, and `/api/v1/*` advanced-safety mocks), a React Native/Expo frontend (map, route details, emergency screen, plus a parallel `.web.js` track and a landing site), and a 157,160-row Bangalore crime dataset. The 12-week roadmap (§6.1) is a *harden-and-productionize* plan layered on that baseline; see `Plan.md` §12A "Current Implementation Baseline" for the full inventory.

---

# 2. Project Overview

## 2.1 Project Identity

**Project Name:** SurakṣāMārga.ai (Sanskrit: सुरक्षा मार्ग — "Safe Path")

**Tagline:** "Google Maps tells you the fastest route. We tell you the safest."

**Project Type:** 5G-Enabled AI Navigation System for Women Safety

**Hackathon:** DrishtiXR 5G Hackathon 2026

## 2.2 Core Value Proposition

SurakṣāMārga.ai is the world's first AI-powered navigation platform that prioritizes safety over speed. By integrating real crime data from 157,000+ historical incident records with 5G edge computing capabilities, the system delivers:

- **Safety-first route optimization** that analyzes every route segment for potential danger
- **Real-time threat detection** with sub-20ms response times via 5G edge infrastructure
- **One-tap emergency response** with automatic contact notification and location tracking
- **Predictive safety intelligence** using machine learning to anticipate emerging threats

---

# 3. Vision and Mission

## 3.1 Vision Statement

**SurakṣāMārga.ai envisions a world where no woman ever compromises her safety for convenience.** We are building the world's first AI-powered safety-first navigation platform that leverages real 5G infrastructure to deliver sub-50ms emergency response, predictive threat detection, and intelligent route optimization—transforming every journey from a potential vulnerability into a secured passage.

## 3.2 Mission Statement

To create a ubiquitous safety infrastructure that empowers women to navigate urban spaces with confidence through:

- **Real-time threat intelligence** powered by 5G edge computing
- **Predictive crime analytics** using 157,000+ historical incident records
- **Instant emergency escalation** with sub-10-second response pipelines
- **Ethical AI governance** ensuring privacy, transparency, and inclusivity
- **Scalable deployment** from college campuses to smart city ecosystems

---

# 4. Strategic Goals

## 4.1 Short-Term Goals (0-3 Months — Hackathon Phase)

| Goal | Description | Success Criteria |
|------|-------------|------------------|
| **Functional Prototype** | Working mobile app with core routing and SOS | Demo at hackathon |
| **5G Integration** | Demonstrate 5G vs 4G latency difference | Live demo with metrics |
| **Data Foundation** | 157K crime records loaded, risk engine operational | API responding |
| **Team Formation** | Skilled team with clear roles | All positions filled |

## 4.2 Medium-Term Goals (3-12 Months — MVP to V1)

| Goal | Description | Success Criteria |
|------|-------------|------------------|
| **MVP Launch** | Core features in production | 1000+ users |
| **Enterprise Pilot** | College campus deployment | 3+ college partnerships |
| **City Expansion** | Multi-city data integration | 5 major cities |
| **Revenue Initiation** | First revenue generation | B2B or B2C pilot |

## 4.3 Long-Term Goals (1-3 Years — Scale Phase)

| Goal | Description | Success Criteria |
|------|-------------|------------------|
| **National Presence** | Pan-India deployment | 50+ cities |
| **Platform Ecosystem** | Multi-feature safety platform | Multiple revenue streams |
| **Government Partnership** | Official safety initiative | Government contract |
| **International Expansion** | Global market entry | First international market |

---

# 5. Technology Strategy

## 5.1 Technology Stack Overview

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | React Native (Expo) | Cross-platform, rapid development |
| **Backend** | FastAPI (Python) | High performance, async, auto-docs |
| **Database** | PostgreSQL + PostGIS | Spatial queries, 157K records |
| **AI/ML** | XGBoost, ONNX Runtime | Edge inference, risk scoring |
| **Infrastructure** | Docker, Cloud + Edge | Scalable deployment |
| **Maps** | react-native-maps | Google Maps SDK |

## 5.2 5G Integration Strategy

The project leverages the college's 5G lab infrastructure as a genuine testbed:

- **G-Node B (WISIG Network):** Primary radio access for 5G connectivity
- **CU/DU Unit:** Core network processing for emergency sessions
- **LPRU Unit:** Radio transmission for high-bandwidth location streaming
- **Network Slicing:** Dedicated slice for SOS traffic with priority queuing
- **Edge Computing:** Docker container deployment for sub-10ms latency

---

# 6. Product Roadmap

## 6.1 Version 1.0 — Hackathon MVP (Month 1-3)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              VERSION 1.0 MILESTONES                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Month 1 (Weeks 1-4)                                                             │
│  ├── Week 1: Infrastructure Setup                                               │
│  │   ├── 5G edge node configuration                                             │
│  │   ├── PostgreSQL + PostGIS deployment                                        │
│  │   └── Basic API server running                                              │
│  ├── Week 2: Core API Development                                              │
│  │   ├── Route fetching endpoints (OSRM/Google)                                │
│  │   ├── Crime zone aggregation                                                │
│  │   └── Basic risk calculation                                                │
│  ├── Week 3: 5G Edge Integration                                               │
│  │   ├── Docker container deployment on edge                                   │
│  │   ├── Latency benchmarking setup                                            │
│  │   └── Network slicing demonstration                                         │
│  └── Week 4: Risk Engine Development                                           │
│      ├── 5-factor scoring algorithm                                            │
│      ├── Time-of-day multiplier logic                                          │
│      └── Segment-level analysis                                                │
│                                                                                  │
│  Month 2 (Weeks 5-8)                                                            │
│  ├── Week 5: ML Integration                                                    │
│  │   ├── Threat detection model integration                                    │
│  │   ├── Crowd prediction model                                               │
│  │   └── Real-time alert pipeline                                              │
│  ├── Week 6: SOS Pipeline                                                      │
│  │   ├── Emergency trigger endpoint                                            │
│  │   ├── Contact notification system                                           │
│  │   └── Location tracking flow                                                │
│  ├── Week 7: Mobile App Core                                                   │
│  │   ├── React Native project setup                                            │
│  │   ├── Map integration                                                       │
│  │   └── Search input component                                                │
│  └── Week 8: Route Display                                                     │
│      ├── Route polyline rendering                                              │
│      ├── Risk color coding                                                      │
│      └── Route selection flow                                                  │
│                                                                                  │
│  Month 3 (Weeks 9-12)                                                          │
│  ├── Week 9: Emergency Features                                               │
│  │   ├── SOS button component                                                  │
│  │   ├── Emergency screen                                                      │
│  │   └── Location service integration                                          │
│  ├── Week 10: Integration Testing                                             │
│  │   ├── End-to-end flow testing                                              │
│  │   ├── Security audit                                                        │
│  │   └── Performance optimization                                             │
│  ├── Week 11: 5G Demo Preparation                                              │
│  │   ├── 5G lab demo environment                                              │
│  │   ├── Comparison metrics                                                    │
│  │   └── Demo script creation                                                  │
│  └── Week 12: Final Polish                                                    │
│      ├── Documentation complete                                               │
│      ├── Pitch deck ready                                                      │
│      └── Deployment verification                                              │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Version 2.0 — Production (Month 4-6)

- Enhanced ML models for better accuracy
- User authentication and profiles
- Analytics dashboard
- Enterprise features (admin panel)
- Performance optimization

## 6.3 Version 3.0 — Scale (Month 7-12)

- Multi-city deployment
- Predictive safety features
- Wearable integration
- Government integration
- International expansion preparation

---

# 7. Team Structure

## 7.1 Core Team Roles

| Role | Count | Responsibilities |
|------|-------|------------------|
| **Project Lead** | 1 | Overall coordination, pitch, stakeholder management |
| **Backend Developer** | 2 | API development, risk engine, database |
| **Frontend Developer** | 2 | React Native app, UI/UX |
| **DevOps/5G Specialist** | 1 | 5G lab integration, deployment |
| **ML Engineer** | 1 | ML models, predictions, ONNX deployment |
| **UX Designer** | 1 | User interface, demo preparation |

## 7.2 Skills Matrix

| Skill | Required Level | Team Coverage |
|-------|---------------|---------------|
| Python/FastAPI | Advanced | 2+ members |
| React Native | Intermediate | 2+ members |
| PostgreSQL/PostGIS | Intermediate | 2+ members |
| 5G/Networking | Basic | 1+ member |
| ML/XGBoost | Intermediate | 1+ member |
| Docker/K8s | Basic | 1+ member |

## 7.3 Communication Protocol

- **Daily Standups:** 15 minutes, every day at designated time
- **Weekly Sync:** 60 minutes, review progress and plan next sprint
- **Ad-hoc:** As needed via team chat for blockers and quick questions

---

# 8. Key Performance Indicators

## 8.1 Technical KPIs

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| API Uptime | 99.9% | Monitoring dashboard |
| Response Time P95 | <200ms | Application Performance Monitoring |
| SOS Latency | <20s | End-to-end test |
| Crash Rate | <1% | Bugsnag/Error tracking |
| Build Success | 100% | CI/CD pipeline |

## 8.2 Business KPIs

| Metric | Target | Timeframe |
|--------|--------|-----------|
| User Acquisition | 10,000+ users | 3 months |
| Daily Active Users | 40% of MAU | Monthly |
| User Retention | 60% (30-day) | Cohort analysis |
| Net Promoter Score | 50+ | User survey |
| Safety Incidents | 0 during use | User reports |

## 8.3 Impact KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Routes Taken Safely | 1M+ | Analytics platform |
| SOS Triggers Handled | 1000+ | System logs |
| User Safety Rating | 4.5+ stars | App store reviews |
| Press Mentions | 10+ | PR tracking |
| Government Interest | 3+ meetings | Business development |

---

# 9. Risk Register Overview

| Risk Category | Key Risks | Mitigation |
|---------------|-----------|------------|
| **Technical** | 5G lab unavailable, ML model inaccurate, DB performance | Simulated fallback, human validation, indexing |
| **Operational** | Team availability, scope creep, technical debt | Clear ownership, weekly scope review |
| **Social** | Privacy backlash, area stigmatization, false security | Transparent policies, context-aware messaging |

---

# 10. Stakeholder Management

## 10.1 Internal Stakeholders

| Stakeholder | Interest | Engagement Strategy |
|-------------|----------|-------------------|
| Team Members | Career growth, skill development | Regular feedback, recognition |
| Project Lead | Project success | Full authority, resources |

## 10.2 External Stakeholders

| Stakeholder | Interest | Engagement Strategy |
|-------------|----------|-------------------|
| Hackathon Judges | Innovation, feasibility | Strong demo, technical depth |
| College (5G Lab) | Research, infrastructure | Partnership, acknowledgment |
| Future Users | Safety, usability | Beta testing, feedback loops |
| Government | Public safety, policy alignment | Policy papers, pilot proposals |
| Investors | ROI, scalability | Business case, traction |

---

# 11. Budget Overview

## 11.1 Initial Budget (Hackathon Phase)

| Category | Estimated Cost | Notes |
|----------|---------------|-------|
| Cloud Infrastructure | ₹5,000/month | AWS/GCP basic tier |
| Domain & SSL | ₹2,000/year | Production domain |
| API Keys | ₹0 | OSRM free, Google limited |
| Development Tools | ₹0 | Open source |
| Team | Unpaid (hackathon) | Founders commitment |

## 11.2 Post-Hackathon Funding Requirements

| Phase | Estimated Amount | Source |
|-------|------------------|--------|
| MVP Launch | ₹5-10 Lakhs | Bootstrapping, grants |
| Scale Up | ₹50 Lakhs - 2 Crore | Seed funding, government |
| Expansion | ₹10+ Crore | Series A, partnerships |

---

# 12. Success Criteria

## 12.1 Hackathon Success Metrics

| Criterion | Definition |
|-----------|------------|
| **Working Demo** | All features functional during presentation |
| **Technical Depth** | 5G integration convincingly demonstrated |
| **Social Impact** | Clear problem-solution narrative with data |
| **Scalability** | Path to production clearly articulated |
| **Team Presentation** | Compelling, confident delivery |

## 12.2 Post-Hackathon Success

| Criterion | Definition |
|-----------|------------|
| **Team Continuation** | Core team remains together |
| **Funding Raised** | Seed round or government grant |
| **User Base** | 1,000+ active users |
| **Partnership** | Government or enterprise contract |
| **Product Version** | V1 officially launched |

---

# 13. Appendix

## 13.1 Document References

| Document | Location | Purpose |
|----------|----------|---------|
| Plan.md | /doc/MD/Plan.md | Master strategic update (v2.1) — single source of truth |
| RESEARCH_PLAN.md | /doc/MD/RESEARCH_PLAN.md | 5G research, ML methodology, spatial analysis, benchmarks |
| ARCHITECTURE.md | /doc/MD/ARCHITECTURE.md | System / edge / API / DB / security / scaling architecture |
| PRODUCT_PLAN.md | /doc/MD/PRODUCT_PLAN.md | Personas, feature roadmap, UX, accessibility, pricing |
| EXECUTION_TRACKER.md | /doc/MD/EXECUTION_TRACKER.md | 12-week sprint tracking, deliverables, demos |
| RISKS.md | /doc/MD/RISKS.md | Risk register and mitigation |
| DECISIONS.md | /doc/MD/DECISIONS.md | Decision log (ADR-style) |
| METRICS.md | /doc/MD/METRICS.md | KPIs, dashboards, analytics plan |
| RETROSPECTIVE.md | /doc/MD/RETROSPECTIVE.md | Sprint/phase retrospectives |
| implementation.md | /doc/implementation.md | Hands-on implementation notes |
| SuraksaMarga_Overview.md | /doc/SuraksaMarga_Overview.md | Plain-language overview |
| Research paper | /doc/PDF/Paper/main.tex | Academic write-up |
| Presentation | /doc/DrishtiXR_5G_Hackathon2026.pptx, /doc/PDF/PPT/ | Pitch decks |

## 13.2 Contact Information

| Role | Name | Contact |
|------|------|---------|
| Project Lead | [To be filled] | [To be filled] |
| Technical Lead | [To be filled] | [To be filled] |

## 13.3 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | May 12, 2026 | Initial creation from Plan.md v2.0 | AI |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added hackathon name + "source of truth" note, prototype-baseline paragraph in §1, expanded §13.1 document references to all docs | AI |

---

**Document Control:**

- This document is the primary reference for all project decisions; `Plan.md` is the upstream source of truth
- All strategic changes must be documented here and propagated per `Plan.md` Part X dependency order
- Monthly review and updates required
- Next scheduled review: June 12, 2026

---

*This Master Plan aligns with the strategic vision established in Plan.md and provides the operational framework for execution.*