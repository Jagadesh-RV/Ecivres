import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerDashboard'>;
};

export const CustomerDashboard = ({ navigation }: Props) => {
  const logout = useAuthStore(state => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Dashboard</Text>
      
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('CategoryList')}
      >
        <Text style={styles.cardTitle}>Browse Services</Text>
        <Text style={styles.cardDescription}>Explore available categories and services.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('CustomerBookings')}
      >
        <Text style={styles.cardTitle}>My Bookings</Text>
        <Text style={styles.cardDescription}>View and manage your service appointments.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardDescription}>Check your alerts and notifications.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  card: { padding: 24, backgroundColor: '#fff', borderRadius: 8, elevation: 2, marginBottom: 24 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#666' },
  logoutButton: { padding: 16, alignItems: 'center' },
  logoutText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});
