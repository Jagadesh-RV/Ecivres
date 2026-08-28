import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { serviceService } from '../../services/api/serviceService';
import { bookingService } from '../../services/api/bookingService';
import { reviewService } from '../../services/api/reviewService';
import { Service } from '../../types';
import { Star } from 'lucide-react-native';

export const ServiceDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { serviceId } = route.params;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchServiceDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getServiceById(serviceId);
      setService(data);
      const revs = await reviewService.getServiceReviews(serviceId);
      setReviews(revs);
    } catch (err: any) {
      setError(err.message || 'Service is no longer available');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleBookService = async () => {
    if (!bookingDate) {
      Alert.alert('Missing Info', 'Please enter a date and time.');
      return;
    }
    
    try {
      setBookingLoading(true);
      await bookingService.createBooking({
        serviceId: serviceId,
        scheduledAt: new Date(bookingDate).toISOString()
      });
      Alert.alert('Success', 'Booking request sent successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      Alert.alert('Booking Failed', err.response?.data?.message || err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity onPress={fetchServiceDetails}><Text style={styles.retry}>Retry</Text></TouchableOpacity></View>;
  if (!service) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.category}>{service.category?.name}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.description}>{service.description || 'No description available.'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>${service.price.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{service.duration} mins</Text>
        </View>
      </View>

      {service.provider && (
        <TouchableOpacity 
          style={styles.providerCard}
          onPress={() => navigation.navigate('ProviderDetails', { providerId: service.provider?.id })}
        >
          <Text style={styles.providerLabel}>Provided By</Text>
          <Text style={styles.providerName}>{service.provider.businessName || service.provider.userId}</Text>
          <Text style={styles.viewProfile}>View Profile →</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bookingSection}>
        <Text style={styles.sectionTitle}>Book Appointment</Text>
        <TextInput 
          style={styles.input}
          placeholder="YYYY-MM-DD HH:MM"
          value={bookingDate}
          onChangeText={setBookingDate}
        />
        <TouchableOpacity style={styles.bookButton} onPress={handleBookService} disabled={bookingLoading}>
          {bookingLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookButtonText}>BOOK SERVICE</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet.</Text>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>
                  {review.author?.customerProfile?.firstName} {review.author?.customerProfile?.lastName}
                </Text>
                <View style={styles.stars}>
                  {[1,2,3,4,5].map(star => (
                    <Star
                      key={star}
                      size={14}
                      color={star <= review.rating ? "#FBBF24" : "#D1D5DB"}
                      fill={star <= review.rating ? "#FBBF24" : "transparent"}
                    />
                  ))}
                </View>
              </View>
              {review.comment && <Text style={styles.reviewComment}>{review.comment}</Text>}
              <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', marginBottom: 10 },
  retry: { color: '#007AFF', fontWeight: 'bold' },
  container: { padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  category: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  detailsCard: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 24, elevation: 1 },
  description: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold' },
  providerCard: { padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#eee' },
  providerLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase', marginBottom: 4 },
  providerName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  viewProfile: { fontSize: 14, color: '#007AFF' },
  bookingSection: { marginBottom: 24, backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  bookButton: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  reviewsSection: { marginBottom: 32 },
  noReviews: { color: '#666', fontStyle: 'italic' },
  reviewCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewerName: { fontWeight: 'bold' },
  stars: { flexDirection: 'row' },
  reviewComment: { color: '#444', marginBottom: 8 },
  reviewDate: { fontSize: 12, color: '#999' },
});
