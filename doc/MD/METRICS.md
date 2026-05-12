# SurakṣāMārga.ai — Metrics Document

## Key Performance Indicators, Success Metrics, and Analytics Framework

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Metrics and Analytics Reference  
**Status:** Active Measurement

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1). v1.1 adds §6.3 "Production-Readiness / Mock-Replacement Metrics" to track the harden→production work over the 12 weeks. Latency / accuracy targets here match the invariants in `Plan.md` Appendix A.2.

---

# 1. Metrics Framework Overview

## 1.1 Purpose

This document establishes the metrics framework for measuring SurakṣāMārga.ai's success across four key dimensions:

1. **Technical Performance** - System reliability and speed
2. **User Engagement** - Adoption and usage patterns
3. **Safety Impact** - Real-world safety outcomes
4. **Business Success** - Growth and sustainability

## 1.2 Measurement Philosophy

| Principle | Implementation |
|-----------|----------------|
| **Data-Driven** | All decisions backed by metrics |
| **Actionable** | Metrics lead to specific actions |
| **Balanced** | Multiple dimensions, not single focus |
| **Practical** | Feasible to collect and analyze |

---

# 2. Technical Metrics

## 2.1 API Performance

### 2.1.1 Response Time Metrics

| Metric | Definition | Target | Measurement |
|--------|------------|--------|--------------|
| **P50 Latency** | Median response time | <50ms (5G), <200ms (4G) | APM tool |
| **P95 Latency** | 95th percentile | <100ms (5G), <300ms (4G) | APM tool |
| **P99 Latency** | 99th percentile | <200ms (5G), <500ms (4G) | APM tool |
| **Error Rate** | Percentage of failed requests | <0.1% | API logs |

### 2.1.2 Endpoint-Specific Targets

| Endpoint | Target P95 | Critical? |
|----------|------------|-----------|
| `/api/safe-route` | <100ms | Yes |
| `/api/sos-trigger` | <20ms E2E | Yes |
| `/api/crime-zones` | <200ms | No |
| `/api/routes` | <150ms | No |

### 2.1.3 5G vs 4G Comparison

| Metric | 3G | 4G | 5G | Improvement Target |
|--------|----|----|----|---------------------|
| Route calculation | 700ms | 250ms | <50ms | 5x vs 4G |
| SOS trigger | 400ms | 150ms | <10ms | 15x vs 4G |
| Location update | 30s interval | 15s interval | 2s interval | 7.5x |

---

## 2.2 System Reliability

### 2.2.1 Availability Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Uptime** | 99.9% | Monitoring |
| **Mean Time Between Failures (MTBF)** | >720 hours | Logs |
| **Mean Time to Recovery (MTTR)** | <1 hour | Incident reports |

### 2.2.2 Error Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **API Error Rate** | <0.1% | API logs |
| **Database Error Rate** | <0.01% | DB logs |
| **Mobile App Crash Rate** | <1% | Crash reporting |
| **Build Success Rate** | 100% | CI/CD |

---

## 2.3 Infrastructure Metrics

### 2.3.1 Resource Utilization

| Resource | Target Utilization | Alert Threshold |
|----------|-------------------|-----------------|
| CPU | <70% average | >80% |
| Memory | <80% average | >90% |
| Database connections | <80% max | >90% |
| API requests/min | <80% capacity | >90% |

### 2.3.2 Cost Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| Cloud cost per user | <₹5/month | Billing |
| API cost per 1000 requests | <₹0.50 | API logs |
| Infrastructure cost per DAU | <₹2 | Billing |

---

# 3. User Engagement Metrics

## 3.1 User Acquisition

### 3.1.1 Acquisition Funnel

| Stage | Metric | Target | Notes |
|-------|--------|--------|-------|
| **Awareness** | App store impressions | TBD | Post-launch |
| **Install** | Install rate | >30% | Of impressions |
| **Signup** | Signup rate | >70% | Of installs |
| **Activation** | First route search | >60% | Of signups |
| **Retention** | Day 7 retention | >40% | Of installs |

### 3.1.2 Growth Metrics

| Metric | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|----------------|----------------|-----------------|
| **Total Users** | 10,000 | 100,000 | 1,000,000 |
| **MAU** | 5,000 | 50,000 | 500,000 |
| **DAU** | 2,000 | 20,000 | 200,000 |
| **DAU/MAU** | 40% | 40% | 40% |

---

## 3.2 User Activity

### 3.2.1 Usage Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Routes per user/week** | >5 | Database |
| **Average session length** | >3 minutes | Analytics |
| **Session frequency** | >3 per week | Analytics |
| **Feature adoption** | >80% use SOS button | Analytics |

### 3.2.2 Engagement by User Type

