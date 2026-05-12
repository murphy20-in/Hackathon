import React, { useEffect, useRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  // Three.js particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let rafId = null;
    let checkTimer = null;
    let resize = null;
    let onScroll = null;
    let renderer = null;
    let geometry = null;
    let material = null;

    const initAnimation = () => {
      if (cancelled || !window.THREE || sceneRef.current) return;

      const THREE = window.THREE;
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 4;

      resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize);

      const count = 4000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorA = new THREE.Color('#FF5500');
      const colorB = new THREE.Color('#FF2200');
      const colorW = new THREE.Color('#FFFFFF');

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2.8 * Math.cbrt(Math.random());

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        const t = Math.random();
        const c = t < 0.2 ? colorW : colorA.clone().lerp(colorB, Math.random());
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      material = new THREE.PointsMaterial({
        size: 0.018,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      sceneRef.current = { renderer, scene, camera, points };

      let scrollY = 0;
      onScroll = () => { scrollY = window.scrollY; };
      window.addEventListener('scroll', onScroll);

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0003;
        points.position.y = scrollY * 0.0004;
        renderer.render(scene, camera);
      };
      animate();
    };

    if (window.THREE) {
      initAnimation();
    } else {
      checkTimer = window.setInterval(() => {
        if (window.THREE) {
          window.clearInterval(checkTimer);
          checkTimer = null;
          initAnimation();
        }
      }, 120);
    }

    return () => {
      cancelled = true;
      if (checkTimer) window.clearInterval(checkTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (resize) window.removeEventListener('resize', resize);
      if (onScroll) window.removeEventListener('scroll', onScroll);
      if (sceneRef.current?.scene && sceneRef.current?.points) {
        sceneRef.current.scene.remove(sceneRef.current.points);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
      sceneRef.current = null;
    };
  }, []);

  // GSAP hero animation
  useEffect(() => {
    if (!window.gsap) return;
    const gsap = window.gsap;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-line', { y: 80, opacity: 0, duration: 0.9, stagger: 0.15 }, 0.3);
    tl.from('.hero-tagline', { y: 50, opacity: 0, duration: 0.8 }, '-=0.5');
    tl.from('.hero-service', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
  }, []);

  const services = [
    { num: '#01', label: 'AI Risk Scoring' },
    { num: '#02', label: 'Safe Route Planning' },
    { num: '#03', label: 'Crime Heatmaps' },
    { num: '#04', label: 'Emergency SOS' },
  ];

  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Grain overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.6) 35%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Content */}
      <Box sx={{ position: 'relative', zIndex: 10, maxWidth: 1280, mx: 'auto', width: '100%', px: { xs: 3, md: 5 }, pb: { xs: 5, md: 8 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ lg: 'flex-end' }} justifyContent="space-between" spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
          {/* Left: Big heading */}
          <Box>
            <Typography className="hero-line" sx={{ color: '#999', fontSize: { xs: '0.85rem', md: '1rem' }, mb: 1, letterSpacing: '0.1em' }}>
              Powered by 5G & AI
            </Typography>
            <Typography className="hero-line" sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '64px', sm: '80px', md: '120px', lg: '140px' }, lineHeight: 0.92, color: '#fff', letterSpacing: '-1px' }}>
              SurakṣāMārga.ai
            </Typography>
          </Box>

          {/* Right: Tagline */}
          <Box className="hero-tagline" sx={{ maxWidth: { lg: 420 }, textAlign: { lg: 'right' } }}>
            <Typography sx={{ fontSize: { xs: '1.15rem', md: '1.4rem' }, fontWeight: 600, lineHeight: 1.4, mb: 1.5, color: '#fff' }}>
              Not the fastest route. The safest one.
            </Typography>
            <Typography sx={{ color: '#999', fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.7 }}>
              AI-powered navigation that scores every street for safety using 157K+ crime records, real-time context, and time-of-day intelligence — built for Bangalore.
            </Typography>
          </Box>
        </Stack>

        {/* Service strip */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4, md: 6 }} flexWrap="wrap">
            {services.map((s) => (
              <Box key={s.num} className="hero-service">
                <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '1.5rem', md: '1.8rem' }, color: '#FF5500' }}>
                  {s.num}
                </Typography>
                <Typography sx={{ color: '#fff', fontSize: { xs: '0.85rem', md: '0.95rem' }, fontWeight: 500, mt: 0.3 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
