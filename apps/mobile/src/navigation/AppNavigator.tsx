import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ProviderNavigator } from './ProviderNavigator';
import { ProfileSetupNavigator } from './ProfileSetupNavigator';

export const AppNavigator = () => {
  const { isAuthenticated, user, isProfileComplete, isLoading, restoreSession } = useAuthStore();

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
    
    if (!isProfileComplete) {
      return <ProfileSetupNavigator />;
    }
    
    // Convert role to uppercase if it's stored differently or just check generic string match
    // Actually the backend returns uppercase roles (e.g. 'PROVIDER') based on seed
    if (user.roles?.includes('PROVIDER') || user.roles?.includes('provider')) {
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
