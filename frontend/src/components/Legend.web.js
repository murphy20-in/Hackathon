import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const ITEMS = [
  { label: 'Safest route', color: '#0F766E' },
  { label: 'Watch closely', color: '#D97706' },
  { label: 'Unsafe corridor', color: '#DC2626' },
];

export default function Legend() {
  const theme = useTheme();

  return (
    <Stack spacing={1}>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Visual legend
      </Typography>
      <Stack spacing={1}>
        {ITEMS.map((item) => (
          <Stack key={item.label} direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 34,
                height: 8,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${alpha(item.color, 0.35)} 0%, ${item.color} 100%)`,
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
