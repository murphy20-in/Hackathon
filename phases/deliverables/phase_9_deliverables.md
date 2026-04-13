# Phase 9: 5G Simulation + Demo Layer

## 1. Phase Overview

**Objective:** Build a simulation layer that demonstrates how 5G connectivity enhances SafeRoute AI's real-time capabilities — showcasing ultra-low latency location updates, high-bandwidth video streaming during SOS, edge computing for instant risk scoring, and network slicing for priority emergency channels.

**Why This Phase Matters:**  
The hackathon theme is "5G-Powered." Without a tangible 5G demonstration, the project is just another safety app. This phase creates visible, measurable proof of 5G's value — showing live latency comparisons (4G vs 5G), demonstrating edge-computed risk scores, and simulating priority network slicing for SOS events.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Latency Simulator** | Configurable network latency injection (4G: 50-100ms, 5G: 1-10ms) |
| 2 | **Bandwidth Simulator** | Throttle/accelerate data transfer rates for video/location streams |
| 3 | **5G vs 4G Comparison Dashboard** | Split-screen or toggle view showing real-time performance difference |
| 4 | **Edge Computing Simulation** | Risk score computation at simulated edge node (local) vs cloud (remote) |
| 5 | **Network Slicing Demo** | Priority channel for SOS traffic vs regular data, with visual queue |
| 6 | **Real-Time Metrics Panel** | Live display of latency, throughput, packet count, and jitter |
| 7 | **5G Benefit Annotations** | Contextual callouts throughout the app explaining 5G's role |
| 8 | **Demo Script Orchestrator** | Pre-configured demo scenarios with one-click execution |

---

## 3. Code Deliverables

### New Files

```
simulation/
├── core/
│   ├── latencySimulator.js       # Inject artificial latency into API responses
│   ├── bandwidthSimulator.js     # Throttle data stream rates
│   ├── networkSlicer.js          # Priority queue for SOS vs regular traffic
│   └── edgeCompute.js            # Simulate edge vs cloud processing
├── config/
│   ├── networkProfiles.js        # Pre-defined profiles: 5G, 4G, 3G, edge
│   └── demoScenarios.js          # Scripted demo sequences
├── metrics/
│   ├── metricsCollector.js       # Collect latency, throughput, jitter stats
│   └── metricsStore.js           # In-memory time-series for live dashboard
└── middleware/
    └── simulationMiddleware.js   # Express middleware to inject latency/bandwidth

server/src/
├── routes/
│   └── simulation.routes.js      # /api/v1/sim/* control endpoints
└── controllers/
    └── simulation.controller.js   # Toggle profiles, get metrics

client/src/
├── components/
│   ├── Simulation/
│   │   ├── NetworkToggle.jsx      # Switch between 4G/5G mode
│   │   ├── LatencyMeter.jsx       # Real-time latency gauge
│   │   ├── ThroughputChart.jsx    # Live bandwidth chart
│   │   ├── ComparisonView.jsx     # Side-by-side 4G vs 5G
│   │   ├── EdgeBadge.jsx          # "Computed at Edge" indicator
│   │   └── SlicingVisual.jsx      # Network slice priority visualization
│   ├── Demo/
│   │   ├── DemoPanel.jsx          # Demo scenario selector
│   │   └── DemoOverlay.jsx        # Guided demo annotations
│   └── Metrics/
│       └── MetricsDashboard.jsx   # Full metrics panel
├── hooks/
│   └── useNetworkMetrics.js       # WebSocket subscription to metrics
└── utils/
    └── simulationConfig.js        # Client-side profile definitions
```

### Network Profile Definitions

```javascript
// simulation/config/networkProfiles.js

module.exports = {
  '5G': {
    label: '5G Ultra-Low Latency',
    latency: { min: 1, max: 5, unit: 'ms' },
    bandwidth: { down: 1000, up: 500, unit: 'Mbps' },
    jitter: 1,
    packetLoss: 0.001,
    edgeEnabled: true,
    slicingEnabled: true
  },
  '4G': {
    label: '4G LTE',
    latency: { min: 30, max: 100, unit: 'ms' },
    bandwidth: { down: 50, up: 20, unit: 'Mbps' },
    jitter: 15,
    packetLoss: 0.01,
    edgeEnabled: false,
    slicingEnabled: false
  },
  '3G': {
    label: '3G (Degraded)',
    latency: { min: 100, max: 500, unit: 'ms' },
    bandwidth: { down: 5, up: 1, unit: 'Mbps' },
    jitter: 50,
    packetLoss: 0.05,
    edgeEnabled: false,
    slicingEnabled: false
  }
};
```

