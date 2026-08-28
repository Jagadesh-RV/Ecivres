import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth-store';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api/v1';

export const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = typeof window !== 'undefined' ? localStorage.getItem('auth') : null;
    if (tokens) {
      try {
        const { access_token } = JSON.parse(tokens);
        if (access_token) {
          config.headers.set('Authorization', `Bearer ${access_token}`);
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

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

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.set('Authorization', 'Bearer ' + token);
          }
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      let refreshToken = null;
      const tokensRaw = typeof window !== 'undefined' ? localStorage.getItem('auth') : null;
      if (tokensRaw) {
        try {
          const parsed = JSON.parse(tokensRaw);
          refreshToken = parsed.refresh_token;
        } catch (e) {}
      }
      
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token || refreshToken;
        
        localStorage.setItem('auth', JSON.stringify({ access_token: newAccessToken, refresh_token: newRefreshToken }));
        
        client.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        if (originalRequest.headers) {
          originalRequest.headers.set('Authorization', 'Bearer ' + newAccessToken);
        }
        
        processQueue(null, newAccessToken);
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
