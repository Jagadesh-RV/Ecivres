import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

// Use Expo environment variables, fallback to localhost for development if missing
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor, errorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
