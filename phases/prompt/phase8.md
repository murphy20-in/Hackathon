Act as a senior mobile engineer + real-time systems engineer + safety product designer.

Implement PHASE 8 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Build a complete EMERGENCY SAFETY SYSTEM that enables:

- One-tap SOS trigger
- Real-time location sharing
- Emergency contact alerts
- Continuous tracking during distress

This feature must be reliable, fast, and demo-ready.

---

### 🔧 TECH STACK (STRICT)

Frontend:
- React Native (Expo)

Backend:
- FastAPI (Python)

Realtime:
- WebSockets OR Firebase Realtime Database

Device Features:
- GPS (Location services)

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. SOS BUTTON (FRONTEND)

Add a prominent UI element:

---

### Requirements:

- Floating button (bottom-right corner)
- Red color (high visibility)
- Icon: SOS / alert

---

### Behavior:

- Single tap OR long press
- Confirmation prompt:
  - "Send emergency alert?"

---

---

## 2. LOCATION TRACKING (REAL-TIME)

Implement:

- Fetch current GPS location
- Continuously update every few seconds

---

### Provide:

- React Native code using:
  - expo-location

---

---

## 3. EMERGENCY CONTACT SYSTEM

Allow user to:

- Add 2–3 trusted contacts

---

### Store:

- Name
- Phone number

---

### Storage Options:

- Local storage (AsyncStorage) for POC

---

---

## 4. BACKEND ALERT SYSTEM

Create API:

POST /send-sos

---

### Request:

{
  "user_id": "string",
  "location": {
    "lat": number,
    "lng": number
  },
  "timestamp": "ISO string"
}

---

### Backend Tasks:

- Log alert
- Broadcast to:
  - Emergency contacts (simulated)
  - Dashboard (future)

---

---

## 5. REAL-TIME TRACKING (CRITICAL)

Implement:

- Continuous location streaming

---

### Options:

#### Option A:
- WebSockets

#### Option B (Simpler):
- Firebase Realtime Database

---

### Behavior:

- Send location every 5–10 seconds
- Maintain active session

---

---

## 6. LIVE TRACKING VIEW (OPTIONAL BUT HIGH IMPACT)

Create:

- Shareable tracking link (simulated)

---

### Show:

- User moving on map
- Path trail

---

---

## 7. ALERT MESSAGING

Simulate:

- SMS alert content:

"Emergency! User is in distress.
Live location: <map link>"

---

---

## 8. UI STATES

Implement:

- SOS Active Mode:
  - Screen turns red/dark
  - Show:
    - "Emergency mode active"
    - Live location status

---

---

## 9. COMPONENT STRUCTURE

Frontend:

src/
- components/
  - SOSButton.js
  - EmergencyContacts.js
  - LiveTrackingScreen.js

---

---

## 10. SAFETY FAILSAFE (IMPORTANT)

Add:

- Retry logic if location fails
- Offline fallback (store last known location)

---

---

## 11. SETUP INSTRUCTIONS

Provide:

- Permissions required:
  - Location access
- Firebase setup (if used)
- Backend run instructions

---

---

## 12. OUTPUT FORMAT

- FULL WORKING CODE
- No pseudo code
- Separate:
  - Frontend
  - Backend
  - Realtime logic

---

---

### ⚠️ CONSTRAINTS

- Keep it POC-friendly
- No real SMS needed (simulate)
- Focus on responsiveness + clarity

---

---

### 🎯 FINAL RESULT

- User taps SOS
- Location is tracked live
- Alert is triggered
- System shows emergency mode

---

This is the most emotionally impactful feature, so ensure it is fast, visible, and reliable.