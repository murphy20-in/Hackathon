import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import RadarRounded from '@mui/icons-material/RadarRounded';
import { alpha, useTheme } from '@mui/material/styles';

const MapCanvas = React.forwardRef(function MapCanvas({ mapReady, themeMode }, ref) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: 4,
        overflow: 'hidden',
        pointerEvents: 'auto', // Explicitly allow interaction in the root container
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 28px 80px rgba(2,6,23,0.5)'
            : '0 28px 80px rgba(30,58,138,0.18)',
      }}
    >
      <div
        ref={ref}
        id="leaflet-host"
        style={{
          height: '100%',
          width: '100%',
          pointerEvents: 'auto', // Ensure Leaflet catches all clicks
          backgroundColor: theme.palette.mode === 'dark' ? '#08111F' : '#DCEAFF',
        }}
      />

<Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0, // Below map tiles to allow interaction
        pointerEvents: 'none', // Critical: let clicks pass through to map
        background:
          themeMode === 'dark'
            ? 'linear-gradient(180deg, rgba(2,6,23,0.34) 0%, transparent 22%, transparent 70%, rgba(2,6,23,0.42) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 20%, transparent 70%, rgba(255,255,255,0.14) 100%)',
      }}
    />

      <Stack
        spacing={1}
        sx={{
          position: 'absolute',
          left: { xs: 16, md: 24 },
          bottom: { xs: 168, md: 198 },
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <Chip
          icon={<RadarRounded />}
          label={mapReady ? 'Live map ready' : 'Initializing live map'}
          sx={{
            alignSelf: 'flex-start',
            color: '#FFFFFF',
            backgroundColor: alpha('#0F172A', 0.72),
            backdropFilter: 'blur(18px)',
          }}
        />
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 3,
            backgroundColor: alpha('#0F172A', 0.62),
            color: '#FFFFFF',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Typography variant="overline" sx={{ color: alpha('#FFFFFF', 0.74) }}>
            Live Bangalore overlay
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceRounded sx={{ fontSize: 18, color: '#7DD3FC' }} />
            <Typography variant="body2">
              AI-safety routing with heatmap awareness and route comparison
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
});

export default MapCanvas;
