import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Button,
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import LocalHospitalRounded from '@mui/icons-material/LocalHospitalRounded';
import LocalPoliceRounded from '@mui/icons-material/LocalPoliceRounded';
import LocalPharmacyRounded from '@mui/icons-material/LocalPharmacyRounded';
import DirectionsCarFilledRounded from '@mui/icons-material/DirectionsCarFilledRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { alpha, useTheme } from '@mui/material/styles';

import SearchInput from '../components/SearchInput';
import FloatingControls from '../components/FloatingControls';
import MapCanvas from '../components/MapCanvas';
import SOSButton from '../components/SOSButton';
import RouteDetailsPanel from './RouteDetailsPanel';

import { useRoutes } from '../hooks/useRoutes';
import { useLocation } from '../hooks/useLocation';
import {
  assessBehavioralThreat,
  compare5GSafety,
  completeSafetyLoop,
  flushOfflineQueue,
  getCrimeZones,
  getEmergencyStops,
  scanProximityThreat,
  sendOfflineAlert,
  sendSOS,
  setNetworkMode,
  shareRouteToRideApp,
  triggerEnhancedSOS,
} from '../services/api';
import { decodePolyline } from '../utils/polyline';
import { BANGALORE_CENTER, HEATMAP_CONFIG } from '../constants/config';
import { glassPanel } from '../theme/webTheme';

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
  attribution: '© OpenStreetMap contributors',
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
  const mapViewportRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeGlowRef = useRef(null);
  const routeLayersRef = useRef(null);
  const heatmapLayersRef = useRef(null);
  const markerLayersRef = useRef(null);
  const emergencyLayersRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const [routesGenerated, setRoutesGenerated] = useState(false);
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
  const [networkOnline, setNetworkOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [offlineQueuedCount, setOfflineQueuedCount] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [emergencyStops, setEmergencyStops] = useState([]);
  const [nearestStop, setNearestStop] = useState(null);
  const [proximityAlert, setProximityAlert] = useState(null);
  const [threatAssessment, setThreatAssessment] = useState(null);
  const [rideShareStatus, setRideShareStatus] = useState('');
  const [loopEtaMinutes, setLoopEtaMinutes] = useState(0);
  const [safeConfirmed, setSafeConfirmed] = useState(false);
  const [networkCompare, setNetworkCompare] = useState(null);

  // Fix 1 — Auto-expand map when routes are generated
  useEffect(() => {
    if (routes && routes.length > 0) {
      setRoutesGenerated(true);
    } else {
      setRoutesGenerated(false);
    }
  }, [routes]);

  // Invalidate map size when fullscreening (critical for Leaflet)
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 450); // wait for CSS transition
    }
  }, [mapFullscreen]);

  // Force Leaflet resize after layout changes between full-width and split view
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  }, [routesGenerated, selectedRoute]);

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
      tileLayerRef.current = L.tileLayer(TILE_CONFIG.url, {
        attribution: TILE_CONFIG.attribution,
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      routeGlowRef.current = L.layerGroup().addTo(map);
      routeLayersRef.current = L.layerGroup().addTo(map);
      heatmapLayersRef.current = L.layerGroup().addTo(map);
      markerLayersRef.current = L.layerGroup().addTo(map);
      emergencyLayersRef.current = L.layerGroup().addTo(map);
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

  const decodeRouteCoords = useCallback((route) => {
    if (!route) return [];

    if (Array.isArray(route.geometry?.coordinates) && route.geometry.coordinates.length > 0) {
      return route.geometry.coordinates
        .map(([lng, lat]) => [lat, lng])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
    }

    if (Array.isArray(route.coordinates) && route.coordinates.length > 0) {
      const first = route.coordinates[0];

      if (Array.isArray(first)) {
        return route.coordinates
          .map(([lat, lng]) => [lat, lng])
          .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
      }

      return route.coordinates
        .map((coord) => [coord.latitude, coord.longitude])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
    }

    if (route.polyline) {
      return decodePolyline(route.polyline)
        .map((coord) => [coord.latitude, coord.longitude])
        .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
    }

    return [];
  }, []);

  const parseDurationToMinutes = useCallback((durationText) => {
    if (!durationText) return 15;
    const text = String(durationText).toLowerCase();
    const hourMatch = text.match(/(\d+)\s*h/);
    const minMatch = text.match(/(\d+)\s*m/);
    const total = (hourMatch ? parseInt(hourMatch[1], 10) * 60 : 0) + (minMatch ? parseInt(minMatch[1], 10) : 0);
    return total > 0 ? total : 15;
  }, []);

  const loadEmergencyStops = useCallback(async () => {
    if (!selectedRoute) return;
    try {
      const loc = location || { latitude: BANGALORE_CENTER.latitude, longitude: BANGALORE_CENTER.longitude };
      const routeId = selectedRoute.id ?? selectedRoute.route_id ?? 'default';
      const response = await getEmergencyStops(routeId, loc.latitude, loc.longitude, networkMode);
      setEmergencyStops(response.stops || []);
      setNearestStop(response.nearest_safe_stop || null);
    } catch (error) {
      setEmergencyStops([]);
      setNearestStop(null);
    }
  }, [location, networkMode, selectedRoute]);

  useEffect(() => {
    loadEmergencyStops();
  }, [loadEmergencyStops]);

  useEffect(() => {
    const onOnline = async () => {
      setNetworkOnline(true);
      try {
        const flushed = await flushOfflineQueue(networkMode);
        if (flushed.flushed_count) {
          setOfflineQueuedCount(0);
          setStatusMessage({
            severity: 'info',
            text: `Network restored. ${flushed.flushed_count} queued safety alerts sent.`,
          });
        }
      } catch (error) {
      }
    };
    const onOffline = () => {
      setNetworkOnline(false);
      setStatusMessage({
        severity: 'warning',
        text: 'Low/no network detected. Offline safety fallback will queue SOS alerts.',
      });
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [networkMode]);

  useEffect(() => {
    let active = true;
    compare5GSafety(networkMode)
      .then((data) => {
        if (active) setNetworkCompare(data.comparison || null);
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, [networkMode]);

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

    const selectedRouteId = selectedRoute?.id ?? selectedRoute?.route_id;
    let allBounds = L.latLngBounds();
    let selectedLine = null;
    let selectedBounds = null;

    routes.forEach((route) => {
      const routeId = route.id ?? route.route_id;
      const latlngs = decodeRouteCoords(route);
      if (latlngs.length === 0) return;

      latlngs.forEach((ll) => {
        if (Number.isFinite(ll[0]) && Number.isFinite(ll[1])) {
          allBounds.extend(ll);
        }
      });

      const dimmedLine = L.polyline(latlngs, {
        color: '#888888',
        weight: 3,
        opacity: 0.4,
        lineCap: 'round',
        lineJoin: 'round',
      });
      dimmedLine._isRouteLayer = true;
      dimmedLine._routeId = routeId;
      dimmedLine.on('click', () => {
        setSelectedRoute(route);
        mapViewportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      routeGroup.addLayer(dimmedLine);

      if (selectedRouteId === routeId) {
        selectedBounds = L.latLngBounds(latlngs);

        selectedLine = L.polyline(latlngs, {
          color: '#FF6B35',
          weight: 6,
          opacity: 1,
          lineJoin: 'round',
          lineCap: 'round',
        });
        selectedLine._isRouteLayer = true;
        selectedLine._routeId = routeId;
        selectedLine.on('click', () => {
          setSelectedRoute(route);
          mapViewportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        glowGroup.addLayer(
          L.polyline(latlngs, {
            color: '#FF6B35',
            weight: 18,
            opacity: 0.16,
            lineCap: 'round',
            lineJoin: 'round',
          })
        );

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

    if (selectedLine) {
      routeGroup.addLayer(selectedLine);
    }

    const boundsToFit = (selectedBounds && selectedBounds.isValid()) ? selectedBounds : allBounds;
    if (boundsToFit && boundsToFit.isValid() && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(boundsToFit, {
        padding: [40, 40],
        animate: true,
        duration: 0.5,
      });
    }
  }, [routes, selectedRoute, mapReady, decodeRouteCoords, setSelectedRoute]);

  useEffect(() => {
    if (!mapReady) return;
    const L = window.L;
    const emergencyGroup = emergencyLayersRef.current;
    if (!emergencyGroup) return;

    emergencyGroup.clearLayers();
    emergencyStops.forEach((stop) => {
      const color = stop.type === 'hospital' ? '#DC2626' : stop.type === 'police' ? '#1D4ED8' : '#059669';
      const marker = L.circleMarker([stop.lat, stop.lon], {
        radius: stop === nearestStop ? 9 : 7,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: stop === nearestStop ? 0.7 : 0.45,
      });
      marker.bindPopup(`${stop.name} (${stop.type})`);
      marker.addTo(emergencyGroup);
    });
  }, [emergencyStops, mapReady, nearestStop]);

  useEffect(() => {
    if (!routesGenerated) return;
    const intervalId = setInterval(async () => {
      try {
        const response = await scanProximityThreat({
          user_id: 'user_1',
          tx_power: -59,
          devices: [
            { id: 'device-a', rssi: -64, duration_seconds: 170, movement_similarity: 0.82 },
            { id: 'device-b', rssi: -78, duration_seconds: 65, movement_similarity: 0.41 },
          ],
        }, networkMode);

        setProximityAlert(response.alert || null);

        const threat = await assessBehavioralThreat({
          user_id: 'user_1',
          rssi_threat_score: response.flagged_count > 0 ? 0.8 : 0.2,
          route_deviation_score: selectedRoute ? 0.25 : 0.4,
          time_risk_score: timeContext?.risk_level === 'high' ? 0.7 : 0.3,
          crime_density_score: heatmapVisible ? 0.55 : 0.35,
        }, networkMode);
        setThreatAssessment(threat);
      } catch (error) {
      }
    }, networkMode === '5G' ? 6000 : 12000);

    return () => clearInterval(intervalId);
  }, [heatmapVisible, networkMode, routesGenerated, selectedRoute, timeContext]);

  useEffect(() => {
    if (!routesGenerated || safeConfirmed) return;
    const eta = loopEtaMinutes || 15;
    const timeoutMs = Math.min((eta + 3) * 60 * 1000, 90 * 1000);

    const timerId = setTimeout(async () => {
      try {
        const loc = location || { latitude: BANGALORE_CENTER.latitude, longitude: BANGALORE_CENTER.longitude };
        const alertResponse = await sendOfflineAlert({
          user_id: 'user_1',
          location: { lat: loc.latitude, lon: loc.longitude },
          eta_minutes: eta,
          latency_ms: networkMode === '3G' ? 220 : networkMode === '4G' ? 70 : 15,
          connected: networkOnline,
          emergency_contacts: ['+91-9000000001'],
        }, networkMode);

        if (alertResponse.status === 'queued') {
          setOfflineQueuedCount((count) => count + 1);
        }
        setStatusMessage({
          severity: 'warning',
          text: 'No safe-arrival confirmation received. Auto safety alert has been triggered.',
        });
      } catch (error) {
      }
    }, timeoutMs);

    return () => clearTimeout(timerId);
  }, [location, loopEtaMinutes, networkMode, networkOnline, routesGenerated, safeConfirmed]);

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
      setSafeConfirmed(false);
      const eta = parseDurationToMinutes(result.routes[0]?.duration);
      setLoopEtaMinutes(eta);
      setStatusMessage({
        severity: 'success',
        text: `Found ${result.routes.length} routes in ${elapsed}ms. Safety score: ${result.routes[0]?.risk_score || 'N/A'}. ETA ${eta} min.`,
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
      await triggerEnhancedSOS({
        user_id: 'user_1',
        location: { lat: loc.latitude, lon: loc.longitude },
        network_mode: networkMode,
        connected: networkOnline,
        emergency_contacts: ['+91-9000000001', '+91-9000000002'],
      }, networkMode);

      if (!networkOnline || networkMode === '3G') {
        const alertResponse = await sendOfflineAlert({
          user_id: 'user_1',
          location: { lat: loc.latitude, lon: loc.longitude },
          eta_minutes: loopEtaMinutes,
          latency_ms: networkMode === '3G' ? 220 : networkMode === '4G' ? 70 : 15,
          connected: networkOnline,
          emergency_contacts: ['+91-9000000001', '+91-9000000002'],
        }, networkMode);
        if (alertResponse.status === 'queued') {
          setOfflineQueuedCount((count) => count + 1);
        }
      }

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
    } finally {
      setSosActive(false);
    }
  };

  const handleArrivalSafe = async () => {
    try {
      await completeSafetyLoop('safe', 'user_1', networkMode);
      setSafeConfirmed(true);
      setStatusMessage({
        severity: 'success',
        text: 'Safety loop closed. Arrival confirmed successfully.',
      });
    } catch (error) {
      setStatusMessage({
        severity: 'warning',
        text: 'Could not confirm safe arrival right now. Retry when network is stable.',
      });
    }
  };

  const handleRideShare = async (appName) => {
    if (!selectedRoute) return;
    try {
      const pickup = {
        lat: selectedRoute.start_location?.lat || BANGALORE_CENTER.latitude,
        lon: selectedRoute.start_location?.lng || BANGALORE_CENTER.longitude,
      };
      const dropoff = {
        lat: selectedRoute.end_location?.lat || BANGALORE_CENTER.latitude,
        lon: selectedRoute.end_location?.lng || BANGALORE_CENTER.longitude,
      };
      const coordinates = decodeRouteCoords(selectedRoute).map(([lat, lon]) => ({ lat, lon }));
      const response = await shareRouteToRideApp(appName, pickup, dropoff, coordinates, networkMode);
      setRideShareStatus(response.message || `Route shared to ${appName}`);
      setStatusMessage({
        severity: 'info',
        text: response.message || `Route shared to ${appName}`,
      });
    } catch (error) {
      setRideShareStatus(`Route sharing failed for ${appName}`);
    }
  };

  // Fix 2 — Route select handler with scroll-to-map
  const handleRouteSelect = useCallback((route) => {
    setSelectedRoute(route);
    // Scroll map section into view on mobile
    mapViewportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [setSelectedRoute]);

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <>
      <Box
        id="map-section"
        ref={mapSectionRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          backgroundColor: '#0A0A0A',
          overflow: 'hidden',
          scrollMarginTop: '80px',
        }}
      >
        <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1.5, width: '100%' }}>
          <Box sx={{ mb: 1.25 }}>
            <Typography sx={{ ...theme.typography.sectionHead, color: '#FF5500', mb: 0.6 }}>
              Interactive Safety Map
            </Typography>
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '1.6rem', md: '2.1rem' }, color: '#fff', lineHeight: 1 }}>
              Explore Bangalore Risk Zones
            </Typography>
          </Box>

          <Paper sx={{ p: 1.5, borderRadius: '12px', overflow: 'hidden', boxSizing: 'border-box', ...glassPanel(theme, 0.86) }}>
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
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            overflow: 'hidden',
            gap: 0,
            minWidth: 0,
            '@media (max-width:768px)': {
              flexDirection: 'column',
            },
          }}
        >
          {routesGenerated ? (
            <Box
              sx={{
                width: 300,
                minWidth: 300,
                flexShrink: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '12px 10px',
                borderRight: `1px solid ${alpha('#FFFFFF', 0.07)}`,
                backgroundColor: '#111111',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                boxSizing: 'border-box',
                '@media (max-width:768px)': {
                  width: '100%',
                  height: 280,
                  minWidth: '100%',
                  borderRight: 'none',
                  borderBottom: `1px solid ${alpha('#FFFFFF', 0.06)}`,
                },
              }}
            >
              <RouteDetailsPanel
                routes={routes}
                selectedRoute={selectedRoute}
                onRouteSelect={handleRouteSelect}
                timeContext={timeContext}
                tradeOffNote={tradeOffNote}
                loading={loading}
              />
            </Box>
          ) : null}

          <Box
            ref={mapViewportRef}
            sx={{
              flex: 1,
              position: 'relative',
              minWidth: 0,
              width: routesGenerated ? 'auto' : '100%',
              height: routesGenerated ? '100%' : 'calc(100vh - 180px)',
              p: 1.5,
              boxSizing: 'border-box',
              '@media (max-width:768px)': {
                height: routesGenerated ? '50vh' : 'calc(100vh - 180px)',
              },
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: routesGenerated ? '100%' : '75vh',
                minHeight: 500,
                borderRadius: '16px',
                overflow: 'visible',
                position: 'relative',
              }}
            >
              <FloatingControls
                variant="overlay"
                mapReady={mapReady}
                routeCount={routes.length}
                heatmapVisible={heatmapVisible}
                selectedRoute={selectedRoute}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 'auto', md: 80 },
                  bottom: { xs: 100, md: 'auto' },
                  right: { xs: 10, md: 70 },
                  zIndex: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.25,
                  pointerEvents: 'none',
                  animation: 'mapOverlayFadeInUp 0.4s ease',
                  '@keyframes mapOverlayFadeInUp': {
                    from: { opacity: 0, transform: 'translateY(8px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '& > *': {
                    pointerEvents: 'auto',
                  },
                }}
              >
                <Chip
                  size="small"
                  label={networkOnline ? `Network ${networkMode}` : 'Offline fallback active'}
                  sx={{
                    backgroundColor: alpha('#0A0A0A', 0.88),
                    border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    color: '#fff',
                  }}
                />
                {offlineQueuedCount > 0 ? (
                  <Chip
                    size="small"
                    label={`Retry queue: ${offlineQueuedCount}`}
                    sx={{
                      backgroundColor: alpha('#0A0A0A', 0.88),
                      border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                      color: '#fff',
                    }}
                  />
                ) : null}
                {nearestStop ? (
                  <Chip
                    size="small"
                    label={`Nearest Safe Stop: ${nearestStop.name}`}
                    sx={{
                      backgroundColor: alpha('#0A0A0A', 0.88),
                      border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                      color: '#fff',
                      maxWidth: 260,
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                  />
                ) : null}
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: 12,
                  bottom: 12,
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: { xs: 'calc(100% - 24px)', md: 360 },
                }}
              >
                {proximityAlert ? (
                  <Paper sx={{ p: 1.1, ...glassPanel(theme, 0.86) }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WarningAmberRounded color="warning" />
                      <Typography variant="body2">{proximityAlert} (approximate only)</Typography>
                    </Stack>
                  </Paper>
                ) : null}

                <Paper sx={{ p: 1.1, ...glassPanel(theme, 0.86) }}>
                  <Stack spacing={0.8}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Ride App Integration (Mock)
                    </Typography>
                    <Stack direction="row" spacing={0.8}>
                      <Button size="small" variant="outlined" onClick={() => handleRideShare('Ola')} startIcon={<DirectionsCarFilledRounded />}>Ola</Button>
                      <Button size="small" variant="outlined" onClick={() => handleRideShare('Uber')} startIcon={<DirectionsCarFilledRounded />}>Uber</Button>
                      <Button size="small" variant="outlined" onClick={() => handleRideShare('Rapido')} startIcon={<DirectionsCarFilledRounded />}>Rapido</Button>
                    </Stack>
                    {rideShareStatus ? (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{rideShareStatus}</Typography>
                    ) : null}
                  </Stack>
                </Paper>

                {networkCompare ? (
                  <Paper sx={{ p: 1.1, ...glassPanel(theme, 0.86) }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      4G vs 5G Demo (Priority SOS Channel)
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      4G SOS: {networkCompare?.['4G']?.sos_latency_ms}ms · 5G SOS: {networkCompare?.['5G']?.sos_latency_ms}ms
                    </Typography>
                  </Paper>
                ) : null}

                <Paper sx={{ p: 1.1, ...glassPanel(theme, 0.86) }}>
                  <Stack spacing={0.8}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Safety Loop Closure
                    </Typography>
                    <Typography variant="body2">
                      ETA {loopEtaMinutes || 0} min · {safeConfirmed ? 'Safe confirmed ✅' : 'Awaiting safe confirmation'}
                    </Typography>
                    {!safeConfirmed ? (
                      <Button size="small" variant="contained" onClick={handleArrivalSafe}>
                        Reached Safely?
                      </Button>
                    ) : null}
                  </Stack>
                </Paper>

                <Paper sx={{ p: 1.1, ...glassPanel(theme, 0.86) }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalHospitalRounded fontSize="small" />
                    <LocalPoliceRounded fontSize="small" />
                    <LocalPharmacyRounded fontSize="small" />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Emergency stops mapped: hospitals, police, pharmacies
                    </Typography>
                  </Stack>
                  {threatAssessment ? (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.6 }}>
                      Smart risk: {threatAssessment.risk_level} ({threatAssessment.risk_score}) · {threatAssessment.action}
                    </Typography>
                  ) : null}
                </Paper>
              </Box>
              <MapCanvas
                ref={mapContainerRef}
                mapReady={mapReady}
                fullscreen={mapFullscreen}
                onFullscreenToggle={handleFullscreenToggle}
              />
            </Box>
          </Box>
        </Box>
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
