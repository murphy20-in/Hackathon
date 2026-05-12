# SurakṣāMārga.ai — Retrospective Document

## Lessons Learned, Improvements, and Team Reflections

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Team Learning Reference  
**Status:** Active Retrospectives

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1). v1.1 adds §3.0 "Sprint 0 — Prototype Baseline Retrospective" capturing what was learned building the `/codebase` prototype (per `Plan.md` §12A). The Sprint 1–6 entries below remain *forward-looking templates* to be filled in during execution.

---

# 1. Retrospective Overview

## 1.1 Purpose

The retrospective document captures lessons learned, improvements made, and team reflections throughout the project lifecycle. It serves as:

1. **Learning repository:** Document what worked and what didn't
2. **Improvement tracker:** Track action items from retrospectives
3. **Team memory:** Preserve knowledge for future projects
4. **Process reference:** Guide future decision-making

## 1.2 Retrospective Schedule

| Type | Frequency | Duration | Participants |
|------|-----------|----------|---------------|
| **Sprint Retrospective** | Every 2 weeks | 60 minutes | Full team |
| **Phase Retrospective** | End of each phase | 90 minutes | Full team + mentors |
| **Project Retrospective** | End of project | Half day | Full team |
| **Ad-hoc** | As needed | 30 minutes | Affected members |

---

# 2. Retrospective Framework

## 2.1 Format: Start-Stop-Continue

Each retrospective uses the Start-Stop-Continue framework:

| Category | Description | Questions |
|----------|-------------|-----------|
| **Start** | New actions to take | What should we start doing? |
| **Stop** | Actions to discontinue | What should we stop doing? |
| **Continue** | What works well | What should we keep doing? |

## 2.2 Additional Dimensions

Beyond Start-Stop-Continue, we also reflect on:

- **What went well:** Celebrate successes
- **What didn't go well:** Acknowledge challenges
- **What surprised us:** Unexpected outcomes
- **What we learned:** New insights

---

# 3. Sprint Retrospectives

## 3.0 Sprint 0 — Prototype Baseline Retrospective (Pre-Week 1)

**Scope:** Building the working prototype now in `/codebase` (FastAPI backend, RN/Expo + web frontend, 157K crime dataset, `/api/v1/*` advanced-safety mocks). This is real, completed work — see `Plan.md` §12A.

### 3.0.1 What Went Well

| Item | Details |
|------|---------|
| End-to-end vertical slice early | Routing → 5-factor scoring → map render → SOS works as one flow; de-risked the core value prop |
| Deterministic mocks for "future" features | `/api/v1/*` (identity, offline SOS, proximity, threat-assess, ride-share, emergency stops, 4G/5G compare) let the demo tell the whole story without flaky external deps |
| 5-factor engine clean & explainable | `CRIME_WEIGHTS` + density/severity/category-max/recency/infra + time multiplier — easy to reason about and tune |
| Web build alongside RN | `.web.js` track + webpack ⇒ trivially shareable demo (link/projector); RN stays the real product |
| Data pipeline | Monthly CSVs → `processed/` → `final.csv` (157,160 rows) with fix-coords/analyze scripts is reproducible |
| Simulation layer | `crowd_simulator` / `realtime_simulator` / `simulation/*` give a believable 5G-vs-4G story before the lab is wired |

### 3.0.2 What Didn't Go Well / Watch-Outs

| Item | Details | Carried into |
|------|---------|--------------|
| SQLite chosen for speed of dev | Production needs PostgreSQL+PostGIS; risk of PostGIS-only SQL leaking into dev | RISK T-011; EXEC W1 |
| Several capabilities are mocks | Could be mistaken for "shipped" if not labelled everywhere | RISK T-010; labels added across all docs |
| Dual frontend (`.js` / `.web.js`) | Two presentation layers can drift | RISK T-013; share logic via `src/services` |
| Thin test coverage | Only `tests/test_api.py` smoke tests | METRICS §6.3; EXEC W4 & W10 |
| No real auth yet | `verify-identity` is a mock; no user/contacts tables | DECISION P-005; PRODUCT V1.1 |
| Docs had drifted from code | Plan used invented endpoint names; 5-factor description didn't sum to 100% | Fixed in Plan v2.1; this alignment pass |

