import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
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
        p: 1.25,
        borderRadius: '10px',
        backgroundColor: alpha('#111111', 0.6),
        border: `1px solid ${alpha(tone.color, 0.16)}`,
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75, minWidth: 0, gap: 1, overflow: 'hidden' }}>
        <Typography sx={{ ...theme.typography.cardSubtitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
          Safety score
        </Typography>
        <Typography sx={{ ...theme.typography.cardTitle, color: tone.color, flexShrink: 0 }}>
          {Math.round(progressValue)}%
        </Typography>
      </Stack>

      <Box
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: alpha(tone.color, 0.12),
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: `${progressValue}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${tone.color} 0%, ${tone.accent} 100%)`,
            borderRadius: 2,
          }}
        />
      </Box>

      <Typography sx={{ ...theme.typography.chipLabel, color: '#888', mt: 0.5, textAlign: 'right' }}>
        {Math.round(progressValue)}%
      </Typography>

      <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: 'nowrap', minWidth: 0, overflow: 'hidden' }}>
        <Chip
          icon={<ShieldRounded />}
          label={tone.label}
          sx={{
            color: tone.color,
            backgroundColor: alpha(tone.color, 0.12),
            alignSelf: 'flex-start',
            flexShrink: 0,
            px: 0.2,
            '& .MuiChip-label': {
              ...theme.typography.chipLabel,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
          }}
        />
        <Chip
          icon={<WarningAmberRounded />}
          label={`Risk ${Number(riskScore || 0).toFixed(0)}`}
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: alpha('#111111', 0.82),
            alignSelf: 'flex-start',
            flexShrink: 0,
            px: 0.2,
            '& .MuiChip-label': {
              ...theme.typography.chipLabel,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
          }}
        />
      </Stack>
    </Box>
  );
}
