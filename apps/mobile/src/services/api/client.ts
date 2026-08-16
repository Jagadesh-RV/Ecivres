import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

// Use Expo environment variables, fallback to localhost for development if missing
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(requestInterceptor, errorInterceptor);
client.interceptors.response.use(responseInterceptor, errorInterceptor);

export default client;
