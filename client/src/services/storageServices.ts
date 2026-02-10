// src/services/storage.services.ts
import localforage from 'localforage';

// Initialize storage instances
const puzzleStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'puzzles'
});

const userProgressStore = localforage.createInstance({
  name: 'DailyPuzzleGame',
  storeName: 'progress'
});

export const storage = {
  // Generic Save
  setItem: async <T>(key: string, value: T): Promise<T> => {
    try {
      return await puzzleStore.setItem(key, value);
    } catch (err) {
      console.error('Storage Save Error:', err);
      throw err;
    }
  },

  // Generic Get
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      return await puzzleStore.getItem<T>(key);
    } catch (err) {
      console.error('Storage Get Error:', err);
      return null;
    }
  },

  // Save User Progress
  saveProgress: async (userId: string, data: any) => {
    // We will implement compression here later in Phase 4
    return await userProgressStore.setItem(userId, data);
  }
};