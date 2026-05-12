import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CameraAltRounded from '@mui/icons-material/CameraAltRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { verifyIdentity } from '../services/api';
import { glassPanel } from '../theme/webTheme';

const STEPS = ['Gov ID', 'Face Auth', 'Verification'];
const MOCK_MODE = true;

function createMockEmbedding(seedText) {
  const hash = btoa(seedText).replace(/=/g, '').slice(0, 24);
  return `vector_mock_${hash}`;
}

function verifyIdentityMock(data) {
  if (MOCK_MODE) {
    return {
      verified: true,
      confidence: 0.92,
      message: 'Mock verification successful',
    };
  }

  return verifyIdentity(data.govId, data.faceEmbedding);
}

export default function IdentityOnboarding({ onVerified }) {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [govId, setGovId] = useState('');
  const [faceEmbedding, setFaceEmbedding] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const canCaptureFace = govId.trim().length > 0;
  const canVerify = govId.trim().length > 0 && faceEmbedding.length > 0;

  const helpText = useMemo(() => {
    if (!govId) return 'Use Aadhaar mock format 1234-5678-9012 or PAN format ABCDE1234F';
    return faceEmbedding ? 'Face scan captured. Proceed to verification.' : 'Capture face scan to continue.';
  }, [govId, faceEmbedding]);

  const handleCaptureFace = () => {
    if (!canCaptureFace) return;
    setScanning(true);
    setTimeout(() => {
      const embedding = createMockEmbedding(`${govId}:${Date.now()}`);
      setFaceEmbedding(embedding);
      setScanning(false);
      setActiveStep(2);
      setResult({
        verified: true,
        confidence: 0.92,
        message: 'Face scan complete (mock)',
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (!canVerify) return;
    setLoading(true);
    try {
      const response = await verifyIdentityMock({ govId, faceEmbedding });
      setResult(response);
      if (response.verified || MOCK_MODE) {
        const confidence = response.confidence ?? 0.92;
        setResult({
          verified: true,
          confidence,
          message: 'Mock verification successful',
        });
        setActiveStep(3);

        setTimeout(() => {
          onVerified?.({
            govId,
            confidence,
            verifiedAt: new Date().toISOString(),
          });
        }, 1200);
      } else {
        onVerified?.({
          govId,
          confidence: response.confidence,
          verifiedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      setResult({
        verified: true,
        confidence: 0.92,
        message: 'Mock verification successful',
      });
      setTimeout(() => {
        onVerified?.({
          govId,
          confidence: 0.92,
          verifiedAt: new Date().toISOString(),
        });
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let rafId = null;
    let checkTimer = null;
    let resize = null;
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
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
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

      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 2.8 * Math.cbrt(Math.random());

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        const t = Math.random();
        const color = t < 0.2 ? colorW : colorA.clone().lerp(colorB, Math.random());
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
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
      sceneRef.current = { scene, points };

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        points.rotation.y += 0.0008;
        points.rotation.x += 0.0003;
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
      if (sceneRef.current?.scene && sceneRef.current?.points) {
        sceneRef.current.scene.remove(sceneRef.current.points);
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        background:
          'radial-gradient(circle at 10% 20%, rgba(108,99,255,0.15), transparent), radial-gradient(circle at 90% 80%, rgba(255,101,132,0.1), transparent), radial-gradient(circle at 20% 20%, #0f0f1a, #050507 70%)',
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

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

      <Paper
        sx={{
          position: 'relative',
          zIndex: 2,
          width: 'min(420px, 100%)',
          p: { xs: 2.5, md: 4 },
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          ...glassPanel(theme, 0.9),
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                mb: '12px',
              }}
            >
              <Chip
                label="Demo Mode"
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: alpha('#4CAF50', 0.15),
                  color: '#4CAF50',
                  borderRadius: '999px',
                  fontSize: '11px',
                  height: 'auto',
                  '& .MuiChip-label': {
                    px: '10px',
                    py: '4px',
                    fontWeight: 500,
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: '#FF6A00',
                  opacity: 0.8,
                  lineHeight: 1.2,
                }}
              >
                SECURITY LAYER
              </Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, mt: 0.5 }}>
              Identity verification before safety navigation
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Government ID"
              value={govId}
              onChange={(event) => {
                setGovId(event.target.value.toUpperCase());
                setResult(null);
                setActiveStep(1);
              }}
              placeholder="1234-5678-9012 or ABCDE1234F"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
              <Button
                variant="outlined"
                startIcon={<CameraAltRounded />}
                onClick={handleCaptureFace}
                disabled={!canCaptureFace || scanning}
              >
                {scanning ? 'Scanning...' : 'Simulate Face Scan'}
              </Button>
              <Button
                variant="contained"
                onClick={handleVerify}
                disabled={!canVerify || loading}
              >
                {loading ? 'Verifying...' : 'Verify Identity'}
              </Button>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {helpText}
            </Typography>
          </Stack>

          {result ? (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                backgroundColor: alpha(theme.palette.success.main, 0.08),
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleRounded color="success" />
                <Typography variant="subtitle2">
                  ✅ Identity Verified (Mock Mode)
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Confidence: {Math.round((result.confidence ?? 0.92) * 100)}%
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
}
