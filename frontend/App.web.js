console.log('[App.web] Module loading...', window.location.href);

if (typeof window !== 'undefined') {
  // ── Load Google Fonts: Bebas Neue + DM Sans ──
  if (!document.getElementById('_dashboard_font')) {
    const link = document.createElement('link');
    link.id = '_dashboard_font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // ── Load Font Awesome 6 ──
  if (!document.getElementById('_fa_icons')) {
    const fa = document.createElement('link');
    fa.id = '_fa_icons';
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fa.crossOrigin = 'anonymous';
    document.head.appendChild(fa);
  }

  // ── Load Three.js r128 ──
  if (!window.THREE && !document.getElementById('_three_js')) {
    const s = document.createElement('script');
    s.id = '_three_js';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  // ── Load GSAP + ScrollTrigger ──
  if (!window.gsap && !document.getElementById('_gsap_js')) {
    const g = document.createElement('script');
    g.id = '_gsap_js';
    g.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    g.crossOrigin = 'anonymous';
    g.onload = () => {
      const st = document.createElement('script');
      st.id = '_gsap_st';
      st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      st.crossOrigin = 'anonymous';
      st.onload = () => {
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
        }
      };
      document.head.appendChild(st);
    };
    document.head.appendChild(g);
  }

  window.onerror = function(msg, src, line, col, err) {
    if (msg.includes('Script error') && line === 0) {
      console.warn('Cross-origin script error masked by browser security. Check CDN resources.');
      return false;
    }

    const el = document.getElementById('_global_error');
    if (!el) {
      const div = document.createElement('div');
      div.id = '_global_error';
      div.style.cssText =
        'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#0A0A0A;color:#fff;padding:40px;font-family:DM Sans,monospace;overflow:auto;';
      div.innerHTML = '<h2 style="color:#FF5500">JS Runtime Error</h2>';
      document.body.appendChild(div);
    }
    const d = document.getElementById('_global_error');
    d.innerHTML += `<p style="color:#FF7733">${msg}</p><p style="color:#666;font-size:12px">${src}:${line}:${col}</p>`;
    d.innerHTML += `<p style="color:#666;font-size:11px">Origin: ${window.location.href}</p>`;
    if (err && err.stack) d.innerHTML += `<pre style="color:#444;font-size:11px;white-space:pre-wrap">${err.stack}</pre>`;
  };

  window.addEventListener('unhandledrejection', function(e) {
    console.error('[Unhandled Promise]', e.reason);
  });
}

import React from 'react';
import {
  Box,
  CssBaseline,
  GlobalStyles,
  Paper,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import Navbar from './src/components/Navbar';
import HeroSection from './src/components/HeroSection';
import BrandMarquee from './src/components/BrandMarquee';
import CustomCursor from './src/components/CustomCursor';
import Footer from './src/components/Footer';
import MapScreen from './src/screens/MapScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import { createAppTheme, glassPanel } from './src/theme/webTheme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#0A0A0A',
            p: 4,
          }}
        >
          <Paper sx={(theme) => ({ width: 'min(720px, 100%)', p: 4, borderRadius: 4, ...glassPanel(theme, 0.92) })}>
            <Typography variant="overline" sx={{ color: '#FF5500' }}>
              Runtime Error
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, color: '#fff' }}>
              The dashboard failed to render.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: '#999' }}>
              {this.state.error?.message || 'Unknown error'}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  background: '#FF5500',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Reload Dashboard
              </button>
            </Box>
            <Typography
              component="pre"
              sx={{
                mt: 3,
                mb: 0,
                p: 2,
                overflow: 'auto',
                borderRadius: 3,
                backgroundColor: alpha('#000000', 0.5),
                color: '#FF7733',
                fontSize: 12,
                fontFamily: '"DM Sans", monospace',
              }}
            >
              {this.state.error?.stack?.substring(0, 1200) || ''}
            </Typography>
          </Paper>
        </Box>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [screen, setScreen] = React.useState('Map');
  const [screenParams, setScreenParams] = React.useState({});

  const navigation = React.useMemo(
    () => ({
      navigate: (name, params = {}) => {
        setScreen(name);
        setScreenParams(params);
      },
      goBack: () => {
        setScreen('Map');
        setScreenParams({});
      },
    }),
    []
  );

  const route = { params: screenParams };

  if (screen === 'Emergency') {
    return (
      <EmergencyScreen
        navigation={navigation}
        route={route}
        themeMode="dark"
      />
    );
  }

  // Main page: Hero → Marquee → Map Dashboard → Footer
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', width: '100%' }}>
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <BrandMarquee />
      <MapScreen navigation={navigation} themeMode="dark" />
      <Footer />
    </Box>
  );
}

