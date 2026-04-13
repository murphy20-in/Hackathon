# Phase 5: Risk Scoring Engine

## 1. Phase Overview

**Objective:** Build the intelligent risk scoring engine that assigns a quantitative safety score to every route segment, enabling SafeRoute AI to rank routes from safest to riskiest and recommend the optimal path.

**Why This Phase Matters:**  
This is the algorithmic brain of SafeRoute AI. While the heatmap shows overall crime density, the risk engine computes per-segment scores factoring in crime proximity, severity weighting, time-of-day adjustments, and road infrastructure. This transforms the system from a "crime map" into an actionable "safe route recommender."

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Segment Risk Scorer** | Algorithm that scores each 100m segment of a route based on nearby crime data |
| 2 | **Multi-Factor Risk Model** | Composite score from crime density, severity, category weight, recency, and infrastructure |
| 3 | **Route Comparator** | Ranks alternative routes by overall safety score |
| 4 | **Risk Score API** | Endpoint that accepts route geometry and returns segment-level + overall scores |
| 5 | **Safest Route Selector** | Algorithm to select the recommended route balancing safety and travel time |
| 6 | **Color-Coded Route Segments** | Frontend rendering of routes with segment colors (green → red) based on risk |
| 7 | **Scoring Configuration** | Admin-adjustable weights for each risk factor |

---

## 3. Code Deliverables

### New Files

```
server/src/
├── services/
│   ├── riskEngine/
│   │   ├── segmentScorer.js         # Core: score a single route segment
│   │   ├── routeScorer.js           # Score entire route (aggregate segments)
│   │   ├── routeComparator.js       # Compare and rank multiple routes
│   │   ├── riskFactors.js           # Individual factor calculators
│   │   └── config.js                # Weights and thresholds configuration
│   └── riskEngine.service.js        # Public service interface
├── routes/
│   └── risk.routes.js               # /api/v1/risk/* endpoints
├── controllers/
│   └── risk.controller.js           # Request handling
└── utils/
    ├── geomath.js                   # Haversine, segment splitting, buffer
    └── normalization.js             # Min-max and z-score normalizers

client/src/
├── components/
│   ├── Route/
│   │   ├── SafetyScoreBadge.jsx     # Displays route score (e.g., 7.4/10)
│   │   ├── SegmentedRoute.jsx       # Multi-color polyline per segment
│   │   └── RouteComparison.jsx      # Side-by-side route safety comparison
│   └── Score/
│       ├── RiskBreakdown.jsx         # Expandable risk factor details
│       └── ScoreExplanation.jsx      # "Why this score?" tooltip
├── hooks/
│   └── useRiskScore.js              # Fetch risk scores for routes
└── utils/
    └── colorScale.js                # Score → color mapping function
```

### Risk Scoring Algorithm

```javascript
// server/src/services/riskEngine/segmentScorer.js

const WEIGHTS = {
  crimeDensity: 0.30,     // Number of crimes within buffer
  severityAvg: 0.25,      // Average severity of nearby crimes
  categoryWeight: 0.20,   // Higher for crimes against women
  recency: 0.15,          // Recent crimes weighted more
  infrastructure: 0.10    // Street lights, CCTV, road type
};

function scoreSegment(segment, crimeData, infrastructure) {
  const buffer = 200; // meters
  const nearbyCrimes = getCrimesWithinBuffer(segment.midpoint, buffer, crimeData);

  const factors = {
    crimeDensity:   normalizeDensity(nearbyCrimes.length, buffer),
    severityAvg:    avgSeverity(nearbyCrimes) / 5.0,
    categoryWeight: categoryRiskWeight(nearbyCrimes),
    recency:        recencyDecay(nearbyCrimes),
    infrastructure: 1.0 - infrastructureScore(segment, infrastructure)
  };

  // Weighted sum → 0 (safest) to 1 (most dangerous)
  const riskScore = Object.keys(WEIGHTS).reduce((sum, key) => {
    return sum + WEIGHTS[key] * factors[key];
  }, 0);

  // Invert to safety score: 10 (safest) to 0 (most dangerous)
  const safetyScore = Math.round((1 - riskScore) * 10 * 10) / 10;

  return { ...segment, riskScore, safetyScore, factors };
}
```

---

## 4. API Contracts

### Score a Route

```
POST /api/v1/risk/score-route
Body: {
  "route_id": "route_1",
  "geometry": { "type": "LineString", "coordinates": [[77.5946,12.9716], ...] },
  "segment_length_m": 100,
  "time_context": "2026-04-11T22:00:00Z"
}

Response 200:
{
  "route_id": "route_1",
  "overall_safety_score": 6.8,
  "overall_risk_level": "moderate",
  "segments": [
    {
      "index": 0,
      "start": [77.5946, 12.9716],
      "end": [77.5955, 12.9710],
      "safety_score": 8.2,
      "risk_level": "low",
      "factors": {
        "crime_density": 0.12,
        "severity_avg": 0.20,
        "category_weight": 0.15,
        "recency": 0.08,
        "infrastructure": 0.05
      },
      "color": "#4CAF50"
    },
    {
      "index": 1,
      "safety_score": 3.1,
      "risk_level": "high",
      "factors": { ... },
      "color": "#F44336"
    }
  ],
  "risk_summary": {
    "high_risk_segments": 3,
    "moderate_risk_segments": 8,
    "low_risk_segments": 12,
    "worst_segment_index": 5,
    "best_segment_index": 18
  }
}
```

### Compare Routes