### 3.0.3 Action Items (carried forward)

| Action | Owner | Status | Tracked in |
|--------|-------|--------|------------|
| Migrate SQLite → PostgreSQL/PostGIS, CI on PostGIS | Backend / DevOps | Pending | EXEC W1 |
| Train ThreatDetector (XGBoost→ONNX), swap into `/api/v1/threat/assess` | ML Engineer | Pending | EXEC W5 |
| Train CrowdPredictor (LSTM), promote `crowd_simulator` outputs | ML Engineer | Pending | EXEC W5–W6 |
| Durable offline-SOS queue + retry/backoff + SMS fallback | Backend | Pending | EXEC W6 |
| Twilio mock → live | Backend | Pending | EXEC W6 |
| Wire native (`.js`) screens to hardened API | Frontend | Pending | EXEC W7–W9 |
| Raise backend coverage >80% | Backend / QA | Pending | METRICS §6.3 |
| Keep all mocks labelled in code + docs + demo script | All | Ongoing | RISK T-010 |
| Real 5G-lab latency measurements (G-Node B / CU-DU / LPRU) | DevOps | Pending | EXEC W10–W11 |

---

## 3.1 Sprint 1 Retrospective (Week 1-2)

**Date:** [To be filled after Sprint 1]  
**Sprint Goal:** Infrastructure setup and basic API

### 3.1.1 What Went Well

| Item | Details |
|------|---------|
| Team coordination | Daily standups effective, good communication |
| Setup pace | Database setup completed faster than expected |
| Documentation | README and setup guides clear |

### 3.1.2 What Didn't Go Well

| Item | Details |
|------|---------|
| 5G lab access | Delayed - waiting on credentials |
| Task distribution | Some imbalances in workload |

### 3.1.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Follow up on 5G lab access | DevOps | Pending |
| Re-balance task assignments | Project Lead | Pending |

---

## 3.2 Sprint 2 Retrospective (Week 3-4)

**Date:** [To be filled after Sprint 2]  
**Sprint Goal:** Risk engine development

### 3.2.1 What Went Well

| Item | Details |
|------|---------|
| Algorithm implementation | 5-factor model working correctly |
| Testing coverage | 85% code coverage achieved |

### 3.2.2 What Didn't Go Well

| Item | Details |
|------|---------|
| API integration delays | OSRM rate limiting caused issues |
| Documentation | Some gaps in API docs |

### 3.2.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Add caching for OSRM | Backend | Pending |
| Complete API documentation | Backend | Pending |

---

## 3.3 Sprint 3 Retrospective (Week 5-6)

**Date:** [To be filled after Sprint 3]  
**Sprint Goal:** ML integration and SOS pipeline

### 3.3.1 What Went Well

| Item | Details |
|------|---------|
| ONNX model deployment | Smooth transition |
| SOS flow | Works end-to-end |

### 3.3.2 What Didn't Go Well

| Item | Details |
|------|---------|
| ML accuracy | Below target (78% vs 80%) |
| Frontend-backend sync | Some miscommunication |

### 3.3.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Fine-tune ML model | ML Engineer | Pending |
| Better sync meetings | Team | Pending |

---

## 3.4 Sprint 4 Retrospective (Week 7-8)

**Date:** [To be filled after Sprint 4]  
**Sprint Goal:** Mobile app core features

### 3.4.1 What Went Well

| Item | Details |
|------|---------|
| React Native setup | Smooth, no major issues |
| Map integration | Working well |

### 3.4.2 What Didn't Go Well

| Item | Details |
|------|---------|
| Performance on older devices | Some lag with heatmap |
| Build issues | Had to rebuild multiple times |

### 3.4.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Optimize map rendering | Frontend | Pending |
| Set up better build process | DevOps | Pending |

---

## 3.5 Sprint 5 Retrospective (Week 9-10)

