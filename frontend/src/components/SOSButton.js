import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Vibration, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { SOS_LONG_PRESS_DURATION } from '../constants/config';

export default function SOSButton({ onTrigger, disabled }) {
  const [pressing, setPressing] = useState(false);

  const handleLongPress = () => {
    Vibration.vibrate([100, 200, 100]);
    Alert.alert(
      'Emergency SOS',
      'Send emergency alert to your contacts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'SEND SOS',
          style: 'destructive',
          onPress: () => onTrigger(),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, pressing && styles.buttonPressed, disabled && styles.buttonDisabled]}
      onLongPress={handleLongPress}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}
      delayLongPress={SOS_LONG_PRESS_DURATION}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>SOS</Text>
      <Text style={styles.hint}>Hold</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.sosRed,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.sosRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  buttonPressed: {
    backgroundColor: '#B71C1C',
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
  },
});
