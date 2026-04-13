import React from 'react';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import BoltRounded from '@mui/icons-material/BoltRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import { alpha, useTheme } from '@mui/material/styles';

import SearchInput from './SearchInput';
import { glassPanel } from '../theme/webTheme';

export default function Navbar({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSearch,
  onSwap,
  loading,
  statusMessage,
  themeMode,
  onThemeModeChange,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 10,
        mb: { xs: 2.25, md: 2.75 },
        borderRadius: 4,
        p: { xs: 2.25, md: 3 },
        overflow: 'hidden',
        ...glassPanel(theme, 0.82),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 38%), radial-gradient(circle at right, rgba(45,212,191,0.16), transparent 32%)'
              : 'radial-gradient(circle at top left, rgba(59,130,246,0.16), transparent 36%), radial-gradient(circle at right, rgba(20,184,166,0.16), transparent 28%)',
          pointerEvents: 'none',
        }}
      />

      <Stack spacing={3} sx={{ position: 'relative' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} alignItems={{ lg: 'flex-start' }}>
          <Stack spacing={1.25} sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Investor Demo UI" icon={<AutoAwesomeRounded />} color="primary" />
              <Chip
                label="5G Edge Aware"
                icon={<BoltRounded />}
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                  color: theme.palette.secondary.main,
                }}
              />
              <Chip
                label="AI Safety Scoring"
                icon={<ShieldRounded />}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                }}
              />
            </Stack>

            <Typography variant="h2">AI Safe Route Navigator</Typography>
            <Typography variant="body1" sx={{ maxWidth: 760, color: 'text.secondary' }}>
              Real-time safety-aware navigation using 5G + AI. Compare recommended corridors,
              highlight risk hotspots, and demonstrate an end-to-end incident response flow.
            </Typography>
          </Stack>

          <IconButton
            onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
            sx={{
              alignSelf: { xs: 'flex-start', lg: 'center' },
              width: 52,
              height: 52,
              borderRadius: '18px',
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha('#0F172A', 0.82)
                  : alpha('#FFFFFF', 0.74),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha('#111C32', 0.92)
                    : alpha('#FFFFFF', 0.92),
              },
            }}
          >
            {themeMode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
          </IconButton>
        </Stack>

        <SearchInput
          source={source}
          destination={destination}
          onSourceChange={onSourceChange}
          onDestinationChange={onDestinationChange}
          onSearch={onSearch}
          onSwap={onSwap}
          loading={loading}
          statusMessage={statusMessage}
        />
      </Stack>
    </Box>
  );
}
