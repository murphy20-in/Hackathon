# Phase 8: SOS + Emergency System

## 1. Phase Overview

**Objective:** Build the real-time emergency response system — a panic button, live location sharing, automated alerts to emergency contacts and nearby authorities, and a distress communication channel.

**Why This Phase Matters:**  
This is the feature that justifies SafeRoute AI's existence as a safety tool, not just a map. When a user feels threatened, every second counts. The SOS system must work instantly, reliably, and without requiring complex user interaction — a single press must trigger the entire safety chain.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **SOS Panic Button** | Always-visible, one-tap emergency trigger with haptic/visual feedback |
| 2 | **Emergency Contact System** | Manage up to 5 trusted contacts who receive automated alerts |
| 3 | **Live Location Sharing** | Real-time GPS stream to emergency contacts via WebSocket |
| 4 | **Automated SMS/Call Trigger** | Backend sends SMS with live location link to emergency contacts |
| 5 | **Nearby Authority Notification** | Alert nearest police station with user's location and status |
| 6 | **SOS Dashboard (Admin)** | Real-time view of active SOS events for responders |
| 7 | **Audio/Video Evidence Capture** | Silent background recording when SOS is activated |
| 8 | **Countdown Cancel** | 5-second countdown to cancel accidental triggers |
| 9 | **Shake-to-SOS** | Device shake detection as alternative trigger |
| 10 | **SOS Event Logging** | Persistent record of all SOS events for history/audit |

---

## 3. Code Deliverables

### New Files

```
server/src/
├── routes/
│   └── sos.routes.js                # /api/v1/sos/* endpoints
├── controllers/
│   └── sos.controller.js            # SOS event handling
├── services/
│   ├── sos/
│   │   ├── sosManager.js            # Orchestrates SOS activation flow
│   │   ├── smsService.js            # Twilio/MSG91 SMS integration
│   │   ├── locationBroadcast.js     # WebSocket location streaming
│   │   ├── nearbyAuthority.js       # Find and notify nearest police station
│   │   └── evidenceStore.js         # Store audio/video evidence
│   └── websocket/
│       └── sosChannel.js            # WebSocket channel for SOS events
├── models/
│   └── sosEvent.model.js            # SOS event database model

client/src/
├── components/
│   ├── SOS/
│   │   ├── SOSButton.jsx            # Floating panic button (always visible)
│   │   ├── SOSCountdown.jsx         # 5-second cancel countdown
│   │   ├── SOSActiveScreen.jsx      # Full-screen active SOS view
│   │   ├── SOSStatusBar.jsx         # Shows "SOS Active" banner
│   │   └── EmergencyContacts.jsx    # Contact management (CRUD)
│   ├── LiveShare/
│   │   ├── LiveLocationMap.jsx      # Shareable map view for contacts
│   │   └── ShareLink.jsx            # Generate and copy share link
│   └── Evidence/
│       └── RecordingIndicator.jsx   # Silent recording status
├── hooks/
│   ├── useSOS.js                    # SOS state management
│   ├── useShakeDetection.js         # Device motion API
│   └── useLiveLocation.js           # WebSocket location streaming
└── pages/
    └── SOSLive.jsx                  # Public page: live location for contacts
```

### Database Schema Addition

```sql
CREATE TABLE sos_events (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) NOT NULL,
    triggered_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at     TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'active',  -- active, resolved, cancelled, false_alarm
    trigger_method  VARCHAR(20),                   -- button, shake, auto
    location_start  GEOGRAPHY(POINT, 4326),
    location_last   GEOGRAPHY(POINT, 4326),
    route_snapshot  JSONB,                          -- Route user was on when triggered
    contacts_notified JSONB,                       -- List of contacts + notification status
    nearest_station_id INTEGER REFERENCES police_stations(id),
    evidence_url    TEXT,                           -- S3/storage URL for audio/video
    notes           TEXT
);

CREATE TABLE emergency_contacts (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20) NOT NULL,
    relation    VARCHAR(50),
    priority    INTEGER DEFAULT 1,                 -- 1 = first notified
    UNIQUE(user_id, phone)
);

CREATE INDEX idx_sos_active ON sos_events(status) WHERE status = 'active';
CREATE INDEX idx_sos_user ON sos_events(user_id);
```

---

## 4. API Contracts

