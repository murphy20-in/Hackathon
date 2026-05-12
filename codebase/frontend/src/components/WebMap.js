import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * Web-compatible map component using Leaflet.
 * Drop-in replacement for react-native-maps MapView on web platform.
 */
const WebMap = forwardRef(function WebMap(
  {
    initialRegion,
    style,
    children,
    showsUserLocation,
  },
  ref
) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const leafletLoadedRef = useRef(false);

  // Expose fitToCoordinates for parent to call
  useImperativeHandle(ref, () => ({
    fitToCoordinates: (coords, options) => {
      const map = mapInstanceRef.current;
      if (!map || !coords || coords.length === 0) return;
      const bounds = coords.map((c) => [c.latitude, c.longitude]);
      try {
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      } catch (e) {
        console.warn('[WebMap] fitBounds error:', e);
      }
    },
  }));

  const initMap = useCallback(() => {
    if (mapInstanceRef.current || !containerRef.current) return;

    const L = window.L;
    if (!L) return;

    const lat = initialRegion?.latitude || 12.9716;
    const lng = initialRegion?.longitude || 77.5946;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);

    if (showsUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLatLng = [pos.coords.latitude, pos.coords.longitude];
          L.circleMarker(userLatLng, {
            radius: 8,
            fillColor: '#4285F4',
            color: '#FFF',
            weight: 2,
            fillOpacity: 1,
          }).addTo(map);
        },
        () => {} // ignore error
      );
    }

    mapInstanceRef.current = map;

    // Invalidate size after a short delay to handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [initialRegion, showsUserLocation]);

  // Load Leaflet CSS + JS, then init map
  useEffect(() => {
    if (leafletLoadedRef.current) {
      initMap();
      return;
    }

    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
    }

    // Inject Leaflet JS
    if (window.L) {
      leafletLoadedRef.current = true;
      initMap();
    } else if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        leafletLoadedRef.current = true;
        initMap();
      };
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initMap]);

  // Re-render layers when children (routes, circles, markers) change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = window.L;
    const layerGroup = layerGroupRef.current;
    if (!map || !L || !layerGroup) return;

    layerGroup.clearLayers();

    // Process children to extract map elements
    React.Children.forEach(children, (child) => {
      if (!child || !child.props) return;

      const { type } = child;
      const typeName = type?.displayName || type?.name || '';

      // Handle WebPolyline
      if (typeName === 'WebPolyline' || child.props._webMapType === 'polyline') {
        const { coordinates, strokeColor, strokeWidth, lineDashPattern, onPress } = child.props;
        if (coordinates && coordinates.length > 0) {
          const latlngs = coordinates.map((c) => [c.latitude, c.longitude]);
          const polyline = L.polyline(latlngs, {
            color: strokeColor || '#1565C0',
            weight: strokeWidth || 3,
            dashArray: lineDashPattern ? lineDashPattern.join(' ') : null,
            opacity: 0.9,
          });
          if (onPress) {
            polyline.on('click', onPress);
          }
          layerGroup.addLayer(polyline);
        }
      }

      // Handle WebCircle
      if (typeName === 'WebCircle' || child.props._webMapType === 'circle') {
        const { center, radius, fillColor, strokeColor: sc } = child.props;
        if (center) {
          const circle = L.circle([center.latitude, center.longitude], {
            radius: radius || 200,
            fillColor: fillColor || 'rgba(244,67,54,0.3)',
            color: sc || 'transparent',
            fillOpacity: 0.6,
            weight: 0,
          });
          layerGroup.addLayer(circle);
        }
      }

      // Handle WebMarker
      if (typeName === 'WebMarker' || child.props._webMapType === 'marker') {
        const { coordinate, title, pinColor } = child.props;
        if (coordinate) {
          const iconColor = pinColor === 'green' ? '2AAD27' : pinColor === 'red' ? 'CB2B3E' : '2A81CB';
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width:24px;height:24px;border-radius:50%;
              background:#${iconColor};border:3px solid #FFF;
              box-shadow:0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const marker = L.marker([coordinate.latitude, coordinate.longitude], { icon });
          if (title) marker.bindPopup(title);
          layerGroup.addLayer(marker);
        }
      }
    });
  }, [children]);

  return (
    <View style={[styles.container, style]}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </View>
  );
});

export default WebMap;

// Web-compatible replacements for react-native-maps components
export function WebPolyline(props) {
  return null; // Rendered by WebMap parent via children inspection
}
WebPolyline.displayName = 'WebPolyline';

export function WebCircle(props) {
  return null;
}
WebCircle.displayName = 'WebCircle';

export function WebMarker(props) {
  return null;
}
WebMarker.displayName = 'WebMarker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
});
