import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

// In bare RN, you could use react-native-config. 
// For now we'll use a hardcoded dev IP that works on Android Emulator.
// Physical device testing will require this to be your PC's IP.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'; 

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(requestInterceptor, errorInterceptor);
client.interceptors.response.use(responseInterceptor, errorInterceptor);

export default client;
