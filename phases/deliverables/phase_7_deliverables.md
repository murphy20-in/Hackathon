# Phase 7: UI/UX Layer

## 1. Phase Overview

**Objective:** Design and implement the complete user interface — transforming all backend capabilities (maps, heatmaps, scoring, temporal intelligence) into a polished, intuitive, and visually stunning application that users trust and enjoy using.

**Why This Phase Matters:**  
All technical intelligence is useless if the interface is confusing or unappealing. This phase delivers the final user-facing skin: onboarding, navigation flow, accessibility, responsive design, and polish. For a hackathon demo, the UI is what judges see and evaluate first.

---

## 2. Technical Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1 | **Design System** | Color palette, typography, spacing, component library (buttons, cards, inputs, modals) |
| 2 | **Onboarding Flow** | Welcome screen → permission requests (location, notifications) → first-use tutorial |
| 3 | **Main Navigation Screen** | Unified view: map + search + route cards + heatmap toggle + time slider |
| 4 | **Route Detail Panel** | Expandable panel showing safety score, segment breakdown, risk factors |
| 5 | **Settings & Profile Screen** | Emergency contacts, notification preferences, theme toggle |
| 6 | **Responsive Layout** | Mobile-first design, desktop sidebar layout adapts |
| 7 | **Loading & Error States** | Skeleton loaders, error boundaries, offline fallback |
| 8 | **Accessibility** | ARIA labels, keyboard navigation, contrast ratios, screen reader support |
| 9 | **Micro-Animations** | Route drawing animation, score counter, heatmap fade-in, slide transitions |
| 10 | **Dark Mode** | Full dark theme with seamless toggle |

---

## 3. Code Deliverables

### New/Updated Files

```
client/src/
├── styles/
│   ├── variables.css              # CSS custom properties (colors, spacing, typography)
│   ├── global.css                 # Reset, base styles, scrollbar, selection
│   ├── animations.css             # Keyframe definitions
│   └── themes/
│       ├── light.css              # Light theme variables
│       └── dark.css               # Dark theme variables
├── components/
│   ├── Layout/
│   │   ├── AppShell.jsx           # Top-level layout wrapper
│   │   ├── Sidebar.jsx            # Desktop sidebar for controls
│   │   ├── BottomSheet.jsx        # Mobile bottom sheet (draggable)
│   │   ├── Header.jsx             # App header with branding
│   │   └── NavigationBar.jsx      # Bottom nav for mobile
│   ├── Common/
│   │   ├── Button.jsx             # Styled button variants (primary, ghost, danger)
│   │   ├── Card.jsx               # Reusable card container
│   │   ├── Modal.jsx              # Overlay modal with backdrop
│   │   ├── Loader.jsx             # Skeleton and spinner loaders
│   │   ├── Badge.jsx              # Status badges (safe, caution, danger)
│   │   ├── Toggle.jsx             # Switch component
│   │   ├── Tooltip.jsx            # Info tooltips
│   │   └── ErrorBoundary.jsx      # React error boundary
│   ├── Onboarding/
│   │   ├── WelcomeScreen.jsx      # App intro with branding
│   │   ├── PermissionRequest.jsx  # Location + notification permission
│   │   └── QuickTutorial.jsx      # 3-step feature walkthrough
│   ├── Profile/
│   │   ├── SettingsPage.jsx       # User preferences
│   │   ├── EmergencyContacts.jsx  # Manage SOS contacts
│   │   └── ThemeToggle.jsx        # Dark/light mode switch
│   └── Navigation/
│       ├── MainView.jsx           # Primary navigation screen (assembled)
│       ├── RouteDetailPanel.jsx   # Expanded route info with score breakdown
│       └── SafetyDashboard.jsx    # Quick overview: area safety + time indicator
├── context/
│   ├── ThemeContext.jsx           # Dark/light mode state
│   └── AppContext.jsx             # Global app state (user, preferences)
├── hooks/
│   ├── useMediaQuery.js           # Responsive breakpoint hook
│   └── useTheme.js                # Theme toggling hook
└── pages/
    ├── Home.jsx                   # Main map + navigation page
    ├── Onboarding.jsx             # First-use flow
    └── Settings.jsx               # Settings page
```

