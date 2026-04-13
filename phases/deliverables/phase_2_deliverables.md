# Phase 2: Maps + Routing

## 1. Phase Overview

**Objective:** Implement the core mapping and route calculation engine that powers SafeRoute AI's navigation — displaying maps, geocoding locations, computing multiple route options, and rendering them on an interactive canvas.

**Why This Phase Matters:**  
Navigation is the user-facing centerpiece of the product. Without a functional map and routing engine, there is no product to demo. This phase delivers the visual foundation that every subsequent phase (heatmaps, risk scoring, SOS) layers onto.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Interactive Map Component** | Leaflet/Mapbox GL JS map with pan, zoom, geolocation, and tile layer switching |
| 2 | **Geocoding Service** | Address-to-coordinates and reverse geocoding via Nominatim or Mapbox Geocoding API |
| 3 | **Route Computation Engine** | Multi-route calculation using OSRM or Mapbox Directions API with `alternatives=true` |
| 4 | **Route Rendering Layer** | Polyline overlays with color-coded segments for each route alternative |
| 5 | **Search Bar with Autocomplete** | Origin/Destination input fields with debounced geocoding suggestions |
| 6 | **User Location Tracking** | Browser Geolocation API with continuous watch for real-time position updates |
| 7 | **Route Metadata Display** | Distance, estimated duration, and turn-by-turn summary for each route |
| 8 | **Backend Route Proxy** | Server-side proxy to routing APIs to protect API keys and enable caching |

---

## 3. Code Deliverables

### New Files

```
client/src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.jsx        # Core Leaflet/Mapbox wrapper
│   │   ├── RouteLayer.jsx          # Route polyline rendering
│   │   ├── UserMarker.jsx          # Current location pin
│   │   └── MapControls.jsx         # Zoom, locate-me, layer toggle
│   ├── Search/
│   │   ├── SearchBar.jsx           # Dual input (origin + destination)
│   │   ├── SuggestionList.jsx      # Autocomplete dropdown
│   │   └── SearchContext.jsx       # Shared state for search inputs
│   └── Route/
│       ├── RouteCard.jsx           # Individual route summary card
│       └── RouteSelector.jsx       # List of alternative routes
├── hooks/
│   ├── useGeolocation.js           # Browser geolocation hook
│   └── useRouting.js               # Route fetch + state management
├── services/
│   ├── geocoding.js                # Geocoding API calls
│   └── routing.js                  # Route computation API calls
└── utils/
    └── mapHelpers.js               # Coordinate formatting, distance calc

server/src/
├── routes/
│   └── maps.routes.js              # /api/v1/maps/* route definitions
├── controllers/
│   └── maps.controller.js          # Geocode, directions, proxy logic
└── services/
    ├── geocoding.service.js         # Server-side geocoding with caching
    └── routing.service.js           # OSRM/Mapbox directions wrapper
```

---

## 4. API Contracts

### Geocode (Forward)

```
GET /api/v1/maps/geocode?q=MG+Road+Bangalore

Response 200:
{
  "results": [
    {
      "display_name": "MG Road, Bangalore, Karnataka, India",
      "lat": 12.9716,
      "lon": 77.5946,
      "type": "road"
    }
  ]
}
```

### Reverse Geocode

```
GET /api/v1/maps/reverse-geocode?lat=12.9716&lon=77.5946

Response 200:
{
  "address": "MG Road, Shanthala Nagar, Bangalore",
  "city": "Bangalore",
  "state": "Karnataka"
}
```

### Get Routes

```
POST /api/v1/maps/directions
Body: {
  "origin": { "lat": 12.9716, "lon": 77.5946 },
  "destination": { "lat": 12.9352, "lon": 77.6245 },
  "alternatives": true,
  "mode": "walking"
}

Response 200:
{
  "routes": [
    {
      "id": "route_1",
      "geometry": { "type": "LineString", "coordinates": [[77.5946,12.9716], ...] },
      "distance_km": 4.2,
      "duration_min": 52,
      "steps": [
        { "instruction": "Head south on MG Road", "distance_m": 340 },
        ...
      ]
    },
    {
      "id": "route_2",
      "geometry": { ... },
      "distance_km": 4.8,
      "duration_min": 58,
      "steps": [...]
    }
  ]
}
```

---

## 5. Data Flow

