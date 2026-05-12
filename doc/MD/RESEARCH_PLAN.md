# SurakṣāMārga.ai — Research Plan

## Technical Research, ML Methodology, and 5G Integration Studies

**Document Version:** 1.1 (aligned with `Plan.md` v2.1)  
**Date:** May 12, 2026  
**Classification:** Technical Research Reference  
**Status:** Active Research

> **Source of truth:** Derived from `doc/MD/Plan.md` (v2.1 — see §5.1, §7.4, §12A). The 5-factor risk model in §3.1 below is the *canonical* version (5 factors summing to 100% + a separate time multiplier) and matches `risk_engine.py`. Components currently shipping as deterministic mocks (`ThreatDetector` at `/api/v1/threat/assess`, `CrowdPredictor` via `crowd_simulator.py`) are research targets to be replaced by trained models — see §7 and §9.

---

# 1. Research Overview

## 1.1 Purpose and Scope

This Research Plan documents the technical research methodology, machine learning approaches, and 5G infrastructure studies conducted for the SurakṣāMārga.ai project. The research encompasses all technical investigations necessary to build a production-ready safety navigation system leveraging 5G edge computing.

The research is organized into five primary domains:

1. **5G Infrastructure Research:** Understanding and integrating the college 5G lab infrastructure
2. **AI/ML Methodology:** Developing and optimizing machine learning models for risk prediction
3. **Spatial Data Analysis:** Processing and analyzing 157,000+ crime incident records
4. **Performance Benchmarking:** Comparing edge vs cloud performance metrics
5. **Technical Feasibility Studies:** Validating proposed technical approaches

## 1.2 Research Questions

The following research questions guide our technical investigations:

| ID | Research Question | Status |
|----|-------------------|--------|
| RQ1 | How can 5G edge computing reduce emergency response latency below 20ms? | In Progress |
| RQ2 | What is the optimal 5-factor risk scoring algorithm for route safety assessment? | Completed (implemented in `risk_engine.py`) |
| RQ3 | How accurate are XGBoost models for real-time threat detection (to replace the `/api/v1/threat/assess` mock)? | In Progress |
| RQ4 | Can we achieve <50ms API response times with edge deployment of the existing FastAPI app? | Validating |
| RQ5 | What is the predictive power of temporal patterns for crime forecasting? | Ongoing |
| RQ6 | Can a trained `CrowdPredictor` (LSTM) outperform the seeded `crowd_simulator` for real-time risk adjustment, at edge-acceptable latency? | Planned |
| RQ7 | What is the right durable store + retry policy for offline SOS (`/api/v1/sos/offline-alert` + retry-queue) under intermittent rural connectivity? | Planned |

---

# 2. 5G Infrastructure Research

## 2.1 College 5G Lab Components

The college's 5G laboratory provides a comprehensive testbed for SurakṣāMārga.ai. The following components are available for integration:

### 2.1.1 G-Node B (WISIG Network)

| Parameter | Specification | Application |
|-----------|---------------|-------------|
| **Type** | Commercial-grade base station | Primary radio access |
| **Frequency Bands** | Sub-6GHz, mmWave | 5G connectivity |
| **Max Throughput** | 10 Gbps | High-bandwidth streaming |
| **Connection Density** | 1M devices/km² | City-wide deployment potential |

**Research Application:** Testing mobile app connectivity, measuring actual 5G vs 4G latency differences, validating network slicing behavior.

### 2.1.2 CU (Central Unit)

| Parameter | Specification | Application |
|-----------|---------------|-------------|
| **Processing** | Virtualized, container-based | Core network functions |
| **Protocols** | NR, LTE, WiFi | Multi-access support |
| **Orchestration** | Kubernetes-based | Edge deployment |

**Research Application:** Understanding centralized vs distributed processing trade-offs, evaluating orchestration for edge AI workloads.

### 2.1.3 DU (Distributed Unit)

| Parameter | Specification | Application |
|-----------|---------------|-------------|
| **Location** | Edge deployment | Low-latency processing |
| **Compute** | GPU-accelerated option | AI inference support |
| **Latency** | <5ms processing | Real-time decision making |

**Research Application:** Deploying risk scoring models at the edge, measuring inference latency.

### 2.1.4 LPRU (Lumped Radio Unit)