### Design System Tokens

```css
/* client/src/styles/variables.css */

:root {
  /* Brand Colors */
  --color-primary: #6C63FF;
  --color-primary-light: #8B83FF;
  --color-primary-dark: #4A42DB;
  --color-accent: #FF6584;

  /* Safety Palette */
  --color-safe: #4CAF50;
  --color-moderate: #FFC107;
  --color-caution: #FF9800;
  --color-danger: #F44336;

  /* Surfaces */
  --color-bg: #FAFBFC;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FFFFFF;
  --color-text-primary: #1A1A2E;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;

  /* Typography */
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Borders & Shadows */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
}

/* Dark Theme */
[data-theme="dark"] {
  --color-bg: #0F0F1A;
  --color-surface: #1A1A2E;
  --color-surface-elevated: #252540;
  --color-text-primary: #F0F0F5;
  --color-text-secondary: #9CA3AF;
  --color-border: #2D2D44;
}
```

---

## 4. API Contracts

### User Preferences

```
GET /api/v1/user/preferences
Response 200:
{
  "theme": "dark",
  "default_city": "Bangalore",
  "notification_enabled": true,
  "emergency_contacts": [
    { "name": "Mom", "phone": "+919876543210", "relation": "parent" }
  ]
}

PUT /api/v1/user/preferences
Body: { "theme": "dark", "notification_enabled": true }
Response 200: { "status": "updated" }
```

### Onboarding Status

```
GET /api/v1/user/onboarding-status
Response 200:
{
  "completed": false,
  "steps": {
    "welcome": true,
    "location_permission": false,
    "tutorial": false
  }
}

POST /api/v1/user/onboarding-complete
Response 200: { "status": "completed" }
```

---

## 5. Data Flow

```
App Launch
  │
  ├── Check onboarding status → show WelcomeScreen if first use
  │   └── Request permissions → QuickTutorial → MainView
  │
  └── Load user preferences (theme, contacts, defaults)
      │
      ▼
MainView renders:
  ├── MapContainer (Phase 2) with HeatmapLayer (Phase 4)
  ├── SearchBar (Phase 2) → triggers route computation
  ├── TimeSlider (Phase 6) → adjusts scores and heatmap
  ├── RouteSelector (Phase 2) with SafetyScoreBadge (Phase 5)
  └── SOSButton (Phase 8) — always visible
      │
      ▼
User interaction flows:
  Search → Route options → Score comparison → Select safest → Navigate
```

**Integration with Previous Phases:**
- This phase **assembles** all components from Phases 2-6 into a coherent UI
- No new backend logic — purely frontend composition and polish
- Each existing component gets wrapped in the design system's styling

---

## 6. Dependencies

### Previous Phases
- **Phase 2:** Map, Search, Route components
- **Phase 4:** Heatmap layer
- **Phase 5:** Risk score badges and breakdown
- **Phase 6:** Time slider and danger charts

### External APIs/Libraries

| Dependency | Purpose |
|------------|---------|
| `framer-motion` (^11.x) | Animations and transitions |
| `react-spring` (optional) | Physics-based animations |
| Google Fonts (Inter) | Typography |
| `react-icons` | Icon library |
| `react-hot-toast` | Toast notifications |

---

## 7. Setup Instructions

```bash
# 1. Install UI dependencies
cd client
npm install framer-motion react-icons react-hot-toast

# 2. Add Google Font to index.html
# <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

# 3. Import design system
# Ensure global.css and variables.css are imported in main.jsx

# 4. Run frontend
npm run dev

# 5. Test responsive design
# Open Chrome DevTools → Toggle device toolbar
# Test at: 375px (mobile), 768px (tablet), 1440px (desktop)

# 6. Test dark mode
# Click theme toggle → verify all components adapt
```

