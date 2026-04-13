console.log('[App.web] Module loading...', window.location.href);

if (typeof window !== 'undefined') {
  if (!document.getElementById('_dashboard_font')) {
    const link = document.createElement('link');
    link.id = '_dashboard_font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  window.onerror = function(msg, src, line, col, err) {
    if (msg.includes('Script error') && line === 0) {
      console.warn('Cross-origin script error masked by browser security. Check CDN resources.');
      return false; // Don't show the error overlay for this
    }

    const el = document.getElementById('_global_error');
    if (!el) {
      const div = document.createElement('div');
      div.id = '_global_error';
      div.style.cssText =
        'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#050816;color:#fff;padding:40px;font-family:Space Grotesk,monospace;overflow:auto;';
      div.innerHTML = '<h2 style="color:#F87171">JS Runtime Error</h2>';
      document.body.appendChild(div);
    }
    const d = document.getElementById('_global_error');
    d.innerHTML += `<p style="color:#FDBA74">${msg}</p><p style="color:#94A3B8;font-size:12px">${src}:${line}:${col}</p>`;
    d.innerHTML += `<p style="color:#94A3B8;font-size:11px">Origin: ${window.location.href}</p>`;
    if (err && err.stack) d.innerHTML += `<pre style="color:#64748B;font-size:11px;white-space:pre-wrap">${err.stack}</pre>`;
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
            background: 'radial-gradient(circle at top, #0F172A 0%, #020617 62%)',
            p: 4,
          }}
        >
          <Paper sx={(theme) => ({ width: 'min(720px, 100%)', p: 4, borderRadius: 4, ...glassPanel(theme, 0.92) })}>
            <Typography variant="overline" color="error.main">
              Runtime Error
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              The dashboard failed to render.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: 'text.secondary' }}>
              {this.state.error?.message || 'Unknown error'}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563EB, #1E3A8A)',
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
                backgroundColor: alpha('#020617', 0.78),
                color: '#93C5FD',
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

function AppContent({ themeMode, onThemeModeChange }) {
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

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', width: '100%', flex: 1 }}>
      {screen === 'Map' && (
        <MapScreen
          navigation={navigation}
          themeMode={themeMode}
          onThemeModeChange={onThemeModeChange}
        />
      )}
      {screen === 'Emergency' && (
        <EmergencyScreen
          navigation={navigation}
          route={route}
          themeMode={themeMode}
          onThemeModeChange={onThemeModeChange}
        />
      )}
    </Box>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = React.useState('light');
  const theme = React.useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={(muiTheme) => ({
          html: {
            minHeight: '100%',
          },
          body: {
            minHeight: '100%',
            margin: 0,
            overflowY: 'auto !important',
            overflowX: 'hidden !important',
            background:
              muiTheme.palette.mode === 'dark'
                ? 'radial-gradient(circle at top, #102347 0%, #020617 62%)'
                : 'linear-gradient(180deg, #F8FBFF 0%, #E3EEFF 100%)',
          },
          '#root': {
            minHeight: '100%',
            width: '100%',
          },
          '.leaflet-container': {
            background: muiTheme.palette.mode === 'dark' ? '#08111F' : '#DCEAFF',
            fontFamily: muiTheme.typography.fontFamily,
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
            border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.12)} !important`,
            background:
              muiTheme.palette.mode === 'dark'
                ? `${alpha('#08111F', 0.84)} !important`
                : `${alpha('#FFFFFF', 0.82)} !important`,
            color: `${muiTheme.palette.text.primary} !important`,
            marginBottom: '8px !important',
            backdropFilter: 'blur(18px)',
          },
          '.leaflet-control-attribution': {
            background:
              muiTheme.palette.mode === 'dark'
                ? `${alpha('#08111F', 0.82)} !important`
                : `${alpha('#FFFFFF', 0.78)} !important`,
            color: `${muiTheme.palette.text.secondary} !important`,
            borderRadius: '14px !important',
            padding: '6px 10px !important',
            margin: '16px !important',
            border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.08)} !important`,
          },
          '.leaflet-control-attribution a': {
            color: `${muiTheme.palette.primary.main} !important`,
          },
          '.map-marker': {
            display: 'block',
            width: '18px',
            height: '18px',
            borderRadius: '999px',
            border: '4px solid rgba(255,255,255,0.92)',
            boxShadow: '0 0 0 8px rgba(255,255,255,0.18), 0 12px 26px rgba(15,23,42,0.25)',
          },
          '.map-marker-start': {
            background: 'linear-gradient(135deg, #2DD4BF 0%, #0F766E 100%)',
          },
          '.map-marker-end': {
            background: 'linear-gradient(135deg, #FB7185 0%, #DC2626 100%)',
          },
          '@keyframes riskPulse': {
            '0%': {
              opacity: 0.28,
              transform: 'scale(1)',
            },
            '50%': {
              opacity: 0.52,
              transform: 'scale(1.02)',
            },
            '100%': {
              opacity: 0.28,
              transform: 'scale(1)',
            },
          },
          '.risk-zone-high': {
            animation: 'riskPulse 2.4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 14px rgba(220, 38, 38, 0.5))',
          },
          '.risk-zone-medium': {
            animation: 'riskPulse 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.36))',
          },
        })}
      />
      <ErrorBoundary>
        <AppContent themeMode={themeMode} onThemeModeChange={setThemeMode} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
