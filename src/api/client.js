import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL+"/api/v1" || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(API_URL + '/auth/refresh', {}, { withCredentials: true });
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = 'Bearer ' + data.accessToken;
          return api(original);
        }
      } catch (_) {
        localStorage.removeItem('accessToken');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login';
        }
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status !== 401 && !original.silent) {
      // toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default api;
