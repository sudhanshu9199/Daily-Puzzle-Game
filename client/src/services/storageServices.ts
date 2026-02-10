// src/services/storageServices.ts
import localforage from 'localforage';

const puzzleStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'puzzles', 
  description: 'Cache for daily puzzles'
});

const userStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'user_progress',
  description: 'User streaks and stats'
});

export const StorageService = {
  // Generic Get
  getItem: async <T>(key: string, store: 'puzzle' | 'user' = 'user'): Promise<T | null> => {
    try {
      const targetStore = store === 'puzzle' ? puzzleStore : userStore;
      const value = await targetStore.getItem<T>(key);
      return value;
    } catch (error) {
      console.error(`Storage READ Error [${key}]:`, error);
      return null;
    }
  },

  // Generic Set
  setItem: async <T>(key: string, value: T, store: 'puzzle' | 'user' = 'user'): Promise<T> => {
    try {
      const targetStore = store === 'puzzle' ? puzzleStore : userStore;
      return await targetStore.setItem(key, value);
    } catch (error) {
      console.error(`Storage WRITE Error [${key}]:`, error);
      throw error;
    }
  },

  // Remove Item
  removeItem: async (key: string, store: 'puzzle' | 'user' = 'user'): Promise<void> => {
    const targetStore = store === 'puzzle' ? puzzleStore : userStore;
    await targetStore.removeItem(key);
  },

  // Clear specific store (useful for Logout)
  clearUserData: async () => {
    await userStore.clear();
  }
};