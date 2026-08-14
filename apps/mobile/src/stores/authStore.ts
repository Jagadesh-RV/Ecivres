import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: any, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (userData, accessToken, refreshToken) => {
    await AsyncStorage.setItem('access_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);
    set({ user: userData, isAuthenticated: true, isLoading: false });
  },
  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  restoreSession: async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      // If we have a token, we might want to fetch user profile, but for now we'll just set authenticated
      // A more robust implementation would fetch the current user profile here.
      if (accessToken) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  }
}));
