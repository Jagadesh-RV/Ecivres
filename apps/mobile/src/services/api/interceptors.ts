import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../stores/authStore';

// We need the baseURL to create a separate axios instance to avoid circular loops on retry
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'; // fallback for emulator

export const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const errorInterceptor = async (error: any) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = 'Bearer ' + token;
        return axios(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = await AsyncStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refresh_token: refreshToken
      });

      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      
      await AsyncStorage.setItem('access_token', newAccessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem('refresh_token', newRefreshToken);
      }
      
      axios.defaults.headers.common.Authorization = 'Bearer ' + newAccessToken;
      originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
      
      processQueue(null, newAccessToken);
      return axios(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};
