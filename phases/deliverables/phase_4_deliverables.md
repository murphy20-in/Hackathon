# Phase 4: Heatmap Visualization

## 1. Phase Overview

**Objective:** Build a real-time, interactive crime density heatmap layer on top of the map — enabling users to visually assess safety levels across the city at a glance.

**Why This Phase Matters:**  
A heatmap is the most intuitive way to communicate risk. Users can instantly see danger zones (red hotspots) and safe corridors (green/cool areas) without reading numbers. This phase transforms raw crime data from Phase 3 into a compelling visual layer that drives user trust and decision-making.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Heatmap Rendering Engine** | Leaflet.heat / Mapbox GL heatmap layer with configurable intensity and radius |
| 2 | **Heatmap Data API** | Backend endpoint that returns aggregated crime density points optimized for heatmap rendering |
| 3 | **Dynamic Filtering Controls** | UI controls to filter heatmap by crime category, severity, and time range |
| 4 | **Zoom-Responsive Density** | Heatmap auto-adjusts resolution and clustering based on zoom level |
| 5 | **Color Gradient Legend** | Visual legend mapping colors to risk intensity (green → yellow → orange → red) |
| 6 | **Heatmap Toggle** | On/off switch to toggle heatmap overlay without losing map context |
| 7 | **Performance-Optimized Clustering** | Server-side grid aggregation for large datasets to prevent frontend slowdown |

---

## 3. Code Deliverables

### New Files

```
client/src/
├── components/
│   ├── Heatmap/
│   │   ├── HeatmapLayer.jsx        # Leaflet.heat integration
│   │   ├── HeatmapControls.jsx     # Category, severity, time filters
│   │   ├── HeatmapLegend.jsx       # Color gradient legend
│   │   └── HeatmapToggle.jsx       # On/off switch
│   └── Filters/
│       ├── CategoryFilter.jsx       # Crime category multi-select
│       ├── SeveritySlider.jsx       # Severity range slider (1-5)
│       └── TimeRangeFilter.jsx      # Date range / time-of-day picker
├── hooks/
│   └── useHeatmapData.js           # Fetch + cache heatmap data
└── utils/
    └── heatmapConfig.js            # Gradient colors, radius, intensity settings

server/src/
├── routes/
│   └── heatmap.routes.js           # /api/v1/heatmap/* endpoints
├── controllers/
│   └── heatmap.controller.js       # Heatmap data aggregation logic
└── services/
    └── heatmap.service.js          # Grid-based density computation, caching
```

---

## 4. API Contracts

### Get Heatmap Data

```
GET /api/v1/heatmap/density?sw_lat=12.90&sw_lon=77.55&ne_lat=13.00&ne_lon=77.65&zoom=14&category=harassment,assault&severity_min=2&from=2024-01-01&to=2024-12-31

Response 200:
{
  "zoom": 14,
  "grid_size_m": 200,
  "points": [
    { "lat": 12.9421, "lon": 77.5834, "intensity": 0.87, "count": 23 },
    { "lat": 12.9456, "lon": 77.5901, "intensity": 0.42, "count": 8 },
    { "lat": 12.9510, "lon": 77.5780, "intensity": 0.15, "count": 2 }
  ],
  "meta": {
    "total_incidents": 312,
    "max_density": 0.87,
    "generated_at": "2026-04-11T12:00:00Z"
  }
}
```

### Get Heatmap for Route Corridor

```
POST /api/v1/heatmap/corridor
Body: {
  "route_geometry": { "type": "LineString", "coordinates": [...] },
  "buffer_m": 500,
  "category": ["harassment", "robbery"]
}

Response 200:
{
  "corridor_points": [
    { "lat": 12.9421, "lon": 77.5834, "intensity": 0.65, "distance_from_route_m": 120 },
    ...
  ],
  "corridor_risk_avg": 0.43
}
```

---

## 5. Data Flow

```
User adjusts filters (category, severity, time)
       │
       ▼
useHeatmapData hook triggers API call
       │
       ▼
GET /api/v1/heatmap/density?bbox=...&filters=...
       │
       ▼
heatmap.service.js:
  1. Query crime_incidents within bbox + filters
  2. Grid-aggregate: divide bbox into cells (size based on zoom)
  3. Count incidents per cell → normalize to 0-1 intensity
  4. Cache result in Redis (key = hash(bbox + filters + zoom), TTL: 5min)
       │
       ▼
Return grid-aggregated points
       │
       ▼
HeatmapLayer.jsx receives points → renders via Leaflet.heat
HeatmapLegend.jsx displays gradient scale
```