```
POST /api/v1/risk/compare
Body: {
  "routes": [
    { "id": "route_1", "geometry": {...} },
    { "id": "route_2", "geometry": {...} },
    { "id": "route_3", "geometry": {...} }
  ],
  "time_context": "2026-04-11T22:00:00Z"
}

Response 200:
{
  "recommended": "route_2",
  "rankings": [
    { "route_id": "route_2", "safety_score": 7.9, "distance_km": 4.8, "duration_min": 58, "rank": 1 },
    { "route_id": "route_1", "safety_score": 6.8, "distance_km": 4.2, "duration_min": 52, "rank": 2 },
    { "route_id": "route_3", "safety_score": 4.2, "distance_km": 3.9, "duration_min": 48, "rank": 3 }
  ],
  "trade_off_note": "Route 2 is 14% longer but 16% safer than the shortest route."
}
```

---

## 5. Data Flow

```
User selects origin + destination (Phase 2)
       │
       ▼
Phase 2 returns 2-3 route alternatives with geometries
       │
       ▼
POST /api/v1/risk/compare (all routes + current time)
       │
       ▼
routeComparator.js:
  For each route:
    1. Split geometry into 100m segments (geomath.js)
    2. For each segment:
       a. Query crime_incidents within 200m buffer (PostGIS)
       b. Calculate each risk factor
       c. Compute weighted composite score
    3. Aggregate segment scores → overall route score
       │
       ▼
Rank routes by safety_score → mark recommended
       │
       ▼
Client receives scores → SegmentedRoute renders color-coded polylines
RouteComparison shows ranked cards with SafetyScoreBadge
```

**Integration with Previous Phases:**
- **Phase 2:** Receives route geometries from directions API
- **Phase 3:** Queries crime_incidents table for segment scoring
- **Phase 4:** Risk scores complement the heatmap — heatmap = area overview, risk score = route-specific

---

## 6. Dependencies

### Previous Phases
- **Phase 2:** Route geometries from directions API
- **Phase 3:** crime_incidents table, PostGIS spatial queries, police_stations data

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `@turf/turf` | Segment splitting, buffer, distance calculations |
| PostGIS `ST_DWithin` | Radius queries for nearby crimes |
| `chroma-js` | Score → color gradient mapping |
| Redis | Caching scored routes (TTL: 5 min) |

---

## 7. Setup Instructions

```bash
# 1. Install dependencies
cd server && npm install @turf/turf
cd ../client && npm install chroma-js

# 2. Ensure prerequisites
# - Phase 3: Crime data loaded (minimum 500 records)
# - Phase 2: Directions API functional

# 3. Configure scoring weights (optional)
# Edit server/src/services/riskEngine/config.js

# 4. Test scoring
curl -X POST http://localhost:5000/api/v1/risk/score-route \
  -H "Content-Type: application/json" \
  -d '{"route_id":"test","geometry":{"type":"LineString","coordinates":[[77.5946,12.9716],[77.5955,12.9710],[77.5970,12.9700]]},"segment_length_m":100}'

# 5. Verify in UI
# Select a route → should see color-coded segments and safety score badge
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Score a route with known crime data | Segments near crimes score lower | ☐ |
| 2 | Score a route in crime-free area | All segments score 8+ (safe) | ☐ |
| 3 | Compare 3 routes | Safest route correctly ranked #1 | ☐ |
| 4 | Segment splitting at 100m | Correct number of segments for route length | ☐ |
| 5 | Category weighting | Harassment-heavy areas score worse than theft-heavy | ☐ |
| 6 | Recency decay | Year-old crimes contribute less than month-old | ☐ |
| 7 | Color-coded segments render on map | Visible green → yellow → red gradient | ☐ |
| 8 | Safety badge displays on route card | Score like "7.4/10" shown | ☐ |
| 9 | Trade-off note in comparison | Sensible text explaining safety vs distance | ☐ |
| 10 | Performance: score 3 routes < 2s | Acceptable latency for real-time use | ☐ |
| 11 | Invalid geometry returns 400 | Proper error message | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Routes display with visibly different segment colors (green → red)
- [ ] Safety score badge shows on each route card (e.g., "Safety: 7.4/10")
- [ ] Recommended route highlighted with "Safest Route" label
- [ ] Clicking on a red segment shows risk factor breakdown
- [ ] Route comparison panel shows rankings with trade-off notes
- [ ] Score computation completes within 2 seconds for 3 routes

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Risk scores feel arbitrary without explanation | High | RiskBreakdown component explains each factor's contribution |
| Sparse crime data → all scores similar | Medium | Increase scoring sensitivity; amplify small differences in presentation |
| Scoring latency too high (complex routes) | Medium | Pre-compute grid-level scores; cache segment scores |
| Infrastructure data unavailable | Medium | Default infrastructure factor to neutral (0.5); mark as "data pending" |
| Users distrust AI-generated scores | Medium | Show transparency panel: "Based on 23 incidents within 200m" |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Segment splitting algorithm (Turf.js) | 2h |
| Risk factor calculators (5 factors) | 5h |
| Weighted scoring aggregation | 2h |
| Route comparison and ranking | 3h |
| Risk score API endpoints | 3h |
| Color-coded segment rendering | 3h |
| Safety score badge + breakdown UI | 3h |
| Redis caching for scored routes | 1h |
| Testing and tuning weights | 3h |
| **Total** | **~25h** |

---

## 12. Deliverable Output Summary

- ✅ Multi-factor risk scoring algorithm (density, severity, category, recency, infrastructure)
- ✅ Per-segment scoring for 100m route chunks
- ✅ Route comparison engine ranking alternatives by safety
- ✅ API endpoints for scoring individual routes and comparing multiple
- ✅ Color-coded route segments on map (green = safe, red = risky)
- ✅ Safety score badges on route cards
- ✅ Risk factor breakdown component ("Why this score?")
- ✅ Recommended route with trade-off explanation
- ✅ Configurable scoring weights for tuning
