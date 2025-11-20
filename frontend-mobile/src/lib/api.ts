/**
 * API Client - Handles all API requests with authentication
 * Uses AsyncStorage for token persistence in React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from app.json extra config or fallback to localhost
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  refresh_token?: string;
  user?: any;
  user_type?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication token from AsyncStorage
   */
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Set authentication token in AsyncStorage
   */
  private async setToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  /**
   * Remove authentication token from AsyncStorage
   */
  private async removeToken() {
    try {
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'user',
        'user_type',
      ]);
    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  }

  /**
   * Fetch with retry logic and timeout
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    timeout = 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error: any) {
        clearTimeout(timeoutId);

        // Don't retry on abort (timeout)
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - por favor intenta de nuevo');
        }

        // Don't retry on last attempt
        if (i === retries - 1) {
          throw error;
        }

        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries reached');
  }

  /**
   * Make an authenticated API request with retry logic and timeout
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}${endpoint}`,
        { ...options, headers }
      );

      const data = await response.json();

      if (!response.ok) {
        // Provide user-friendly error messages
        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
        } else if (response.status === 403) {
          throw new Error('No tienes permiso para realizar esta acción.');
        } else if (response.status === 404) {
          throw new Error('Recurso no encontrado.');
        } else if (response.status >= 500) {
          throw new Error('Error del servidor. Por favor intenta más tarde.');
        }

        throw new Error(data.error || `Error HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);

      // Network error
      if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
        throw new Error('Error de conexión. Verifica tu internet.');
      }

      throw error;
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register a new client account (used with invite token)
   */
  async registerClient(data: {
    email: string;
    password: string;
    name: string;
    invite_token?: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/api/auth/register-client', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      await this.setToken(response.token);
      if (response.refresh_token) {
        await AsyncStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem('user_type', 'client');
      }
    }

    return response;
  }

  /**
   * Login with email and password
   */
  async login(data: {
    email: string;
    password: string;
    user_type?: 'trainer' | 'client';
  }): Promise<ApiResponse> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...data, user_type: data.user_type || 'client' }),
    });

    if (response.token) {
      await this.setToken(response.token);
      if (response.refresh_token) {
        await AsyncStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        await AsyncStorage.setItem(
          'user_type',
          response.user_type || 'client'
        );
      }
    }

    return response;
  }

  /**
   * Logout - clear tokens
   */
  async logout() {
    await this.removeToken();
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<ApiResponse> {
    return this.request('/api/auth/me');
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse> {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.token) {
      await this.setToken(data.token);
    }

    return data;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<any> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  // ==================== WORKOUT ENDPOINTS ====================

  /**
   * Get all workouts for the authenticated client
   */
  async getWorkouts(): Promise<ApiResponse> {
    return this.request('/api/workouts');
  }

  /**
   * Get a specific workout
   */
  async getWorkout(workoutId: string): Promise<ApiResponse> {
    return this.request(`/api/workouts/${workoutId}`);
  }

  /**
   * Log a workout completion
   */
  async logWorkout(data: {
    workout_id: number;
    performance_data: any[];
    duration_seconds: number;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/workout-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
