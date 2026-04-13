import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ExploreRounded from '@mui/icons-material/ExploreRounded';
import MapRounded from '@mui/icons-material/MapRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import { alpha, useTheme } from '@mui/material/styles';

import Navbar from '../components/Navbar';
import FloatingControls from '../components/FloatingControls';
import MapCanvas from '../components/MapCanvas';
import SOSButton from '../components/SOSButton';
import RouteDetailsPanel from './RouteDetailsPanel';

import { useRoutes } from '../hooks/useRoutes';
import { useLocation } from '../hooks/useLocation';
import { getCrimeZones, sendSOS, setNetworkMode } from '../services/api';
import { decodePolyline } from '../utils/polyline';
import { BANGALORE_CENTER, HEATMAP_CONFIG } from '../constants/config';
import { getRouteTone, glassPanel } from '../theme/webTheme';

function loadLeaflet() {
  if (!document.getElementById('leaflet-style')) {
    const link = document.createElement('link');
    link.id = 'leaflet-style';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = 'anonymous';
    document.head.prepend(link);
  }

  return new Promise((resolve, reject) => {
    if (window.L) { resolve(window.L); return; }

    const tryLoadLeaflet = (attempt = 1, maxAttempts = 3) => {
      if (window.L) { resolve(window.L); return; }

      if (document.getElementById('leaflet-script')) {
        if (attempt < maxAttempts) {
          setTimeout(() => tryLoadLeaflet(attempt + 1, maxAttempts), 500);
          return;
        }
        reject(new Error('Leaflet library failed to load after multiple attempts'));
        return;
      }

      const script = document.createElement('script');
      script.id = 'leaflet-script';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (window.L) {
          resolve(window.L);
        } else {
          if (attempt < maxAttempts) {
            setTimeout(() => tryLoadLeaflet(attempt + 1, maxAttempts), 500);
          } else {
            reject(new Error('Leaflet loaded but window.L not available'));
          }
        }
      };
      script.onerror = (e) => {
        console.error('[Leaflet] Load attempt', attempt, 'failed', e);
        if (attempt < maxAttempts) {
          setTimeout(() => tryLoadLeaflet(attempt + 1, maxAttempts), 1000);
        } else {
          reject(new Error('Failed to load Leaflet - check network connection to unpkg.com'));
        }
      };
      document.head.appendChild(script);
    };

    tryLoadLeaflet();
  });
}

const TILESETS = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
  },
};