**Date:** [To be filled after Sprint 5]  
**Sprint Goal:** Emergency features and integration

### 3.5.1 What Went Well

| Item | Details |
|------|---------|
| SOS implementation | Complete and tested |
| Integration testing | Found and fixed many issues |

### 3.5.2 What Didn't Go Well

| Item | Details |
|------|---------|
| Bug backlog | Some regression bugs |
| Time pressure | Less time for polish |

### 3.5.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Fix outstanding bugs | QA + Dev | Pending |
| Prioritize polish tasks | Project Lead | Pending |

---

## 3.6 Sprint 6 Retrospective (Week 11-12)

**Date:** [To be filled after Sprint 6]  
**Sprint Goal:** Demo preparation and final polish

### 3.6.1 What Went Well

| Item | Details |
|------|---------|
| Demo readiness | All features working for demo |
| Team collaboration | Great teamwork under pressure |

### 3.6.2 What Didn't Go Well

| Item | Details |
|------|---------|
| Some features cut | Had to prioritize for demo |
| Documentation incomplete | Some docs still pending |

### 3.6.3 Action Items

| Action | Owner | Status |
|--------|-------|--------|
| Complete post-hackathon docs | Team | Pending |
| Plan V2 features | Product Lead | Pending |

---

# 4. Technical Learnings

## 4.1 What Worked Well

### 4.1.1 Technology

| Technology | Why It Worked |
|------------|---------------|
| FastAPI | Great performance, easy to use |
| PostgreSQL + PostGIS | Excellent spatial query performance |
| React Native + Expo | Fast development, easy builds |
| Docker | Consistent deployments |

### 4.1.2 Process

| Practice | Why It Worked |
|----------|---------------|
| Daily standups | Kept everyone aligned |
| Code reviews | Caught issues early |
| Small sprints | Maintained focus |

---

## 4.2 What Didn't Work Well

### 4.2.1 Technology

| Technology | Issue | Lesson |
|------------|-------|--------|
| OSRM rate limits | Unexpected throttling | Need backup providers |
| Heatmap rendering | Performance on older devices | Need optimization |
| Large ML models | Slow edge deployment | Use ONNX quantization |

### 4.2.2 Process

| Practice | Issue | Lesson |
|----------|-------|--------|
| Task estimation | Underestimated time | Add buffers |
| Documentation | Often delayed | Write as you go |
| Testing | Limited time for QA | Automate more |

---

## 4.3 Surprises

### 4.3.1 Positive Surprises

| Item | Impact |
|------|--------|
| FastAPI documentation | Saved development time |
| 5G simulation | Good enough for demo |
| Team collaboration | Better than expected |

### 4.3.2 Negative Surprises

| Item | Impact |
|------|--------|
| OSRM rate limits | Required workarounds |
| Map rendering performance | Needed optimization |

---

# 5. Process Improvements

## 5.1 Identified Improvements

### 5.1.1 Development Process

| Improvement | Priority | Status |
|-------------|----------|--------|
| Add automated testing | High | Pending |
| Better task estimation | Medium | Pending |
| More documentation | Medium | Pending |

### 5.1.2 Communication

| Improvement | Priority | Status |
|-------------|----------|--------|
| Regular sync meetings | High | Implemented |
| Better task tracking | Medium | Pending |

---

## 5.2 Implementation Plan

| Improvement | Owner | Timeline |
|-------------|-------|----------|
| Automated tests | Backend + QA | Post-hackathon |
| Estimation calibration | Project Lead | Ongoing |
| Documentation process | Team | Immediate |

---

# 6. Team Feedback

## 6.1 Individual Reflections

### 6.1.1 Team Member 1 - [Role: Backend Developer]

**Strengths to continue:**
- Clear task assignments
- Good technical decisions

**Areas to improve:**
- Earlier identification of blockers

---

### 6.1.2 Team Member 2 - [Role: Frontend Developer]

**Strengths to continue:**
- Quick bug fixes
- Good design implementation

**Areas to improve:**
- More proactive communication

