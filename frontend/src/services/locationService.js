import * as Location from 'expo-location';

/**
 * Request location permissions.
 * @returns {boolean} Whether permission was granted
 */
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Get the current location.
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function getCurrentLocation() {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

/**
 * Watch position changes for live tracking (SOS mode).
 * @param {function} callback - Called with {latitude, longitude} on each update
 * @param {number} interval - Update interval in ms (default 5000)
 * @returns {Promise<object>} Subscription object - call .remove() to stop
 */
export async function watchPosition(callback, interval = 5000) {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: interval,
      distanceInterval: 5, // minimum 5m movement
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
}
