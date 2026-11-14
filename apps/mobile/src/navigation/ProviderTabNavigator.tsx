import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProviderDashboard } from '../screens/provider/ProviderDashboard';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ProviderServicesScreen } from '../screens/provider/ProviderServicesScreen';
import { ProviderAvailabilityScreen } from '../screens/provider/ProviderAvailabilityScreen';
import { ProviderEarningsScreen } from '../screens/provider/ProviderEarningsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
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
        component={ProviderDashboard}
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
        name="ProviderAvailability"
        component={ProviderAvailabilityScreen}
        options={{ tabBarLabel: 'Hours' }}
      />
      <Tab.Screen
        name="ProviderEarnings"
        component={ProviderEarningsScreen}
        options={{ tabBarLabel: 'Earnings' }}
      />
      <Tab.Screen
        name="ProviderProfile"
        component={EditProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
