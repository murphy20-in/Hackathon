import React from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';
import TravelExploreRounded from '@mui/icons-material/TravelExploreRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { DEMO_LOCATIONS, DEMO_PRESETS } from '../theme/webTheme';

function renderField(theme, label, placeholder, value, onChange, icon, onSearch) {
  return (
    <Autocomplete
      freeSolo
      options={DEMO_LOCATIONS}
      value={value}
      onChange={(_, nextValue) => onChange(nextValue || '')}
      onInputChange={(_, nextValue) => onChange(nextValue || '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearch();
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                {icon}
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha('#020817', 0.42)
                  : alpha('#FFFFFF', 0.88),
              '& fieldset': {
                borderColor:
                  theme.palette.mode === 'dark'
                    ? alpha('#93C5FD', 0.16)
                    : alpha('#1E3A8A', 0.12),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.32),
              },
              '&.Mui-focused fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.6),
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
              },
            },
          }}
        />
      )}
    />
  );
}

export default function SearchInput({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onSearch,
  onSwap,
  loading,
  statusMessage,
}) {
  const theme = useTheme();

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5} alignItems="stretch">
        <Box sx={{ flex: 1 }}>
          {renderField(
            theme,
            'Starting point',
            'Search a neighborhood, landmark, or corridor',
            source,
            onSourceChange,
            <MyLocationRounded sx={{ color: theme.palette.secondary.main }} />,
            onSearch
          )}
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flex: 1, alignItems: 'stretch' }}>
          <Box sx={{ flex: 1 }}>
            {renderField(
              theme,
              'Destination',
              'Where should AI guide you?',
              destination,
              onDestinationChange,
              <PlaceRounded sx={{ color: theme.palette.error.main }} />,
              onSearch
            )}
          </Box>

          <IconButton
            onClick={onSwap}
            sx={{
              alignSelf: 'center',
              width: 52,
              height: 52,
              borderRadius: '18px',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha('#020817', 0.5)
                  : alpha('#FFFFFF', 0.76),
              color: theme.palette.primary.main,
              transition: 'transform 180ms ease, box-shadow 180ms ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.16)}`,
              },
            }}
          >
            <SwapHorizRounded />
          </IconButton>

          <Button
            onClick={onSearch}
            disabled={loading}
            variant="contained"
            startIcon={
              loading ? <CircularProgress size={18} sx={{ color: '#FFFFFF' }} /> : <TravelExploreRounded />
            }
            sx={{
              minWidth: { xs: '100%', xl: 220 },
              alignSelf: 'stretch',
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #0F766E 100%)',
              boxShadow: '0 18px 40px rgba(30, 58, 138, 0.32)',
              '&:hover': {
                background: 'linear-gradient(135deg, #172554 0%, #1D4ED8 50%, #115E59 100%)',
                transform: 'translateY(-1px) scale(1.01)',
                boxShadow: '0 22px 44px rgba(30, 58, 138, 0.36)',
              },
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
          >
            {loading ? 'Running AI safety analysis…' : 'Find Safe Routes'}
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ md: 'center' }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {DEMO_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              icon={<AutoAwesomeRounded />}
              onClick={() => {
                onSourceChange(preset.source);
                onDestinationChange(preset.destination);
              }}
              sx={{
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha('#0F172A', 0.72)
                    : alpha('#FFFFFF', 0.72),
              }}
            />
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.secondary', ml: { md: 'auto' } }}>
          Autocomplete is tuned for Bangalore demo corridors and landmark-based searches.
        </Typography>
      </Stack>

      {statusMessage ? (
        <Alert
          severity={statusMessage.severity || 'info'}
          sx={{
            borderRadius: 2.5,
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha('#08111F', 0.92)
                : alpha('#FFFFFF', 0.9),
          }}
        >
          {statusMessage.text}
        </Alert>
      ) : null}
    </Stack>
  );
}
