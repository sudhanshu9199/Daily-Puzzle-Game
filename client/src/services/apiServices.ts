// src/services/api.services.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const ApiService = {
  // Example: We will use this later to sync progress to Neon
  syncProgress: async (userId: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, data }),
      });
      return await response.json();
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  }
};