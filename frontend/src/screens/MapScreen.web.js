import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import SearchInput from '../components/SearchInput';
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

// Fix 6 — Use stable tile URL without {s} subdomain placeholder
const TILE_CONFIG = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  darkUrl: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
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

export default function MapScreen({ navigation, themeMode = 'dark' }) {
  const theme = useTheme();
  const [source, setSource] = useState('Koramangala, Bangalore');
  const [destination, setDestination] = useState('MG Road, Bangalore');
  const [statusMessage, setStatusMessage] = useState(null);

  const mapContainerRef = useRef(null);
  const mapSectionRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeGlowRef = useRef(null);
  const routeLayersRef = useRef(null);
  const heatmapLayersRef = useRef(null);
  const markerLayersRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Fix 1 — Map expansion state
  const [mapExpanded, setMapExpanded] = useState(false);
  // Fix 5 — Fullscreen state
  const [mapFullscreen, setMapFullscreen] = useState(false);

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

  // Fix 1 — Auto-expand map when routes are generated
  useEffect(() => {
    if (routes && routes.length > 0) {
      setMapExpanded(true);
    }
  }, [routes]);

  // Invalidate map size when expanding/fullscreening (critical for Leaflet)
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 450); // wait for CSS transition
    }
  }, [mapExpanded, mapFullscreen]);

  // Fix 5 — Fullscreen toggle handler
  const handleFullscreenToggle = useCallback(() => {
    setMapFullscreen(prev => {
      const next = !prev;
      // Invalidate size after transition
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 450);
      return next;
    });
  }, []);

  // ESC key to exit fullscreen
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && mapFullscreen) {
        setMapFullscreen(false);
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 450);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mapFullscreen]);

  // ── GSAP ScrollTrigger for map section ──
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;

    gsap.from('#map-section', {
      scrollTrigger: {
        trigger: '#map-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });

    gsap.from('#routes-section', {
      scrollTrigger: {
        trigger: '#routes-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
  }, []);

  // ── Leaflet initialisation ──
  useEffect(() => {
    let cancelled = false;
    let resizeObserver = null;

    loadLeaflet().then((L) => {
      if (cancelled || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
        scrollWheelZoom: true,  // Enable scroll zoom for better UX
        tap: false,
        dragging: true,
        zoomSnap: 0.25,
        wheelDebounceTime: 50,
      }).setView([BANGALORE_CENTER.latitude, BANGALORE_CENTER.longitude], 13);

      // Fix 6 — Stable tile layer URL
      tileLayerRef.current = L.tileLayer(TILE_CONFIG.darkUrl, {
        attribution: TILE_CONFIG.attribution,
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      routeGlowRef.current = L.layerGroup().addTo(map);
      routeLayersRef.current = L.layerGroup().addTo(map);
      heatmapLayersRef.current = L.layerGroup().addTo(map);
      markerLayersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

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
    };
  }, []);

  // ── Route polyline rendering (Fix 3 + Fix 4) ──
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

    // Fix 4 — Draw ALL routes dimmed first, then selected bright on top
    const sorted = [...routes].sort((a, b) => {
      const aS = selectedRoute?.route_id === a.route_id ? 1 : 0;
      const bS = selectedRoute?.route_id === b.route_id ? 1 : 0;
      return aS - bS;
    });

    let selectedBounds = null;
    let allBounds = L.latLngBounds();

    sorted.forEach((route) => {
      const isSelected = selectedRoute?.route_id === route.route_id;
      const tone = getRouteTone(route.risk_score);
      const coords = route.coordinates || decodePolyline(route.polyline);
      const latlngs = coords.map((coord) => [coord.latitude, coord.longitude]);

      if (latlngs.length === 0) return;

      // Extend allBounds for initial fitBounds
      latlngs.forEach((ll) => {
        if (ll && ll[0] && ll[1]) allBounds.extend(ll);
      });

      if (isSelected) {
        selectedBounds = L.latLngBounds();
        latlngs.forEach((ll) => {
          if (ll && ll[0] && ll[1]) selectedBounds.extend(ll);
        });

        // Glow layer for selected route
        glowGroup.addLayer(
          L.polyline(latlngs, {
            color: '#FF5500',
            weight: 20,
            opacity: 0.2,
            lineCap: 'round',
            lineJoin: 'round',
          })
        );
      }

      // Fix 4 — dimmed lines for non-selected, bright orange for selected
      const line = L.polyline(latlngs, {
        color: isSelected ? '#FF6B35' : '#888888',
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 1 : 0.4,
        dashArray: isSelected ? null : '8 6',
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Clicking a polyline on the map selects that route
      line.on('click', () => {
        setSelectedRoute(route);
        // Scroll map into view
        if (mapSectionRef.current) {
          mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      routeGroup.addLayer(line);

      // Only add markers for selected route
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

    // Fix 3 — Fit bounds to selected route, or all routes if none selected
    const boundsToFit = (selectedBounds && selectedBounds.isValid()) ? selectedBounds : allBounds;
    if (boundsToFit && boundsToFit.isValid() && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(boundsToFit, {
        padding: [60, 60],
        animate: true,
        duration: 0.5,
      });
    }
  }, [routes, selectedRoute, mapReady]);

  // ── Heatmap rendering ──
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

    setStatusMessage({
      severity: 'info',
      text: 'Finding safest routes...',
    });

    const startedAt = Date.now();
    const result = await fetchRoutes(source, destination, null, networkMode);
    const elapsed = Date.now() - startedAt;
    setResponseTime(elapsed);

    if (result.routes && result.routes.length > 0) {
      setStatusMessage({
        severity: 'success',
        text: `Found ${result.routes.length} routes in ${elapsed}ms. Safety score: ${result.routes[0]?.risk_score || 'N/A'}`,
      });
    } else {
      setStatusMessage({
        severity: 'error',
        text: result.error || 'No routes found. Try different locations or check backend.',
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

  // Fix 2 — Route select handler with scroll-to-map
  const handleRouteSelect = useCallback((route) => {
    setSelectedRoute(route);
    // Scroll map section into view on mobile
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setSelectedRoute]);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <>
      {/* ── MAP SECTION ── */}
      <Box
        id="map-section"
        ref={mapSectionRef}
        sx={{
          width: '100%',
          position: 'relative',
          background: '#0A0A0A',
          py: { xs: 6, md: 10 },
          scrollMarginTop: '80px', // account for fixed navbar
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          {/* Section header */}
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography sx={{ color: '#FF5500', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', mb: 1 }}>
              Interactive Safety Map
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '2rem', md: '3rem' }, color: '#fff', lineHeight: 1 }}>
              Explore Bangalore Risk Zones
            </Typography>
          </Box>

          {/* Search bar */}
          <Paper sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 4, mb: 3, ...glassPanel(theme, 0.86) }}>
            <SearchInput
              source={source}
              destination={destination}
              onSourceChange={setSource}
              onDestinationChange={setDestination}
              onSearch={handleSearch}
              onSwap={handleSwap}
              loading={loading}
              statusMessage={statusMessage}
            />
          </Paper>

          <Grid container spacing={{ xs: 2.5, lg: 3 }}>
            <Grid item xs={12} lg={mapExpanded ? 12 : 8.5}>
              <Paper
                sx={{
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 4,
                  mb: { xs: 2.5, lg: 0 },
                  ...glassPanel(theme, 0.86),
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={mapReady ? 'Map Ready' : 'Loading...'}
                        sx={{
                          backgroundColor: mapReady ? alpha('#10B981', 0.15) : alpha('#F59E0B', 0.15),
                          color: mapReady ? '#10B981' : '#F59E0B',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        size="small"
                        label={routes.length > 0 ? `${routes.length} Routes` : 'No Routes'}
                        sx={{
                          backgroundColor: routes.length > 0 ? alpha('#FF5500', 0.15) : alpha('#64748B', 0.15),
                          color: routes.length > 0 ? '#FF5500' : '#666',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Chip
                        size="small"
                        label={heatmapVisible ? 'Risk Zones On' : 'Risk Zones Off'}
                        sx={{
                          backgroundColor: heatmapVisible ? alpha('#EF4444', 0.15) : alpha('#64748B', 0.15),
                          color: heatmapVisible ? '#EF4444' : '#666',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Stack>

                    {/* Selected route indicator */}
                    {selectedRoute && (
                      <Chip
                        size="small"
                        label={`Viewing: ${selectedRoute.label || `Route ${selectedRoute.route_id}`}`}
                        sx={{
                          backgroundColor: alpha('#FF5500', 0.15),
                          color: '#FF5500',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          border: `1px solid ${alpha('#FF5500', 0.3)}`,
                        }}
                      />
                    )}
                  </Stack>

                  {/* Fix 1 — Map container with dynamic height */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: mapExpanded
                        ? { xs: '55vh', md: '65vh', xl: '70vh' }
                        : { xs: '35vh', md: '45vh', xl: '50vh' },
                      minHeight: mapExpanded ? { xs: 380, md: 450 } : { xs: 280, md: 350 },
                      borderRadius: 4,
                      overflow: 'hidden',
                      transition: 'height 0.4s ease, min-height 0.4s ease',
                    }}
                  >
                    <MapCanvas
                      ref={mapContainerRef}
                      mapReady={mapReady}
                      fullscreen={mapFullscreen}
                      onFullscreenToggle={handleFullscreenToggle}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Controls sidebar — hide when map is expanded to give more room */}
            {!mapExpanded && (
              <Grid item xs={12} lg={3.5}>
                <Stack
                  spacing={2.5}
                  sx={{
                    position: { lg: 'sticky' },
                    top: { lg: 88 },
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
                    <Typography variant="overline" sx={{ color: '#666' }}>
                      Quick Tips
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.6, color: '#fff' }}>
                      Get Started
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                      1. Enter source and destination
                      <br />
                      2. Click "Find Routes"
                      <br />
                      3. Toggle heatmap for risk zones
                      <br />
                      4. Select routes to compare
                    </Typography>
                  </Paper>
                </Stack>
              </Grid>
            )}

            {/* Show controls inline below map when expanded */}
            {mapExpanded && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 4,
                    ...glassPanel(theme, 0.86),
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
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
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="overline" sx={{ color: '#666' }}>
                        Quick Tips
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.6, color: '#fff' }}>
                        Get Started
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: '#999' }}>
                        Click any route card below to highlight it on the map.
                        Use the fullscreen button (top-right of map) for immersive view.
                        Press ESC to exit fullscreen.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* ── ROUTES SECTION ── */}
      <Box
        id="routes-section"
        sx={{
          width: '100%',
          background: '#0A0A0A',
          pb: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          <RouteDetailsPanel
            routes={routes}
            selectedRoute={selectedRoute}
            onRouteSelect={handleRouteSelect}
            timeContext={timeContext}
            tradeOffNote={tradeOffNote}
            loading={loading}
          />
        </Container>
      </Box>

      {/* ── SOS Button ── */}
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 18, md: 28 },
          bottom: { xs: 22, md: 30 },
          zIndex: mapFullscreen ? 10000 : 80,
        }}
      >
        <SOSButton onTrigger={handleSOS} disabled={sosActive} />
      </Box>
    </>
  );
}
