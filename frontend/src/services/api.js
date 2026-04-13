import { API_BASE_URL, NETWORK_PROFILES } from '../constants/config';

/**
 * Base fetch wrapper with error handling and optional simulated latency.
 */
async function apiFetch(endpoint, options = {}, networkMode = '5G') {
  const url = `${API_BASE_URL}${endpoint}`;

  // Simulate network latency for non-5G modes
  const profile = NETWORK_PROFILES[networkMode];
  if (profile && profile.latency > 10) {
    await new Promise((r) => setTimeout(r, profile.latency));
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Network error' }));
      console.error('[API] Request failed', {
        endpoint,
        status: response.status,
        detail: error.detail || 'Network error',
      });
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('[API] Transport error', { endpoint, url, message: error.message });
    throw error;
  }
}

/**
 * Fetch multiple route alternatives.
 */
export async function getRoutes(source, destination, networkMode = '5G') {
  return apiFetch(
    '/get-routes',
    {
      method: 'POST',
      body: JSON.stringify({ source, destination }),
    },
    networkMode
  );
}

/**
 * Fetch routes with safety scoring and recommendation.
 */
export async function getSafeRoute(source, destination, timeOfDay = null, networkMode = '5G') {
  return apiFetch(
    '/safe-route',
    {
      method: 'POST',
      body: JSON.stringify({
        source,
        destination,
        time_of_day: timeOfDay,
      }),
    },
    networkMode
  );
}

/**
 * Fetch aggregated crime zones for heatmap.
 */
export async function getCrimeZones(networkMode = '5G') {
  return apiFetch('/crime-zones', {}, networkMode);
}

/**
 * Trigger SOS emergency alert.
 */
export async function sendSOS(userId, location, contacts = [], networkMode = '5G') {
  return apiFetch(
    '/send-sos',
    {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        location,
        contacts,
        timestamp: new Date().toISOString(),
      }),
    },
    networkMode
  );
}

/**
 * Resolve an active SOS event.
 */
export async function resolveSOS(sosId, networkMode = '5G') {
  return apiFetch(
    '/sos/resolve',
    {
      method: 'POST',
      body: JSON.stringify({ sos_id: sosId }),
    },
    networkMode
  );
}

/**
 * Get simulation/network status.
 */
export async function getSimulationStatus() {
  return apiFetch('/simulation/status');
}

/**
 * Set network simulation mode.
 */
export async function setNetworkMode(mode) {
  return apiFetch('/simulation/set-mode', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });
}

/**
 * Get real-time risk assessment for a location.
 */
export async function getRealtimeRisk(lat, lng, hour = null, networkMode = '5G') {
  const params = new URLSearchParams({ lat, lng });
  if (hour !== null) params.append('hour', hour);
  return apiFetch(`/simulation/realtime-risk?${params}`, {}, networkMode);
}

/**
 * Get crowd density for a location.
 */
export async function getCrowdDensity(lat, lng, hour = null, areaName = '') {
  const params = new URLSearchParams({ lat, lng });
  if (hour !== null) params.append('hour', hour);
  if (areaName) params.append('area_name', areaName);
  return apiFetch(`/simulation/crowd-density?${params}`);
}
