import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { COLORS } from '../constants/colors';
import { watchPosition } from '../services/locationService';
import { resolveSOS } from '../services/api';

export default function EmergencyScreen({ route, navigation }) {
  const { location: initialLocation, networkMode = '5G' } = route.params || {};

  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [elapsed, setElapsed] = useState(0);
  const [sosId, setSosId] = useState(null);
  const watchRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Vibrate pattern to indicate emergency mode
    Vibration.vibrate([500, 500, 500], false);

    // Start location tracking
    startTracking();

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      stopTracking();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTracking = async () => {
    try {
      const subscription = await watchPosition((loc) => {
        setCurrentLocation(loc);
      }, 5000);
      watchRef.current = subscription;
    } catch (err) {
      console.error('Failed to start location tracking:', err);
    }
  };

  const stopTracking = () => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  };

  const handleCancel = async () => {
    try {
      if (sosId) {
        await resolveSOS(sosId, networkMode);
      }
    } catch (err) {
      // Best effort resolve
    }
    stopTracking();
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Emergency header */}
      <View style={styles.header}>
        <Text style={styles.pulse}>🔴</Text>
        <Text style={styles.title}>EMERGENCY MODE ACTIVE</Text>
        <Text style={styles.subtitle}>Your location is being shared</Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Duration</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      </View>

      {/* Location display */}
      <View style={styles.locationCard}>
        <Text style={styles.locationLabel}>Live Location</Text>
        {currentLocation ? (
          <>
            <Text style={styles.locationValue}>
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.locationUpdate}>
              Updating every 5 seconds via {networkMode}
            </Text>
          </>
        ) : (
          <Text style={styles.locationValue}>Acquiring GPS signal...</Text>
        )}
      </View>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        <StatusItem icon="📱" text="Emergency contacts notified" status="sent" />
        <StatusItem icon="📍" text="Location tracking active" status="active" />
        <StatusItem icon="🏥" text="Nearest police station alerted" status="sent" />
        <StatusItem icon="📡" text={`Connected via ${networkMode}`} status="active" />
      </View>

      {/* Tracking link (simulated) */}
      <View style={styles.trackingCard}>
        <Text style={styles.trackingLabel}>Shareable Tracking Link</Text>
        <Text style={styles.trackingUrl}>
          surakshamarga.ai/track/sos-{Date.now().toString(36)}
        </Text>
      </View>

      {/* Cancel button */}
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelText}>I'm Safe - Cancel Emergency</Text>
      </TouchableOpacity>

      <Text style={styles.emergencyCall}>
        For immediate help, call 112 or 100
      </Text>
    </View>
  );
}

function StatusItem({ icon, text, status }) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusIcon}>{icon}</Text>
      <Text style={styles.statusText}>{text}</Text>
      <View style={[styles.statusDot, {
        backgroundColor: status === 'active' ? COLORS.safe : COLORS.moderate
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0000',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pulse: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.sosRed,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  timer: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFF',
    letterSpacing: 4,
  },
  locationCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(211,47,47,0.3)',
  },
  locationLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  locationValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  locationUpdate: {
    fontSize: 11,
    color: COLORS.safe,
    marginTop: 6,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trackingCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    alignItems: 'center',
  },
  trackingLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  trackingUrl: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyCall: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 16,
  },
});
