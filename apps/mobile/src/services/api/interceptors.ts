import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { authApi } from './auth';

export const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = async (error: any) => {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        const response = await authApi.refreshToken(refreshToken);
        if (response.success && response.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          await SecureStore.setItemAsync('access_token', accessToken);
          await SecureStore.setItemAsync('refresh_token', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // We need to use axios directly to bypass the current interceptor instance context
          // or use the original client, but since we are inside interceptor, let's just retry
          const axios = require('axios').default;
          return axios(originalRequest);
        }
      }
    } catch {
      // Refresh failed, clear session
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      // A full implementation would trigger the logout store action here
    }
  }
  return Promise.reject(error);
};
