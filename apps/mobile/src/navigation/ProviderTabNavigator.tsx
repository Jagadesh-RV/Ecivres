import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ProviderServicesScreen } from '../screens/provider/ProviderServicesScreen';
import { ProfileScreen } from '../screens/auth/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const ProviderTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen
        name="ProviderHome"
        component={ProviderHomeScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="ProviderBookings"
        component={ProviderBookingsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="ProviderServices"
        component={ProviderServicesScreen}
        options={{ tabBarLabel: 'Services' }}
      />
      <Tab.Screen
        name="ProviderProfile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
