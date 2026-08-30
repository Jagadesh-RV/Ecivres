import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';
import { reviewService } from '../../services/api/reviewService';
import { serviceService } from '../../services/api/serviceService';
import { bookingService } from '../../services/api/bookingService';

export const ProviderDashboard = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const navigation = useNavigation<any>();
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (user?.id) {
        const statsData = await reviewService.getProviderStats(user.id);
        setStats(statsData);

        if (user?.providerProfile?.id) {
          const servicesData = await serviceService.getAllServices({ providerId: user.providerProfile.id });
          setServices(servicesData);

          const bookingsData = await bookingService.getProviderBookings();
          setBookings(bookingsData);
        }
      }
    } catch (err) {
      console.log('Could not load provider dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          {loading ? <ActivityIndicator /> : <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}</Text>}
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statBox}>
          {loading ? <ActivityIndicator /> : <Text style={styles.statValue}>{stats.totalReviews}</Text>}
          <Text style={styles.statLabel}>Total Reviews</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ProviderBookings')}
      >
        <Text style={styles.cardTitle}>Manage Bookings</Text>
        <Text style={styles.cardDescription}>View incoming requests and upcoming appointments.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('ProviderServices')}
      >
        <Text style={styles.cardTitle}>Manage Services</Text>
        <Text style={styles.cardDescription}>Add, edit, or remove the services you offer.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardDescription}>View updates on bookings and payments.</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Services Offered</Text>
        {services.length === 0 ? (
          <Text style={styles.emptyText}>You haven't listed any services yet.</Text>
        ) : (
          services.map(service => (
            <View key={service.id} style={styles.serviceItem}>
              <View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}>{service.duration} mins</Text>
              </View>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f9fafb' },
  header: { marginBottom: 32 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  emailText: { fontSize: 16, color: '#6b7280' },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#6b7280' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb', elevation: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  logoutButton: { marginTop: 24, backgroundColor: '#fee2e2', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#b91c1c', fontWeight: 'bold', fontSize: 16 },
  section: { marginTop: 24, backgroundColor: '#fff', padding: 20, borderRadius: 12, borderHeight: 1, borderColor: '#e5e7eb', elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  emptyText: { fontSize: 14, color: '#6b7280', fontStyle: 'italic' },
  serviceItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  serviceName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  serviceDuration: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  servicePrice: { fontSize: 16, fontWeight: 'bold', color: '#10b981' },
});
