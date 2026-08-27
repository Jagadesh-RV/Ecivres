import { create } from 'zustand';
import { client } from '../lib/axios';

interface User {
  id: string;
  email: string;
  role: string;
  hasCustomerProfile: boolean;
  hasProviderProfile: boolean;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  isLoading: boolean;
  login: (userData: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (userData: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isProfileComplete: false,
  isLoading: true,
  login: async (userData, accessToken, refreshToken) => {
    localStorage.setItem('auth', JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }));
    
    const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
    
    set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
  },

  logout: async () => {
    try {
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        const tokens = JSON.parse(authRaw);
        if (tokens.refresh_token) {
          await client.post('/auth/logout', { refresh_token: tokens.refresh_token });
        }
      }
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('auth');
      set({ user: null, isAuthenticated: false, isProfileComplete: false, isLoading: false });
    }
  },

  restoreSession: async () => {
    try {
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        const tokens = JSON.parse(authRaw);
        if (tokens.access_token) {
          try {
            const response = await client.get('/users/me');
            const userData = response.data;
            const isProfileComplete = userData.hasCustomerProfile || userData.hasProviderProfile || false;
            set({ user: userData, isAuthenticated: true, isProfileComplete, isLoading: false });
          } catch {
            localStorage.removeItem('auth');
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
