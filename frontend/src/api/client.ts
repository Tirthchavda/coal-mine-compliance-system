import axios from 'axios';

// Dynamically determine the active API Base URL
export const getApiBaseUrl = (): string => {
  // 1. Check if user configured a custom URL in localStorage
  const savedUrl = localStorage.getItem('coal_gov_api_url');
  if (savedUrl && savedUrl.trim()) {
    let u = savedUrl.trim();
    if (!u.startsWith('http') && !u.startsWith('/')) u = `https://${u}`;
    if (u.startsWith('http') && !u.endsWith('/api')) u = `${u}/api`;
    return u;
  }

  // 2. Check environment variable if explicitly provided
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    let u = envUrl.trim();
    if (!u.startsWith('http') && !u.startsWith('/')) u = `https://${u}`;
    if (u.startsWith('http') && !u.endsWith('/api')) u = `${u}/api`;
    return u;
  }

  // 3. Default relative '/api' for same-origin local & unified cloud deployment
  return '/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Update dynamic baseURL and JWT token on every request
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem('coal_gov_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('coal_gov_token');
        localStorage.removeItem('coal_gov_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
