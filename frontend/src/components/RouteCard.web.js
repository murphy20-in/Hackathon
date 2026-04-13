import React from 'react';
import {
  Box,
  Card,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import RouteRounded from '@mui/icons-material/RouteRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { alpha, useTheme } from '@mui/material/styles';

import SafetyIndicator from './SafetyIndicator';
import { getRouteTone } from '../theme/webTheme';

function MetricPill({ icon, label, value, accent }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.4,
        borderRadius: 2.5,
        backgroundColor: alpha(accent, 0.08),
        border: `1px solid ${alpha(accent, 0.12)}`,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.35 }}>
        <Box sx={{ color: accent, display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function RouteCard({ route, isSelected, onSelect }) {
  const theme = useTheme();
  const tone = getRouteTone(route.risk_score);
  const label = route.label || `Route ${route.route_id}`;
  const summary = route.summary || {
    high_risk_segments: 0,
    medium_risk_segments: 0,
    low_risk_segments: 0,
    total_segments: 1,
  };
  const lowRisk = summary.low_risk_segments || 0;
  const medRisk = summary.medium_risk_segments || 0;
  const highRisk = summary.high_risk_segments || 0;
  
  const totalSegments = Math.max(
    summary.total_segments || (lowRisk + medRisk + highRisk),
    1
  );

  return (
    <Card
      onClick={() => onSelect(route)}
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: 'none',
        height: '100%',
        p: 2.5,
        borderRadius: 4,
        cursor: 'pointer',
        background: isSelected
          ? 'linear-gradient(160deg, rgba(255,107,53,0.12) 0%, rgba(20,15,10,0.95) 100%)'
          : tone.fill,
        border: isSelected
          ? '2px solid #FF6B35'
          : `1px solid ${alpha('#FFFFFF', 0.06)}`,
        boxShadow: isSelected
          ? '0 0 0 4px rgba(255,107,53,0.15), 0 28px 56px rgba(255,85,0,0.2)'
          : '0 16px 36px rgba(0, 0, 0, 0.3)',
        transform: isSelected ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
        transition: 'all 280ms ease',
        '&:hover': {
          transform: isSelected ? 'translateY(-10px) scale(1.03)' : 'translateY(-6px) scale(1.01)',
          boxShadow: isSelected
            ? '0 0 0 4px rgba(255,107,53,0.2), 0 32px 64px rgba(255,85,0,0.25)'
            : `0 30px 60px ${tone.glow}`,
          borderColor: isSelected ? '#FF6B35' : alpha('#FF5500', 0.3),
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
          <Box>
            <Typography variant="overline" sx={{ color: tone.color }}>
              {isSelected ? 'Selected route' : 'Compare option'}
            </Typography>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', mt: 0.4 }}>
              {label}
            </Typography>
          </Box>

          <Stack spacing={1} alignItems="flex-end">
            <Chip
              label={tone.label}
              sx={{
                color: tone.color,
                backgroundColor: alpha(tone.color, 0.12),
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Route #{route.route_id}
            </Typography>
          </Stack>
        </Stack>

        <SafetyIndicator safetyScore={route.safety_score} riskScore={route.risk_score} />

        <Stack direction="row" spacing={1.2}>
          <MetricPill
            icon={<RouteRounded sx={{ fontSize: 18 }} />}
            label="Distance"
            value={route.distance}
            accent={theme.palette.primary.main}
          />
          <MetricPill
            icon={<ScheduleRounded sx={{ fontSize: 18 }} />}
            label="Duration"
            value={route.duration}
            accent={theme.palette.secondary.main}
          />
          <MetricPill
            icon={<WarningAmberRounded sx={{ fontSize: 18 }} />}
            label="Risk"
            value={`${Number(route.risk_score || 0).toFixed(0)}`}
            accent={tone.color}
          />
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: alpha('#111111', 0.5),
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.1 }}>
            <SecurityRounded sx={{ fontSize: 18, color: tone.color }} />
            <Typography variant="subtitle2">Exposure profile</Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              gap: 0.4,
              height: 10,
              borderRadius: 999,
              overflow: 'hidden',
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }}
          >
            <Box sx={{ flex: lowRisk || 0.1, backgroundColor: '#0F766E' }} />
            <Box sx={{ flex: medRisk || 0.1, backgroundColor: '#D97706' }} />
            <Box sx={{ flex: highRisk || 0.1, backgroundColor: '#DC2626' }} />
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {lowRisk} safe
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {medRisk} watch
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {highRisk} unsafe / {totalSegments}
            </Typography>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {route.message ||
            'AI safety scoring blends risk density, route exposure, and dynamic time-of-day context.'}
        </Typography>
      </Stack>
    </Card>
  );
}