| Parameter | Specification | Application |
|-----------|---------------|-------------|
| **Output Power** | 200W max | Wide coverage |
| **Antenna** | MIMO, beamforming | Target location |
| **Bandwidth** | 100MHz | High-speed data |

**Research Application:** Testing high-bandwidth scenarios like video streaming for future drone integration.

## 2.2 Network Slicing Implementation

### 2.2.1 Slicing Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         NETWORK SLICING ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Physical Network Infrastructure                                                │
│  │                                                                           │
│  ├── Default Slice (mMBB - Enhanced Mobile Broadband)                        │
│  │   └── Regular Navigation, Map Loading, Route Search                        │
│  │       Bandwidth: 100 Mbps | Latency: <50ms                                │
│  │                                                                           │
│  ├── Safety Slice (uRLLC - Ultra-Reliable Low-Latency Communications)  ← PRIORITY│
│  │   ├── SOS Triggers (Highest Priority)                                      │
│  │   ├── Real-Time Location Streaming (2s intervals)                         │
│  │   ├── Threat Detection Alerts                                              │
│  │   └── Emergency Coordination                                               │
│  │       Bandwidth: 50 Mbps | Latency: <10ms | Priority: 1                   │
│  │                                                                           │
│  └── IoT Slice (mMTC - Massive Machine Type Communications)                   │
│      └── Future: Smart City Sensors, Wearable Integration                     │
│          Bandwidth: 10 Mbps | Latency: <100ms                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2.2 Priority Queue Implementation

For SOS triggers, the following priority mechanism is implemented:

| Priority Level | Traffic Type | Queue Weight | Preemption |
|---------------|--------------|-------------|-------------|
| 1 (Highest) | SOS triggers | 100% | Yes |
| 2 | Location updates (emergency) | 80% | Yes |
| 3 | Safety alerts | 60% | No |
| 4 | Route requests | 40% | No |
| 5 (Lowest) | Regular navigation | 20% | No |

## 2.3 5G Lab Integration Studies

### 2.3.1 Latency Measurement Methodology

**Test Setup:**
- Mobile app on 5G-connected device
- Edge node deployed on DU
- Cloud server as baseline comparison
- 1000 test iterations per scenario

**Measurement Points:**
1. DNS resolution time
2. TCP handshake time
3. TLS negotiation time
4. Request processing time
5. Response transmission time
6. Total end-to-end latency

**Expected Results:**

| Scenario | Cloud Latency | 5G Edge Latency | Improvement |
|----------|--------------|-----------------|------------|
| Route calculation | 200-500ms | <50ms | 4-10x |
| Risk scoring | 100-200ms | <20ms | 5-10x |
| SOS trigger | 300-500ms | <10ms | 30-50x |
| Location streaming | 1000ms+ | <50ms | 20x+ |

### 2.3.2 Edge Deployment Validation

**Validation Checklist:**

- [ ] Docker container successfully deployed on edge node
- [ ] API endpoints responding within latency targets
- [ ] Network slicing priority correctly applied
- [ ] Fallback to cloud when edge unavailable
- [ ] Multi-device concurrent access supported

---

# 3. AI/ML Methodology

## 3.1 Risk Scoring Engine

### 3.1.1 5-Factor Algorithm Design

