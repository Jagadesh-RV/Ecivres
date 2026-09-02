import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { ProfileScreen } from '../screens/auth/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.danger,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ tabBarLabel: 'Governance' }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
};
