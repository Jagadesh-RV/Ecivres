import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const OfflineSyncScreen: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(2);

  return (
    <View style={styles.container}>
      <View style={[styles.statusBadge, { backgroundColor: isOnline ? '#059669' : '#D97706' }]}>
        <Text style={styles.statusText}>{isOnline ? '🟢 Connected to EcivreS Cloud' : '🟠 Working Offline'}</Text>
      </View>

      <Text style={styles.title}>Offline Queue Manager</Text>
      <Text style={styles.subtitle}>
        {pendingQueueCount > 0
          ? `${pendingQueueCount} actions queued to sync when internet re-connects`
          : 'All offline actions synced successfully'}
      </Text>

      <TouchableOpacity
        style={styles.syncButton}
        onPress={() => setPendingQueueCount(0)}
      >
        <Text style={styles.buttonText}>Force Background Sync Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 12,
  },
  syncButton: {
    backgroundColor: '#4338CA',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
