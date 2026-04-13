import React from 'react';
import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { getRouteTone } from '../theme/webTheme';

export default function SafetyIndicator({ safetyScore = 0, riskScore = 0 }) {
  const theme = useTheme();
  const tone = getRouteTone(riskScore);
  const progressValue = Math.max(0, Math.min(100, Number(safetyScore || 0) * 10));

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: alpha('#111111', 0.6),
        border: `1px solid ${alpha(tone.color, 0.16)}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
        <Typography variant="subtitle2">Safety score</Typography>
        <Typography variant="h6" sx={{ color: tone.color }}>
          {Number(safetyScore || 0).toFixed(1)}/10
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          height: 10,
          borderRadius: 999,
          backgroundColor: alpha(tone.color, 0.12),
          '& .MuiLinearProgress-bar': {
            borderRadius: 999,
            background: `linear-gradient(90deg, ${tone.color} 0%, ${tone.accent} 100%)`,
          },
        }}
      />

      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
        <Chip
          icon={<ShieldRounded />}
          label={tone.label}
          sx={{
            color: tone.color,
            backgroundColor: alpha(tone.color, 0.12),
          }}
        />
        <Chip
          icon={<WarningAmberRounded />}
          label={`Risk ${Number(riskScore || 0).toFixed(0)}`}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: alpha('#111111', 0.82),
          }}
        />
      </Stack>
    </Box>
  );
}
