// src/services/api.services.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
       },
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
  syncProgress: (token: string, data: any) => {
    return request<{ success: boolean; syncedAt: string }>('/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
  },

  getUserProgress: (token: string) => {
    return request<{ data: any }>('/sync', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }
};
