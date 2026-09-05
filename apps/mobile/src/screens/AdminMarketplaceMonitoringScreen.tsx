import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface AdminMarketplaceMonitoringScreenProps {
  totalBookings: number;
  pendingCount: number;
  confirmedCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
  completionRate: number;
  grossVolume: number;
  platformCommission: number;
}

export const AdminMarketplaceMonitoringScreen: React.FC<AdminMarketplaceMonitoringScreenProps> = ({
  totalBookings,
  pendingCount,
  confirmedCount,
  inProgressCount,
  completedCount,
  cancelledCount,
  completionRate,
  grossVolume,
  platformCommission,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Marketplace Admin Analytics</Text>
      <Text style={styles.subtitle}>Real-time system health and booking flow metrics</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerLabel}>Gross Marketplace Volume</Text>
        <Text style={styles.bannerValue}>${grossVolume.toFixed(2)}</Text>
        <Text style={styles.bannerSub}>Platform Commission (10%): +${platformCommission.toFixed(2)}</Text>
      </View>

      <Text style={styles.sectionHeader}>Booking States Breakdown</Text>
      <View style={styles.grid}>
        <View style={[styles.card, styles.pendingCard]}>
          <Text style={styles.cardVal}>{pendingCount}</Text>
          <Text style={styles.cardLab}>Pending</Text>
        </View>

        <View style={[styles.card, styles.confirmedCard]}>
          <Text style={styles.cardVal}>{confirmedCount}</Text>
          <Text style={styles.cardLab}>Confirmed</Text>
        </View>

        <View style={[styles.card, styles.inProgressCard]}>
          <Text style={styles.cardVal}>{inProgressCount}</Text>
          <Text style={styles.cardLab}>In Progress</Text>
        </View>

        <View style={[styles.card, styles.completedCard]}>
          <Text style={styles.cardVal}>{completedCount}</Text>
          <Text style={styles.cardLab}>Completed</Text>
        </View>
      </View>

      <View style={styles.metricsBox}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Total Bookings Processed</Text>
          <Text style={styles.metricValue}>{totalBookings}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Cancelled Orders</Text>
          <Text style={styles.metricValue}>{cancelledCount}</Text>
        </View>
        <View style={[styles.metricRow, styles.lastRow]}>
          <Text style={styles.metricLabel}>Completion Fulfillment Rate</Text>
          <Text style={styles.rateValue}>{completionRate}%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  banner: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bannerLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bannerValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#10B981',
    marginVertical: 6,
  },
  bannerSub: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  pendingCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  confirmedCard: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  inProgressCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  completedCard: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  cardVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardLab: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  metricsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lastRow: {
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  metricLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
});
