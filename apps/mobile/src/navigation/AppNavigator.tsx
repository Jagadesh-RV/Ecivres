import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ProviderNavigator } from './ProviderNavigator';

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getNavigator = () => {
    if (!isAuthenticated || !user) {
      return <AuthNavigator />;
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
