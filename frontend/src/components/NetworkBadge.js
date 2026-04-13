import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { NETWORK_PROFILES } from '../constants/config';

export default function NetworkBadge({ currentMode, onToggle, responseTime }) {
  const profile = NETWORK_PROFILES[currentMode] || NETWORK_PROFILES['5G'];
  const modes = Object.keys(NETWORK_PROFILES);

  const handlePress = () => {
    const currentIndex = modes.indexOf(currentMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onToggle(nextMode);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.dot, { backgroundColor: profile.color }]} />
      <Text style={styles.modeText}>{profile.label}</Text>
      <View style={styles.divider} />
      <Text style={styles.latencyText}>{profile.latency}ms</Text>
      {currentMode === '5G' && <Text style={styles.edgeBadge}>Edge</Text>}
      {responseTime > 0 && (
        <Text style={styles.responseText}>{responseTime}ms</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  },
  latencyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  edgeBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    backgroundColor: COLORS.network5G,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
    overflow: 'hidden',
  },
  responseText: {
    fontSize: 11,
    color: COLORS.primaryLight,
    marginLeft: 6,
    fontWeight: '500',
  },
});
