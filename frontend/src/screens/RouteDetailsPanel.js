import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import RouteCard from '../components/RouteCard';
import { COLORS } from '../constants/colors';

export default function RouteDetailsPanel({ routes, selectedRoute, onRouteSelect, timeContext, tradeOffNote }) {
  if (!routes || routes.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Time context header */}
      {timeContext && (
        <View style={styles.header}>
          <View style={[styles.timeBadge, {
            backgroundColor: timeContext.period === 'night' ? COLORS.high
              : timeContext.period === 'evening' ? COLORS.moderate
              : COLORS.safe
          }]}>
            <Text style={styles.timeBadgeText}>
              {timeContext.period === 'night' ? '🌙' : timeContext.period === 'evening' ? '🌆' : '☀️'}
              {' '}{timeContext.label} Mode
            </Text>
          </View>
          <Text style={styles.routeCount}>{routes.length} routes found</Text>
        </View>
      )}

      {/* Trade-off note */}
      {tradeOffNote ? (
        <Text style={styles.tradeOff}>{tradeOffNote}</Text>
      ) : null}

      {/* Route cards scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {routes.map((route) => (
          <RouteCard
            key={route.route_id}
            route={route}
            isSelected={selectedRoute?.route_id === route.route_id}
            onSelect={onRouteSelect}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 280,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 80,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timeBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  routeCount: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tradeOff: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
});
