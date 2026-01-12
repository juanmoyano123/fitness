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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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
  async getClients(params?: { active?: boolean }): Promise<Client[]> {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    const response = await this.request<Client[]>(`/api/clients${queryString}`);
    return response.data || response as any;
  }

  /**
   * Get a specific client
   */
  async getClient(clientId: number | string): Promise<ApiResponse> {
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
    gender?: 'male' | 'female' | 'other';
    age?: number;
    goals?: string;
  }): Promise<Client> {
    const response = await this.request<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as any;
  }

  /**
   * Update a client
   */
  async updateClient(
    clientId: number | string,
    data: {
      name?: string;
      phone?: string;
      notes?: string;
      is_active?: boolean;
      gender?: 'male' | 'female' | 'other';
      age?: number;
      goals?: string;
    }
  ): Promise<Client> {
    const response = await this.request<Client>(`/api/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response as any;
  }

  /**
   * Delete a client
   */
  async deleteClient(clientId: number | string): Promise<ApiResponse> {
    return this.request(`/api/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Send invitation to a client
   */
  async inviteClient(clientId: number | string): Promise<ApiResponse> {
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

  // ==================== EXERCISE ENDPOINTS (F-030, F-031, F-032) ====================

  /**
   * Get exercises with filters
   */
  async getExercises(params?: ExerciseFilters): Promise<Exercise[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.bodyPart) queryParams.append('bodyPart', params.bodyPart);
    if (params?.target) queryParams.append('target', params.target);
    if (params?.equipment) queryParams.append('equipment', params.equipment);
    if (params?.custom_only) queryParams.append('custom_only', 'true');
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/exercises?${queryString}` : '/api/exercises';

    const response = await this.request<Exercise[]>(endpoint);
    return response.data || response as any;
  }

  /**
   * Get exercise filters metadata (body parts, targets, equipment)
   */
  async getExerciseFilters(): Promise<ExerciseFiltersMetadata> {
    const response = await this.request<ExerciseFiltersMetadata>('/api/exercises/filters');
    return response.data || response as any;
  }

  /**
   * Sync exercises from ExerciseDB API
   */
  async syncExercises(limit?: number): Promise<SyncStats> {
    const endpoint = limit ? `/api/exercises/sync?limit=${limit}` : '/api/exercises/sync';
    const response = await this.request<{ stats: SyncStats }>(endpoint, {
      method: 'POST',
    });
    return response.data?.stats || (response as any).stats;
  }

  /**
   * Create a custom exercise
   */
  async createCustomExercise(data: CreateExerciseData): Promise<Exercise> {
    const response = await this.request<Exercise>('/api/exercises/custom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || response as any;
  }

  /**
   * Update a custom exercise
   */
  async updateCustomExercise(exerciseId: string, data: Partial<CreateExerciseData>): Promise<Exercise> {
    const response = await this.request<Exercise>(`/api/exercises/custom/${exerciseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data || response as any;
  }

  /**
   * Delete a custom exercise
   */
  async deleteCustomExercise(exerciseId: string): Promise<void> {
    await this.request(`/api/exercises/custom/${exerciseId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get a specific exercise by ID
   */
  async getExercise(exerciseId: string): Promise<Exercise> {
    const response = await this.request<Exercise>(`/api/exercises/${exerciseId}`);
    return response.data || response as any;
  }

  // ==================== WORKOUT ENDPOINTS ====================

  /**
   * Get all workouts for the authenticated trainer
   */
  async getWorkouts(): Promise<ApiResponse> {
    return this.request('/api/workouts');
  }

  /**
   * Create a new workout
   */
  async createWorkout(data: CreateWorkoutInput): Promise<ApiResponse> {
    // Convert frontend format to backend format
    const backendData = {
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.durationMinutes,
      scheduledDays: data.scheduledDays,
      exercises: data.exercises.map((ex, index) => ({
        exercise_id: ex.exerciseId,
        order: index + 1,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.restSeconds,
        notes: ex.notes,
      })),
    };

    return this.request('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  /**
   * Assign a workout to a client
   */
  async assignWorkout(data: {
    workout_id: number;
    client_id: number;
    scheduled_date?: string;
    notes?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Assign a workout to multiple clients
   */
  async assignWorkoutToClients(workoutId: number, clientIds: string[], notes?: string): Promise<ApiResponse[]> {
    const assignments = await Promise.all(
      clientIds.map((clientId) =>
        this.assignWorkout({
          workout_id: workoutId,
          client_id: parseInt(clientId),
          notes,
        })
      )
    );
    return assignments;
  }
}

// ==================== TYPE DEFINITIONS ====================

export interface Exercise {
  id: string;
  externalId?: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl?: string;
  videoUrl?: string;
  instructions?: string[];
  isCustom: boolean;
  trainerId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  status: string;
  is_active?: boolean;
  created_at?: string;
  createdAt?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  goals?: string;
  adherence?: number;
  lastActivity?: string;
  workoutsCompleted?: number;
  workoutsAssigned?: number;
}

export interface CreateClientInput {
  email: string;
  name: string;
  phone?: string;
  notes?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  goals?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface CreateWorkoutInput {
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
  durationMinutes?: number;
  scheduledDays?: number[];
  exercises: WorkoutExercise[];
}

export interface ExerciseFilters {
  search?: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  custom_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface ExerciseFiltersMetadata {
  bodyParts: string[];
  targets: string[];
  equipment: string[];
}

export interface SyncStats {
  synced: number;
  updated: number;
  errors: number;
  total: number;
}

export interface CreateExerciseData {
  name: string;
  bodyPart: string;
  equipment: string;
  target?: string;
  gifUrl?: string;
  videoUrl?: string;
  instructions?: string[];
}

// Export singleton instance
export const api = new ApiClient();
export default api;

// Export convenience functions

// Exercises
export const fetchExercises = (filters?: ExerciseFilters) => api.getExercises(filters);
export const fetchExerciseFilters = () => api.getExerciseFilters();
export const syncExercises = (limit?: number) => api.syncExercises(limit);
export const createCustomExercise = (data: CreateExerciseData) => api.createCustomExercise(data);
export const updateCustomExercise = (id: string, data: Partial<CreateExerciseData>) => api.updateCustomExercise(id, data);
export const deleteCustomExercise = (id: string) => api.deleteCustomExercise(id);

// Clients
export const fetchClients = (params?: { active?: boolean }) => api.getClients(params);
export const fetchClient = (clientId: number | string) => api.getClient(clientId);
export const createClient = (data: CreateClientInput) => api.createClient(data);
export const updateClient = (clientId: number | string, data: Partial<CreateClientInput> & { is_active?: boolean }) => api.updateClient(clientId, data);
export const deleteClient = (clientId: number | string) => api.deleteClient(clientId);
export const inviteClient = (clientId: number | string) => api.inviteClient(clientId);

// Workouts
export const createWorkout = (data: CreateWorkoutInput) => api.createWorkout(data);
export const assignWorkout = (data: { workout_id: number; client_id: number; scheduled_date?: string; notes?: string }) => api.assignWorkout(data);
export const assignWorkoutToClients = (workoutId: number, clientIds: string[], notes?: string) => api.assignWorkoutToClients(workoutId, clientIds, notes);

// ==================== ANALYTICS TYPES AND FUNCTIONS ====================

export interface ClientAdherence {
  clientId: string;
  name: string;
  adherence: number;
  workoutsCompleted: number;
  workoutsAssigned: number;
}

export interface WeeklyActivity {
  date: string;
  completed: number;
}

export interface AnalyticsData {
  totalClients: number;
  activeClients: number;
  avgAdherence: number;
  workoutsThisWeek: number;
  clientsAdherence: ClientAdherence[];
  weeklyActivity: WeeklyActivity[];
}

export const fetchTrainerAnalytics = async (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'week'): Promise<AnalyticsData> => {
  try {
    const response = await api['request']<AnalyticsData>(`/api/analytics?time_range=${timeRange}`);
    return response.data || response as any;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Return empty data structure on error
    return {
      totalClients: 0,
      activeClients: 0,
      avgAdherence: 0,
      workoutsThisWeek: 0,
      clientsAdherence: [],
      weeklyActivity: [],
    };
  }
};
