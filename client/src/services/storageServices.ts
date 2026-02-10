// src/services/storage.services.ts
import localforage from 'localforage';

// Initialize separate stores for organization
const puzzleStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'puzzles' // For caching puzzle data
});

const userStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'user_progress' // For streaks, solved puzzles
});

export const StorageService = {
  // Generic Generic Get
  getItem: async <T>(key: string, store: 'puzzle' | 'user' = 'user'): Promise<T | null> => {
    try {
      const targetStore = store === 'puzzle' ? puzzleStore : userStore;
      return await targetStore.getItem<T>(key);
    } catch (error) {
      console.error(`Storage Read Error (${key}):`, error);
      return null;
    }
  },

  // Generic Set
  setItem: async <T>(key: string, value: T, store: 'puzzle' | 'user' = 'user'): Promise<T> => {
    try {
      const targetStore = store === 'puzzle' ? puzzleStore : userStore;
      return await targetStore.setItem(key, value);
    } catch (error) {
      console.error(`Storage Write Error (${key}):`, error);
      throw error;
    }
  },

  // Clear specific store (useful for logout)
  clearUserData: async () => {
    await userStore.clear();
  }
};