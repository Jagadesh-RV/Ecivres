import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDashboard } from '../screens/customer/CustomerDashboard';

const Stack = createNativeStackNavigator();

export const CustomerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
};
