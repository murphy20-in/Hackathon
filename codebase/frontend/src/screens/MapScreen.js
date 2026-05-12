import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Keyboard, Platform } from 'react-native';

import SearchInput from '../components/SearchInput';
import SOSButton from '../components/SOSButton';
import HeatmapToggle from '../components/HeatmapToggle';
import Legend from '../components/Legend';
import NetworkBadge from '../components/NetworkBadge';
import MetricsPanel from '../components/MetricsPanel';
import RouteDetailsPanel from './RouteDetailsPanel';
import ErrorBoundary from '../components/ErrorBoundary';

import { useRoutes } from '../hooks/useRoutes';
import { useLocation } from '../hooks/useLocation';
import { getCrimeZones, sendSOS, setNetworkMode } from '../services/api';
import { decodePolyline } from '../utils/polyline';
import { BANGALORE_CENTER, HEATMAP_CONFIG } from '../constants/config';
import { COLORS, getRiskColor, getScoreColor } from '../constants/colors';

// Platform-conditional map imports
const isWeb = Platform.OS === 'web';

let MapView, Polyline, Circle, Marker, PROVIDER_GOOGLE;
let WebMap, WebPolyline, WebCircle, WebMarker;

if (isWeb) {
  const webMapModule = require('../components/WebMap');
  WebMap = webMapModule.default;
  WebPolyline = webMapModule.WebPolyline;
  WebCircle = webMapModule.WebCircle;
  WebMarker = webMapModule.WebMarker;
} else {
  const nativeMapModule = require('react-native-maps');
  MapView = nativeMapModule.default;
  Polyline = nativeMapModule.Polyline;
  Circle = nativeMapModule.Circle;
  Marker = nativeMapModule.Marker;
  PROVIDER_GOOGLE = nativeMapModule.PROVIDER_GOOGLE;
}

