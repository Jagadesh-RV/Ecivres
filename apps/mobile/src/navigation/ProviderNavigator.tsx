import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProviderDashboard } from '../screens/provider/ProviderDashboard';

const Stack = createNativeStackNavigator();

export const ProviderNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ProviderDashboard" component={ProviderDashboard} options={{ title: 'Provider Dashboard' }} />
    </Stack.Navigator>
  );
};
