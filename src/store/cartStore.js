import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../api/endpoints.js';

export const useCart = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      fetchCart: async () => {
        set({ loading: true });
        try {
          const { data } = await cartAPI.get();
          set({ cart: data.data, loading: false });
          return data.data;
        } catch (error) {
          set({ loading: false, error: error.message });
          return null;
        }
      },

      addToCart: async (productId, quantity = 1, options = {}) => {
        try {
          const { data } = await cartAPI.add({ productId, quantity, ...options });
          set({ cart: data.data });
          return data.data;
        } catch (error) {
          throw error;
        }
      },

      updateItem: async (itemId, quantity) => {
        try {
          const { data } = await cartAPI.updateItem(itemId, { quantity });
          set({ cart: data.data });
          return data.data;
        } catch (error) {
          throw error;
        }
      },

      removeItem: async (itemId) => {
        try {
          const { data } = await cartAPI.removeItem(itemId);
          set({ cart: data.data });
          return data.data;
        } catch (error) {
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await cartAPI.clear();
          set({ cart: null });
        } catch (error) {
          throw error;
        }
      },

      applyCoupon: async (code) => {
        try {
          const { data } = await cartAPI.applyCoupon(code);
          set({ cart: data.data });
          return data.data;
        } catch (error) {
          throw error;
        }
      },

      removeCoupon: async () => {
        try {
          const { data } = await cartAPI.removeCoupon();
          set({ cart: data.data });
        } catch (error) {
          throw error;
        }
      },

      getItemCount: () => {
        const cart = get().cart;
        if (!cart) return 0;
        return cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      },
    }),
    { name: 'cart-storage' },
  ),
);
