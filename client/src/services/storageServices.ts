// src/services/storageServices.ts
import localforage from 'localforage';
import LZString from 'lz-string';

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
      const compressedData = await targetStore.getItem<string>(key);
      if (!compressedData) return null;

      const decompressedData = LZString.decompressFromUTF16(compressedData);
      if (!decompressedData) {
        console.warn(`Storage Warning: Failed to decompress data for key [${key}]`);
        return null;
      }
      return JSON.parse(decompressedData) as T;
    } catch (error) {
      console.error(`Storage READ Error [${key}]:`, error);
      return null;
    }
  },

  // Generic Set
  setItem: async <T>(key: string, value: T, store: 'puzzle' | 'user' = 'user'): Promise<T> => {
    try {
      const targetStore = store === 'puzzle' ? puzzleStore : userStore;

      const stringified = JSON.stringify(value);
      const compressed = LZString.compressToUTF16(stringified);

      await targetStore.setItem(key, compressed);

      return value;
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