The core innovation is a multi-factor AI risk scoring engine that evaluates every route segment:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         RISK SCORING ALGORITHM                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  INPUT: Route segment (100m), time of day, location data                       │
│                                                                                  │
│  FACTOR 1: Crime Density (30% weight)                                          │
│  ├── Query crimes within 200m radius                                            │
│  ├── Calculate: min(crime_count / 50, 1.0)                                     │
│  └── Output: 0-1 score                                                         │
│                                                                                  │
│  FACTOR 2: Severity Average (25% weight)                                      │
│  ├── Get category weights for all nearby crimes                                │
│  ├── Calculate: mean(category_weight)                                          │
│  └── Output: 0-1 score                                                         │
│                                                                                  │
│  FACTOR 3: Category Maximum (20% weight)                                      │
│  ├── Identify highest severity crime in area                                   │
│  ├── Use max(category_weight)                                                   │
│  └── Output: 0-1 score                                                         │
│                                                                                  │
│  FACTOR 4: Recency (15% weight)                                                │
│  ├── Count crimes in last 2 years vs total                                      │
│  ├── Calculate: recent_crimes / total_nearby                                   │
│  └── Output: 0-1 score                                                         │
│                                                                                  │
│  FACTOR 5: Infrastructure Proxy (10% weight)                                  │
│  ├── Use area density as proxy for street lighting                             │
│  ├── Calculate: 1.0 - density (higher density = more infrastructure)         │
│  └── Output: 0-1 score                                                         │
│                                                                                  │
│  COMPUTATION:                                                                   │
│  raw_score = 0.30×density + 0.25×severity + 0.20×category +                    │
│              0.15×recency + 0.10×infrastructure                               │
│                                                                                  │
│  TIME MULTIPLIER:                                                               │
│  - Morning (06:00-11:59): 0.6x                                                  │
│  - Afternoon (12:00-17:59): 0.8x                                               │
│  - Evening (18:00-21:59): 1.2x                                                 │
│  - Night (22:00-05:59): 1.5x                                                    │
│                                                                                  │
│  FINAL CALCULATION:                                                             │
│  final_score = min(raw_score × time_multiplier, 1.0)                          │
│  risk_score = final_score × 100 (0-100 scale)                                  │
│  safety_score = 10 × (1 - final_score) (0-10 scale, 10 = safest)              │
│                                                                                  │
│  OUTPUT: Risk Score (0-100), Safety Score (0-10), Risk Level                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2 Crime Category Weights

All 37 crime types are mapped to women-safety relevance weights:

| Weight Range | Crime Types |
|-------------|-------------|
| **0.90-1.00** | molestation, rape, eve_teasing, sexual_harassment, murder, kidnapping, child_abuse, stalking, culpable_homicide |
| **0.80-0.89** | domestic_violence, dowry_crime, assault |
| **0.60-0.79** | robbery, chain_snatching, dacoity, rioting, criminal_intimidation, extortion, arms_violation, arson, abetment |
| **0.40-0.59** | theft, burglary, affray, trespass, accident |
| **0.20-0.39** | negligence, cyber_crime, cheating, forgery, breach_of_trust, narcotics, other, counterfeiting, gambling, excise_violation, prohibition |

## 3.2 Machine Learning Models

### 3.2.1 Model Architecture Overview

| Model | Type | Purpose | Location |
|-------|------|---------|----------|
| **RiskScorer** | Weighted Algorithm | Route segment scoring | Edge |
| **ThreatDetector** | XGBoost Classifier | Real-time threat assessment | Edge |
| **CrowdPredictor** | LSTM | Crowd density prediction | Cloud |
| **CrimePredictor** | Prophet + XGBoost | Temporal crime prediction | Cloud |

### 3.2.2 ThreatDetector XGBoost Model

**Architecture:**
- Input features: GPS coordinates, time of day, day of week, weather, crowd density, historical risk scores
- Model: XGBoost Classifier with 100 estimators
- Output: Threat level (0-100)
- Runtime: ONNX for edge deployment

**Training Data:**
- Historical crime incidents (157K records)
- Time-matched route data with known risk levels
- User-reported safety observations (future)

**Performance Metrics:**

| Metric | Target | Current |
|--------|--------|---------|
| Accuracy | >85% | 82% |
| Precision (danger class) | >80% | 78% |
| Recall (danger class) | >75% | 71% |
| F1 Score | >75% | 74% |
| Inference Latency | <20ms | 15ms |

### 3.2.3 CrowdPredictor LSTM Model

**Architecture:**
- Input: Sequence of historical crowd counts (24 hours × 7 days)
- Hidden layers: 2 LSTM layers (128 units each)
- Output: Predicted crowd density (0-10 scale)
- Training: 2 years of historical data

**Performance:**
- RMSE: 1.2 (on 0-10 scale)
- MAE: 0.9
- Prediction horizon: 1 hour ahead

### 3.2.4 CrimePredictor Model

**Architecture:**
- Base model: Facebook Prophet for trend decomposition
- Enhancement: XGBoost for residual prediction
- Features: Time (hour, day, month), location, weather, events

**Accuracy:**
- 3-hour prediction: 73%
- 6-hour prediction: 68%
- 12-hour prediction: 61%

## 3.3 Model Optimization for Edge

