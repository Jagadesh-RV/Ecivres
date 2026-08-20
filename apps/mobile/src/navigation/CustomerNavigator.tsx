import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDashboard } from '../screens/customer/CustomerDashboard';
import { CategoryListScreen } from '../screens/customer/CategoryListScreen';
import { ServiceListScreen } from '../screens/customer/ServiceListScreen';
import { ServiceDetailsScreen } from '../screens/customer/ServiceDetailsScreen';
import { ProviderDetailsScreen } from '../screens/customer/ProviderDetailsScreen';

const Stack = createNativeStackNavigator();

export const CustomerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="CategoryList" component={CategoryListScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="ServiceList" component={ServiceListScreen} options={{ title: 'Services' }} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={{ title: 'Service Details' }} />
      <Stack.Screen name="ProviderDetails" component={ProviderDetailsScreen} options={{ title: 'Provider Details' }} />
    </Stack.Navigator>
  );
};
