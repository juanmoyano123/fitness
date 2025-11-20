/**
 * API Client - Handles all API requests with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
   * Get authentication token from localStorage
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Set authentication token in localStorage
   */
  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Remove authentication token from localStorage
   */
  private removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
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
    const token = this.getToken();
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
      if (error.message === 'Failed to fetch') {
        throw new Error('Error de conexión. Verifica tu internet.');
      }

      throw error;
    }
  }

  // ==================== AUTH ENDPOINTS ====================

  /**
   * Register a new trainer account
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    business_name?: string;
  }): Promise<ApiResponse> {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
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
      body: JSON.stringify(data),
    });

    if (response.token) {
      this.setToken(response.token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('user_type', response.user_type || 'trainer');
      }
    }

    return response;
  }

  /**
   * Logout - clear tokens
   */
  logout() {
    this.removeToken();
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
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  // ==================== CLIENT ENDPOINTS ====================

  /**
   * Get all clients for the authenticated trainer
   */
  async getClients(params?: { active?: boolean }): Promise<ApiResponse> {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request(`/api/clients${queryString}`);
  }

  /**
   * Get a specific client
   */
  async getClient(clientId: number): Promise<ApiResponse> {
    return this.request(`/api/clients/${clientId}`);
  }

  /**
   * Create a new client
   */
  async createClient(data: {
    email: string;
    name: string;
    phone?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a client
   */
  async updateClient(
    clientId: number,
    data: {
      name?: string;
      phone?: string;
      notes?: string;
      is_active?: boolean;
    }
  ): Promise<ApiResponse> {
    return this.request(`/api/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a client
   */
  async deleteClient(clientId: number): Promise<ApiResponse> {
    return this.request(`/api/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Send invitation to a client
   */
  async inviteClient(clientId: number): Promise<ApiResponse> {
    return this.request(`/api/clients/${clientId}/invite`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored user data
   */
  getStoredUser(): any {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