### Trigger SOS

```
POST /api/v1/sos/trigger
Headers: Authorization: Bearer <token>
Body: {
  "location": { "lat": 12.9716, "lon": 77.5946 },
  "trigger_method": "button"
}

Response 201:
{
  "sos_id": "sos_4821",
  "status": "active",
  "triggered_at": "2026-04-11T22:34:00Z",
  "contacts_notified": [
    { "name": "Mom", "phone": "+919876543210", "sms_status": "sent" },
    { "name": "Priya", "phone": "+919876543211", "sms_status": "sent" }
  ],
  "nearest_station": {
    "name": "Koramangala Police Station",
    "phone": "080-25533222",
    "distance_km": 1.2
  },
  "live_share_url": "https://saferoute.ai/live/sos_4821",
  "websocket_channel": "ws://api.saferoute.ai/ws/sos/sos_4821"
}
```

### Cancel/Resolve SOS

```
POST /api/v1/sos/:sosId/resolve
Body: { "resolution": "false_alarm", "notes": "Accidentally triggered" }

Response 200:
{
  "sos_id": "sos_4821",
  "status": "resolved",
  "resolved_at": "2026-04-11T22:36:00Z",
  "duration_seconds": 120
}
```

### Stream Location (WebSocket)

```
WebSocket: ws://localhost:5000/ws/sos/:sosId

Client → Server (every 3 seconds):
{
  "type": "location_update",
  "lat": 12.9720,
  "lon": 77.5950,
  "accuracy_m": 8,
  "speed_mps": 1.2,
  "timestamp": "2026-04-11T22:34:15Z"
}

Server → Contacts (broadcast):
{
  "type": "location_broadcast",
  "sos_id": "sos_4821",
  "user_name": "Ananya",
  "lat": 12.9720,
  "lon": 77.5950,
  "last_updated": "2026-04-11T22:34:15Z",
  "status": "active"
}
```

### Manage Emergency Contacts

```
GET /api/v1/user/emergency-contacts
Response 200:
{
  "contacts": [
    { "id": 1, "name": "Mom", "phone": "+919876543210", "relation": "parent", "priority": 1 },
    { "id": 2, "name": "Priya", "phone": "+919876543211", "relation": "friend", "priority": 2 }
  ]
}

POST /api/v1/user/emergency-contacts
Body: { "name": "Dad", "phone": "+919876543212", "relation": "parent" }
Response 201: { "id": 3, ... }

DELETE /api/v1/user/emergency-contacts/:id
Response 204
```

---

## 5. Data Flow

```
User presses SOS button (or shake detected)
       │
       ▼
SOSCountdown starts (5 seconds cancel window)
       │ (not cancelled)
       ▼
POST /api/v1/sos/trigger
       │
       ▼
sosManager.js orchestrates:
  ├── 1. Create sos_events record (status: active)
  ├── 2. smsService.js → Send SMS to all emergency contacts
  │      SMS: "🚨 ALERT: Ananya needs help! Live location: https://saferoute.ai/live/sos_4821"
  ├── 3. nearbyAuthority.js → Find nearest police station (PostGIS query)
  ├── 4. locationBroadcast.js → Open WebSocket channel
  └── 5. evidenceStore.js → Start background audio recording
       │
       ▼
SOSActiveScreen renders:
  ├── Live location streaming (every 3s)
  ├── "Help is on the way" status
  ├── One-tap call to nearest police station
  ├── Cancel/resolve button
  └── Recording indicator
       │
       ▼
Contacts open live_share_url → SOSLive.jsx shows real-time map
```

**Integration with Previous Phases:**
- **Phase 1:** WebSocket server from architecture setup
- **Phase 3:** Police station locations from PostGIS for nearest authority lookup
- **Phase 5:** SOS can be auto-triggered if a route segment's live risk exceeds threshold (future enhancement)
- **Phase 7:** SOS button styled and positioned per design system

---

## 6. Dependencies

### Previous Phases
- **Phase 1:** WebSocket infrastructure, auth middleware
- **Phase 3:** police_stations table for nearest station lookup
- **Phase 7:** UI components and design system

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| Twilio / MSG91 | SMS delivery |
| `socket.io` (^4.x) | WebSocket communication |
| `nosleep.js` | Prevent screen lock during active SOS |
| `react-countdown` | Countdown timer component |
| Browser MediaDevices API | Audio/video capture |
| Browser DeviceMotion API | Shake detection |

