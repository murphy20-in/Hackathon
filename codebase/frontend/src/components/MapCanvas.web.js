import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import FullscreenRounded from '@mui/icons-material/FullscreenRounded';
import FullscreenExitRounded from '@mui/icons-material/FullscreenExitRounded';
import { alpha } from '@mui/material/styles';

const MapCanvas = React.forwardRef(function MapCanvas({ mapReady, fullscreen, onFullscreenToggle }, ref) {
  return (
    <Box
      sx={{
        position: fullscreen ? 'fixed' : 'absolute',
        top: fullscreen ? 0 : 0,
        left: fullscreen ? 0 : 0,
        width: fullscreen ? '100vw' : '100%',
        height: fullscreen ? '100vh' : '100%',
        borderRadius: fullscreen ? 0 : '16px',
        overflow: 'hidden',
        pointerEvents: 'auto',
        boxShadow: fullscreen ? 'none' : '0 28px 80px rgba(0,0,0,0.5)',
        zIndex: fullscreen ? 9999 : 'auto',
        transition: 'all 0.4s ease',
      }}
    >
      <div
        ref={ref}
        id="leaflet-host"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          backgroundColor: '#08111F',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.34) 0%, transparent 22%, transparent 70%, rgba(10,10,10,0.42) 100%)',
        }}
      />

      {/* Fullscreen toggle button (Fix 5) */}
      <IconButton
        onClick={onFullscreenToggle}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 999,
          backgroundColor: alpha('#0A0A0A', 0.7),
          backdropFilter: 'blur(12px)',
          color: '#fff',
          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
          width: 40,
          height: 40,
          '&:hover': {
            backgroundColor: alpha('#FF5500', 0.8),
          },
          transition: 'all 0.2s ease',
        }}
      >
        {fullscreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
      </IconButton>

      {/* Bottom-left info */}
      <Stack
        spacing={1}
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: { xs: 40, md: 40 },
          zIndex: 900,
          pointerEvents: 'none',
          width: 'fit-content',
          maxWidth: 'calc(100% - 32px)',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.2,
            borderRadius: 3,
            backgroundColor: alpha('#0A0A0A', 0.62),
            color: '#FFFFFF',
            backdropFilter: 'blur(18px)',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <Typography variant="overline" sx={{ color: alpha('#FFFFFF', 0.74), fontSize: '0.6rem' }}>
            Live Bangalore overlay
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceRounded sx={{ fontSize: 16, color: '#FF5500' }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              AI-safety routing · Click routes to compare
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
});

export default MapCanvas;
