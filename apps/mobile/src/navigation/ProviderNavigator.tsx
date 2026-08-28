import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProviderDashboard } from '../screens/provider/ProviderDashboard';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ProviderServicesScreen } from '../screens/provider/ProviderServicesScreen';
import { ProviderServiceFormScreen } from '../screens/provider/ProviderServiceFormScreen';
import { ProviderStackParamList } from './types';

const Stack = createNativeStackNavigator<ProviderStackParamList>();

export const ProviderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ProviderDashboard" component={ProviderDashboard} options={{ title: 'Provider Dashboard' }} />
      <Stack.Screen name="ProviderBookings" component={ProviderBookingsScreen} options={{ title: 'Manage Bookings' }} />
      <Stack.Screen name="ProviderServices" component={ProviderServicesScreen} options={{ title: 'Manage Services' }} />
      <Stack.Screen name="ProviderServiceForm" component={ProviderServiceFormScreen} options={{ title: 'Service Details' }} />
    </Stack.Navigator>
  );
};
