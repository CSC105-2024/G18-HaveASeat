import { create } from 'zustand';
import axiosInstance from '@/lib/axios';

const useFavoritesStore = create((set, get) => ({
  favorites: new Set(),
  favoriteCounts: new Map(),
  isLoading: false,
  lastFetch: null,

  fetchFavorites: async (forceRefresh = false) => {
    const state = get();

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (!forceRefresh && state.lastFetch && state.lastFetch > fiveMinutesAgo) {
      return;
    }

    if (state.isLoading) return;

    set({ isLoading: true });

    try {
      const response = await axiosInstance.get('/user/favourites');
      const favourites = response.data?.favourites || [];
      const favoriteIds = new Set(favourites.map(fav => fav.merchantId));

      set({
        favorites: favoriteIds,
        isLoading: false,
        lastFetch: Date.now()
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      set({ isLoading: false });
    }
  },

  setFavoriteCount: (merchantId, count) => {
    const state = get();
    const newCounts = new Map(state.favoriteCounts);
    newCounts.set(merchantId, count);
    set({ favoriteCounts: newCounts });
  },

  getFavoriteCount: (merchantId) => {
    return get().favoriteCounts.get(merchantId);
  },

  isFavorite: (merchantId) => {
    return get().favorites.has(merchantId);
  },

  addFavorite: async (merchantId) => {
    const state = get();

    const newFavorites = new Set(state.favorites);
    newFavorites.add(merchantId);

    const newCounts = new Map(state.favoriteCounts);
    const currentCount = newCounts.get(merchantId) || 0;
    newCounts.set(merchantId, currentCount + 1);

    set({ favorites: newFavorites, favoriteCounts: newCounts });

    try {
      await axiosInstance.post('/user/favourites', { merchantId });
    } catch (error) {
      const revertedFavorites = new Set(state.favorites);
      revertedFavorites.delete(merchantId);
      const revertedCounts = new Map(state.favoriteCounts);
      revertedCounts.set(merchantId, currentCount);
      set({ favorites: revertedFavorites, favoriteCounts: revertedCounts });
      throw error;
    }
  },

  removeFavorite: async (merchantId) => {
    const state = get();

    const newFavorites = new Set(state.favorites);
    newFavorites.delete(merchantId);

    const newCounts = new Map(state.favoriteCounts);
    const currentCount = newCounts.get(merchantId) || 0;
    newCounts.set(merchantId, Math.max(0, currentCount - 1));

    set({ favorites: newFavorites, favoriteCounts: newCounts });

    try {
      await axiosInstance.delete('/user/favourites', {
        data: { merchantId },
      });
    } catch (error) {
      const revertedFavorites = new Set(state.favorites);
      revertedFavorites.add(merchantId);
      const revertedCounts = new Map(state.favoriteCounts);
      revertedCounts.set(merchantId, currentCount);
      set({ favorites: revertedFavorites, favoriteCounts: revertedCounts });
      throw error;
    }
  },

  clearFavorites: () => {
    set({ favorites: new Set(), lastFetch: null });
  },
}));

export { useFavoritesStore };