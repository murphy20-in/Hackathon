Act as a senior full-stack mobile engineer and implement PHASE 2 of the project:

"SafeRoute AI – 5G-Powered Women Safety Navigation System"

---

### 🎯 OBJECTIVE

Build the complete Maps + Routing backbone of the application.

The system must:
- Accept Source and Destination input
- Fetch multiple route options using Google Directions API
- Display routes visually on a mobile map
- Prepare backend for future safety scoring integration

---

### 🔧 TECH STACK (STRICT)

Frontend:
- React Native (Expo)
- react-native-maps (Google Maps)

Backend:
- FastAPI (Python)

APIs:
- Google Directions API
- Google Places API (Autocomplete)

---

### 📦 OUTPUT REQUIREMENTS (MANDATORY)

---

## 1. FRONTEND IMPLEMENTATION (FULL CODE)

Create a working React Native screen:

### Screen Name:
MapScreen.js

---

### Features:

1. Fullscreen map using react-native-maps

2. Input Fields:
- Source (Google Places Autocomplete)
- Destination (Google Places Autocomplete)

3. Button:
- "Find Safe Routes"

---

### Map Behavior:

- Show user's current location
- Fetch and display 2–3 alternative routes
- Each route must:
  - Have different colors
  - Be selectable (highlight selected route)

---

### Required Implementation:

- Use Polyline to render routes
- Maintain state for:
  - routes
  - selected route
- Clean UI (minimal but functional)

---

---

## 2. BACKEND IMPLEMENTATION (FULL CODE)

### Create FastAPI app

---

### Endpoint:

POST /get-routes

---

### Request:

{
  "source": "Indiranagar, Bangalore",
  "destination": "MG Road, Bangalore"
}

---

### Backend Logic:

1. Call Google Directions API
2. Extract:
   - Multiple routes
   - Distance
   - Duration
   - Encoded polyline

---

### Response:

{
  "routes": [
    {
      "route_id": 1,
      "distance": "5.2 km",
      "duration": "18 mins",
      "polyline": "encoded_string"
    }
  ]
}

---

### Requirements:

- Use requests or httpx
- Handle API errors
- Store API key in .env

---

---

## 3. GOOGLE API SETUP

Provide:

- Steps to enable:
  - Directions API
  - Places API
- Example API request URL
- How to restrict API key

---

---

## 4. POLYLINE DECODING (IMPORTANT)

- Decode encoded polyline into coordinates
- Provide utility function (JS)
- Ensure compatibility with react-native-maps

---

---

## 5. FRONTEND ↔ BACKEND INTEGRATION

### Flow:

1. User enters source/destination
2. Frontend calls backend (/get-routes)
3. Backend returns route data
4. Frontend:
   - Decodes polyline
   - Draws routes

---

### Requirements:

- Use axios or fetch
- Proper loading states
- Error handling (invalid locations, API failure)

---

---

## 6. PROJECT STRUCTURE (CLEAN)

### Frontend:

src/
- screens/MapScreen.js
- components/
- services/api.js

---

### Backend:

app/
- main.py
- routes/
- services/
- config/

---

---

## 7. SETUP INSTRUCTIONS

Provide step-by-step:

### Backend:
- Install dependencies
- Run FastAPI server

### Frontend:
- Install Expo
- Run app on emulator/device

---

---

## 8. OUTPUT FORMAT

- Provide FULL WORKING CODE (no pseudo code)
- Clearly separate:
  - Frontend code
  - Backend code
- Keep it clean and runnable

---

---

### ⚠️ CONSTRAINTS

- Keep it POC-friendly
- No authentication required
- No ML logic yet
- Focus only on maps + routing

---

---

### 🎯 FINAL RESULT

- User opens app
- Inputs source/destination
- Routes are displayed on map
- Multiple routes visible and selectable
- Backend successfully serves route data

---

This implementation will be directly used in development, so ensure accuracy, completeness, and clean coding practices.