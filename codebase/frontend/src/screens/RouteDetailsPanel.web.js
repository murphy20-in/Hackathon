import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
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
        p: 1.5,
        borderRadius: '12px',
        backgroundColor: alpha('#FFFFFF', 0.03),
        border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        maxWidth: '100%',
        width: '100%',
        flexShrink: 1,
      }}
    >
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '8px',
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        >
          {icon}
        </Box>
        <Typography sx={{ ...theme.typography.cardTitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {title}
        </Typography>
        <Typography sx={{ ...theme.typography.bodySmall, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minWidth: 0, flexShrink: 1 }}>
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
        minWidth: 0,
      }}
    >
      <Paper
        sx={{
          p: 1.25,
          borderRadius: '12px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          ...glassPanel(theme, 0.9),
        }}
      >
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              pb: 1.25,
              borderBottom: `1px solid ${alpha('#FFFFFF', 0.07)}`,
              mb: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                color: '#FF6B35',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Recommended Corridors
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '#888',
                mt: 0.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Ranked by AI safety score
            </Typography>
          </Box>

          {tradeOffNote && hasRoutes ? (
            <Box
              sx={{
                p: 1.25,
                borderRadius: '10px',
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
                overflow: 'hidden',
                boxSizing: 'border-box',
              }}
            >
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0, overflow: 'hidden' }}>
                <AutoAwesomeRounded sx={{ color: theme.palette.secondary.main, flexShrink: 0 }} />
                <Typography sx={{ ...theme.typography.bodySmall, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minWidth: 0, flex: 1 }}>
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
                width: '100%',
                maxHeight: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                px: 0,
                boxSizing: 'border-box',
                minWidth: 0,
              }}
            >
              <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
                {routes.map((route, index) => (
                  <RouteCard
                    key={route.id ?? route.route_id ?? `route-${index + 1}`}
                    route={route}
                    index={index}
                    isSelected={(selectedRoute?.id ?? selectedRoute?.route_id) === (route.id ?? route.route_id)}
                    onSelect={onRouteSelect}
                  />
                ))}
              </Stack>
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
