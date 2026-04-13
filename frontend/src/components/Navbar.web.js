import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function Navbar({ onScrollToMap }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP fade-in
  useEffect(() => {
    if (!window.gsap) return;
    window.gsap.from('#main-navbar', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  // CTA hover bounce
  useEffect(() => {
    if (!window.gsap) return;
    const cta = document.getElementById('nav-cta-btn');
    if (!cta) return;
    const enter = () => {
      window.gsap.fromTo(cta, { scale: 1 }, { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    };
    cta.addEventListener('mouseenter', enter);
    return () => cta.removeEventListener('mouseenter', enter);
  }, []);

  return (
    <Box
      id="main-navbar"
      ref={navRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        transition: 'all 0.5s ease',
        background: scrolled ? alpha('#0A0A0A', 0.72) : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 3, md: 5 }, py: 2.5 }}>
        <Typography
          component="a"
          href="#hero"
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: '1.5rem',
            color: '#fff',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            fontWeight: 400,
          }}
        >
          SafeRoute AI
        </Typography>

        {/* Desktop links */}
        <Stack direction="row" spacing={4} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Typography component="a" href="#hero" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Home
          </Typography>
          <Typography component="a" href="#map-section" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Map
          </Typography>
          <Typography component="a" href="#routes-section" sx={{ color: '#999', fontSize: '0.85rem', textDecoration: 'none', '&:hover': { color: '#fff' }, transition: 'color 0.3s' }}>
            Routes
          </Typography>
          <Box
            id="nav-cta-btn"
            component="a"
            href="#map-section"
            onClick={(e) => {
              e.preventDefault();
              if (onScrollToMap) onScrollToMap();
              else document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#FF5500',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: 999,
              textDecoration: 'none',
              transition: 'filter 0.3s',
              '&:hover': { filter: 'brightness(1.1)' },
            }}
          >
            Find Routes <span style={{ fontSize: '0.75rem' }}>→</span>
          </Box>
        </Stack>

        {/* Mobile hamburger */}
        <Box
          onClick={() => setMenuOpen(!menuOpen)}
          sx={{
            display: { xs: 'block', md: 'none' },
            color: '#fff',
            fontSize: '1.4rem',
            cursor: 'pointer',
          }}
        >
          <i className={`fa-solid fa-${menuOpen ? 'xmark' : 'bars'}`} />
        </Box>
      </Box>

      {/* Mobile menu */}
      {menuOpen && (
        <Box sx={{ display: { md: 'none' }, px: 3, pb: 3, background: alpha('#0A0A0A', 0.95), backdropFilter: 'blur(20px)' }}>
          <Stack spacing={2}>
            <Typography component="a" href="#hero" onClick={() => setMenuOpen(false)} sx={{ color: '#999', fontSize: '0.9rem', textDecoration: 'none', '&:hover': { color: '#fff' } }}>Home</Typography>
            <Typography component="a" href="#map-section" onClick={() => setMenuOpen(false)} sx={{ color: '#999', fontSize: '0.9rem', textDecoration: 'none', '&:hover': { color: '#fff' } }}>Map</Typography>
            <Typography component="a" href="#routes-section" onClick={() => setMenuOpen(false)} sx={{ color: '#999', fontSize: '0.9rem', textDecoration: 'none', '&:hover': { color: '#fff' } }}>Routes</Typography>
            <Box
              component="a"
              href="#map-section"
              onClick={() => setMenuOpen(false)}
              sx={{ backgroundColor: '#FF5500', color: '#fff', fontSize: '0.85rem', fontWeight: 600, px: 3, py: 1.2, borderRadius: 999, textDecoration: 'none', textAlign: 'center' }}
            >
              Find Routes →
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