export default function App() {
  const theme = React.useMemo(() => createAppTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: {
            minHeight: '100%',
            scrollBehavior: 'smooth',
          },
          body: {
            minHeight: '100%',
            margin: 0,
            overflowY: 'auto !important',
            overflowX: 'hidden !important',
            background: '#0A0A0A',
            fontFamily: '"DM Sans", sans-serif',
          },
          '#root': {
            minHeight: '100%',
            width: '100%',
          },
          '::selection': {
            background: '#FF5500',
            color: '#fff',
          },
          /* Scrollbar */
          '::-webkit-scrollbar': { width: '6px' },
          '::-webkit-scrollbar-track': { background: '#0A0A0A' },
          '::-webkit-scrollbar-thumb': { background: '#FF5500', borderRadius: '999px' },
          /* Marquee keyframes */
          '@keyframes marquee-scroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          /* Leaflet overrides */
          '.leaflet-container': {
            background: '#08111F',
            fontFamily: '"DM Sans", sans-serif',
          },
          '.leaflet-control-zoom': {
            border: 'none !important',
            boxShadow: 'none !important',
            marginTop: '20px !important',
            marginLeft: '20px !important',
          },
          '.leaflet-control-zoom a': {
            width: '42px !important',
            height: '42px !important',
            lineHeight: '42px !important',
            borderRadius: '14px !important',
            border: `1px solid ${alpha('#FF5500', 0.12)} !important`,
            background: `${alpha('#0A0A0A', 0.84)} !important`,
            color: '#fff !important',
            marginBottom: '8px !important',
            backdropFilter: 'blur(18px)',
          },
          '.leaflet-control-attribution': {
            background: `${alpha('#0A0A0A', 0.82)} !important`,
            color: '#999 !important',
            borderRadius: '14px !important',
            padding: '6px 10px !important',
            margin: '16px !important',
            border: `1px solid ${alpha('#FFFFFF', 0.05)} !important`,
          },
          '.leaflet-control-attribution a': {
            color: '#FF5500 !important',
          },
          '.map-marker': {
            display: 'block',
            width: '18px',
            height: '18px',
            borderRadius: '999px',
            border: '4px solid rgba(255,255,255,0.92)',
            boxShadow: '0 0 0 8px rgba(255,255,255,0.18), 0 12px 26px rgba(0,0,0,0.4)',
          },
          '.map-marker-start': {
            background: 'linear-gradient(135deg, #2DD4BF 0%, #0F766E 100%)',
          },
          '.map-marker-end': {
            background: 'linear-gradient(135deg, #FB7185 0%, #DC2626 100%)',
          },
          '@keyframes riskPulse': {
            '0%': { opacity: 0.28, transform: 'scale(1)' },
            '50%': { opacity: 0.52, transform: 'scale(1.02)' },
            '100%': { opacity: 0.28, transform: 'scale(1)' },
          },
          '.risk-zone-high': {
            animation: 'riskPulse 2.4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 14px rgba(220, 38, 38, 0.5))',
          },
          '.risk-zone-medium': {
            animation: 'riskPulse 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.36))',
          },
        }}
      />
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
