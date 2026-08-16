import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api/client';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  login: (userData: any, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (userData: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isProfileComplete: false,
  isLoading: true,
  login: async (userData, accessToken, refreshToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    
    // Check if user has required profile based on their role
    const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
    
    set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
  },

  logout: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch (e) {
      // Ignore errors on logout
    } finally {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isProfileComplete: false, isLoading: false });
    }
  },

  restoreSession: async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (accessToken) {
        // Fetch current user from /users/me
        try {
          const response = await apiClient.get('/users/me');
          const userData = response.data;
          const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
          set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
        } catch (e) {
          // If token is invalid or request fails, logout
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
          set({ isAuthenticated: false, isProfileComplete: false, isLoading: false });
        }
      } else {
        set({ isAuthenticated: false, isProfileComplete: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isProfileComplete: false, isLoading: false });
    }
  },
  updateUser: (userData) => {
    const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
    set({ user: userData, isProfileComplete });
  }
}));