```
User types destination
       │
       ▼
SearchBar (debounce 300ms)
       │
       ▼
geocoding.js → GET /api/v1/maps/geocode
       │
       ▼
Server proxies to Nominatim/Mapbox → caches result in Redis (TTL: 24h)
       │
       ▼
SuggestionList renders options → User selects
       │
       ▼
useRouting hook → POST /api/v1/maps/directions
       │
       ▼
Server calls OSRM/Mapbox Directions API → returns 2-3 route alternatives
       │
       ▼
RouteLayer renders polylines on MapContainer
RouteSelector shows cards with distance/duration
```

**Integration with Phase 1:**
- Uses auth middleware from Phase 1 for all API calls
- Uses Redis connection from Phase 1 for geocode/route caching
- API routes register under the Express app from Phase 1

---

## 6. Dependencies

### Previous Phases
- **Phase 1:** Express server, auth middleware, Redis, database connection, project structure

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `leaflet` (^1.9) | Map rendering |
| `react-leaflet` (^4.x) | React bindings for Leaflet |
| `@mapbox/polyline` | Polyline encoding/decoding |
| OSRM (self-hosted or demo server) | Route computation |
| Nominatim API | Free geocoding |
| `lodash.debounce` | Search input debouncing |

---

## 7. Setup Instructions

```bash
# 1. Install frontend dependencies
cd client
npm install leaflet react-leaflet @mapbox/polyline lodash.debounce

# 2. Install backend dependencies
cd ../server
npm install axios node-cache

# 3. Configure environment
# Add to .env:
MAPBOX_ACCESS_TOKEN=pk.your_token_here    # Optional, if using Mapbox
OSRM_API_URL=https://router.project-osrm.org  # Free demo server
NOMINATIM_URL=https://nominatim.openstreetmap.org

# 4. Start services
docker-compose up -d
cd server && npm run dev
cd ../client && npm run dev

# 5. Test in browser
# Navigate to http://localhost:5173 → map should render
# Type an address → suggestions should appear
# Select origin + destination → routes should display
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Map renders on page load | Tile layer visible, centered on default location | ☐ |
| 2 | "Locate me" button works | Map pans to user's GPS coordinates | ☐ |
| 3 | Search "Bangalore" | Returns geocoded suggestions within 500ms | ☐ |
| 4 | Select origin + destination | Route polylines appear on map | ☐ |
| 5 | Multiple route alternatives shown | 2-3 routes with different colors | ☐ |
| 6 | Route card shows distance/duration | Correct values matching API response | ☐ |
| 7 | Click a route card | Corresponding polyline highlights on map | ☐ |
| 8 | Geocode caching works | Second identical query returns from Redis (faster) | ☐ |
| 9 | Invalid address returns empty | Graceful "no results found" message | ☐ |
| 10 | Map works on mobile viewport | Responsive layout, touch gestures work | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Map loads within 2 seconds with proper tile rendering
- [ ] User can search and select origin/destination via autocomplete
- [ ] At least 2 route alternatives displayed with different colors
- [ ] Route cards show distance and estimated walking time
- [ ] Clicking a route highlights it on the map
- [ ] "Locate me" button works (or falls back to default city center)
- [ ] No API keys exposed in frontend code (all proxied through backend)

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| OSRM demo server rate-limited | High | Self-host OSRM Docker container; pre-cache common routes |
| Nominatim usage policy violations | Medium | Respect 1 req/sec limit; implement server-side queue |
| Mapbox token over free tier | Medium | Use OpenStreetMap + OSRM as free fallback stack |
| Browser blocks geolocation | Low | Default to city center; show manual location picker |
| Large polyline data slows rendering | Medium | Simplify geometry with Douglas-Peucker; limit coordinate precision |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Map component setup (Leaflet + React) | 3h |
| Geocoding service (frontend + backend) | 3h |
| Search bar with autocomplete | 3h |
| Route computation API integration | 4h |
| Route rendering on map (polylines) | 3h |
| Route cards and selector UI | 2h |
| Geolocation hook and locate-me | 1h |
| Redis caching for geocode/routes | 2h |
| Testing and edge cases | 2h |
| **Total** | **~23h** |

---

## 12. Deliverable Output Summary

- ✅ Interactive map with pan/zoom/geolocation using Leaflet
- ✅ Geocoding service with autocomplete search bar
- ✅ Multi-route computation via OSRM/Mapbox Directions
- ✅ Route polylines rendered on map with color differentiation
- ✅ Route metadata cards (distance, duration, steps)
- ✅ Backend proxy protecting API keys with Redis caching
- ✅ Responsive map UI working on desktop and mobile viewports
- ✅ User location tracking via Geolocation API
