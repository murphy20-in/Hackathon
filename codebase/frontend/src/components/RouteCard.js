import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, getScoreColor } from '../constants/colors';

export default function RouteCard({ route, isSelected, onSelect }) {
  const riskColor = getScoreColor(route.risk_score);
  const label = route.label || `Route ${route.route_id}`;

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(route)}
      activeOpacity={0.8}
    >
      {/* Header with label and score */}
      <View style={styles.header}>
        <View style={styles.labelRow}>
          {isSelected && <View style={[styles.indicator, { backgroundColor: riskColor }]} />}
          <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: riskColor }]}>
          <Text style={styles.scoreText}>{route.risk_score?.toFixed(0)}</Text>
        </View>
      </View>

      {/* Route details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{route.distance}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{route.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Safety</Text>
          <Text style={[styles.detailValue, { color: riskColor }]}>
            {route.safety_score?.toFixed(1)}/10
          </Text>
        </View>
      </View>

      {/* Risk summary */}
      {route.summary && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryDot, { backgroundColor: COLORS.high }]} />
          <Text style={styles.summaryText}>{route.summary.high_risk_segments} high</Text>
          <View style={[styles.summaryDot, { backgroundColor: COLORS.moderate }]} />
          <Text style={styles.summaryText}>{route.summary.medium_risk_segments} med</Text>
          <View style={[styles.summaryDot, { backgroundColor: COLORS.safe }]} />
          <Text style={styles.summaryText}>{route.summary.low_risk_segments} safe</Text>
        </View>
      )}

      {/* Message */}
      {route.message && (
        <Text style={styles.message} numberOfLines={2}>{route.message}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    width: 260,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardSelected: {
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  labelSelected: {
    color: COLORS.primary,
  },
  scoreBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
