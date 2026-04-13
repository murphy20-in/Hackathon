import React from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import BoltRounded from '@mui/icons-material/BoltRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { NETWORK_PROFILES } from '../constants/config';

export default function NetworkBadge({ currentMode, onToggle, responseTime }) {
  const theme = useTheme();
  const profile = NETWORK_PROFILES[currentMode] || NETWORK_PROFILES['5G'];

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Network simulation
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.2,
            py: 0.7,
            borderRadius: 999,
            backgroundColor: alpha(profile.color, 0.14),
            color: profile.color,
          }}
        >
          <BoltRounded sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {profile.latency}ms latency
          </Typography>
        </Box>
      </Stack>

      <ToggleButtonGroup
        exclusive
        size="small"
        value={currentMode}
        onChange={(_, nextValue) => {
          if (nextValue) onToggle(nextValue);
        }}
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1,
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: '16px !important',
            textTransform: 'none',
            fontWeight: 700,
            color: theme.palette.text.secondary,
            backgroundColor: alpha('#111111', 0.7),
          },
          '& .Mui-selected': {
            color: '#FFFFFF !important',
            background: 'linear-gradient(135deg, #CC4400 0%, #FF5500 48%, #FF7733 100%) !important',
            boxShadow: '0 14px 28px rgba(255, 85, 0, 0.22)',
          },
        }}
      >
        {Object.keys(NETWORK_PROFILES).map((mode) => (
          <ToggleButton key={mode} value={mode}>
            {mode}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Response telemetry
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {responseTime > 0 ? `${responseTime}ms observed` : 'Awaiting route fetch'}
        </Typography>
      </Stack>
    </Stack>
  );
}
