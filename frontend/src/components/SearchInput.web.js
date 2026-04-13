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
import MyLocationRounded from '@mui/icons-material/MyLocationRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
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
              backgroundColor: alpha('#111111', 0.8),
              '& fieldset': {
                borderColor: alpha('#FFFFFF', 0.1),
              },
              '&:hover fieldset': {
                borderColor: alpha('#FF5500', 0.5),
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF5500',
                boxShadow: `0 0 0 3px ${alpha('#FF5500', 0.15)}`,
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
            'From',
            'Enter starting point',
            source,
            onSourceChange,
            <MyLocationRounded sx={{ color: '#FF5500', fontSize: 22 }} />,
            onSearch
          )}
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flex: 1, alignItems: 'stretch' }}>
          <Box sx={{ flex: 1 }}>
            {renderField(
              theme,
              'To',
              'Enter destination',
              destination,
              onDestinationChange,
              <PlaceRounded sx={{ color: '#EF4444', fontSize: 22 }} />,
              onSearch
            )}
          </Box>

          <IconButton
            onClick={onSwap}
            sx={{
              alignSelf: 'center',
              width: 48,
              height: 48,
              borderRadius: '14px',
              border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
              backgroundColor: alpha('#111111', 0.8),
              color: '#999',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: alpha('#1A1A1A', 0.9),
                color: '#fff',
                transform: 'rotate(180deg)',
              },
              transition: 'all 200ms ease',
            }}
          >
            <SwapHorizRounded />
          </IconButton>

          <Button
            onClick={onSearch}
            disabled={loading}
            variant="contained"
            startIcon={loading ? <CircularProgress size={18} sx={{ color: '#FFFFFF' }} /> : <SearchRounded />}
            sx={{
              minWidth: { xs: '100%', xl: 200 },
              alignSelf: 'stretch',
              background: 'linear-gradient(135deg, #CC4400 0%, #FF5500 100%)',
              boxShadow: '0 4px 14px rgba(255, 85, 0, 0.35)',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: '14px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5500 0%, #FF7733 100%)',
                boxShadow: '0 6px 20px rgba(255, 85, 0, 0.45)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: alpha('#64748B', 0.6),
              },
              transition: 'all 200ms ease',
            }}
          >
            {loading ? 'Analyzing...' : 'Find Routes'}
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
          Try:
        </Typography>
        {DEMO_PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            onClick={() => {
              onSourceChange(preset.source);
              onDestinationChange(preset.destination);
            }}
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: 28,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              backgroundColor: 'transparent',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderColor: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </Stack>

      {statusMessage ? (
        <Alert
          severity={statusMessage.severity || 'info'}
          sx={{
            borderRadius: 2,
            fontSize: '0.875rem',
            backgroundColor: statusMessage.severity === 'success' 
              ? alpha('#10B981', 0.1)
              : statusMessage.severity === 'error'
              ? alpha('#EF4444', 0.1)
              : statusMessage.severity === 'warning'
              ? alpha('#F59E0B', 0.1)
              : alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${
              statusMessage.severity === 'success' 
                ? alpha('#10B981', 0.3)
                : statusMessage.severity === 'error'
                ? alpha('#EF4444', 0.3)
                : statusMessage.severity === 'warning'
                ? alpha('#F59E0B', 0.3)
                : alpha(theme.palette.primary.main, 0.2)
            }`,
          }}
        >
          {statusMessage.text}
        </Alert>
      ) : null}
    </Stack>
  );
}
