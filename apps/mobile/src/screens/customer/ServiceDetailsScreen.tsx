import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import { getServiceDetails } from '../../services/api/serviceService';
import { createBooking } from '../../services/api/bookingService';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'ServiceDetails'>;
  route: RouteProp<CustomerStackParamList, 'ServiceDetails'>;
};

export const ServiceDetailsScreen = ({ navigation, route }: Props) => {
  const { serviceId } = route.params;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const data = await getServiceDetails(serviceId);
        setService(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [serviceId]);

  const handleBook = async () => {
    setBooking(true);
    try {
      // In a real app we'd have a date picker, but we use a default date for the foundation MVP
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 1); // Tomorrow
      await createBooking({ serviceId, scheduledAt: scheduledAt.toISOString() });
      Alert.alert('Success', 'Booking created successfully!');
      navigation.navigate('CustomerDashboard');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!service) {
    return <View style={styles.center}><Text>Service not found</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.category}>{service.category?.name}</Text>
      <Text style={styles.price}>${service.price}</Text>
      <Text style={styles.duration}>{service.duration} mins</Text>
      <Text style={styles.desc}>{service.description}</Text>

      {service.provider && (
        <View style={styles.providerCard}>
          <Text style={styles.providerTitle}>Provider</Text>
          <Text>{service.provider.businessName}</Text>
          <Button title="View Provider" onPress={() => navigation.navigate('ProviderDetails', { providerId: service.provider.userId })} />
        </View>
      )}

      <View style={styles.bookSection}>
        <Button title={booking ? "Booking..." : "BOOK SERVICE"} onPress={handleBook} disabled={booking} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  category: { fontSize: 14, color: 'blue', marginVertical: 5 },
  price: { fontSize: 20, color: 'green', marginTop: 10 },
  duration: { fontSize: 16, color: '#666' },
  desc: { fontSize: 16, marginTop: 15, lineHeight: 24 },
  providerCard: { marginTop: 30, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
  providerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  bookSection: { marginTop: 40, marginBottom: 40 },
});
