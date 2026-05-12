# SurakṣāMārga.ai — Risks Document

## Risk Identification, Assessment, and Mitigation Strategies

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Risk Management Reference  
**Status:** Active Risk Tracking

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1). v1.1 adds risks arising from the prototype baseline (mock endpoints, SQLite→PostGIS migration) — see §2.3.

---

# 1. Risk Management Overview

## 1.1 Risk Management Philosophy

SurakṣāMārga.ai adopts a proactive risk management approach:

1. **Identify Early:** Detect risks before they become issues
2. **Assess Objectively:** Evaluate probability and impact systematically
3. **Mitigate Proactively:** Implement preventive measures
4. **Monitor Continuously:** Track risk status throughout project lifecycle

## 1.2 Risk Categories

| Category | Description |
|----------|-------------|
| **Technical** | Technology, infrastructure, and implementation risks |
| **Operational** | Process, team, and resource risks |
| **Social/Ethical** | Privacy, fairness, and societal impact risks |
| **Compliance** | Legal, regulatory, and policy risks |
| **Market** | Competitive and market-related risks |

---

# 2. Technical Risks

## 2.1 High Priority Technical Risks

### Risk T-001: 5G Lab Unavailability

| Property | Value |
|----------|-------|
| **Risk ID** | T-001 |
| **Category** | Technical |
| **Probability** | Medium (40%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** The college 5G lab may be unavailable or have limited access during development, preventing proper 5G integration testing.

**Impact:**
- Cannot demonstrate real 5G performance
- Demo may need to use cloud fallback
- Lose differentiation in hackathon

**Mitigation Strategy:**
1. Implement latency simulation in cloud environment
2. Create fallback demo with cloud-based API
3. Document 5G requirements and test procedure
4. Coordinate with lab administrators for priority access

**Contingency Plan:**
- Use simulated 5G mode with latency injection
- Show comparison metrics between simulated and real
- Have backup demo using cloud infrastructure

---

### Risk T-002: ML Model Inaccuracy

| Property | Value |
|----------|-------|
| **Risk ID** | T-002 |
| **Category** | Technical |
| **Probability** | Low (20%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** The threat detection ML model may not achieve sufficient accuracy, leading to false positives or false negatives.

**Impact:**
- Users may receive incorrect safety alerts
- Trust in system could be compromised
- Safety-critical decisions may be wrong

**Mitigation Strategy:**
1. Use well-established algorithms (XGBoost) with proven track record
2. Implement human-in-the-loop validation for edge cases
3. Set conservative thresholds favoring safety over convenience
4. Regular model evaluation and retraining

**Contingency Plan:**
- Fall back to rule-based scoring if ML fails
- Provide clear explanations of confidence levels
- Allow user feedback to improve model

---

### Risk T-003: Database Performance

| Property | Value |
|----------|-------|
| **Risk ID** | T-003 |
| **Category** | Technical |
| **Probability** | Low (15%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** PostGIS spatial queries on 157K crime records may be slow under load, affecting API response times.

**Impact:**
- Routes may take longer to calculate
- User experience degraded
- Demo may appear sluggish

**Mitigation Strategy:**
1. Create appropriate indexes (GiST on location)
2. Implement query result caching (Redis)
3. Pre-aggregate crime zones
4. Optimize query patterns

**Contingency Plan:**
- Reduce query complexity for demo
- Use simplified spatial queries
- Pre-compute frequently accessed data

---

### Risk T-004: Mobile Rendering Performance

| Property | Value |
|----------|-------|
| **Risk ID** | T-004 |
| **Category** | Technical |
| **Probability** | Medium (35%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Rendering 800+ crime heatmap circles on React Native may cause UI lag on older devices.

**Impact:**
- App feels sluggish
- User experience poor
- Demo may stutter

**Mitigation Strategy:**
1. Implement map clustering for heatmap
2. Use lazy loading for off-screen elements
3. Optimize rendering with React.memo
4. Test on multiple device types

**Contingency Plan:**
- Reduce number of heatmap circles
- Use simplified markers instead of circles
- Provide toggle to turn off heatmap

---

### Risk T-005: API Rate Limits

| Property | Value |
|----------|-------|
| **Risk ID** | T-005 |
| **Category** | Technical |
| **Probability** | High (60%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** OSRM public API has rate limits that may be hit during demo.

**Impact:**
- Route fetching fails
- Demo interrupted
- User cannot get routes

**Mitigation Strategy:**
1. Implement request caching
2. Batch multiple requests
3. Have backup routing provider (Google)
4. Pre-fetch common routes

**Contingency Plan:**
- Switch to Google Directions API
- Use pre-computed routes for demo
- Show cached results

---

## 2.2 Low Priority Technical Risks

| Risk ID | Description | Probability | Impact | Mitigation |
|---------|-------------|-------------|--------|------------|
| T-006 | Cloud infrastructure cost overrun | Low | Low | Budget monitoring |
| T-007 | Third-party API changes | Medium | Low | Version pinning |
| T-008 | Docker container issues | Low | Medium | Local testing |
| T-009 | SSL/TLS certificate expiry | Low | Medium | Auto-renewal |

---

## 2.3 Baseline / Prototype-Specific Technical Risks (added v1.1)

### Risk T-010: Mock Endpoints Mistaken for Production

| Property | Value |
|----------|-------|
| **Risk ID** | T-010 |
| **Category** | Technical / Communication |
| **Probability** | Medium (40%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** The `/api/v1/*` advanced-safety endpoints (identity verification, offline SOS, proximity scan, behavioural threat, etc.) and the `simulation/*` latency numbers are deterministic mocks. Reviewers, judges, or new contributors may assume they are real, leading to over-claiming in the pitch or wrong assumptions in downstream work.

**Mitigation:**
1. Label every mock clearly in code, docs (done — `Plan.md` §12A, `ARCHITECTURE.md` §3.1.1, `PRODUCT_PLAN.md` §3.1), and demo narration ("this is a mock that demonstrates the flow; the model lands in Week 5").
2. Keep the "Mock → Model Replacement Backlog" (`RESEARCH_PLAN.md` §9.2) visible in standups.
3. Never put a mock-only capability in a claim of "shipped".

**Contingency:** If a mock is called out, pivot to the backlog table and the 12-week plan.

---

### Risk T-011: SQLite → PostgreSQL/PostGIS Migration

| Property | Value |
|----------|-------|
| **Risk ID** | T-011 |
| **Category** | Technical |
| **Probability** | Medium (35%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Dev runs on SQLite (`saferoute.db`); production needs PostgreSQL+PostGIS for GiST-indexed spatial queries on 157K rows. Migration may surface query incompatibilities (PostGIS functions vs. SQLite), geometry-column handling, and performance regressions.

**Mitigation:**
1. Do the migration in Week 1, not late.
2. Keep spatial logic behind `geo_utils.py` so the DB swap is localised.
3. Add a CI job that runs the test suite against PostGIS.
4. Pre-load + `ANALYZE` + verify `ST_DWithin` query plans use the GiST index.

**Contingency:** Ship demo on a managed PostGIS instance; keep SQLite as the offline-dev fallback only.

---

### Risk T-012: Advanced-Safety Mocks Not Replaced In Time

| Property | Value |
|----------|-------|
| **Risk ID** | T-012 |
| **Category** | Technical / Scope |
| **Probability** | Medium (45%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Training ThreatDetector/CrowdPredictor and wiring durable offline-SOS may slip past Weeks 5–6.

**Mitigation:** Strict prioritisation — ThreatDetector (Week 5) is P0; CrowdPredictor and durable offline queue are P1; everything else stays mock for the hackathon and is explicitly roadmapped. Mocks are demo-stable, so a slip degrades "production-ready" claims but not the demo.

**Contingency:** Present mocks with the replacement backlog; commit dates in the pitch.

---

### Risk T-013: Dual Frontend Track Drift (`.js` vs `.web.js`)

| Property | Value |
|----------|-------|
| **Risk ID** | T-013 |
| **Category** | Technical / Maintainability |
| **Probability** | Medium (40%) |
| **Impact** | Low–Medium |
| **Status** | Identified |

**Description:** The frontend maintains parallel React Native (`.js`) and web (`.web.js`) implementations of most screens/components; they can drift in behaviour and API usage.

**Mitigation:** Share API/business logic via `src/services/*` and `src/utils/*`; keep platform files thin (presentation only); checklist parity in code review. Weeks 7–9 explicitly wire the native screens to the hardened API.

**Contingency:** For the hackathon, demo on whichever track is most polished; document parity gaps.

---

# 3. Operational Risks

## 3.1 Team-Related Risks

### Risk O-001: Team Availability

| Property | Value |
|----------|-------|
| **Risk ID** | O-001 |
| **Category** | Operational |
| **Probability** | Medium (35%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** Team members may have conflicts (exams, personal commitments) reducing availability during critical periods.

**Impact:**
- Delayed deliverables
- Quality compromised
- More work on fewer people

**Mitigation Strategy:**
1. Identify critical path and buffer time
2. Cross-train team members on key areas
3. Document all processes thoroughly
4. Maintain buffer in timeline

**Contingency Plan:**
- Reallocate tasks to available members
- Prioritize critical features
- Extend working hours if needed

---

### Risk O-002: Scope Creep

| Property | Value |
|----------|-------|
| **Risk ID** | O-002 |
| **Category** | Operational |
| **Probability** | High (55%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** New features may be added beyond original scope, causing delays and resource issues.

**Impact:**
- Missed deadlines
- Quality issues
- Team burnout

**Mitigation Strategy:**
1. Strict change control process
2. Weekly scope review meetings
3. Clear MVP definition
4. Document all change requests

**Contingency Plan:**
- Move new features to V2
- Reduce scope to essential features
- Extend timeline if absolutely necessary

---

### Risk O-003: Technical Debt Accumulation

| Property | Value |
|----------|-------|
| **Risk ID** | O-003 |
| **Category** | Operational |
| **Probability** | Medium (40%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Quick fixes and shortcuts may accumulate technical debt, causing future issues.

**Impact:**
- Maintenance difficulties
- Future development slowed
- Bugs more likely

**Mitigation Strategy:**
1. Allocate time for refactoring
2. Code review process
3. Documentation requirements
4. Technical debt tracking

**Contingency Plan:**
- Schedule refactoring sprints
- Document known issues
- Accept some debt for demo deadline

---

# 4. Social/Ethical Risks

## 4.1 Privacy and Security Risks

### Risk S-001: Privacy Backlash

| Property | Value |
|----------|-------|
| **Risk ID** | S-001 |
| **Category** | Social/Ethical |
| **Probability** | Low (15%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** Users or media may criticize location data collection as invasive surveillance.

**Impact:**
- Negative press
- User trust damaged
- Regulatory scrutiny

**Mitigation Strategy:**
1. Clear privacy policy and consent
2. User control over data sharing
3. Data minimization principle
4. Transparent communication

**Contingency Plan:**
- Public response strategy
- Privacy features prominently featured
- Third-party privacy audit

---

### Risk S-002: Area Stigmatization

| Property | Value |
|----------|-------|
| **Risk ID** | S-002 |
| **Category** | Social/Ethical |
| **Probability** | Medium (35%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Marking areas as "unsafe" may stigmatize communities and reinforce negative stereotypes.

**Impact:**
- Community backlash
- Media criticism
- Loss of trust

**Mitigation Strategy:**
1. Focus on specific segments, not areas
2. Provide constructive recommendations
3. Avoid language that stigmatizes
4. Engage community representatives

**Contingency Plan:**
- Adjust messaging to focus on routes
- Partner with community organizations
- Document intent and approach

---

### Risk S-003: False Sense of Security

| Property | Value |
|----------|-------|
| **Risk ID** | S-003 |
| **Category** | Social/Ethical |
| **Probability** | Medium (40%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** Users may believe app guarantees safety, leading to risky behavior.

**Impact:**
- User safety compromised
- Legal liability
- Trust destroyed if incident occurs

**Mitigation Strategy:**
1. Clear disclaimers about limitations
2. Encourage traditional safety practices
3. Regular safety reminders
4. User education content

**Contingency Plan:**
- Prominent warnings in app
- Safety tips in onboarding
- Regular push notifications

---

# 5. Compliance Risks

## 5.1 Legal and Regulatory Risks

### Risk C-001: Data Protection Compliance

| Property | Value |
|----------|-------|
| **Risk ID** | C-001 |
| **Category** | Compliance |
| **Probability** | Low (20%) |
| **Impact** | High |
| **Status** | Identified |

**Description:** App may not fully comply with GDPR (for international users) or India's PDP Act.

**Impact:**
- Regulatory penalties
- Legal action
- Reputational damage

**Mitigation Strategy:**
1. Privacy by design
2. GDPR/PDP compliant data handling
3. Regular compliance audits
4. Legal counsel review

**Contingency Plan:**
- Data processing agreement
- Right to deletion implementation
- Privacy officer designation

---

# 6. Market Risks

## 6.1 Competitive and Market Risks

### Risk M-001: Google Competition

| Property | Value |
|----------|-------|
| **Risk ID** | M-001 |
| **Category** | Market |
| **Probability** | Low (10%) |
| **Impact** | Medium |
| **Status** | Identified |

**Description:** Google may add similar safety features to Google Maps.

**Impact:**
- Market share reduced
- Differentiation lost
- Competitive pressure

**Mitigation Strategy:**
1. First-mover advantage
2. Specialized features
3. Community trust building
4. Continuous innovation

**Contingency Plan:**
- Partnership opportunities
- Focus on safety niche
- Exit or acquisition potential

---

# 7. Risk Register

## 7.1 Summary Risk Matrix

| Probability → | Low (1) | Medium (2) | High (3) |
|---------------|---------|-------------|-----------|
| **Impact High (3)** | T-002, C-001 | T-001, S-001, S-003 | O-001 |
| **Impact Medium (2)** | T-003, T-006, S-002, M-001 | T-004, T-010, T-011, T-012, O-002, O-003 | T-005 |
| **Impact Low (1)** | T-007, T-008, T-009 | T-013 | |

## 7.2 Risk Prioritization

**Priority 1 (Immediate Action):**
- T-001: 5G Lab Unavailability
- T-011: SQLite → PostgreSQL/PostGIS Migration (do it Week 1)
- O-001: Team Availability
- S-003: False Sense of Security

**Priority 2 (Close Monitoring):**
- T-005: API Rate Limits
- T-010: Mock Endpoints Mistaken for Production
- T-012: Advanced-Safety Mocks Not Replaced In Time
- O-002: Scope Creep
- T-004: Mobile Rendering

**Priority 3 (Contingency Planning):**
- T-002: ML Model Inaccuracy
- T-003: Database Performance
- T-013: Dual Frontend Track Drift
- S-001: Privacy Backlash

---

# 8. Mitigation Action Plan

## 8.1 High Priority Mitigation Actions

### For T-001 (5G Lab Unavailable)

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Set up latency simulation in cloud | DevOps | Week 2 | Not Started |
| Create fallback demo with cloud | Backend | Week 3 | Not Started |
| Coordinate with lab for access | Project Lead | Week 1 | Not Started |
| Document 5G test procedure | DevOps | Week 3 | Not Started |

### For O-001 (Team Availability)

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Identify critical path | Project Lead | Week 1 | Not Started |
| Cross-train team members | All | Week 2 | Not Started |
| Document all processes | All | Week 4 | Not Started |
| Build timeline buffer | Project Lead | Week 1 | Not Started |

### For S-003 (False Sense of Security)

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Create clear disclaimers | UX Designer | Week 4 | Not Started |
| Design warning UI components | UX Designer | Week 6 | Not Started |
| Write safety tips content | Product Lead | Week 4 | Not Started |
| Implement reminder notifications | Frontend | Week 8 | Not Started |

---

# 9. Risk Review Schedule

| Review | Frequency | Attendees | Focus |
|--------|-----------|-----------|-------|
| Daily Standup | Daily | Team | Immediate blockers |
| Weekly Review | Weekly | Team + Lead | All active risks |
| Sprint Retrospective | Bi-weekly | Team | Risk process improvement |
| Phase Gate | Monthly | Lead + Mentors | Strategic risks |

---

# 10. Appendix

## 10.1 Risk Terminology

| Term | Definition |
|------|------------|
| **Probability** | Likelihood of risk occurring (Low <20%, Medium 20-50%, High >50%) |
| **Impact** | Consequence if risk occurs (Low, Medium, High) |
| **Mitigation** | Actions to reduce probability or impact |
| **Contingency** | Plans to execute if risk occurs |
| **Risk Owner** | Person responsible for monitoring and managing risk |

## 10.2 Risk Tracking Tool

Risks tracked in this document and updated:
- Weekly during weekly review
- As new risks are identified
- When risk status changes

---

## 10.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial risk register from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added §2.3 baseline/prototype risks (T-010 mock-vs-prod, T-011 PostGIS migration, T-012 mocks not replaced, T-013 dual frontend drift), updated §7 matrix & prioritization |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Weekly (Week 1: Day 7)
- Owner: Project Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Risks Document provides a systematic approach to identifying, assessing, and managing project risks.*