Act as a senior mobile UI/UX designer + React Native expert + product designer.

Implement PHASE 7 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Transform the app from a functional prototype into a polished, demo-ready product with:

- Clean UI/UX
- Route safety insights
- Interactive controls
- Clear visual hierarchy

This phase is CRITICAL for hackathon judging.

---

### 🔧 TECH STACK (STRICT)

Frontend:
- React Native (Expo)
- react-native-maps

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. MAIN MAP SCREEN (UI UPGRADE)

Enhance MapScreen.js:

---

### Features:

- Fullscreen map
- Floating input panel (top):
  - Source input
  - Destination input
- Bottom sheet / card:
  - Route details
  - Risk insights

---

### UI Requirements:

- Clean modern layout
- Proper spacing
- Rounded cards
- Subtle shadows

---

---

## 2. ROUTE COLOR CODING (IMPORTANT)

Implement:

- 🟢 Safe route → Green
- 🟡 Moderate → Yellow
- 🔴 Risky → Red

---

### Behavior:

- Default: Safest route highlighted
- User can tap alternate routes

---

---

## 3. ROUTE INSIGHT PANEL (CORE FEATURE)

Create a bottom card:

---

### Show:

- Risk Score (0–100)
- Route Label:
  - “Safest Route”
  - “Faster but Risky”
- Estimated Time & Distance

---

### Dynamic Message:

Examples:

- "This route avoids high-risk zones"
- "Higher risk due to low activity at night"

---

---

## 4. HEATMAP TOGGLE + LEGEND

Add:

- Toggle button:
  - "Safety Heatmap ON/OFF"

---

### Legend Component:

- Red → High Risk
- Yellow → Medium
- Green → Safe

---

---

## 5. TIME CONTEXT DISPLAY

Show:

- Current time context:
  - "Night Mode Active"
  - "Daytime Safety"

---

---

## 6. INTERACTION ENHANCEMENTS

Implement:

- Tap route → highlight
- Smooth transitions
- Loading indicator while fetching routes
- Error UI (invalid input / API failure)

---

---

## 7. COMPONENT STRUCTURE

Frontend:

src/
- screens/
  - MapScreen.js
- components/
  - RouteCard.js
  - HeatmapToggle.js
  - Legend.js
  - SearchInput.js

---

---

## 8. STATE MANAGEMENT

Maintain:

- routes
- selectedRoute
- heatmapVisible
- loading
- error

---

---

## 9. VISUAL POLISH

Include:

- Consistent color theme
- Minimalist design
- Avoid clutter
- Mobile-first layout

---

---

## 10. OPTIONAL (HIGH IMPACT)

Add:

- Animated bottom sheet
- Icon indicators (⚠️ for risky zones)

---

---

## 11. SETUP INSTRUCTIONS

Provide:

- Dependencies
- How to run app
- Any UI libraries used

---

---

## 12. OUTPUT FORMAT

- FULL WORKING CODE
- No pseudo code
- Clean modular components

---

---

### ⚠️ CONSTRAINTS

- Must integrate with:
  - Phase 2 (routes)
  - Phase 4 (heatmap)
  - Phase 5/6 (risk engine)
- Keep UI simple but impactful
- No overdesign

---

---

### 🎯 FINAL RESULT

- User sees:
  - Clean map UI
  - Color-coded routes
  - Risk insights
  - Heatmap toggle

- App feels like a real product

---

This phase is critical for demo success, so focus on clarity, usability, and visual impact.