import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ProviderNavigator } from './ProviderNavigator';
import { SplashScreen } from '../screens/auth/SplashScreen';

export const AppNavigator = () => {
  const { isAuthenticated, user, isInitializing, hasSeenOnboarding, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const getNavigator = () => {
    if (isInitializing) {
      return <SplashScreen />;
    }

    if (!isAuthenticated || !user) {
      return <AuthNavigator initialRouteName={hasSeenOnboarding ? 'Welcome' : 'Onboarding'} />;
    }
    
    if (user.roles?.includes('provider')) {
      return <ProviderNavigator />;
    }
    
    return <CustomerNavigator />;
  };

  return (
    <NavigationContainer>
      {getNavigator()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