export default function MapScreen({ navigation }) {
  // Search state
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  // Map & route state
  const mapRef = useRef(null);
  const {
    routes, selectedRoute, setSelectedRoute,
    loading, error, timeContext, tradeOffNote,
    fetchRoutes, clearRoutes,
  } = useRoutes();

  // Location
  const { location } = useLocation();

  // Heatmap state
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [crimeZones, setCrimeZones] = useState([]);
  const [heatmapLoading, setHeatmapLoading] = useState(false);

  // Network state
  const [networkMode, setNetworkModeState] = useState('5G');
  const [responseTime, setResponseTime] = useState(0);

  // SOS state
  const [sosActive, setSosActive] = useState(false);

  // Global error handlers for web (PHASE 1: Force error visibility)
  useEffect(() => {
    if (!isWeb) return;

    const handleError = (event) => {
      console.error('[GlobalError]', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const handleRejection = (event) => {
      console.error('[UnhandledRejection]', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Fetch crime zones when heatmap is toggled on
  useEffect(() => {
    if (heatmapVisible && crimeZones.length === 0) {
      loadCrimeZones();
    }
  }, [heatmapVisible]);

  const loadCrimeZones = async () => {
    setHeatmapLoading(true);
    try {
      const data = await getCrimeZones(networkMode);
      setCrimeZones(data.zones || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to load crime zone data');
    } finally {
      setHeatmapLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!source.trim() || !destination.trim()) {
      Alert.alert('Input Required', 'Please enter both source and destination');
      return;
    }
    Keyboard.dismiss();

    const startTime = Date.now();
    const result = await fetchRoutes(source, destination, null, networkMode);
    setResponseTime(Date.now() - startTime);

    // Fit map to show all routes
    if (result.routes.length > 0 && mapRef.current) {
      const allCoords = result.routes.flatMap((r) => decodePolyline(r.polyline));
      if (allCoords.length > 0) {
        mapRef.current.fitToCoordinates(allCoords, {
          edgePadding: { top: 200, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    }

    if (error) {
      Alert.alert('Error', error);
    }
  };

  const handleNetworkToggle = async (mode) => {
    setNetworkModeState(mode);
    try {
      await setNetworkMode(mode);
    } catch (err) {
      // Network mode is primarily frontend-simulated
    }
  };

  const handleSOS = async () => {
    const loc = location || { latitude: BANGALORE_CENTER.latitude, longitude: BANGALORE_CENTER.longitude };
    setSosActive(true);

    try {
      await sendSOS('user_1', { lat: loc.latitude, lng: loc.longitude }, [], networkMode);
      navigation.navigate('Emergency', {
        location: loc,
        networkMode,
      });
    } catch (err) {
      Alert.alert('SOS Error', 'Failed to send emergency alert. Please call 112 directly.');
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);

    // Fit map to selected route
    if (mapRef.current && route.polyline) {
      const coords = decodePolyline(route.polyline);
      if (coords.length > 0) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 200, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    }
  };

  // Render map children (heatmap circles + routes + markers)
  const renderMapChildren = () => {
    const PolylineComp = isWeb ? WebPolyline : Polyline;
    const CircleComp = isWeb ? WebCircle : Circle;
    const MarkerComp = isWeb ? WebMarker : Marker;

    return (
      <>
        {/* Heatmap circles */}
        {heatmapVisible && crimeZones.map((zone, i) => {
          const config = HEATMAP_CONFIG[zone.risk_level] || HEATMAP_CONFIG.low;
          return (
            <CircleComp
              key={`hz-${i}`}
              _webMapType="circle"
              center={{ latitude: zone.lat, longitude: zone.lng }}
              radius={config.radius}
              fillColor={config.fillColor}
              strokeColor={config.strokeColor}
              strokeWidth={0}
            />
          );
        })}

        {/* Route polylines */}
        {routes.map((route) => {
          const isSelected = selectedRoute?.route_id === route.route_id;
          const coords = decodePolyline(route.polyline);
          return (
            <PolylineComp
              key={`route-${route.route_id}`}
              _webMapType="polyline"
              coordinates={coords}
              strokeColor={isSelected ? getScoreColor(route.risk_score) : '#90A4AE'}
              strokeWidth={isSelected ? 6 : 3}
              tappable={true}
              onPress={() => handleRouteSelect(route)}
              lineDashPattern={isSelected ? null : [10, 5]}
            />
          );
        })}

        {/* Start/End markers for selected route */}
        {selectedRoute && selectedRoute.start_location && (
          <MarkerComp
            _webMapType="marker"
            coordinate={{
              latitude: selectedRoute.start_location.lat,
              longitude: selectedRoute.start_location.lng,
            }}
            title="Start"
            pinColor="green"
          />
        )}
        {selectedRoute && selectedRoute.end_location && (
          <MarkerComp
            _webMapType="marker"
            coordinate={{
              latitude: selectedRoute.end_location.lat,
              longitude: selectedRoute.end_location.lng,
            }}
            title="Destination"
            pinColor="red"
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <ErrorBoundary>
        {isWeb ? (
          <WebMap
            ref={mapRef}
            style={styles.map}
            initialRegion={BANGALORE_CENTER}
            showsUserLocation={true}
          >
            {renderMapChildren()}
          </WebMap>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={BANGALORE_CENTER}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
          >
            {renderMapChildren()}
          </MapView>
        )}
      </ErrorBoundary>

      {/* Search overlay - pointer-events: none on container, auto on inputs */}
      <SearchInput
        source={source}
        destination={destination}
        onSourceChange={setSource}
        onDestinationChange={setDestination}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Map controls: heatmap toggle + legend */}
      <View style={styles.mapControls} pointerEvents="box-none">
        <HeatmapToggle
          isActive={heatmapVisible}
          onToggle={() => setHeatmapVisible(!heatmapVisible)}
        />
        <View style={{ width: 8 }} />
        <NetworkBadge
          currentMode={networkMode}
          onToggle={handleNetworkToggle}
          responseTime={responseTime}
        />
      </View>

      {/* Legend */}
      {(heatmapVisible || routes.length > 0) && (
        <View style={styles.legendContainer} pointerEvents="box-none">
          <Legend />
        </View>
      )}

      {/* Metrics Panel */}
      {routes.length > 0 && (
        <View style={styles.metricsContainer} pointerEvents="box-none">
          <MetricsPanel
            networkMode={networkMode}
            responseTime={responseTime}
            routeCount={routes.length}
            timeContext={timeContext}
          />
        </View>
      )}

      {/* Route details panel */}
      {routes.length > 0 && (
        <RouteDetailsPanel
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteSelect={handleRouteSelect}
          timeContext={timeContext}
          tradeOffNote={tradeOffNote}
        />
      )}

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        <SOSButton onTrigger={handleSOS} disabled={sosActive} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  mapControls: {
    position: 'absolute',
    top: 200,
    right: 15,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    zIndex: 5,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 320,
    left: 15,
    zIndex: 5,
  },
  metricsContainer: {
    position: 'absolute',
    top: 200,
    left: 15,
    zIndex: 5,
    width: 180,
  },
  sosContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 15,
  },
});
