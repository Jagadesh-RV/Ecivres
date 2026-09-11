import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export const ProviderBusinessSuiteScreen: React.FC = () => {
  const [stats] = useState({
    dailyEarnings: '$450',
    occupancyRate: '78%',
    activeStaff: '4 Active',
    lowStockAlerts: '1 Item',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Business Suite</Text>
      <Text style={styles.subtitle}>Daily earnings, team scheduling & inventory management</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Earnings Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Today's Earnings</Text>
          <Text style={styles.metricText}>{stats.dailyEarnings}</Text>
          <Text style={styles.subMetric}>Occupancy: {stats.occupancyRate}</Text>
        </View>

        {/* Staff Overview */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Team Members</Text>
          <Text style={styles.metricText}>{stats.activeStaff}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Manage Schedules</Text>
          </TouchableOpacity>
        </View>

        {/* Inventory Overview */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Inventory & Equipment</Text>
          <Text style={styles.metricText}>Stock Healthy</Text>
          <Text style={styles.subMetric}>Alerts: {stats.lowStockAlerts}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 20,
  },
  content: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  subMetric: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4338CA',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
