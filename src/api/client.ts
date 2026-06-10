import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const API_URL = configuredApiUrl || '/api'

// When VITE_API_URL is absent, use same-origin /api.
if (!import.meta.env.VITE_API_URL && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  console.error(
    '[ElectoraOS] ⚠️ VITE_API_URL não foi definida no build. ' +
    'O frontend está usando /api na mesma origem. ' +
    'Se o backend estiver em outro domínio, configure VITE_API_URL e faça um novo deploy.'
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
  const token = sessionStorage.getItem('electoral_token');
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
      sessionStorage.removeItem('electoral_token');
      sessionStorage.removeItem('electoral_auth_user');
      localStorage.removeItem('electoral_token');
      localStorage.removeItem('electoral_auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
