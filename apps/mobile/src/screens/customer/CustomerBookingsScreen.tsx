import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { bookingService } from '../../services/api/bookingService';
import { paymentService } from '../../services/api/paymentService';
import { ReviewModal } from '../../components/ReviewModal';
import { Alert } from 'react-native';

export const CustomerBookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const data = await bookingService.getCustomerBookings();
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

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingService.updateBookingStatus(id, 'CANCELLED');
      fetchBookings();
    } catch (err: any) {
      console.error('Failed to cancel', err);
    }
  };

  const handlePayBooking = async (booking: any) => {
    Alert.alert(
      'Secure Checkout',
      `Complete payment of $${booking.service.price} for ${booking.service.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            try {
              setLoading(true);
              await paymentService.payForBooking(booking.id);
              Alert.alert('Success', 'Payment completed successfully!');
              fetchBookings();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || err.message || 'Payment failed');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const openReviewModal = (booking: any) => {
    setSelectedBooking(booking);
    setReviewModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPending = item.status === 'PENDING';
    const isConfirmed = item.status === 'CONFIRMED';
    const isCompleted = item.status === 'COMPLETED';

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
        <Text style={styles.providerName}>
          Provider: {item.service.provider.companyName || item.service.provider.userId}
        </Text>
        <Text style={styles.date}>
          {new Date(item.scheduledAt).toLocaleString()}
        </Text>
        <Text style={styles.price}>${item.service.price}</Text>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.serviceId })}
          >
            <Text style={styles.viewButtonText}>View Service</Text>
          </TouchableOpacity>

          {isConfirmed && item.payment?.status === 'PENDING' && (
            <TouchableOpacity 
              style={styles.payButton}
              onPress={() => handlePayBooking(item)}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}

          {(isPending || isConfirmed) && (
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {isCompleted && !item.review && (
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => openReviewModal(item)}
            >
              <Text style={styles.reviewButtonText}>Leave a Review</Text>
            </TouchableOpacity>
          )}
          
          {isCompleted && item.review && (
            <View style={styles.reviewedBadge}>
              <Text style={styles.reviewedText}>Reviewed</Text>
            </View>
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
        ListEmptyComponent={<Text style={styles.empty}>You have no bookings yet.</Text>}
      />

      {selectedBooking && (
        <ReviewModal
          visible={reviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          bookingId={selectedBooking.id}
          serviceId={selectedBooking.serviceId}
          serviceName={selectedBooking.service.name}
          onSuccess={fetchBookings}
        />
      )}
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
  providerName: { fontSize: 14, color: '#4b5563', marginBottom: 4 },
  date: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  viewButton: { backgroundColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  viewButtonText: { color: '#374151', fontWeight: 'bold' },
  payButton: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  payButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  cancelButtonText: { color: '#b91c1c', fontWeight: 'bold' },
  reviewButton: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  reviewButtonText: { color: '#fff', fontWeight: 'bold' },
  reviewedBadge: { borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  reviewedText: { color: '#9ca3af', fontWeight: 'bold' },
});
