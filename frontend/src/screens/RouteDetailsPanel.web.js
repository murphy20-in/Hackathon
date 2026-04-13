import React from 'react';
import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import TimelineRounded from '@mui/icons-material/TimelineRounded';
import { alpha, useTheme } from '@mui/material/styles';

import RouteCard from '../components/RouteCard';
import { glassPanel } from '../theme/webTheme';

function EmptyStateCard({ icon, title, text }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 220,
        p: 2.2,
        borderRadius: 3,
        backgroundColor: alpha('#FFFFFF', 0.03),
        border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
      }}
    >
      <Stack spacing={1.2}>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '14px',
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {text}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function RouteDetailsPanel({
  routes,
  selectedRoute,
  onRouteSelect,
  timeContext,
  tradeOffNote,
  loading,
}) {
  const theme = useTheme();
  const hasRoutes = Array.isArray(routes) && routes.length > 0;

  return (
    <Box
      sx={{
        width: '100%',
        scrollMarginTop: { xs: 20, md: 28 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          overflow: 'hidden',
          ...glassPanel(theme, 0.9),
        }}
      >
        <Stack spacing={2.2}>
          <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={1.6}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Route intelligence console
              </Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.2rem', md: '1.45rem' }, mt: 0.4 }}>
                {loading
                  ? 'Computing safety-aware corridor recommendations'
                  : hasRoutes
                    ? 'Recommended corridors ranked by AI safety score'
                    : 'Run a corridor search to unlock the route story'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.8, color: 'text.secondary', maxWidth: 760 }}>
                {loading
                  ? 'Preparing route alternatives, scoring risk exposure, and blending time-of-day intelligence.'
                  : hasRoutes
                    ? 'Select any route card to spotlight it on the map and compare risk exposure, distance, and ETA.'
                    : 'This panel turns into a route comparison deck with safety bars, risk telemetry, and a clear safest recommendation.'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="flex-start">
              {timeContext ? (
                <Chip
                  label={`${timeContext.label} mode`}
                  color={timeContext.period === 'night' ? 'error' : timeContext.period === 'evening' ? 'warning' : 'success'}
                />
              ) : null}
              <Chip label={`${routes?.length || 0} routes`} icon={<TimelineRounded />} />
              <Chip label={selectedRoute ? `Tracking ${selectedRoute.label || 'selected route'}` : 'Awaiting selection'} icon={<ShieldRounded />} />
            </Stack>
          </Stack>

          {tradeOffNote && hasRoutes ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <AutoAwesomeRounded sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {tradeOffNote}
                </Typography>
              </Stack>
            </Box>
          ) : null}

          {loading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {[0, 1, 2].map((item) => (
                <Box
                  key={item}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    backgroundColor: alpha('#111111', 0.7),
                  }}
                >
                  <Skeleton variant="text" width="55%" height={42} />
                  <Skeleton variant="rectangular" height={116} sx={{ borderRadius: 3, mt: 1 }} />
                  <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 3, mt: 1.5 }} />
                  <Skeleton variant="text" width="90%" sx={{ mt: 1.5 }} />
                  <Skeleton variant="text" width="70%" />
                </Box>
              ))}
            </Box>
          ) : hasRoutes ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {routes.map((route) => (
                <RouteCard
                  key={route.route_id}
                  route={route}
                  isSelected={selectedRoute?.route_id === route.route_id}
                  onSelect={onRouteSelect}
                />
              ))}
            </Box>
          ) : (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <EmptyStateCard
                icon={<ShieldRounded />}
                title="Safety-first story"
                text="Every search compares route exposure instead of only shortest-path timing, so judges can instantly see why the AI recommendation matters."
              />
              <EmptyStateCard
                icon={<TimelineRounded />}
                title="Live operational telemetry"
                text="Response time, network simulation, and day-part risk context stay visible while the map remains the visual hero."
              />
              <EmptyStateCard
                icon={<AutoAwesomeRounded />}
                title="Presentation-ready flow"
                text="Autocomplete presets, animated controls, and a premium SOS action keep the experience polished enough for demos and investor walk-throughs."
              />
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
