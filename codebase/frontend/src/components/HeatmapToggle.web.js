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
          : alpha('#111111', 0.76),
        '&:hover': {
          borderColor: alpha(theme.palette.error.main, 0.38),
          background: isActive
            ? 'linear-gradient(135deg, #B91C1C 0%, #F43F5E 100%)'
            : alpha('#1A1A1A', 0.9),
        },
      }}
    >
      {isActive ? 'Hide risk heatmap' : 'Show risk heatmap'}
    </Button>
  );
}
