import axios from 'axios';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

<<<<<<< HEAD
// Use Expo environment variables, fallback to localhost for development if missing
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
=======
// In bare RN, you could use react-native-config. 
// For now we'll use a hardcoded dev IP that works on Android Emulator.
// Physical device testing will require this to be your PC's IP.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000'; 
>>>>>>> 74a7cf7c715b4a21ac0af2e480892cf5c8311303

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(requestInterceptor, errorInterceptor);
client.interceptors.response.use(responseInterceptor, errorInterceptor);

export default client;
