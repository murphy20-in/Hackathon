export const COLORS = {
  // Primary
  primary: '#1565C0',
  primaryDark: '#0D47A1',
  primaryLight: '#42A5F5',

  // Risk levels
  safe: '#4CAF50',
  moderate: '#FFC107',
  high: '#F44336',
  veryHigh: '#B71C1C',

  // UI
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  disabled: '#BDBDBD',

  // SOS
  sosRed: '#D32F2F',
  sosBackground: '#1A0000',

  // Network badges
  network5G: '#00C853',
  network4G: '#FF9800',
  network3G: '#F44336',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  heatmapHigh: 'rgba(244, 67, 54, 0.35)',
  heatmapMedium: 'rgba(255, 193, 7, 0.3)',
  heatmapLow: 'rgba(76, 175, 80, 0.15)',
};

export const RISK_COLORS = {
  low: COLORS.safe,
  medium: COLORS.moderate,
  high: COLORS.high,
  very_high: COLORS.veryHigh,
};

export const getRiskColor = (riskLevel) => {
  return RISK_COLORS[riskLevel?.toLowerCase()] || COLORS.safe;
};

export const getScoreColor = (score) => {
  if (score > 60) return COLORS.high;
  if (score > 30) return COLORS.moderate;
  return COLORS.safe;
};
