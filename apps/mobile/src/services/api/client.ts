import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

const BASE_URL = 'http://localhost:5000/api/v1'; // TODO: Use react-native-config for environments

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(requestInterceptor, errorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
