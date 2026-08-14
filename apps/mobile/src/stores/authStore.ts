import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../services/api/client';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  hasSeenOnboarding: boolean;
  login: (userData: any, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  hasSeenOnboarding: false,
  
  login: async (userData, accessToken, refreshToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);
    set({ user: userData, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const hasSeenOnboardingStr = await AsyncStorage.getItem('has_seen_onboarding');
      const hasSeenOnboarding = hasSeenOnboardingStr === 'true';
      set({ hasSeenOnboarding });

      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        // We have a token, let's fetch the current user profile
        const response = await client.get('/users/me');
        set({ user: response.data, isAuthenticated: true });
      }
    } catch {
      // If fetching fails (e.g. invalid token), clear it
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false });
    }
  }
}));
