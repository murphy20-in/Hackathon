# Phase 6: Time-Based Intelligence

## 1. Phase Overview

**Objective:** Enhance the risk scoring engine and heatmap with temporal awareness — adjusting safety assessments based on time-of-day, day-of-week, and seasonal patterns to provide contextually accurate recommendations.

**Why This Phase Matters:**  
A street that's bustling and safe at 2 PM can be deserted and dangerous at 2 AM. Static risk scores ignore this reality. Time-based intelligence makes SafeRoute AI's recommendations context-aware and dramatically more useful for real-world navigation — especially for women traveling at night.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Temporal Crime Analysis Module** | Analyze crime data by hour-of-day, day-of-week, and month to build temporal profiles |
| 2 | **Time-Adjusted Risk Multiplier** | Modifier that scales segment risk scores based on current or selected time |
| 3 | **Time-of-Day Slider** | UI slider allowing users to preview safety at different times (e.g., "What if I leave at 10 PM?") |
| 4 | **Temporal Heatmap Mode** | Heatmap that changes intensity based on selected time window |
| 5 | **Peak Danger Hours Indicator** | Visual indicator showing the riskiest hours for a selected area or route |
| 6 | **Daylight Awareness** | Integration with sunrise/sunset data to factor ambient light into scoring |
| 7 | **Historical Trend API** | API returning crime frequency trends over time for an area |

---

## 3. Code Deliverables

### New Files

```
server/src/
├── services/
│   ├── temporal/
│   │   ├── temporalAnalyzer.js      # Build hour/day/month crime distributions
│   │   ├── timeMultiplier.js        # Calculate time-based risk multiplier
│   │   ├── daylightService.js       # Sunrise/sunset calculation
│   │   └── trendAnalyzer.js         # Historical trend computation
│   └── riskEngine/
│       └── config.js                # (UPDATED) Add time-weight configuration
├── routes/
│   └── temporal.routes.js           # /api/v1/temporal/* endpoints
├── controllers/
│   └── temporal.controller.js
└── jobs/
    └── buildTemporalProfiles.js     # Scheduled job to pre-compute temporal stats

data/
└── precomputed/
    └── temporal_profiles.json       # Pre-computed hourly risk profiles per ward

client/src/
├── components/
│   ├── Temporal/
│   │   ├── TimeSlider.jsx           # 24-hour circular or linear slider
│   │   ├── DangerHoursChart.jsx     # Bar chart showing risky hours
│   │   ├── DayNightIndicator.jsx    # Sun/moon icon with light status
│   │   └── TrendSparkline.jsx       # Mini chart showing monthly trend
│   └── Heatmap/
│       └── HeatmapLayer.jsx         # (UPDATED) Accept time parameter
├── hooks/
│   └── useTemporalData.js           # Fetch temporal profiles
└── utils/
    └── timeUtils.js                 # Hour buckets, day-of-week helpers
```

### Time Multiplier Algorithm

```javascript
// server/src/services/temporal/timeMultiplier.js

const HOUR_RISK_PROFILE = {
  // Normalized risk multiplier per hour (pre-computed from data)
  // 1.0 = baseline, >1.0 = higher risk, <1.0 = lower risk
  0: 1.8,  1: 1.9,  2: 1.7,  3: 1.5,   // Late night
  4: 1.3,  5: 1.1,  6: 0.8,  7: 0.6,   // Early morning
  8: 0.5,  9: 0.5,  10: 0.5, 11: 0.5,  // Business hours
  12: 0.5, 13: 0.5, 14: 0.5, 15: 0.5,
  16: 0.6, 17: 0.7, 18: 0.8, 19: 0.9,  // Evening
  20: 1.1, 21: 1.3, 22: 1.5, 23: 1.7   // Night
};

function getTimeMultiplier(hour, wardId, wardProfiles) {
  // Use ward-specific profile if available, else fallback to global
  const profile = wardProfiles?.[wardId] || HOUR_RISK_PROFILE;
  return profile[hour] || 1.0;
}

function getDaylightMultiplier(timestamp, lat, lon) {
  const { sunrise, sunset } = getSunTimes(timestamp, lat, lon);
  const isNight = timestamp < sunrise || timestamp > sunset;
  return isNight ? 1.3 : 1.0;  // 30% risk increase after dark
}

function computeTemporalScore(baseScore, timestamp, wardId, lat, lon, profiles) {
  const hour = new Date(timestamp).getHours();
  const timeMult = getTimeMultiplier(hour, wardId, profiles);
  const dayMult = getDaylightMultiplier(timestamp, lat, lon);
  return Math.min(baseScore * timeMult * dayMult, 1.0); // Clamp to [0, 1]
}
```

