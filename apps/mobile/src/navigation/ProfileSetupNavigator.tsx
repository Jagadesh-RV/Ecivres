import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import CustomerProfileSetupScreen from '../screens/customer/CustomerProfileSetupScreen';
import ProviderProfileSetupScreen from '../screens/provider/ProviderProfileSetupScreen';

const Stack = createNativeStackNavigator();

export const ProfileSetupNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="CustomerProfileSetup" component={CustomerProfileSetupScreen} />
      <Stack.Screen name="ProviderProfileSetup" component={ProviderProfileSetupScreen} />
    </Stack.Navigator>
  );
};
