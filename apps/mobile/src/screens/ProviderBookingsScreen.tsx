import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { IncomingBookingCard, MobileBookingItem } from './IncomingBookingCard';

interface ProviderBookingsScreenProps {
  bookings: MobileBookingItem[];
  onRefresh?: () => void;
  onAcceptBooking?: (id: string) => Promise<void>;
  onRejectBooking?: (id: string) => Promise<void>;
  onRescheduleBooking?: (id: string) => void;
}

export const ProviderBookingsScreen: React.FC<ProviderBookingsScreenProps> = ({
  bookings,
  onRefresh,
  onAcceptBooking,
  onRejectBooking,
  onRescheduleBooking,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (selectedFilter === 'ALL') return true;
    return b.status === selectedFilter;
  });

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleAccept = async (id: string) => {
    try {
      if (onAcceptBooking) {
        await onAcceptBooking(id);
        Alert.alert('Success', 'Booking accepted successfully');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to accept booking');
    }
  };

  const handleReject = async (id: string) => {
    try {
      if (onRejectBooking) {
        await onRejectBooking(id);
        Alert.alert('Booking Rejected', 'The customer will be notified');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reject booking');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Provider Bookings</Text>
        <Text style={styles.subtitle}>Manage client requests and schedule fulfillment</Text>
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IncomingBookingCard
            booking={item}
            onAccept={handleAccept}
            onReject={handleReject}
            onReschedule={onRescheduleBooking}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#4F46E5']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found for this filter.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
