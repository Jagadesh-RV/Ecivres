import { apiClient } from './client';

export const authApi = {
  login: async (credentials: any) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  register: async (details: any) => {
    const { data } = await apiClient.post('/auth/register', details);
    return data;
  },
  refreshToken: async (token: string) => {
    const { data } = await apiClient.post('/auth/refresh', { refresh_token: token });
    return data;
  },
  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
};
