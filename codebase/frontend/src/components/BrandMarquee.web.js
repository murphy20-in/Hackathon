import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const BRANDS = [
  { name: '5G Network', icon: '⚡' },
  { name: 'OpenStreetMap', icon: '🗺️' },
  { name: 'OSRM Routing', icon: '🔀' },
  { name: 'AI Safety Engine', icon: '🛡️' },
  { name: 'Crime Data API', icon: '📊' },
  { name: 'Bangalore Police', icon: '👮' },
];

function Pill({ name, icon }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.2,
        backgroundColor: alpha('#FFFFFF', 0.05),
        border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        borderRadius: 999,
        px: 3,
        py: 1.2,
        mx: 1,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
        {name}
      </Typography>
    </Box>
  );
}

export default function BrandMarquee() {
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.from('#marquee-section', {
      scrollTrigger: {
        trigger: '#marquee-section',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
    });
  }, []);

  return (
    <Box id="marquee-section" sx={{ py: { xs: 6, md: 8 }, background: '#111111' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 5 }, mb: 3 }}>
        <Typography sx={{ color: '#666', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>
          Powered by Technologies That Keep You Safe
        </Typography>
      </Box>

      <Box
        className="marquee-wrapper"
        sx={{
          overflow: 'hidden',
          '&:hover .marquee-track': {
            animationPlayState: 'paused',
          },
        }}
      >
        <Stack
          direction="row"
          className="marquee-track"
          sx={{
            width: 'max-content',
            animation: 'marquee-scroll 25s linear infinite',
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <Pill key={`${b.name}-${i}`} name={b.name} icon={b.icon} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
