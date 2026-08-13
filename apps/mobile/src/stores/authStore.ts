import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

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
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('refresh_token', refreshToken);
    set({ user: userData, isAuthenticated: true, isLoading: false });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  restoreSession: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      // If we have a token, we might want to fetch user profile, but for now we'll just set authenticated
      // A more robust implementation would fetch the current user profile here.
      if (accessToken) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ isAuthenticated: false, isLoading: false });
    }
  }
}));