---

## 4. API Contracts

### Get Temporal Risk Profile

```
GET /api/v1/temporal/profile?lat=12.9716&lon=77.5946&radius_km=1

Response 200:
{
  "location": { "lat": 12.9716, "lon": 77.5946 },
  "ward": "Shanthala Nagar",
  "hourly_risk": {
    "0": 0.82, "1": 0.88, "2": 0.79, ..., "23": 0.75
  },
  "peak_danger_hours": [0, 1, 2, 22, 23],
  "safest_hours": [8, 9, 10, 11, 14, 15],
  "day_of_week": {
    "monday": 0.6, "tuesday": 0.55, ..., "saturday": 0.85, "sunday": 0.7
  },
  "daylight": {
    "sunrise": "06:12",
    "sunset": "18:34",
    "current_status": "daylight"
  }
}
```

### Get Time-Adjusted Route Score

```
POST /api/v1/risk/score-route
Body: {
  "route_id": "route_1",
  "geometry": { "type": "LineString", "coordinates": [...] },
  "segment_length_m": 100,
  "time_context": "2026-04-11T22:30:00Z"    ← Time-aware parameter
}

Response 200:
{
  "route_id": "route_1",
  "overall_safety_score": 5.2,               ← Lower at night vs Phase 5's 6.8
  "time_context": "22:30 IST (Night)",
  "time_impact": "-1.6 from baseline",
  "segments": [...]
}
```

### Get Historical Trend

```
GET /api/v1/temporal/trend?ward_id=12&months=6

Response 200:
{
  "ward": "Koramangala",
  "trend_direction": "declining",
  "monthly": [
    { "month": "2025-11", "incidents": 45 },
    { "month": "2025-12", "incidents": 38 },
    { "month": "2026-01", "incidents": 42 },
    ...
  ]
}
```

---

## 5. Data Flow

```
User selects time via TimeSlider (or system uses current time)
       │
       ▼
Client sends time_context with route scoring / heatmap requests
       │
       ▼
Backend:
  1. Load pre-computed temporal profiles for relevant wards
  2. Calculate hour-of-day multiplier
  3. Calculate daylight multiplier (sunrise/sunset)
  4. Apply multipliers to base risk scores from Phase 5
       │
       ▼
Adjusted scores returned → UI updates:
  - Segment colors shift (more red at night)
  - Safety badges update
  - Heatmap intensity changes
  - DangerHoursChart shows current position on timeline
```

**Integration with Previous Phases:**
- **Phase 3:** Adds `occurred_at` hour extraction for temporal profiling
- **Phase 4:** Heatmap density API now accepts `time_hour` parameter
- **Phase 5:** Risk engine's `segmentScorer.js` now calls `computeTemporalScore()` as a post-processing step

---

## 6. Dependencies

### Previous Phases
- **Phase 3:** crime_incidents table with `occurred_at` timestamps
- **Phase 4:** Heatmap layer parameterized by time
- **Phase 5:** Base risk scoring engine for score modification

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `suncalc` (^1.9) | Sunrise/sunset/twilight calculation |
| `chart.js` or `recharts` | DangerHoursChart and TrendSparkline rendering |
| Node-cron | Scheduled temporal profile computation |

