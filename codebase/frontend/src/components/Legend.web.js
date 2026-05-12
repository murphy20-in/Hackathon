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
    <Stack spacing={1} sx={{ minWidth: 0, width: '100%', maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
      <Typography sx={{ ...theme.typography.sectionHead, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
        Visual legend
      </Typography>
      <Stack spacing={1}>
        {ITEMS.map((item) => (
          <Stack key={item.label} direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flexWrap: 'nowrap', overflow: 'hidden' }}>
            <Box
              sx={{
                width: 24,
                height: 8,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${alpha(item.color, 0.35)} 0%, ${item.color} 100%)`,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ ...theme.typography.bodySmall, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1, flexShrink: 1 }}>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
