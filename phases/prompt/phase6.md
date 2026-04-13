Act as a senior AI engineer + backend engineer + real-time systems architect.

Implement PHASE 6 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Enhance the existing Risk Scoring Engine to support:

- Time-of-day based risk adaptation
- Dynamic route re-evaluation
- Real-time-like behavior (simulated for POC)
- Context-aware safety scoring

---

### 🔧 TECH STACK (STRICT)

Backend:
- FastAPI (Python)

Database:
- PostgreSQL + PostGIS

Libraries:
- datetime
- numpy

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. TIME-BASED RISK MODEL

Enhance the risk formula:

Risk Score =
  w1 * Crime Density +
  w2 * Time Risk +
  w3 * Isolation Factor

---

### Implement Time Risk:

Define:

- Morning (6 AM – 12 PM) → LOW risk multiplier
- Afternoon (12 PM – 6 PM) → MEDIUM
- Evening (6 PM – 10 PM) → HIGH
- Night (10 PM – 6 AM) → VERY HIGH

---

### Provide:

- Python function:
  get_time_risk_multiplier(current_time)

---

---

## 2. DYNAMIC ROUTE RE-SCORING

Implement:

- Route risk changes based on:
  - Time input
  - Current system time

---

### Behavior:

- Same route → different score at night
- Safer routes may change dynamically

---

---

## 3. API ENHANCEMENT

Update:

POST /safe-route

---

### Add support for:

{
  "source": "string",
  "destination": "string",
  "time_of_day": "optional (auto-detect if not provided)"
}

---

### Response Enhancement:

{
  "recommended_route": {...},
  "alternatives": [...],
  "time_context": "night",
  "message": "Higher risk detected due to late hours"
}

---

---

## 4. REAL-TIME SIMULATION LAYER (IMPORTANT FOR HACKATHON)

Simulate dynamic inputs:

### A. Crowd Density Simulation

- Randomly assign:
  - LOW crowd → HIGH risk
  - HIGH crowd → LOWER risk

---

### B. Live Alerts Simulation

- Example:
  - "Low activity detected in this area"
  - "Recent incidents reported nearby"

---

### Provide:

- Python function:
  simulate_real_time_risk(lat, lng)

---

---

## 5. CONTEXT-AWARE MESSAGING

Add intelligent feedback:

Examples:

- "This route passes through high-risk zones at night"
- "Alternative route recommended due to lower activity"

---

---

## 6. FRONTEND HOOK SUPPORT

Prepare backend for UI:

- Return:
  - Risk reason
  - Time-based alerts
  - Dynamic messages

---

---

## 7. CODE STRUCTURE UPDATE

Backend:

app/
- services/
  - time_risk.py
  - realtime_simulator.py
  - risk_engine.py (updated)

---

---

## 8. PERFORMANCE CONSIDERATIONS

- Avoid recalculating unnecessarily
- Cache time-based factors
- Efficient updates

---

---

## 9. SETUP + TESTING

Provide:

- Example API request
- Test scenarios:
  - Day vs Night
  - Different routes

---

---

## 10. OUTPUT FORMAT

- FULL WORKING CODE
- No pseudo code
- Clean modular implementation

---

---

### ⚠️ CONSTRAINTS

- No real 5G required (simulate behavior)
- Keep logic simple but convincing
- Avoid heavy ML

---

---

### 🎯 FINAL RESULT

- Routes change based on time
- Risk scores dynamically adapt
- System feels “live” and intelligent
- Strong 5G justification layer

---

This phase is critical for making the system feel predictive and intelligent, so ensure realism, clarity, and clean logic.