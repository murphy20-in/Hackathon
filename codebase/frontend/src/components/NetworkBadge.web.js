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
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minWidth: 0, gap: 1, overflow: 'hidden' }}>
        <Typography sx={{ ...theme.typography.sectionHead, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
          Network simulation
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.4,
            borderRadius: 999,
            backgroundColor: alpha(profile.color, 0.14),
            color: profile.color,
            alignSelf: 'flex-start',
            flexShrink: 0,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <BoltRounded sx={{ fontSize: 14, flexShrink: 0 }} />
          <Typography sx={{ ...theme.typography.chipLabel, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
          gap: 0.75,
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none',
            borderRadius: '12px !important',
            textTransform: 'none',
            fontWeight: 700,
            color: theme.palette.text.secondary,
            backgroundColor: alpha('#111111', 0.7),
            overflow: 'hidden',
            minWidth: 0,
            px: 1,
            py: 0.5,
            ...theme.typography.chipLabel,
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

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minWidth: 0, gap: 1, overflow: 'hidden' }}>
        <Typography sx={{ ...theme.typography.bodySmall, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>
          Response telemetry
        </Typography>
        <Typography sx={{ ...theme.typography.cardSubtitle, fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>
          {responseTime > 0 ? `${responseTime}ms observed` : 'Awaiting route fetch'}
        </Typography>
      </Stack>
    </Stack>
  );
}
