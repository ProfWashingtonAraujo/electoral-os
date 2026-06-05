import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
const API_URL = isLocalhost ? '/api' : (configuredApiUrl || 'http://localhost:3001/api')

// Warn in production when VITE_API_URL was not set at build time
if (!import.meta.env.VITE_API_URL && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  console.error(
    '[ElectoraOS] ⚠️ VITE_API_URL não foi definida no build. ' +
    'O frontend está tentando usar http://localhost:3001/api, que não funciona em produção. ' +
    'Configure VITE_API_URL nas variáveis de ambiente da Vercel e faça um novo deploy.'
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('electoral_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('electoral_token');
      localStorage.removeItem('electoral_auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
