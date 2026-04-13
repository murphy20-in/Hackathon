import { useState, useCallback } from 'react';
import { getSafeRoute } from '../services/api';

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
      const data = await getSafeRoute(source, destination, timeOfDay, networkMode);
      const responseTime = Date.now() - startTime;

      const allRoutes = [];
      if (data.recommended_route) {
        allRoutes.push(data.recommended_route);
      }
      if (data.alternatives) {
        allRoutes.push(...data.alternatives);
      }

      setRoutes(allRoutes);
      setSelectedRoute(allRoutes[0] || null);
      setTimeContext(data.time_context || null);
      setTradeOffNote(data.trade_off_note || '');

      return { routes: allRoutes, responseTime };
    } catch (err) {
      setError(err.message);
      return { routes: [], responseTime: 0 };
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