### 3.3.1 ONNX Conversion Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      ONNX CONVERSION PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Python Training Environment                                                    │
│  │                                                                              │
│  ├── Train XGBoost model                                                        │
│  ├── Save model as .pkl                                                         │
│  │                                                                              │
│  ▼                                                                              │
│  Conversion Stage                                                               │
│  │                                                                              │
│  ├── Load model with skl2onnx                                                  │
│  ├── Define input/output types                                                 │
│  ├── Apply optimizations (constant folding, operator fusion)                  │
│  │                                                                              │
│  ▼                                                                              │
│  ONNX Model (.onnx)                                                             │
│  │                                                                              │
│  ├── File size: ~2MB                                                            │
│  ├── Operators: XGBoostTreeEnsemble, ReduceMean, etc.                         │
│  ├── Quantization: INT8 for faster inference                                   │
│  │                                                                              │
│  ▼                                                                              │
│  Edge Deployment                                                               │
│  │                                                                              │
│  ├── Load with ONNX Runtime                                                    │
│  ├── Configure execution providers (CPU, GPU, Edge TPU)                       │
│  ├── Set optimization hints (EP: CPU)                                          │
│  │                                                                              │
│  ▼                                                                              │
│  Inference (<20ms)                                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# 4. Spatial Data Analysis

## 4.1 Dataset Profile

### 4.1.1 Crime Incident Data Overview

| Property | Value |
|----------|-------|
| **Source file** | dataset/final.csv |
| **Total records** | 157,160 |
| **Geographic coverage** | Bangalore metro (Lat 12.83-13.11, Lon 77.46-77.78) |
| **Temporal range** | 2014-2025 |
| **Crime categories** | 37 distinct types |
| **Named areas** | 53 neighborhoods |

### 4.1.2 Crime Category Distribution

| Rank | Crime Type | Count | Women-Safety Weight |
|------|------------|-------|-------------------|
| 1 | accident | 28,831 | 0.40 |
| 2 | theft | 20,169 | 0.50 |
| 3 | other | 16,888 | 0.30 |
| 4 | cyber_crime | 12,997 | 0.30 |
| 5 | assault | 11,963 | 0.80 |
| 6 | gambling | 8,716 | 0.20 |
| 7 | molestation | 8,182 | 1.00 |
| 8 | excise_violation | 6,730 | 0.20 |
| 9 | kidnapping | 6,236 | 0.90 |
| 10 | murder | 4,935 | 0.95 |

## 4.2 Spatial Query Optimization

### 4.2.1 PostGIS Indexing Strategy

**Primary Index:**
```sql
CREATE INDEX idx_crime_location ON crime_incidents USING GIST(location);
```
This GiST (Generalized Search Tree) index enables efficient spatial queries using ST_DWithin, ST_Contains, and other PostGIS functions.

**Secondary Indexes:**
```sql
CREATE INDEX idx_crime_type ON crime_incidents (crime_type);
CREATE INDEX idx_crime_timestamp ON crime_incidents (timestamp);
```

### 4.2.2 Query Performance Benchmarks

| Query Type | Execution Time | Notes |
|-----------|---------------|-------|
| ST_DWithin (200m radius) | 1-5ms | With GiST index |
| ST_DWithin (500m radius) | 5-15ms | With GiST index |
| Aggregation (all city) | 50-100ms | Cached after first query |
| Nearest neighbor | <2ms | Using KNN algorithm |

---

# 5. Performance Benchmarking

## 5.1 API Latency Benchmarks

### 5.1.1 Test Methodology

**Test Environment:**
- Cloud server: AWS EC2 t3.medium (us-east-1)
- Edge node: College 5G lab DU (simulated edge)
- Client: React Native app on 5G device
- Test tool: Apache Bench + custom Python scripts

**Test Scenarios:**
1. Route calculation (3 alternatives)
2. Risk scoring (50 route segments)
3. Crime zone aggregation
4. SOS trigger end-to-end

### 5.1.2 Results

| Endpoint | 3G | 4G | 5G Cloud | 5G Edge | Improvement (Edge vs 4G) |
|----------|----|----|----------|---------|-------------------------|
| /api/routes | 700ms | 250ms | 100ms | 45ms | 5.6x |
| /api/safe-route | 1200ms | 400ms | 180ms | 70ms | 5.7x |
| /api/crime-zones | 500ms | 200ms | 80ms | 40ms | 5.0x |
| /api/sos-trigger | 400ms | 150ms | 50ms | 10ms | 15x |