| User Type | DAU/MAU | Routes/Week | Session Length |
|-----------|---------|-------------|----------------|
| Active users | 60% | >10 | >5 min |
| Regular users | 40% | 5-10 | 3-5 min |
| Casual users | 20% | 1-5 | <3 min |

---

## 3.3 User Satisfaction

### 3.3.1 Satisfaction Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **App Store Rating** | >4.5 stars | App stores |
| **NPS Score** | >50 | Quarterly survey |
| **CSAT (in-app)** | >80% | In-app survey |
| **Support tickets per user** | <0.01 | Support system |

### 3.3.2 User Feedback Categories

| Category | Target | Notes |
|----------|--------|-------|
| Positive reviews | >70% | App stores |
| Feature requests | <10% of feedback | Support |
| Bug reports | <5% of feedback | Support |
| Safety concerns | Track separately | Critical |

---

# 4. Safety Impact Metrics

## 4.1 Safety Outcomes

### 4.1.1 Direct Safety Impact

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Routes taken safely** | 1M+ | Analytics |
| **SOS triggers handled** | 100% | System |
| **Safety incidents during use** | 0 | User reports |
| **Danger alerts generated** | Track | Analytics |

### 4.1.2 User-Reported Safety

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Felt safer with app** | >80% | User survey |
| **Would recommend** | >70% | User survey |
| **Changed route due to app** | >50% | User survey |
| **Emergency resolved** | 100% | SOS tracking |

---

## 4.2 Risk Assessment Accuracy

### 4.2.1 Model Performance

| Metric | Target | Current | Measurement |
|--------|--------|---------|--------------|
| **Risk scoring accuracy** | >85% | 82% | Validation |
| **Danger detection precision** | >80% | 78% | User feedback |
| **Danger detection recall** | >75% | 71% | User feedback |
| **False positive rate** | <10% | 12% | User feedback |

### 4.2.2 Time-of-Day Risk Accuracy

| Time Period | Expected vs Actual | Target Variance |
|-------------|-------------------|-----------------|
| Morning (6-12) | Lower risk | <10% |
| Afternoon (12-18) | Medium risk | <10% |
| Evening (18-22) | Higher risk | <15% |
| Night (22-6) | Highest risk | <15% |

---

# 5. Business Metrics

## 5.1 Revenue Metrics

### 5.1.1 Monetization

| Metric | Target | Timeline |
|--------|--------|-----------|
| **First revenue** | Month 6 | V2 launch |
| **MRR** | ₹1L/month | Month 9 |
| **ARR** | ₹10L | Month 12 |
| **LTV** | ₹500 | Month 12 |
| **CAC** | <₹100 | Month 12 |

### 5.1.2 Revenue by Segment

| Segment | % of Revenue | Timeline |
|---------|-------------|----------|
| B2C Premium | 40% | Month 6 |
| B2B Enterprise | 40% | Month 9 |
| Government | 20% | Month 12 |

---

## 5.2 Growth Metrics

### 5.2.1 Funnel Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| **User Acquisition** | 10,000 | 100,000 | 1M |
| **Activation Rate** | 60% | 65% | 70% |
| **Revenue** | ₹0 | ₹1L | ₹10L |
| **Partnerships** | 0 | 5 | 20 |

### 5.2.2 Market Metrics

| Metric | Target | Timeline |
|--------|--------|-----------|
| **Market share (safety apps)** | Top 3 | Month 12 |
| **City coverage** | 3 cities | Month 9 |
| **College partnerships** | 10 | Month 9 |
| **Enterprise pilots** | 3 | Month 6 |

---

# 6. Operational Metrics

## 6.1 Team Performance

### 6.1.1 Development Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Sprint velocity** | 20 points | Sprint tracking |
| **Code coverage** | >80% | Testing |
| **Bug escape rate** | <5% | QA |
| **Deployment frequency** | Weekly | CI/CD |

### 6.1.2 Communication Metrics

| Metric | Target | Measurement |
|--------|--------|--------------|
| **Standup attendance** | >90% | Team tracking |
| **Sprint completion** | >80% | Sprint tracking |
| **Decision documentation** | 100% | DECISIONS.md |

---

## 6.3 Production-Readiness / Mock-Replacement Metrics (added v1.1)

Tracks the "prototype → production" work from `Plan.md` §12A and the `RESEARCH_PLAN.md` §9.2 backlog.

