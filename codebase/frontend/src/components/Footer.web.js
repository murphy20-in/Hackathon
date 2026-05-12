import React, { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function Footer() {
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.from('#app-footer', {
      scrollTrigger: {
        trigger: '#app-footer',
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
    });
  }, []);

  return (
    <Box
      id="app-footer"
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        borderTop: `1px solid ${alpha('#FFFFFF', 0.05)}`,
        background: '#0A0A0A',
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 5 } }}>
        <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.8rem', color: '#fff', letterSpacing: '0.04em' }}>
          SurakṣāMārga.ai
        </Typography>

        <Stack direction="row" spacing={4}>
          <Typography component="a" href="#hero" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Home
          </Typography>
          <Typography component="a" href="#map-section" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Map
          </Typography>
          <Typography component="a" href="#routes-section" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Routes
          </Typography>
        </Stack>

        <Stack direction="row" spacing={3}>
          {['github', 'linkedin-in', 'x-twitter', 'instagram'].map((icon) => (
            <Box
              key={icon}
              component="a"
              href="#"
              sx={{
                color: '#666',
                fontSize: '1rem',
                transition: 'color 0.3s',
                '&:hover': { color: '#FF5500' },
                textDecoration: 'none',
              }}
            >
              <i className={`fa-brands fa-${icon}`} />
            </Box>
          ))}
        </Stack>

        <Typography sx={{ color: '#444', fontSize: '0.75rem' }}>
          © 2025 SurakṣāMārga.ai. All rights reserved. Built for women's safety in Bangalore.
        </Typography>
      </Stack>
    </Box>
  );
}
