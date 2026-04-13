Act as a senior mobile UI engineer + React Native expert + geospatial visualization specialist.

Implement PHASE 4 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Build the complete HEATMAP VISUALIZATION layer on top of the map.

The system must:
- Fetch crime risk zone data from backend
- Render heatmap overlay on map
- Visually represent unsafe areas
- Allow toggling of heatmap
- Integrate with existing routes UI

---

### 🔧 TECH STACK (STRICT)

Frontend:
- React Native (Expo)
- react-native-maps

Backend:
- FastAPI (already implemented from Phase 3)

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. FRONTEND — HEATMAP IMPLEMENTATION (FULL CODE)

Update MapScreen.js to include:

---

### Heatmap Layer:

- Use Heatmap component from react-native-maps

---

### Data Source:

Fetch from:
GET /crime-zones

---

### Expected Data Format:

[
  {
    "latitude": number,
    "longitude": number,
    "weight": number
  }
]

---

### Features:

- Render heatmap overlay on map
- Color gradient:
  - Green → Safe
  - Yellow → Moderate
  - Red → High risk

---

---

## 2. UI CONTROLS (IMPORTANT)

Add:

### Toggle Button:
- "Show Safety Heatmap" ON/OFF

---

### Behavior:
- ON → display heatmap
- OFF → hide heatmap

---

### Optional:
- Opacity control (slider)

---

---

## 3. ROUTE + HEATMAP INTEGRATION

Ensure:

- Routes (polylines) are still visible
- Heatmap overlays correctly without blocking routes
- Selected route remains highlighted

---

---

## 4. API INTEGRATION

Provide:

- Fetch logic using axios/fetch
- Loading state handling
- Error handling

---

---

## 5. VISUAL ENHANCEMENTS

Add:

- Legend UI:
  - Red = Unsafe
  - Yellow = Moderate
  - Green = Safe

- Smooth rendering

---

---

## 6. PROJECT STRUCTURE UPDATE

Frontend:

src/
- screens/MapScreen.js
- components/
  - HeatmapLegend.js
- services/api.js

---

---

## 7. PERFORMANCE OPTIMIZATION

Include:

- Avoid re-rendering heatmap unnecessarily
- Efficient state management
- Use memoization if needed

---

---

## 8. SETUP INSTRUCTIONS

Provide:

- Install dependencies
- Any required configuration for heatmap support

---

---

## 9. OUTPUT FORMAT

- Provide FULL WORKING CODE
- No pseudo code
- Clean and modular implementation

---

---

### ⚠️ CONSTRAINTS

- Must work with Phase 2 map setup
- Must consume Phase 3 backend API
- Keep UI clean (no overdesign)
- Focus on clarity + functionality

---

---

### 🎯 FINAL RESULT

- Map displays safety heatmap
- User can toggle heatmap ON/OFF
- Routes + heatmap visible together
- App visually shows unsafe zones clearly

---

This phase is critical for demo impact, so ensure visual clarity, smooth interaction, and correctness.