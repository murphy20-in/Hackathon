import { alpha, createTheme } from '@mui/material/styles';

export const DEMO_LOCATIONS = [
  'Koramangala, Bangalore',
  'MG Road, Bangalore',
  'Indiranagar, Bangalore',
  'Cubbon Park, Bangalore',
  'Jayanagar, Bangalore',
  'Brigade Road, Bangalore',
  'Electronic City, Bangalore',
  'Whitefield, Bangalore',
  'HSR Layout, Bangalore',
  'UB City, Bangalore',
  'Majestic, Bangalore',
  'Marathahalli, Bangalore',
  'Bellandur, Bangalore',
  'BTM Layout, Bangalore',
  'Rajajinagar, Bangalore',
  'Hebbal, Bangalore',
];

export const DEMO_PRESETS = [
  {
    label: 'Koramangala to MG Road',
    source: 'Koramangala, Bangalore',
    destination: 'MG Road, Bangalore',
  },
  {
    label: 'Indiranagar to Cubbon Park',
    source: 'Indiranagar, Bangalore',
    destination: 'Cubbon Park, Bangalore',
  },
  {
    label: 'HSR Layout to Brigade Road',
    source: 'HSR Layout, Bangalore',
    destination: 'Brigade Road, Bangalore',
  },
];

export function getRouteTone(score = 0) {
  if (score > 60) {
    return {
      key: 'high',
      label: 'High Risk',
      color: '#DC2626',
      accent: '#F87171',
      border: 'rgba(220, 38, 38, 0.5)',
      glow: 'rgba(220, 38, 38, 0.35)',
      fill: 'linear-gradient(160deg, rgba(220,38,38,0.12) 0%, rgba(30,10,10,0.92) 100%)',
    };
  }

  if (score > 30) {
    return {
      key: 'medium',
      label: 'Caution',
      color: '#D97706',
      accent: '#FBBF24',
      border: 'rgba(217, 119, 6, 0.45)',
      glow: 'rgba(245, 158, 11, 0.3)',
      fill: 'linear-gradient(160deg, rgba(217,119,6,0.1) 0%, rgba(30,20,5,0.92) 100%)',
    };
  }

  return {
    key: 'low',
    label: 'Safest',
    color: '#0F766E',
    accent: '#2DD4BF',
    border: 'rgba(15, 118, 110, 0.45)',
    glow: 'rgba(20, 184, 166, 0.3)',
    fill: 'linear-gradient(160deg, rgba(15,118,110,0.1) 0%, rgba(5,30,28,0.92) 100%)',
  };
}

export function glassPanel(theme, opacity = 0.8) {
  return {
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    background: `linear-gradient(145deg, ${alpha('#111111', 0.94)} 0%, ${alpha('#1A1A1A', opacity)} 100%)`,
    border: `1px solid ${alpha('#FF5500', 0.1)}`,
    boxShadow: '0 28px 80px rgba(0, 0, 0, 0.55)',
  };
}

export function createAppTheme() {
  return createTheme({
    spacing: 8,
    shape: {
      borderRadius: 24,
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#FF5500',
        light: '#FF7733',
        dark: '#CC4400',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0F766E',
        light: '#14B8A6',
        dark: '#115E59',
      },
      success: {
        main: '#0F766E',
      },
      warning: {
        main: '#D97706',
      },
      error: {
        main: '#DC2626',
      },
      background: {
        default: '#0A0A0A',
        paper: '#111111',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#999999',
      },
      divider: alpha('#FFFFFF', 0.08),
    },
    typography: {
      fontFamily: '"DM Sans", "Segoe UI", sans-serif',
      h1: {
        fontFamily: '"Bebas Neue", "DM Sans", sans-serif',
        fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
        fontWeight: 400,
        lineHeight: 0.96,
        letterSpacing: '0.02em',
      },
      h2: {
        fontFamily: '"Bebas Neue", "DM Sans", sans-serif',
        fontSize: 'clamp(1.65rem, 3vw, 2.6rem)',
        fontWeight: 400,
        lineHeight: 1.04,
        letterSpacing: '0.01em',
      },
      h3: {
        fontFamily: '"Bebas Neue", "DM Sans", sans-serif',
        fontSize: 'clamp(1.25rem, 2vw, 1.8rem)',
        fontWeight: 400,
        lineHeight: 1.1,
      },
      subtitle1: {
        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
        fontSize: '1rem',
        fontWeight: 500,
      },
      body1: {
        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
        fontSize: '0.98rem',
        lineHeight: 1.7,
      },
      body2: {
        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
        fontSize: '0.92rem',
        lineHeight: 1.65,
      },
      button: {
        fontFamily: '"DM Sans", sans-serif',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'none',
      },
      overline: {
        fontFamily: '"DM Sans", "Segoe UI", sans-serif',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            paddingInline: 18,
            paddingBlock: 12,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 700,
          },
        },
      },
    },
  });
}