### Latency Injection Middleware

```javascript
// simulation/middleware/simulationMiddleware.js

const profiles = require('../config/networkProfiles');
let activeProfile = '5G';

function simulateLatency(req, res, next) {
  const profile = profiles[activeProfile];
  const delay = randomBetween(profile.latency.min, profile.latency.max);

  // Record metric
  metricsCollector.record('latency', delay, req.path);

  setTimeout(() => {
    res.setHeader('X-Simulated-Latency', `${delay}ms`);
    res.setHeader('X-Network-Profile', activeProfile);
    next();
  }, delay);
}

function setProfile(profile) {
  if (profiles[profile]) {
    activeProfile = profile;
    return true;
  }
  return false;
}
```

---

## 4. API Contracts

### Set Network Profile

```
POST /api/v1/sim/profile
Body: { "profile": "4G" }  // or "5G", "3G"

Response 200:
{
  "active_profile": "4G",
  "config": {
    "latency": { "min": 30, "max": 100 },
    "bandwidth": { "down": 50, "up": 20 },
    "edge_enabled": false
  }
}
```

### Get Live Metrics

```
GET /api/v1/sim/metrics?window=30s

Response 200:
{
  "profile": "5G",
  "window": "30s",
  "latency": {
    "avg_ms": 3.2,
    "p50_ms": 2.8,
    "p99_ms": 4.9,
    "samples": 45
  },
  "throughput": {
    "requests_per_sec": 12,
    "bytes_transferred": 245000
  },
  "edge_compute": {
    "risk_score_latency_ms": 2.1,      // Edge (5G)
    "cloud_equivalent_ms": 85.0         // What it would be without edge
  }
}
```

### WebSocket: Metrics Stream

```
WebSocket: ws://localhost:5000/ws/metrics

Server → Client (every 1 second):
{
  "type": "metrics_tick",
  "timestamp": "2026-04-11T22:35:01Z",
  "latency_ms": 3.1,
  "throughput_kbps": 850,
  "active_profile": "5G",
  "edge_active": true,
  "sos_priority_active": false
}
```

### Run Demo Scenario

```
POST /api/v1/sim/demo/run
Body: { "scenario": "sos_comparison" }

Response 200:
{
  "scenario": "sos_comparison",
  "steps": [
    { "step": 1, "desc": "Trigger SOS on 4G", "latency_ms": 78, "total_time_ms": 2340 },
    { "step": 2, "desc": "Trigger SOS on 5G", "latency_ms": 3, "total_time_ms": 890 },
    { "step": 3, "desc": "Difference", "improvement": "62% faster response" }
  ]
}
```

---

## 5. Data Flow

```
Demo Operator selects scenario (e.g., "SOS Comparison")
       │
       ▼
DemoPanel.jsx → POST /api/v1/sim/demo/run
       │
       ▼
Orchestrator:
  1. Set profile to "4G" → trigger SOS → measure latency
  2. Set profile to "5G" → trigger SOS → measure latency
  3. Compare and display results
       │
       ▼
ComparisonView.jsx:
  ┌──────────────────┬──────────────────┐
  │     4G Mode      │     5G Mode      │
  │  Latency: 78ms   │  Latency: 3ms    │
  │  SOS Time: 2.3s  │  SOS Time: 0.9s  │
  │  Video: Buffering │  Video: Smooth   │
  └──────────────────┴──────────────────┘

All metrics streamed via WebSocket → MetricsDashboard
```

**Integration with Previous Phases:**
- **Phase 2:** Route computation latency measured under different profiles
- **Phase 5:** Risk scoring latency compared: edge (5G) vs cloud (4G)
- **Phase 8:** SOS trigger-to-notification time compared across profiles
- Simulation middleware wraps ALL existing API endpoints — no changes to Phase 1-8 code

---

## 6. Dependencies

### Previous Phases
- **Phase 1-8:** All existing APIs and WebSocket channels (simulation wraps them transparently)

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `socket.io` (existing) | Metrics streaming |
| `chart.js` / `recharts` (existing) | Live metrics charts |
| `express` middleware pipeline | Latency injection |
| None new — simulation is self-contained | — |

---

## 7. Setup Instructions

