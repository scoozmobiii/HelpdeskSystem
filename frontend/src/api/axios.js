import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore();
  const token = authStore.token;
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;