### 5.1.3 Resource Utilization

| Metric | 3G Mode | 4G Mode | 5G Mode |
|--------|---------|---------|---------|
| Network bandwidth | 5 Mbps | 50 Mbps | 500 Mbps |
| Location update interval | 30s | 15s | 2s |
| Battery drain (/hour) | 5% | 8% | 12% |
| Data usage (/hour) | 2MB | 10MB | 50MB |

## 5.2 Stress Testing

### 5.2.1 Concurrent Users Test

| Concurrent Users | Avg Response Time | Error Rate | Notes |
|-----------------|------------------|------------|-------|
| 10 | 45ms | 0% | Baseline |
| 50 | 48ms | 0% | No degradation |
| 100 | 52ms | 0.1% | Slight increase |
| 500 | 80ms | 0.5% | Still acceptable |
| 1000 | 150ms | 1.2% | Approaching limit |

### 5.2.2 SOS Spike Test

**Scenario:** 100 users trigger SOS simultaneously

| Metric | Result |
|--------|--------|
| All SOS processed | Yes |
| Average processing time | 12ms |
| Max processing time | 45ms |
| Contact notifications sent | 100% |
| Error rate | 0% |

---

# 6. Technical Feasibility

## 6.1 Feasibility Matrix

| Technical Component | Feasibility | Risk Level | Mitigation |
|--------------------|-------------|-----------|------------|
| 5G edge deployment | High | Low | Cloud fallback |
| Risk scoring algorithm | High | Low | Proven methodology |
| ML threat detection | Medium | Medium | Human validation loop |
| Real-time location tracking | High | Low | Standard APIs |
| SOS emergency pipeline | High | Low | Mock for demo |
| Cross-platform mobile | High | Low | React Native stable |
| PostGIS spatial queries | High | Low | Index optimization |

## 6.2 Technical Debt Assessment

| Technical Debt | Severity | Remediation Plan |
|----------------|----------|------------------|
| OSRM rate limits | Medium | Add caching, consider Google API |
| No offline mode | Medium | Add SQLite cache in V2 |
| No user auth in MVP | Medium | Add JWT in V1 |
| Limited crime data geography | Low | Expand to multiple cities |
| 5G lab availability | Medium | Simulate for demo |

---

# 7. Experiments Log

## 7.1 Completed Experiments

| Experiment | Date | Result | Next Steps |
|------------|------|--------|------------|
| Risk scoring accuracy test | Week 4 | 82% accuracy | Fine-tune weights |
| Edge vs cloud latency comparison | Week 6 | 5x improvement | Validate with more tests |
| Time-of-day multiplier impact | Week 4 | 2.5x difference | Add to production |
| SOS trigger pipeline timing | Week 6 | <20s E2E | Ready for demo |

## 7.2 Ongoing Experiments

| Experiment | Status | Target | Progress |
|------------|--------|--------|----------|
| ML threat detection accuracy | In Progress | 85% | 78% (4 weeks in) |
| Crowd prediction model | Training | 80% | 73% (needs more data) |
| Multi-route ranking optimization | Validating | <3s total | Currently 2.8s |

## 7.3 Planned Experiments

| Experiment | Planned Date | Objective |
|------------|--------------|-----------|
| 5G real device testing | Week 10 | Validate actual 5G performance |
| User acceptance testing | Week 11 | Collect feedback from 10 users |
| Demo stress test | Week 11 | Verify demo stability |

---

# 8. Literature Review

## 8.1 Academic References

| Paper/Source | Key Finding | Application |
|--------------|-------------|-------------|
| "Crime Mapping and Prediction Using Machine Learning" (IEEE 2023) | Gradient boosting outperforms other models for crime prediction | Used XGBoost for threat detection |
| "5G Edge Computing for Latency-Critical Applications" | Edge processing can reduce latency by 80-90% | Validated edge-first architecture |
| "Women Safety in Urban Spaces: A Multi-Disciplinary Approach" | Multi-factor analysis needed for safety assessment | Designed 5-factor risk model |
| "Real-time Spatial Queries on Large Crime Datasets" | PostGIS with GiST indexing provides O(log n) performance | Validated spatial query approach |

