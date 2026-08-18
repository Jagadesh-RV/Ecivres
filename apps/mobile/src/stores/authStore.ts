import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
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
    await Keychain.setGenericPassword('auth', JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
    
    // Check if user has required profile based on their role
    const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
    
    set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
  },

  logout: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const tokens = JSON.parse(credentials.password);
        if (tokens.refresh_token) {
          await apiClient.post('/auth/logout', { refresh_token: tokens.refresh_token });
        }
      }
    } catch (e) {
      // Ignore errors on logout
    } finally {
      await Keychain.resetGenericPassword();
      set({ user: null, isAuthenticated: false, isProfileComplete: false, isLoading: false });
    }
  },

  restoreSession: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const tokens = JSON.parse(credentials.password);
        if (tokens.access_token) {
          // Fetch current user from /users/me
          try {
            const response = await apiClient.get('/users/me');
            const userData = response.data;
            const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
            set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
          } catch (e) {
            // If token is invalid or request fails, logout
            await Keychain.resetGenericPassword();
            set({ isAuthenticated: false, isProfileComplete: false, isLoading: false });
          }
        } else {
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