---

## 7. Setup Instructions

```bash
# 1. Install dependencies
cd server && npm install socket.io twilio
cd ../client && npm install socket.io-client nosleep.js

# 2. Configure Twilio (or MSG91)
# Add to .env:
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# 3. Run database migration
cd server && npx prisma migrate dev --name add_sos_tables

# 4. Start services
docker-compose up -d
cd server && npm run dev         # WebSocket server starts on same port
cd ../client && npm run dev

# 5. Test SOS flow
# a. Add emergency contact in Settings
# b. Press SOS button → verify SMS received
# c. Open live share URL → verify map updates
# d. Cancel SOS → verify status changes to resolved

# 6. Test without Twilio (dev mode)
# Set SMS_PROVIDER=mock in .env → logs SMS to console instead of sending
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | SOS button always visible on main screen | Red floating button present | ☐ |
| 2 | Press SOS → countdown starts | 5-4-3-2-1 with cancel option | ☐ |
| 3 | Cancel during countdown | SOS not triggered, no alerts sent | ☐ |
| 4 | SOS triggers → SMS sent | Emergency contacts receive SMS with link | ☐ |
| 5 | Live location streams via WebSocket | Contact sees real-time pin movement | ☐ |
| 6 | Nearest police station found | Correct station within 5km returned | ☐ |
| 7 | One-tap call to police | Phone dialer opens with station number | ☐ |
| 8 | SOS resolves successfully | Status changes, contacts notified, recording stops | ☐ |
| 9 | Shake-to-SOS triggers | 3 strong shakes within 2s triggers countdown | ☐ |
| 10 | SOS event logged in database | Record with full details persisted | ☐ |
| 11 | Live share URL accessible without auth | Public page renders with map | ☐ |
| 12 | Multiple simultaneous SOS events | Each gets unique channel and share URL | ☐ |
| 13 | Audio recording starts silently | No visible indicator to attacker; persists for evidence | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] SOS button is impossible to miss — large, red, floating
- [ ] Pressing SOS shows dramatic countdown with cancel option
- [ ] SMS actually delivers to demo phone (or show mock console log)
- [ ] Live share URL opens and shows real-time location on map
- [ ] Nearest police station displayed with distance and phone
- [ ] SOS active screen shows "Help is on the way" with animation
- [ ] Cancel/resolve flow works cleanly
- [ ] SOS history viewable in settings

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| SMS delivery failure (Twilio downtime) | Critical | Fallback to backup provider (MSG91); queue and retry |
| Accidental SOS triggers | High | 5-second countdown with prominent cancel; shake sensitivity tuning |
| GPS inaccurate indoors | Medium | Show accuracy radius on map; send last known good location |
| WebSocket disconnects mid-SOS | High | Auto-reconnect with exponential backoff; fallback to HTTP polling |
| Audio recording privacy/legal concerns | Medium | Clear consent during onboarding; only records when SOS active |
| Twilio costs for SMS | Low | Use demo/trial account for hackathon; mock mode for testing |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| SOS button + countdown UI | 3h |
| SOS trigger API + event management | 4h |
| SMS integration (Twilio) | 3h |
| WebSocket live location streaming | 4h |
| Live share page (public URL) | 3h |
| Nearest police station lookup | 2h |
| Emergency contact CRUD | 2h |
| Shake-to-SOS detection | 2h |
| Audio evidence capture | 3h |
| SOS active screen UI | 2h |
| Testing (end-to-end flow) | 3h |
| **Total** | **~31h** |

---

## 12. Deliverable Output Summary

- ✅ Always-visible SOS panic button with 5-second cancel countdown
- ✅ Automated SMS alerts to emergency contacts with live location link
- ✅ Real-time WebSocket location streaming during active SOS
- ✅ Public live share page for contacts to track user's position
- ✅ Nearest police station lookup and one-tap call
- ✅ SOS event lifecycle: trigger → active → resolved/cancelled
- ✅ Shake-to-SOS alternative trigger via DeviceMotion API
- ✅ Silent audio recording as evidence during emergencies
- ✅ Emergency contact management (add, remove, prioritize)
- ✅ SOS event history and audit logging
