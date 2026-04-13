import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SearchInput({ source, destination, onSourceChange, onDestinationChange, onSearch, loading }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.dotGreen} />
        <TextInput
          style={styles.input}
          placeholder="Enter starting point"
          placeholderTextColor={COLORS.textSecondary}
          value={source}
          onChangeText={onSourceChange}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.inputRow}>
        <View style={styles.dotRed} />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          placeholderTextColor={COLORS.textSecondary}
          value={destination}
          onChangeText={onDestinationChange}
        />
      </View>

      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={onSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text style={styles.searchButtonText}>Find Safe Routes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.safe,
    marginRight: 10,
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.high,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 15,
    color: COLORS.text,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 20,
    marginVertical: 4,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonDisabled: {
    opacity: 0.7,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
