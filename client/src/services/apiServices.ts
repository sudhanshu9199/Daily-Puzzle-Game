// src/services/api.services.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Failed [${endpoint}]:`, error);
    throw error;
  }
}

export const ApiService = {
  syncProgress: (userId: string, data: any) => {
    return request<{ success: boolean; syncedAt: string }>('/sync', {
      method: 'POST',
      body: JSON.stringify({
        userId, // SQL naming convention (snake_case)
        ...data
      }),
    });
  }
};


// export const ApiService = {
//   // Example: We will use this later to sync progress to Neon
//   syncProgress: async (userId: string, data: any) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/sync`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, data }),
//       });
//       return await response.json();
//     } catch (error) {
//       console.error("Sync failed:", error);
//       throw error;
//     }
//   }
// };