---

### 6.1.3 Team Member 3 - [Role: DevOps]

**Strengths to continue:**
- Reliable infrastructure setup
- Quick troubleshooting

**Areas to improve:**
- Better documentation of setup

---

### 6.1.4 Team Member 4 - [Role: ML Engineer]

**Strengths to continue:**
- Model optimization
- Research documentation

**Areas to improve:**
- Earlier integration with backend

---

## 6.2 Team Dynamics

### What Worked Well

- **Mutual respect:** All members valued each other's contributions
- **Helpful attitude:** Team members readily helped each other
- **Shared vision:** Everyone aligned on the goal

### Areas to Improve

- **Workload balancing:** Some members had more work than others
- **Feedback culture:** Could be more open with constructive feedback

---

# 7. Recommendations for Future Projects

## 7.1 Technical Recommendations

| Recommendation | Rationale |
|----------------|------------|
| Start with edge deployment consideration | Harder to add later |
| Add more automated testing | Catches bugs early |
| Plan for rate limits | Common issue with external APIs |
| Optimize for low-end devices | Broader user reach |

## 7.2 Process Recommendations

| Recommendation | Rationale |
|----------------|------------|
| Build in buffer time | Unexpected issues common |
| Document as you go | Hard to do later |
| Regular check-ins | Keeps everyone aligned |
| Celebrate successes | Team morale |

## 7.3 Team Recommendations

| Recommendation | Rationale |
|----------------|------------|
| Cross-train team members | Reduces bottlenecks |
| Establish clear decision process | Avoids confusion |
| Regular one-on-ones | Catches issues early |

---

# 8. Appendix

## 8.1 Retrospective Templates

### 8.1.1 Sprint Retrospective Template

```
# Sprint [X] Retrospective

**Date:** [Date]
**Sprint Goal:** [Goal]

## What Went Well
- [Item 1]
- [Item 2]

## What Didn't Go Well
- [Item 1]
- [Item 2]

## Action Items
| Action | Owner | Status |
|--------|-------|--------|
| [Action] | [Owner] | [Status] |

## Team Feedback
- [Team member 1]
- [Team member 2]
```

---

### 8.1.2 Phase Retrospective Template

```
# Phase [X] Retrospective

**Date:** [Date]
**Phase Goal:** [Goal]
**Duration:** [Weeks]

## Overall Assessment
- Successes:
- Challenges:
- Surprises:

## Technical Learnings
- What worked:
- What didn't:

## Process Improvements
- Identified:
- Implemented:

## Recommendations for Next Phase
```

---

## 8.2 Action Item Tracking

| Action Item | Created | Owner | Status | Completed |
|-------------|---------|-------|--------|-----------|
| Migrate SQLite → PostgreSQL/PostGIS | Sprint 0 | Backend/DevOps | Pending | - |
| Train ThreatDetector, replace `/api/v1/threat/assess` mock | Sprint 0 | ML Engineer | Pending | - |
| Durable offline-SOS queue + retry | Sprint 0 | Backend | Pending | - |
| Twilio mock → live | Sprint 0 | Backend | Pending | - |
| Wire native `.js` screens to API | Sprint 0 | Frontend | Pending | - |
| Keep all mocks labelled (code/docs/demo) | Sprint 0 | All | Ongoing | - |
| Follow up on 5G lab access | Sprint 1 | DevOps | Pending | - |
| Re-balance task assignments | Sprint 1 | Project Lead | Pending | - |
| Add caching for OSRM | Sprint 2 | Backend | Pending | - |
| Complete API documentation | Sprint 2 | Backend | Pending | - |
| Fine-tune ML model | Sprint 3 | ML Engineer | Pending | - |
| Better sync meetings | Sprint 3 | Team | Pending | - |

---

## 8.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial retrospective scaffold from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added §3.0 "Sprint 0 — Prototype Baseline Retrospective" and corresponding action items in §8.2 |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: After each sprint
- Owner: Project Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Retrospective Document captures our learning journey and provides guidance for future improvements.*