import axios from 'axios';
import { clearAuthSession, getAuthToken } from '../features/auth/utils/session';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor para injetar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      clearAuthSession();
    }

    return Promise.reject(error);
  }
);