| Metric | Baseline (today) | Target | Week | Measurement |
|--------|------------------|--------|------|-------------|
| Database backend | SQLite | PostgreSQL + PostGIS (GiST), test suite green on PostGIS | W1 | CI job |
| Spatial query P95 (`ST_DWithin` 200m) | n/a (SQLite) | <5ms | W1–W3 | `EXPLAIN ANALYZE` |
| Edge containerisation | none | FastAPI in Docker on 5G-lab DU; `/api/safe-route` <50ms | W3 | Benchmark |
| 4G vs 5G SOS latency | simulated | measured on G-Node B / CU-DU / LPRU | W10–W11 | Real test, ≥1000 iters |
| `ThreatDetector` | rule-based mock (`/api/v1/threat/assess`) | trained XGBoost→ONNX, ≥85% accuracy, <20ms edge | W5 | Validation set |
| `CrowdPredictor` | seeded `crowd_simulator` | trained LSTM, RMSE <1.2 (0–10) | W5–W6 | Holdout RMSE |
| Offline-SOS queue | in-memory | durable store + backoff retry + SMS fallback | W6 | Chaos test (kill/restart) |
| Twilio | mock mode | live mode, delivery callbacks, >98% delivery | W6 | Twilio logs |
| Auth | mock identity verify | real JWT + user/contacts tables | V1.1 | Pen test |
| Backend test coverage | partial (`test_api.py`) | >80% | W4, W10 | `pytest --cov` |
| `.js` ↔ `.web.js` parity | partial | native screens wired to hardened API | W7–W9 | Parity checklist |
| Mocks remaining | 11 (`/api/v1/*` + simulated latency) | core demo path fully mock-labelled; ThreatDetector real by W5 | ongoing | Backlog table |

---

# 7. Analytics Implementation

## 7.1 Analytics Stack

| Tool | Purpose | Implementation |
|------|---------|----------------|
| **Backend logs** | API metrics | Structured logging |
| **APM** | Performance | Datadog/CloudWatch |
| **Crash reporting** | Mobile errors | Bugsnag/Sentry |
| **Analytics** | User behavior | Amplitude/Mixpanel |
| **Surveys** | User feedback | In-app + Typeform |

## 7.2 Data Collection Points

| Event | Data | Purpose |
|-------|------|----------|
| App open | Timestamp, device, version | Engagement |
| Route search | Source, destination, time | Usage |
| Route selected | Route ID, safety score | Feature adoption |
| SOS triggered | Location, time, outcome | Safety |
| Location update | GPS, timestamp | Tracking |

---

# 8. Dashboard Specifications

## 8.1 Executive Dashboard

**Refresh:** Daily  
**Audience:** Leadership, investors

| Widget | Metrics |
|--------|---------|
| User growth | MAU, DAU, new users |
| Safety impact | Routes taken, SOS handled |
| Revenue | MRR, ARR |
| System health | Uptime, latency |

## 8.2 Operations Dashboard

**Refresh:** Real-time  
**Audience:** Engineering, operations

| Widget | Metrics |
|--------|---------|
| API performance | Latency, errors |
| System health | CPU, memory, connections |
| Deployments | Last deploy, pipeline status |
| Incidents | Open, resolved |

## 8.3 Product Dashboard

**Refresh:** Daily  
**Audience:** Product, design

| Widget | Metrics |
|--------|---------|
| User engagement | Sessions, routes, features |
| Funnel | Install → signup → activation |
| Ratings | App store, NPS |
| Feedback | Recent reviews |

---

# 9. Reporting Schedule

| Report | Frequency | Audience | Contents |
|--------|-----------|----------|----------|
| Daily standup | Daily | Team | Blockers, priorities |
| Sprint report | Bi-weekly | Team | Velocity, completion |
| Monthly review | Monthly | Leadership | All metrics |
| Quarterly board | Quarterly | Board | Strategic metrics |
| Investor update | Quarterly | Investors | Business metrics |

---

# 10. Success Criteria Summary

## 10.1 Hackathon Success Metrics

| Category | Metric | Target |
|----------|--------|--------|
| Technical | API latency (5G) | <50ms |
| Technical | Demo stability | 100% uptime |
| User | Working features | All MVP features |
| Safety | Risk accuracy | >80% |

## 10.2 Post-Hackathon Success Metrics

| Category | Metric | 3-Month | 6-Month | 12-Month |
|----------|--------|---------|---------|----------|
| Users | MAU | 5,000 | 50,000 | 500,000 |
| Safety | Routes | 100K | 1M | 10M |
| Business | Revenue | ₹0 | ₹1L | ₹10L |
| Technical | Uptime | 99.9% | 99.9% | 99.9% |

---

## 11. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial metrics framework from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added §6.3 Production-Readiness / Mock-Replacement metrics; pointed decision-doc metric at DECISIONS.md |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Monthly
- Owner: Product Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Metrics Document establishes the measurement framework for SurakṣāMārga.ai's success.*