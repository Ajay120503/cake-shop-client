import { create } from 'zustand';
import { settingsAPI } from '../api/endpoints.js';

export const useSettings = create((set) => ({
  settings: null,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data } = await settingsAPI.getPublic();
      set({ settings: data.data, loading: false });
    } catch (_) {
      set({ loading: false });
    }
  },
}));
