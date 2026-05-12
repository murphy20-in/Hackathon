import { useState, useCallback } from 'react';
import { getSafetyRoute } from '../services/api';
import { decodePolyline } from '../utils/polyline';

/**
 * Hook for fetching and managing safe routes.
 */
export function useRoutes() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeContext, setTimeContext] = useState(null);
  const [tradeOffNote, setTradeOffNote] = useState('');

  const fetchRoutes = useCallback(async (source, destination, timeOfDay = null, networkMode = '5G') => {
    setLoading(true);
    setError(null);

    try {
      const startTime = Date.now();
      const data = await getSafetyRoute(source, destination, timeOfDay, networkMode);
      const responseTime = Date.now() - startTime;

      const allRoutes = [];
      if (data.recommended_route) {
        allRoutes.push(data.recommended_route);
      }
      if (data.alternatives) {
        allRoutes.push(...data.alternatives);
      }

      const normalizedRoutes = allRoutes.map((route, index) => ({
        ...route,
        id: route.id ?? route.route_id ?? `route-${index + 1}`,
      }));

      // Pre-decode polyline coordinates so map/UI can use them directly
      normalizedRoutes.forEach((route) => {
        if (route.polyline && !route.coordinates) {
          route.coordinates = decodePolyline(route.polyline);
        }
      });

      setRoutes(normalizedRoutes);
      setSelectedRoute(normalizedRoutes[0] || null);
      setTimeContext(data.time_context || null);
      setTradeOffNote(data.trade_off_note || '');

      return { routes: normalizedRoutes, responseTime, error: null };
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch routes';
      setError(errorMsg);
      return { routes: [], responseTime: 0, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoutes = useCallback(() => {
    setRoutes([]);
    setSelectedRoute(null);
    setError(null);
    setTimeContext(null);
    setTradeOffNote('');
  }, []);

  return {
    routes,
    selectedRoute,
    setSelectedRoute,
    loading,
    error,
    timeContext,
    tradeOffNote,
    fetchRoutes,
    clearRoutes,
  };
}
