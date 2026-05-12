import React from 'react';
import { Box, Chip, Paper, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import HeatmapToggle from './HeatmapToggle';
import NetworkBadge from './NetworkBadge';
import MetricsPanel from './MetricsPanel';
import Legend from './Legend';
import { glassPanel } from '../theme/webTheme';

export default function FloatingControls({
  variant = 'panel',
  heatmapVisible,
  onHeatmapToggle,
  heatmapLoading,
  networkMode,
  onNetworkToggle,
  responseTime,
  routeCount,
  timeContext,
  mapReady,
  selectedRoute,
}) {
  const theme = useTheme();

  if (variant === 'overlay') {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 0.75,
          pointerEvents: 'none',
          maxWidth: 'calc(100% - 84px)',
        }}
      >
        <Chip
          label={mapReady ? 'Map Ready' : 'Loading...'}
          size="small"
          sx={{
            backgroundColor: alpha('#0A0A0A', 0.85),
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
            color: '#FFFFFF',
            pointerEvents: 'auto',
            '& .MuiChip-label': {
              ...theme.typography.chipLabel,
              fontWeight: 600,
            },
          }}
        />
        <Chip
          label={`${routeCount || 0} Routes`}
          size="small"
          sx={{
            backgroundColor: alpha('#0A0A0A', 0.85),
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
            color: '#FFFFFF',
            pointerEvents: 'auto',
            '& .MuiChip-label': {
              ...theme.typography.chipLabel,
              fontWeight: 600,
            },
          }}
        />
        <Chip
          label={heatmapVisible ? 'Risk Zones On' : 'Risk Zones Off'}
          size="small"
          sx={{
            backgroundColor: alpha('#0A0A0A', 0.85),
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
            color: '#FFFFFF',
            pointerEvents: 'auto',
            '& .MuiChip-label': {
              ...theme.typography.chipLabel,
              fontWeight: 600,
            },
          }}
        />
        {selectedRoute ? (
          <Chip
            label={`Viewing: ${selectedRoute.label || `Route ${selectedRoute.id ?? selectedRoute.route_id}`}`}
            size="small"
            sx={{
              backgroundColor: alpha('#0A0A0A', 0.85),
              backdropFilter: 'blur(8px)',
              borderRadius: 999,
              border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
              color: '#FFFFFF',
              pointerEvents: 'auto',
              maxWidth: 260,
              '& .MuiChip-label': {
                ...theme.typography.chipLabel,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        ) : null}
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        width: '100%',
        p: 2.5,
        borderRadius: 4,
        ...glassPanel(theme, 0.82),
      }}
    >
      <Stack spacing={2.25}>
        <HeatmapToggle
          isActive={heatmapVisible}
          onToggle={onHeatmapToggle}
          loading={heatmapLoading}
        />
        <NetworkBadge
          currentMode={networkMode}
          onToggle={onNetworkToggle}
          responseTime={responseTime}
        />
        <MetricsPanel
          networkMode={networkMode}
          responseTime={responseTime}
          routeCount={routeCount}
          timeContext={timeContext}
        />
        <Box
          sx={{
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Legend />
        </Box>
      </Stack>
    </Paper>
  );
}
