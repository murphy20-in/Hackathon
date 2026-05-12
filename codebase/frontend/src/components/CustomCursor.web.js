import { useEffect } from 'react';

/**
 * Renders a custom cursor (white dot + orange ring) on desktop.
 * Hidden on mobile / touch devices.
 * Uses GSAP quickTo for smooth lag.
 */
export default function CustomCursor() {
  useEffect(() => {
    // Only on desktop
    if (typeof window === 'undefined') return;
    if ('ontouchstart' in window || window.innerWidth < 768) return;
    if (!window.gsap) return;

    const gsap = window.gsap;

    // Create cursor elements
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.style.cssText = `
      position:fixed; top:0; left:0; width:8px; height:8px;
      background:#fff; border-radius:50%; pointer-events:none;
      z-index:99999; mix-blend-mode:difference;
    `;

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.style.cssText = `
      position:fixed; top:0; left:0; width:40px; height:40px;
      border:2px solid #FF5500; border-radius:50%; pointer-events:none;
      z-index:99998; opacity:0.7;
    `;

    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.style.cursor = 'none';

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e) => {
      xDot(e.clientX - 4);
      yDot(e.clientY - 4);
      xRing(e.clientX - 20);
      yRing(e.clientY - 20);
    };

    window.addEventListener('mousemove', onMove);

    // Hover effect on interactive elements
    const onEnter = () => gsap.to(ring, { scale: 1.6, borderColor: '#fff', duration: 0.3 });
    const onLeave = () => gsap.to(ring, { scale: 1, borderColor: '#FF5500', duration: 0.3 });

    const bindHovers = () => {
      document.querySelectorAll('a, button, [role="button"], .MuiButton-root, .MuiChip-root, .MuiIconButton-root, .MuiFab-root').forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    // Bind initially + re-bind periodically for dynamic content
    bindHovers();
    const rebindInterval = setInterval(bindHovers, 3000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(rebindInterval);
      document.body.style.cursor = '';
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
