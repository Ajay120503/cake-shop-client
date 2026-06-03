import { create } from 'zustand';
import { wishlistAPI } from '../api/endpoints.js';

export const useWishlist = create((set, get) => ({
  wishlist: null,
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await wishlistAPI.get();
      set({ wishlist: data.data, loading: false });
    } catch (_) {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const { data } = await wishlistAPI.add(productId);
      set({ wishlist: data.data });
    } catch (error) {
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const { data } = await wishlistAPI.remove(productId);
      set({ wishlist: data.data });
    } catch (error) {
      throw error;
    }
  },

  isInWishlist: (productId) => {
    const wl = get().wishlist;
    if (!wl) return false;
    return wl.products?.some((p) => (p.product?._id || p.product) === productId);
  },

  clearWishlist: async () => {
    try {
      await wishlistAPI.clear();
      set({ wishlist: null });
    } catch (error) {
      throw error;
    }
  },
}));