**Integration with Previous Phases:**
- **Phase 2:** Heatmap renders on the same MapContainer component
- **Phase 3:** Queries crime_incidents table via PostGIS spatial functions
- The heatmap layer is an additive overlay — toggling it doesn't affect route rendering

---

## 6. Dependencies

### Previous Phases
- **Phase 2:** MapContainer component for rendering the heatmap layer
- **Phase 3:** crime_incidents table with PostGIS spatial data and indexes

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `leaflet.heat` (^0.2.0) | Heatmap rendering plugin for Leaflet |
| `chroma-js` | Color gradient generation for legend |
| `date-fns` | Date range manipulation in filters |
| Redis | Caching aggregated heatmap data |

---

## 7. Setup Instructions

```bash
# 1. Install new frontend dependencies
cd client
npm install leaflet.heat chroma-js date-fns

# 2. Ensure crime data is loaded (Phase 3 prerequisite)
curl "http://localhost:5000/api/v1/crime/bbox?sw_lat=12.8&sw_lon=77.4&ne_lat=13.1&ne_lon=77.8"
# Should return crime incidents

# 3. Start services
cd server && npm run dev
cd ../client && npm run dev

# 4. Test heatmap in browser
# Navigate to http://localhost:5173
# Toggle heatmap layer ON → should see colored density overlay
# Adjust filters → heatmap should update dynamically
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Heatmap renders on map | Colored blobs visible over crime hotspots | ☐ |
| 2 | Toggle heatmap off/on | Layer disappears and reappears | ☐ |
| 3 | Filter by category="robbery" | Only robbery incidents affect heatmap | ☐ |
| 4 | Adjust severity slider to 4-5 | Heatmap shows only high-severity areas | ☐ |
| 5 | Zoom in → heatmap resolution increases | More granular density at higher zoom | ☐ |
| 6 | Zoom out → heatmap clusters | Broader, aggregated view | ☐ |
| 7 | Pan to area with no data | No heatmap artifacts shown | ☐ |
| 8 | Legend renders with correct gradient | Green → Yellow → Orange → Red scale | ☐ |
| 9 | API response cached in Redis | Second identical request faster | ☐ |
| 10 | Corridor heatmap for a route | Points within 500m buffer returned | ☐ |
| 11 | Large dataset (5000+ points) | No frontend freeze, renders in < 1s | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Heatmap visibly distinguishes safe and risky areas
- [ ] Red hotspots align with known high-crime zones in demo city
- [ ] Category filter dynamically reshapes heatmap in real time
- [ ] Severity slider visibly changes intensity distribution
- [ ] Legend is visible and correctly labeled
- [ ] Heatmap toggle works smoothly without map flicker
- [ ] Performance: no visible lag when panning/zooming with heatmap enabled

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Frontend freezes with 10,000+ raw points | High | Server-side grid aggregation; limit to 2000 points per response |
| Heatmap misleading with sparse data | Medium | Show minimum data threshold warning; adjust radius dynamically |
| Overlapping with route polylines | Low | Use z-index layering; heatmap at lower z-index than routes |
| Color-blind users can't read gradient | Medium | Offer alternative color schemes (blue-purple, or pattern overlay) |
| Cache invalidation when new data loads | Low | TTL-based expiry (5 min); manual flush endpoint for admin |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Leaflet.heat integration | 3h |
| Heatmap data API (grid aggregation) | 4h |
| Filter controls UI (category, severity, time) | 4h |
| Zoom-responsive density adjustment | 2h |
| Color gradient legend component | 1h |
| Toggle and layer management | 1h |
| Redis caching for heatmap data | 2h |
| Corridor heatmap endpoint | 2h |
| Performance optimization (large datasets) | 2h |
| Testing | 2h |
| **Total** | **~23h** |

---

## 12. Deliverable Output Summary

- ✅ Interactive heatmap layer rendering crime density on the map
- ✅ Server-side grid aggregation for performance with large datasets
- ✅ Dynamic filters: category, severity range, and time period
- ✅ Zoom-responsive resolution — granular at high zoom, clustered at low zoom
- ✅ Color gradient legend (green → red safety spectrum)
- ✅ Heatmap toggle without disrupting other map layers
- ✅ Corridor heatmap API for route-specific risk visualization
- ✅ Redis caching for aggregated heatmap responses
