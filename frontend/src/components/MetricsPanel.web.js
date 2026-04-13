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
        p: 1.6,
        borderRadius: 2.5,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha('#020817', 0.48)
            : alpha('#FFFFFF', 0.68),
        border: `1px solid ${alpha(accent, 0.16)}`,
      }}
    >
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '14px',
            backgroundColor: alpha(accent, 0.14),
            color: accent,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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
    <Stack spacing={1.5}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
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
