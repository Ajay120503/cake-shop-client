import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/endpoints.js';

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authAPI.login(credentials);
          set({
            user: data.data.user,
            token: data.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          return data.data.user;
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || 'Login failed' });
          throw error;
        }
      },

      googleLogin: async (token) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authAPI.googleLogin({ idToken: token });
          set({
            user: data.data.user,
            token: data.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          return data.data.user;
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || 'Google login failed' });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authAPI.register(userData);
          set({
            user: data.data.user,
            token: data.data.accessToken,
            isAuthenticated: true,
            loading: false,
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          return data.data.user;
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || 'Registration failed' });
          throw error;
        }
      },

      logout: async () => {
        try { await authAPI.logout(); } catch (_) {}
        localStorage.removeItem('accessToken');
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.data, isAuthenticated: true });
        } catch (_) {
          localStorage.removeItem('accessToken');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      updateUser: (user) => set({ user }),

      isAdmin: () => get().user?.role === 'admin',
    }),
    { name: 'auth-storage' },
  ),
);
