import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuthStore } from '../../stores/authStore';

export const LoginScreen = () => {
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    // Placeholder payload
    await login({ id: '1', email: 'test@test.com', roles: ['customer'] }, 'dummy-access', 'dummy-refresh');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login Screen</Text>
      <Button title="Login as Customer" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
