import axios from 'axios';

import { createLogger } from '../logger';

const apiLogger = createLogger({ prefix: 'API Client', level: 'DEBUG' });

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      apiLogger.warn('Authorization token is missing.');
    }
    apiLogger.debug('Sending request to:', config.url);
    return config;
  },
  (error) => {
    apiLogger.error('Request error:', error);
    return Promise.reject(new Error(String(error)));
  }
);

export default apiClient;
