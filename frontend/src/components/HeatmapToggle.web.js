import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import RadarRounded from '@mui/icons-material/RadarRounded';
import { alpha, useTheme } from '@mui/material/styles';

export default function HeatmapToggle({ isActive, onToggle, loading }) {
  const theme = useTheme();

  return (
    <Button
      onClick={onToggle}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RadarRounded />}
      variant={isActive ? 'contained' : 'outlined'}
      sx={{
        justifyContent: 'flex-start',
        borderRadius: 2.5,
        borderColor: alpha(theme.palette.error.main, 0.24),
        color: isActive ? '#FFFFFF' : theme.palette.text.primary,
        background: isActive
          ? 'linear-gradient(135deg, #DC2626 0%, #FB7185 100%)'
          : theme.palette.mode === 'dark'
            ? alpha('#0F172A', 0.76)
            : alpha('#FFFFFF', 0.74),
        '&:hover': {
          borderColor: alpha(theme.palette.error.main, 0.38),
          background: isActive
            ? 'linear-gradient(135deg, #B91C1C 0%, #F43F5E 100%)'
            : theme.palette.mode === 'dark'
              ? alpha('#111C32', 0.9)
              : alpha('#FFFFFF', 0.92),
        },
      }}
    >
      {isActive ? 'Hide risk heatmap' : 'Show risk heatmap'}
    </Button>
  );
}