---

## 7. Setup Instructions

```bash
# 1. Install dependencies
cd server && npm install suncalc
cd ../client && npm install recharts

# 2. Build temporal profiles (first-time setup)
node server/src/jobs/buildTemporalProfiles.js
# Generates data/precomputed/temporal_profiles.json

# 3. Verify temporal API
curl "http://localhost:5000/api/v1/temporal/profile?lat=12.9716&lon=77.5946&radius_km=1"

# 4. Test time-adjusted scoring
curl -X POST http://localhost:5000/api/v1/risk/score-route \
  -H "Content-Type: application/json" \
  -d '{"route_id":"test","geometry":{...},"time_context":"2026-04-11T02:00:00Z"}'
# Compare score at 2 AM vs 2 PM — night should be lower

# 5. Test TimeSlider in UI
# Navigate to http://localhost:5173
# Drag time slider → watch heatmap and route colors change
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Score route at 2 PM vs 2 AM | Night score significantly lower than day | ☐ |
| 2 | Temporal profile for a ward | 24-hour risk distribution returned | ☐ |
| 3 | Peak danger hours identified | Late night hours (0-3, 22-23) flagged | ☐ |
| 4 | Daylight multiplier after sunset | 30% risk increase applied | ☐ |
| 5 | Time slider updates heatmap | Heatmap intensity visibly changes | ☐ |
| 6 | Time slider updates route colors | Route segments shift to redder at night | ☐ |
| 7 | Day-of-week variation | Saturday night scores worse than Tuesday | ☐ |
| 8 | Historical trend shows direction | "declining" or "increasing" correctly computed | ☐ |
| 9 | Sunrise/sunset times are correct | Match known values for demo city | ☐ |
| 10 | Pre-computed profiles load fast | Profile fetch < 50ms (from cache/file) | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Time slider visually changes heatmap and route colors in real-time
- [ ] Dragging slider from noon to midnight shows dramatically different risk landscape
- [ ] Safety score badge updates when time changes (e.g., 7.4 at day → 4.8 at night)
- [ ] DangerHoursChart clearly shows peak risk hours for selected area
- [ ] Day/night icon reflects current or selected time
- [ ] "Time impact" note shows how much the score changed from baseline

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Crime data lacks time-of-day resolution | High | Use synthetic time distributions based on NCRB national statistics |
| Temporal profiles too granular → noisy | Medium | Smooth with 3-hour rolling average; use ward-level not point-level |
| Sunrise/sunset calc wrong for location | Low | Verify against known sources; use `suncalc` which is well-tested |
| Users confused by score changing with time | Medium | Clear UI label: "Safety at 10:30 PM" + explanation tooltip |
| Pre-computation job takes too long | Low | Run incrementally; only recompute wards with new data |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Temporal crime analysis (hour/day/month distribution) | 4h |
| Time multiplier algorithm | 3h |
| Daylight service (suncalc integration) | 1h |
| Pre-compute temporal profiles job | 3h |
| Temporal API endpoints | 2h |
| TimeSlider UI component | 3h |
| DangerHoursChart + TrendSparkline | 3h |
| Integrate with Phase 5 scoring engine | 2h |
| Integrate with Phase 4 heatmap | 2h |
| Testing and calibration | 2h |
| **Total** | **~25h** |

---

## 12. Deliverable Output Summary

- ✅ Temporal crime profiling (24-hour, 7-day, 12-month distributions)
- ✅ Time-based risk multiplier integrated into scoring engine
- ✅ Daylight/darkness awareness via sunrise/sunset calculation
- ✅ Interactive time slider changing heatmap and route scores in real-time
- ✅ DangerHoursChart and TrendSparkline visualizations
- ✅ Historical trend API for month-over-month crime analysis
- ✅ Pre-computed temporal profiles for fast query performance
- ✅ Safety scores that reflect "now" or any user-selected time
