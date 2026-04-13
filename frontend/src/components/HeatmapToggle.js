import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function HeatmapToggle({ isActive, onToggle }) {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{isActive ? '🔥' : '🗺️'}</Text>
      <Text style={[styles.text, isActive && styles.textActive]}>
        {isActive ? 'Heatmap ON' : 'Heatmap'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonActive: {
    backgroundColor: COLORS.high,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  textActive: {
    color: '#FFF',
  },
});