function hexToRgba(hex, opacity) {
  const sanitized = hex.replace('#', '');
  const normalized =
    sanitized.length === 3
      ? sanitized.split('').map((char) => char + char).join('')
      : sanitized;
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function createMarkerIcon(kind) {
  return window.L.divIcon({
    html: `<span class="map-marker map-marker-${kind}"></span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: '',
  });
}

export default function MapScreen({ navigation, themeMode = 'light', onThemeModeChange }) {
  const theme = useTheme();
  const [source, setSource] = useState('Koramangala, Bangalore');
  const [destination, setDestination] = useState('MG Road, Bangalore');
  const [statusMessage, setStatusMessage] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeGlowRef = useRef(null);
  const routeLayersRef = useRef(null);
  const heatmapLayersRef = useRef(null);
  const markerLayersRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const {
    routes, selectedRoute, setSelectedRoute,
    loading, error, timeContext, tradeOffNote,
    fetchRoutes,
  } = useRoutes();

  const { location } = useLocation();

  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [crimeZones, setCrimeZones] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [networkMode, setNetworkModeState] = useState('5G');
  const [responseTime, setResponseTime] = useState(0);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver = null;

    loadLeaflet().then((L) => {
      if (cancelled || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // Strict singleton check

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
        scrollWheelZoom: false, // Disabled: causes scroll conflicts (crash on :0:0)
        tap: false, // Fix for mobile/touch interaction on web
        dragging: true,
        zoomSnap: 0.25,
        wheelDebounceTime: 50,
      }).setView([BANGALORE_CENTER.latitude, BANGALORE_CENTER.longitude], 13);

      const tileConfig = TILESETS[themeMode] || TILESETS.light;
      tileLayerRef.current = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: 20,
        subdomains: tileConfig.subdomains,
        crossOrigin: true,
      }).addTo(map);

      routeGlowRef.current = L.layerGroup().addTo(map);
      routeLayersRef.current = L.layerGroup().addTo(map);
      heatmapLayersRef.current = L.layerGroup().addTo(map);
      markerLayersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle dynamic layout shifts (scroll/panel expansion) with debounce
      let resizeTimeout = null;
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      });
      resizeObserver.observe(mapContainerRef.current);

      setMapReady(true);
      setStatusMessage({
        severity: 'success',
        text: 'Safety grid active. AI safety models loaded with Bangalore crime context.',
      });
    }).catch((err) => {
      console.error('Failed to initialize map:', err);
    });

    return () => {
      cancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      // NOTE: We do NOT remove the map instance here in dev mode to prevent 
      // the "Script error" during HMR, but we clear it on real unmount if needed.
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !window.L || !mapInstanceRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const tileConfig = TILESETS[themeMode] || TILESETS.light;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 20,
      subdomains: tileConfig.subdomains,
    }).addTo(map);
  }, [themeMode, mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const L = window.L;
    const glowGroup = routeGlowRef.current;
    const routeGroup = routeLayersRef.current;
    const markerGroup = markerLayersRef.current;
    if (!glowGroup || !routeGroup || !markerGroup) return;

    glowGroup.clearLayers();
    routeGroup.clearLayers();
    markerGroup.clearLayers();

    if (routes.length === 0) return;

    const bounds = L.latLngBounds();
    const sorted = [...routes].sort((a, b) => {
      const aS = selectedRoute?.route_id === a.route_id ? 1 : 0;
      const bS = selectedRoute?.route_id === b.route_id ? 1 : 0;
      return aS - bS;
    });

    sorted.forEach((route) => {
      const isSelected = selectedRoute?.route_id === route.route_id;
      const tone = getRouteTone(route.risk_score);
      const coords = decodePolyline(route.polyline);
      const latlngs = coords.map((coord) => [coord.latitude, coord.longitude]);

      if (latlngs.length === 0) return;

      if (isSelected) {
        glowGroup.addLayer(
          L.polyline(latlngs, {
            color: tone.color,
            weight: 18,
            opacity: themeMode === 'dark' ? 0.2 : 0.16,
            lineCap: 'round',
            lineJoin: 'round',
          })
        );
      }

      const line = L.polyline(latlngs, {
        color: isSelected ? tone.color : hexToRgba(tone.color, 0.42),
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 1 : 0.72,
        dashArray: isSelected ? null : '12 10',
        lineCap: 'round',
        lineJoin: 'round',
      });

      line.on('click', () => setSelectedRoute(route));

      routeGroup.addLayer(line);
      latlngs.forEach((ll) => {
        if (ll && ll[0] && ll[1]) bounds.extend(ll);
      });

      if (isSelected) {
        if (route.start_location?.lat && route.start_location?.lng) {
          L.marker([route.start_location.lat, route.start_location.lng], { icon: createMarkerIcon('start') })
            .bindPopup('Start')
            .addTo(markerGroup);
        }
        if (route.end_location?.lat && route.end_location?.lng) {
          L.marker([route.end_location.lat, route.end_location.lng], { icon: createMarkerIcon('end') })
            .bindPopup('Destination')
            .addTo(markerGroup);
        }
      }
    });

    if (bounds.isValid() && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [120, 180] });
    }
  }, [routes, selectedRoute, mapReady, themeMode]);

  useEffect(() => {
    if (!mapReady) return;
    const L = window.L;
    const heatGroup = heatmapLayersRef.current;
    if (!heatGroup) return;

    heatGroup.clearLayers();

    if (!heatmapVisible || crimeZones.length === 0) return;

    crimeZones.forEach((zone) => {
      const cfg = HEATMAP_CONFIG[zone.risk_level] || HEATMAP_CONFIG.low;
      const zoneColor =
        zone.risk_level === 'high' ? '#DC2626'
          : zone.risk_level === 'medium' ? '#D97706'
            : '#0F766E';

      L.circle([zone.lat, zone.lng], {
        radius: cfg.radius,
        fillColor: zoneColor,
        fillOpacity: zone.risk_level === 'high' ? 0.24 : zone.risk_level === 'medium' ? 0.18 : 0.12,
        color: zoneColor,
        opacity: zone.risk_level === 'high' ? 0.7 : 0.35,
        weight: zone.risk_level === 'high' ? 1.25 : 1,
        className:
          zone.risk_level === 'high'
            ? 'risk-zone-high'
            : zone.risk_level === 'medium'
              ? 'risk-zone-medium'
              : '',
      }).addTo(heatGroup);
    });
  }, [heatmapVisible, crimeZones, mapReady]);

  useEffect(() => {
    if (heatmapVisible && crimeZones.length === 0 && !heatmapLoading) {
      loadCrimeZones();
    }
  }, [heatmapVisible, crimeZones.length, heatmapLoading]);

  const loadCrimeZones = async () => {
    setHeatmapLoading(true);
    try {
      const data = await getCrimeZones(networkMode);
      setCrimeZones(data.zones || []);
      setStatusMessage({
        severity: 'success',
        text: `Heatmap loaded with ${(data.zones || []).length.toLocaleString()} risk cells.`,
      });
    } catch (err) {
      setStatusMessage({
        severity: 'error',
        text: 'Failed to load crime zone data from the backend.',
      });
    } finally {
      setHeatmapLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) {
      setStatusMessage({
        severity: 'warning',
        text: 'Enter both a starting point and destination to run the AI route comparison.',
      });
      return;
    }

    const startedAt = Date.now();
    const result = await fetchRoutes(source, destination, null, networkMode);
    const elapsed = Date.now() - startedAt;
    setResponseTime(elapsed);

    if (result.routes.length > 0) {
      setStatusMessage({
        severity: 'success',
        text: `Analyzed ${result.routes.length} routes. Safety model responded in ${elapsed}ms.`,
      });
    } else {
      setStatusMessage({
        severity: 'error',
        text: error || 'No routes were returned. Check the backend or try a different pair of landmarks.',
      });
    }
  };

  const handleNetworkToggle = async (mode) => {
    setNetworkModeState(mode);
    try {
      await setNetworkMode(mode);
      setStatusMessage({
        severity: 'info',
        text: `${mode} simulation enabled. Live latency and response telemetry updated.`,
      });
    } catch (err) {
      setStatusMessage({
        severity: 'warning',
        text: `${mode} simulation updated locally. Backend network sync was unavailable.`,
      });
    }
  };

  const handleSOS = async () => {
    const loc = location || { latitude: BANGALORE_CENTER.latitude, longitude: BANGALORE_CENTER.longitude };
    setSosActive(true);

    try {
      const response = await sendSOS('user_1', { lat: loc.latitude, lng: loc.longitude }, [], networkMode);
      navigation.navigate('Emergency', {
        location: loc,
        networkMode,
        sosId: response.sos_id || null,
        trackingUrl: response.tracking_url || '',
      });
    } catch (err) {
      setSosActive(false);
      setStatusMessage({
        severity: 'error',
        text: 'Failed to send the emergency alert. Please call 112 directly.',
      });
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'visible',
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(30,58,138,0.24) 0%, rgba(2,6,23,0.96) 55%)'
            : 'linear-gradient(180deg, rgba(248,251,255,1) 0%, rgba(228,239,255,1) 100%)',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 14, md: 18 },
        }}
      >
        <Navbar
          source={source}
          destination={destination}
          onSourceChange={setSource}
          onDestinationChange={setDestination}
          onSearch={handleSearch}
          onSwap={handleSwap}
          loading={loading}
          statusMessage={statusMessage}
          themeMode={themeMode}
          onThemeModeChange={onThemeModeChange}
        />

        <Grid container spacing={{ xs: 2.5, lg: 3 }}>
          <Grid item xs={12} lg={8.5}>
            <Paper
              sx={{
                p: { xs: 2, md: 2.5 },
                borderRadius: 4,
                mb: { xs: 2.5, lg: 0 },
                ...glassPanel(theme, 0.86),
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                      Interactive safety map
                    </Typography>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, mt: 0.4 }}>
                      Explore the corridor, then scroll for route intelligence.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.8, color: 'text.secondary', maxWidth: 760 }}>
                      The map now lives inside its own section, while controls and route analysis sit below or alongside it.
                      This keeps the demo readable on smaller screens and lets the user scroll naturally.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="flex-start">
                    <Chip icon={<MapRounded />} label={mapReady ? 'Map ready' : 'Loading map'} />
                    <Chip icon={<ExploreRounded />} label={selectedRoute ? 'Route selected' : 'Browse routes'} />
                    <Chip icon={<ShieldRounded />} label={heatmapVisible ? 'Heatmap on' : 'Heatmap off'} />
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '44vh', md: '50vh', xl: '56vh' },
                    minHeight: { xs: 320, md: 420 },
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <MapCanvas ref={mapContainerRef} mapReady={mapReady} themeMode={themeMode} />
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={3.5}>
            <Stack
              spacing={2.5}
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 24 },
              }}
            >
              <FloatingControls
                heatmapVisible={heatmapVisible}
                onHeatmapToggle={() => setHeatmapVisible((current) => !current)}
                heatmapLoading={heatmapLoading}
                networkMode={networkMode}
                onNetworkToggle={handleNetworkToggle}
                responseTime={responseTime}
                routeCount={routes.length}
                timeContext={timeContext}
              />

              <Paper
                sx={{
                  p: 2.25,
                  borderRadius: 4,
                  ...glassPanel(theme, 0.8),
                }}
              >
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  UX note
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.6 }}>
                  Scroll-first layout
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  Search, map, controls, and route cards now live in separate sections. Users can scan the experience top-to-bottom
                  instead of fighting overlapping floating layers.
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <RouteDetailsPanel
              routes={routes}
              selectedRoute={selectedRoute}
              onRouteSelect={handleRouteSelect}
              timeContext={timeContext}
              tradeOffNote={tradeOffNote}
              loading={loading}
            />
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          position: 'fixed',
          right: { xs: 18, md: 28 },
          bottom: { xs: 22, md: 30 },
          zIndex: 80,
        }}
      >
        <SOSButton onTrigger={handleSOS} disabled={sosActive} />
      </Box>
    </Box>
  );
}
