import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AutoGraphRounded from '@mui/icons-material/AutoGraphRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import TimelineRounded from '@mui/icons-material/TimelineRounded';
import { alpha, useTheme } from '@mui/material/styles';

function MetricTile({ icon, label, value, accent }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: '12px',
        backgroundColor: alpha('#111111', 0.6),
        border: `1px solid ${alpha(accent, 0.16)}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        flexShrink: 1,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: 'nowrap', overflow: 'hidden' }}>
        <Box
          sx={{
            width: 30,
            height: 30,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '8px',
            backgroundColor: alpha(accent, 0.14),
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <Typography sx={{ ...theme.typography.chipLabel, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flexShrink: 1 }}>
            {label}
          </Typography>
          <Typography sx={{ ...theme.typography.cardTitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flexShrink: 1 }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function MetricsPanel({ networkMode, responseTime, routeCount, timeContext }) {
  const theme = useTheme();

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Typography sx={{ ...theme.typography.sectionHead, color: 'text.secondary' }}>
        Live route telemetry
      </Typography>

      <Grid container spacing={1.25}>
        <Grid item xs={12}>
          <MetricTile
            icon={<TimelineRounded sx={{ fontSize: 18 }} />}
            label="Active route set"
            value={`${routeCount || 0} option${routeCount === 1 ? '' : 's'}`}
            accent={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12}>
          <MetricTile
            icon={<ScheduleRounded sx={{ fontSize: 18 }} />}
            label="Observed response"
            value={responseTime > 0 ? `${responseTime}ms` : 'Pending'}
            accent={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12}>
          <MetricTile
            icon={<AutoGraphRounded sx={{ fontSize: 18 }} />}
            label="Current context"
            value={timeContext ? `${timeContext.label} / ${timeContext.risk_level}` : `${networkMode} AI sync`}
            accent={theme.palette.warning.main}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
