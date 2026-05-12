import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function MetricsPanel({ networkMode, responseTime, routeCount, timeContext }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MetricItem label="Network" value={networkMode} />
        <MetricItem label="Response" value={`${responseTime}ms`} />
        <MetricItem label="Routes" value={`${routeCount}`} />
      </View>
      {timeContext && (
        <View style={styles.timeRow}>
          <View style={[styles.timeDot, {
            backgroundColor: timeContext.period === 'night' ? COLORS.high
              : timeContext.period === 'evening' ? COLORS.moderate
              : COLORS.safe
          }]} />
          <Text style={styles.timeText}>
            {timeContext.label} Mode ({timeContext.risk_level})
          </Text>
        </View>
      )}
    </View>
  );
}

function MetricItem({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
