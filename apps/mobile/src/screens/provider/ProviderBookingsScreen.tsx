import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { bookingService } from '../../services/api/bookingService';

export const ProviderBookingsScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const data = await bookingService.getProviderBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      fetchBookings();
    } catch (err: any) {
      console.error('Failed to update status', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPending = item.status === 'PENDING';
    const isConfirmed = item.status === 'CONFIRMED';
    const isCompleted = item.status === 'COMPLETED';
    const customerName = item.customer?.customerProfile ? 
      `${item.customer.customerProfile.firstName} ${item.customer.customerProfile.lastName}` : 'Anonymous';

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{item.service.name}</Text>
          <View style={styles.badgeRow}>
            <Text style={[
              styles.status, 
              isPending && styles.statusPending,
              isConfirmed && styles.statusConfirmed,
              isCompleted && styles.statusCompleted
            ]}>
              {item.status}
            </Text>
            {item.payment && (
              <Text style={[
                styles.paymentBadge,
                item.payment.status === 'SUCCESS' ? styles.paymentSuccess : styles.paymentPending
              ]}>
                {item.payment.status === 'SUCCESS' ? 'Paid' : 'Unpaid'}
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.customerName}>Customer: {customerName}</Text>
        <Text style={styles.date}>{new Date(item.scheduledAt).toLocaleString()}</Text>

        <View style={styles.actions}>
          {isPending && (
            <>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => handleUpdateStatus(item.id, 'CONFIRMED')}
              >
                <Text style={styles.confirmButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
              >
                <Text style={styles.cancelButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

          {isConfirmed && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => handleUpdateStatus(item.id, 'COMPLETED')}
            >
              <Text style={styles.completeButtonText}>Mark Completed</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No booking requests yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16 },
  error: { color: 'red', margin: 16, textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 32, color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceName: { fontSize: 18, fontWeight: 'bold' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden', backgroundColor: '#e5e7eb', color: '#374151' },
  statusPending: { backgroundColor: '#fef3c7', color: '#92400e' },
  statusConfirmed: { backgroundColor: '#dbeafe', color: '#1e40af' },
  statusCompleted: { backgroundColor: '#d1fae5', color: '#065f46' },
  badgeRow: { flexDirection: 'row', gap: 8 },
  paymentBadge: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' },
  paymentPending: { backgroundColor: '#ffedd5', color: '#ea580c' },
  paymentSuccess: { backgroundColor: '#d1fae5', color: '#059669' },
  customerName: { fontSize: 14, color: '#4b5563', marginBottom: 4 },
  date: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  confirmButton: { backgroundColor: '#dcfce7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  confirmButtonText: { color: '#166534', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  cancelButtonText: { color: '#b91c1c', fontWeight: 'bold' },
  completeButton: { backgroundColor: '#2ecc71', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  completeButtonText: { color: '#fff', fontWeight: 'bold' },
});
