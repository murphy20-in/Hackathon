import React from 'react';
import { Box, Paper, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import HeatmapToggle from './HeatmapToggle';
import NetworkBadge from './NetworkBadge';
import MetricsPanel from './MetricsPanel';
import Legend from './Legend';
import { glassPanel } from '../theme/webTheme';

export default function FloatingControls({
  heatmapVisible,
  onHeatmapToggle,
  heatmapLoading,
  networkMode,
  onNetworkToggle,
  responseTime,
  routeCount,
  timeContext,
}) {
  const theme = useTheme();

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
