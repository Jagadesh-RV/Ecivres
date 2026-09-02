import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { CustomerBookingsScreen } from '../screens/customer/CustomerBookingsScreen';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';
import { CustomerSettingsScreen } from '../screens/customer/CustomerSettingsScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color }) => {
          let icon = '🏠';
          if (route.name === 'Bookings') icon = '📅';
          if (route.name === 'Notifications') icon = '🔔';
          if (route.name === 'Settings') icon = '⚙️';
          return <Text style={{ fontSize: 20 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerHomeScreen} options={{ title: 'Overview' }} />
      <Tab.Screen name="Bookings" component={CustomerBookingsScreen} options={{ title: 'My Bookings' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Alerts' }} />
      <Tab.Screen name="Settings" component={CustomerSettingsScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