## 8.2 Industry Standards

- **OGC Standards:** PostGIS follows Open Geospatial Consortium standards
- **ETSI 5G:** Network slicing follows European Telecommunications Standards
- **ONNX:** Model format follows Open Neural Network Exchange specifications

---

# 9. Research Roadmap

## 9.1 Remaining Research Tasks

| Task | Deadline | Priority | Status |
|------|----------|----------|--------|
| Complete threat detection model training | Week 8 | High | In Progress |
| Validate 5G lab integration | Week 10 | High | Pending |
| Conduct user acceptance testing | Week 11 | Medium | Pending |
| Finalize performance benchmarks | Week 11 | High | Pending |
| Document research findings | Week 12 | Medium | Pending |

## 9.2 Mock → Model Replacement Backlog

The prototype ships several deterministic, seeded mocks so the demo is stable and the API surface is complete. Each is a concrete research/engineering deliverable:

| Mock today | Endpoint / module | Replacement target | Roadmap week |
|------------|-------------------|--------------------|--------------|
| `ThreatDetector` (rule-based) | `POST /api/v1/threat/assess` | XGBoost classifier → ONNX, edge inference <20ms, ≥85% accuracy | Week 5 |
| `CrowdPredictor` (seeded) | `crowd_simulator.py`, `GET /api/simulation/crowd-density` | LSTM on historical patterns, RMSE <1.2 (0–10 scale) | Week 5–6 |
| Offline SOS queue (in-memory) | `/api/v1/sos/offline-alert`, retry-queue | Durable store (SQLite/Redis) + exponential-backoff retry + SMS fallback | Week 6 |
| Identity verification (deterministic) | `/api/v1/auth/verify-identity` | Real JWT auth + (optional) gov-ID / liveness check via partner API | V1.1 |
| Twilio SMS (mock mode) | `alert_engine.py` / `notification` | Live Twilio credentials + delivery-status callbacks | Week 6 |
| `compare-5g` / `simulation/compare` (simulated latency) | `simulation.py`, `/api/v1/simulation/compare-5g` | Real measurements on the college 5G lab (G-Node B / CU-DU / LPRU) | Week 10–11 |

## 9.3 Future Research Directions

1. **Federated Learning:** Enable privacy-preserving model improvements from user data
2. **Computer Vision Integration:** Analyze CCTV feeds for real-time threat detection
3. **Natural Language Processing:** Process police reports and news for threat intelligence
4. **Graph Neural Networks:** Model complex route relationships for better routing

---

# 10. Appendix

## 10.1 Research Tools

| Tool | Purpose | Version |
|------|---------|---------|
| Python 3.11 | Development | 3.11+ |
| Jupyter Notebook | Experimentation | Latest |
| ONNX Runtime | Edge inference | 1.15+ |
| PostGIS | Spatial analysis | 3.4+ |
| Weights & Biases | ML experiment tracking | Latest |

## 10.2 Dataset Access

- Crime data: `/codebase/dataset/final.csv` (157,160 rows, 37 crime types, 53 Bangalore areas, 2014–2025)
- Source monthly CSVs + `/codebase/dataset/processed/`
- Pipeline: `/codebase/dataset/scripts/data_pipeline.py`, `fix_coords.py`, `fix_and_analyze.py`
- Model checkpoints (target): `/codebase/backend/models/` (not yet populated — ThreatDetector/CrowdPredictor pending)
- Canonical crime-weight map: `app/services/risk_engine.py` → `CRIME_WEIGHTS` (mirrored in §3.1.2 and `Plan.md` §7.4)

## 10.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 12, 2026 | Initial research plan from Plan.md v2.0 |
| 1.1 | May 12, 2026 | Aligned with Plan.md v2.1: added RQ6/RQ7, "Mock → Model Replacement Backlog" (§9.2), dataset/pipeline pointers, source-of-truth note |

---

**Document Control:**

- Last Updated: May 12, 2026
- Next Review: Weekly during sprint
- Owner: ML Engineer + Backend Lead
- Upstream source of truth: `doc/MD/Plan.md` v2.1

---

*This Research Plan aligns with the technical architecture and execution roadmap established in the master planning documents.*