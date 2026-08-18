import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileSetupScreen({ navigation }: any) {
  const { isProfileComplete } = useAuthStore();

  const handleSelectRole = (role: 'Customer' | 'Provider') => {
    if (role === 'Customer') {
      navigation.navigate('CustomerProfileSetup');
    } else {
      navigation.navigate('ProviderProfileSetup');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>How would you like to use EcivreS?</Text>
      
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleSelectRole('Customer')}
      >
        <Text style={styles.cardTitle}>I'm a Customer</Text>
        <Text style={styles.cardDesc}>I want to book services.</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleSelectRole('Provider')}
      >
        <Text style={styles.cardTitle}>I'm a Service Provider</Text>
        <Text style={styles.cardDesc}>I want to offer my services to customers.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
  }
});
