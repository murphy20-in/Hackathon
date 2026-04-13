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
      border: 'rgba(220, 38, 38, 0.42)',
      glow: 'rgba(220, 38, 38, 0.28)',
      fill: 'linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(254,242,242,0.94) 100%)',
    };
  }

  if (score > 30) {
    return {
      key: 'medium',
      label: 'Caution',
      color: '#D97706',
      accent: '#FBBF24',
      border: 'rgba(217, 119, 6, 0.36)',
      glow: 'rgba(245, 158, 11, 0.24)',
      fill: 'linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(255,251,235,0.94) 100%)',
    };
  }

  return {
    key: 'low',
    label: 'Safest',
    color: '#0F766E',
    accent: '#2DD4BF',
    border: 'rgba(15, 118, 110, 0.34)',
    glow: 'rgba(20, 184, 166, 0.24)',
    fill: 'linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(240,253,250,0.94) 100%)',
  };
}

export function glassPanel(theme, opacity = 0.8) {
  return {
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    background:
      theme.palette.mode === 'dark'
        ? `linear-gradient(145deg, ${alpha('#0B1220', 0.94)} 0%, ${alpha('#111C32', opacity)} 100%)`
        : `linear-gradient(145deg, ${alpha('#FFFFFF', 0.86)} 0%, ${alpha('#EFF6FF', opacity)} 100%)`,
    border:
      theme.palette.mode === 'dark'
        ? `1px solid ${alpha('#93C5FD', 0.12)}`
        : `1px solid ${alpha('#FFFFFF', 0.72)}`,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 28px 80px rgba(2, 6, 23, 0.55)'
        : '0 28px 80px rgba(30, 58, 138, 0.16)',
  };
}

export function createAppTheme(mode = 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    spacing: 8,
    shape: {
      borderRadius: 24,
    },
    palette: {
      mode,
      primary: {
        main: '#1E3A8A',
        light: '#3B82F6',
        dark: '#172554',
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
        default: isDark ? '#020817' : '#EAF2FF',
        paper: isDark ? '#08111F' : '#F8FBFF',
      },
      text: {
        primary: isDark ? '#E5EEF8' : '#102247',
        secondary: isDark ? '#93A8C9' : '#5F7298',
      },
      divider: isDark ? alpha('#94A3B8', 0.12) : alpha('#1E3A8A', 0.08),
    },
    typography: {
      fontFamily: '"Space Grotesk", "DM Sans", "Trebuchet MS", sans-serif',
      h1: {
        fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
        fontSize: 'clamp(2.5rem, 5vw, 4.4rem)',
        fontWeight: 700,
        lineHeight: 0.96,
        letterSpacing: '-0.06em',
      },
      h2: {
        fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
        fontSize: 'clamp(1.65rem, 3vw, 2.6rem)',
        fontWeight: 700,
        lineHeight: 1.04,
        letterSpacing: '-0.04em',
      },
      h3: {
        fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
        fontSize: 'clamp(1.25rem, 2vw, 1.8rem)',
        fontWeight: 700,
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
        fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
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