```bash
# 1. No new dependencies needed (uses existing stack)

# 2. Enable simulation mode
# Add to .env:
SIMULATION_ENABLED=true
DEFAULT_NETWORK_PROFILE=5G

# 3. Restart server with simulation middleware
cd server && npm run dev
# Console should log: "🔬 Simulation mode ENABLED (profile: 5G)"

# 4. Test profile switching
curl -X POST http://localhost:5000/api/v1/sim/profile \
  -H "Content-Type: application/json" \
  -d '{"profile":"4G"}'

# 5. Observe latency headers
curl -i http://localhost:5000/api/v1/health
# Response header: X-Simulated-Latency: 52ms, X-Network-Profile: 4G

# 6. Open MetricsDashboard in UI
# Toggle between 4G/5G → observe latency gauge change in real time

# 7. Run pre-built demo scenario
curl -X POST http://localhost:5000/api/v1/sim/demo/run \
  -d '{"scenario":"sos_comparison"}'
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Set profile to 4G | API responses delayed by 30-100ms | ☐ |
| 2 | Set profile to 5G | API responses delayed by 1-5ms | ☐ |
| 3 | Set profile to 3G | API responses delayed by 100-500ms | ☐ |
| 4 | X-Simulated-Latency header present | Correct value in response headers | ☐ |
| 5 | Metrics dashboard shows live latency | Gauge updates every second | ☐ |
| 6 | 4G vs 5G comparison visible | Clear visual difference in metrics | ☐ |
| 7 | Edge badge appears in 5G mode | "Computed at Edge" shown for risk scores | ☐ |
| 8 | Edge badge hidden in 4G mode | "Computed in Cloud" or no badge | ☐ |
| 9 | SOS comparison demo runs | Shows 62%+ improvement in 5G | ☐ |
| 10 | Network slicing visual for SOS | Priority lane shown for SOS traffic in 5G | ☐ |
| 11 | Disable simulation mode | No latency injection, normal operation | ☐ |
| 12 | Demo scenario completes without errors | All steps execute sequentially | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] Network toggle (4G/5G) is prominent and easy for presenter to switch
- [ ] Latency difference is immediately visible (gauge or animation speed)
- [ ] SOS comparison shows dramatic time savings with 5G
- [ ] "Computed at Edge" badge visible during 5G mode risk scoring
- [ ] Network slicing visualization clearly shows SOS gets priority
- [ ] Metrics dashboard looks professional with live-updating charts
- [ ] Demo scenarios run with one click — no manual steps
- [ ] 5G benefit annotations appear at key moments in the flow

**Pre-configured Demo Scenarios:**

| Scenario | What It Shows |
|----------|---------------|
| `sos_comparison` | SOS trigger-to-notification: 4G (2.3s) vs 5G (0.9s) |
| `route_scoring` | Risk score computation: cloud (85ms) vs edge (2ms) |
| `live_tracking` | Location update frequency: 4G (every 5s) vs 5G (every 1s) |
| `video_sos` | Video evidence quality: 4G (360p, buffering) vs 5G (1080p, smooth) |
| `full_demo` | Runs all scenarios sequentially with narration prompts |

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Audience doesn't understand simulation vs real 5G | High | Clear on-screen labels: "Simulated 5G Conditions"; explain in pitch |
| Latency differences too subtle to notice | Medium | Amplify with visual cues: slow-motion vs instant animations |
| Simulation middleware affects real performance | Low | Lightweight setTimeout-based; negligible overhead |
| Judges question lack of real 5G hardware | Medium | Frame as "5G-ready architecture" + reference real 5G specs in pitch |
| Demo scenario fails mid-presentation | Medium | Pre-run all scenarios; have recorded fallback video |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Latency simulator middleware | 3h |
| Bandwidth simulator | 2h |
| Network profile system (4G/5G/3G) | 2h |
| Metrics collector + store | 3h |
| Metrics dashboard UI (gauges, charts) | 4h |
| 4G vs 5G comparison view | 3h |
| Edge computing simulation | 2h |
| Network slicing visualization | 3h |
| Demo scenario orchestrator | 3h |
| 5G benefit annotations | 2h |
| WebSocket metrics stream | 2h |
| Testing all scenarios | 2h |
| **Total** | **~31h** |

---

## 12. Deliverable Output Summary

- ✅ Network profile system (5G: 1-5ms, 4G: 30-100ms, 3G: 100-500ms)
- ✅ Latency injection middleware wrapping all existing APIs
- ✅ Real-time metrics dashboard with latency gauge and throughput chart
- ✅ 4G vs 5G comparison view showing measurable performance difference
- ✅ Edge computing simulation: risk scores computed locally in 5G mode
- ✅ Network slicing: SOS traffic gets priority in 5G mode
- ✅ Pre-built demo scenarios with one-click execution
- ✅ 5G benefit annotations contextually embedded in the app flow
- ✅ WebSocket-streamed live metrics for dashboard
- ✅ Custom response headers showing simulation parameters