---

## 8. Testing Checklist

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | First launch shows onboarding | Welcome screen renders | ☐ |
| 2 | Returning user skips onboarding | MainView loads directly | ☐ |
| 3 | Dark mode toggle | All surfaces, text, and borders adapt | ☐ |
| 4 | Mobile layout (375px) | Bottom sheet for route details, full-width map | ☐ |
| 5 | Desktop layout (1440px) | Sidebar panel for controls, large map | ☐ |
| 6 | Skeleton loader during data fetch | Animated placeholders visible | ☐ |
| 7 | Network error handling | Error boundary shows friendly message | ☐ |
| 8 | Route drawing animation | Polyline draws progressively on map | ☐ |
| 9 | Safety badge animates on score change | Counter rolls to new value | ☐ |
| 10 | Keyboard navigation | Tab through search, filters, route cards | ☐ |
| 11 | Screen reader announces safety score | "Safety score: 7.4 out of 10, low risk" | ☐ |
| 12 | All buttons have hover states | Visual feedback on hover | ☐ |
| 13 | Modal backdrop closes on click | Overlay dismisses | ☐ |
| 14 | Toast notifications appear | Success/error toasts render and auto-dismiss | ☐ |

---

## 9. Demo Readiness Criteria

- [ ] App looks professional and polished — not a raw dev prototype
- [ ] Color scheme is consistent and visually appealing
- [ ] Dark mode works flawlessly across all screens
- [ ] Mobile responsive layout functional for live phone demo
- [ ] Smooth animations on route selection and score display
- [ ] Loading states prevent blank screens during API calls
- [ ] SOS button is always visible and prominent (red, floating)
- [ ] Branding (SafeRoute AI logo/name) visible in header
- [ ] No console errors or visual glitches during walkthrough

---

## 10. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Animation jank on low-end devices | Medium | Use CSS transitions over JS where possible; `will-change` sparingly |
| Design inconsistency across components | Medium | Design system with CSS variables enforces consistency |
| Accessibility audit failures | Medium | Run axe-core audit; fix critical WCAG 2.1 AA violations |
| Dark mode breaks map tiles | Low | Use dark map tile provider (Mapbox dark style / CartoDB dark) |
| Too many UI elements clutter the screen | High | Progressive disclosure: show details on demand, not upfront |

---

## 11. Time Estimate

| Task | Estimated Hours |
|------|----------------|
| Design system (variables, tokens, base styles) | 3h |
| Common components (Button, Card, Modal, etc.) | 4h |
| Layout components (AppShell, Sidebar, BottomSheet) | 4h |
| Onboarding flow (3 screens) | 3h |
| MainView assembly and composition | 4h |
| Route detail panel + safety dashboard | 3h |
| Settings and profile page | 2h |
| Dark mode implementation | 2h |
| Micro-animations (Framer Motion) | 3h |
| Responsive design tuning | 3h |
| Accessibility pass | 2h |
| **Total** | **~33h** |

---

## 12. Deliverable Output Summary

- ✅ Complete design system with CSS custom properties and theme support
- ✅ Reusable component library (Button, Card, Modal, Badge, etc.)
- ✅ Responsive layouts for mobile (375px) and desktop (1440px)
- ✅ Onboarding flow: welcome → permissions → tutorial
- ✅ MainView assembling map, search, routes, heatmap, and time controls
- ✅ Route detail panel with expandable risk breakdown
- ✅ Settings page with emergency contacts and preferences
- ✅ Dark mode with seamless toggle
- ✅ Micro-animations for route drawing, score display, and transitions
- ✅ Accessibility: ARIA labels, keyboard nav, screen reader support
- ✅ Error boundaries and loading states for resilient UX
