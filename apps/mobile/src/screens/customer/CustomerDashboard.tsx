import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export const CustomerDashboard = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customer Dashboard</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
