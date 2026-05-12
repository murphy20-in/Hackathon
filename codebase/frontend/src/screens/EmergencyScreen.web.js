import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import LocationSearchingRounded from '@mui/icons-material/LocationSearchingRounded';
import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import { alpha, useTheme } from '@mui/material/styles';

import { watchPosition } from '../services/locationService';
import { resolveSOS } from '../services/api';
import { glassPanel } from '../theme/webTheme';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function StatusRow({ icon, label, value, accent }) {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      sx={{
        px: 2,
        py: 1.4,
        borderRadius: 2.5,
        backgroundColor: alpha(accent, 0.08),
        border: `1px solid ${alpha(accent, 0.14)}`,
      }}
    >
      <Box sx={{ color: accent, display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function EmergencyScreen({ route, navigation }) {
  const theme = useTheme();
  const {
    location: initialLocation,
    networkMode = '5G',
    sosId: initialSosId = null,
    trackingUrl = '',
  } = route.params || {};

  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [elapsed, setElapsed] = useState(0);
  const [sosId] = useState(initialSosId);
  const watchRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        const subscription = await watchPosition((loc) => {
          setCurrentLocation(loc);
        }, 5000);
        watchRef.current = subscription;
      } catch (error) {
        console.error('Failed to start emergency tracking:', error);
      }
    };

    startTracking();
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (watchRef.current?.remove) watchRef.current.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCancel = async () => {
    try {
      if (sosId) {
        await resolveSOS(sosId, networkMode);
      }
    } catch (error) {
      console.error('Failed to resolve SOS:', error);
    }
    if (watchRef.current?.remove) watchRef.current.remove();
    navigation.goBack();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        p: { xs: 2, md: 4 },
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(153,27,27,0.24) 0%, rgba(2,6,23,0.96) 58%)'
            : 'radial-gradient(circle at top, rgba(254,226,226,0.92) 0%, rgba(248,250,252,0.96) 58%)',
      }}
    >
      <Paper
        sx={{
          maxWidth: 1080,
          mx: 'auto',
          p: { xs: 2.5, md: 4 },
          borderRadius: 5,
          ...glassPanel(theme, 0.88),
        }}
      >
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="overline" sx={{ color: 'error.main' }}>
                Emergency response grid
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, mt: 0.6 }}>
                SOS mode is active and broadcasting your live position.
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.2, color: 'text.secondary', maxWidth: 760 }}>
                Contacts, responders, and the monitoring layer are now aligned on your live location.
                This screen is optimized for rapid reassurance during demos and emergency walkthroughs.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="flex-start">
              <Chip color="error" label="Priority alert" />
              <Chip label={`Network ${networkMode}`} />
              <Chip label={`Elapsed ${formatTime(elapsed)}`} />
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Box
              sx={{
                flex: 1.2,
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(160deg, rgba(153,27,27,0.94) 0%, rgba(220,38,38,0.86) 100%)',
                color: '#FFFFFF',
              }}
            >
              <Typography variant="overline" sx={{ color: alpha('#FFFFFF', 0.72) }}>
                Active timer
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4rem' }, mt: 0.6 }}>
                {formatTime(elapsed)}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.76), mt: 1.5 }}>
                Continuous tracking, instant notifications, and route-aware context updates are live.
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha('#020817', 0.58)
                    : alpha('#FFFFFF', 0.74),
              }}
            >
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Live location
              </Typography>
              <Typography variant="h3" sx={{ fontSize: '1.2rem', mt: 0.8 }}>
                {currentLocation
                  ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
                  : 'Waiting for GPS lock'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Updates every 5 seconds via {networkMode}. The backend can resolve this session using the emitted SOS id.
              </Typography>
              {trackingUrl ? (
                <Typography variant="caption" sx={{ color: 'primary.main', mt: 2, display: 'block' }}>
                  {trackingUrl}
                </Typography>
              ) : null}
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <StatusRow
              icon={<NotificationsActiveRounded />}
              label="Emergency contacts pinged"
              value="Notifications dispatched with live tracking context"
              accent="#DC2626"
            />
            <StatusRow
              icon={<LocationSearchingRounded />}
              label="Live location tracking"
              value="GPS updates and route telemetry are streaming"
              accent="#1E3A8A"
            />
            <StatusRow
              icon={<CheckCircleRounded />}
              label="Monitoring layer online"
              value="Incident status can be resolved when you are safe"
              accent="#0F766E"
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Button
              onClick={handleCancel}
              variant="contained"
              color="success"
              sx={{
                px: 3,
                py: 1.4,
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                boxShadow: '0 18px 36px rgba(15,118,110,0.22)',
              }}
            >
              I&apos;m safe, resolve alert
            </Button>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <WarningRounded sx={{ color: 'error.main' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                For immediate assistance, call 112 or 100 while this screen remains active.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
