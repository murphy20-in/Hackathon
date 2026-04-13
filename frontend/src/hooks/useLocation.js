import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../services/locationService';

/**
 * Hook for getting and tracking the user's current location.
 */
export function useLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLocation() {
      try {
        const loc = await getCurrentLocation();
        if (isMounted) {
          if (loc) {
            setLocation(loc);
          } else {
            setErrorMsg('Location permission denied');
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorMsg(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, errorMsg, isLoading };
}
