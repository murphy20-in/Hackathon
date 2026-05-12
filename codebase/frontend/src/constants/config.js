// API configuration
// Override with EXPO_PUBLIC_API_BASE_URL when the backend runs on a non-default port.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Bangalore center coordinates
export const BANGALORE_CENTER = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Network simulation profiles
export const NETWORK_PROFILES = {
  '5G': { latency: 5, label: '5G', color: '#00C853' },
  '4G': { latency: 50, label: '4G', color: '#FF9800' },
  '3G': { latency: 200, label: '3G', color: '#F44336' },
};

// Polling interval for real-time updates (ms)
export const POLLING_INTERVAL = 15000;

// SOS settings
export const SOS_LONG_PRESS_DURATION = 1000; // ms
export const SOS_LOCATION_UPDATE_INTERVAL = 5000; // ms

// Heatmap circle settings
export const HEATMAP_CONFIG = {
  high: { radius: 300, fillColor: 'rgba(244, 67, 54, 0.35)', strokeColor: 'transparent' },
  medium: { radius: 200, fillColor: 'rgba(255, 193, 7, 0.3)', strokeColor: 'transparent' },
  low: { radius: 150, fillColor: 'rgba(76, 175, 80, 0.15)', strokeColor: 'transparent' },
};
