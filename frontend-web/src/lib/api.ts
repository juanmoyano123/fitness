/**
 * API Client for FitCompass Pro - F-015
 * Handles all communication with backend API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Demo trainer ID (will be replaced with JWT auth in Phase 6)
const DEMO_TRAINER_ID = 'trainer-demo-1';

/**
 * Get auth headers
 */
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Trainer-Id': DEMO_TRAINER_ID,
    // TODO: Add JWT token in Phase 6
    // 'Authorization': `Bearer ${getToken()}`
  };
}

/**
 * Handle API errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// ============================================================================
// CLIENT API
// ============================================================================

export interface Client {
  id: string;
  name: string;
  email: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  age?: number;
  goals?: string;
  avatar?: string;
  adherence: number;
  lastActivity: string;
  status: "active" | "archived";
  createdAt: string;
  workoutsCompleted: number;
  workoutsAssigned: number;
}

export interface CreateClientInput {
  name: string;
  email: string;
  gender?: string;
  age?: number;
  goals?: string;
  avatar?: string;
}

export async function fetchClients(): Promise<Client[]> {
  const response = await fetch(`${API_BASE}/clients`, {
    headers: getHeaders()
  });
  return handleResponse<Client[]>(response);
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  const response = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Client>(response);
}

export async function getClient(clientId: string): Promise<Client> {
  const response = await fetch(`${API_BASE}/clients/${clientId}`, {
    headers: getHeaders()
  });
  return handleResponse<Client>(response);
}

export async function updateClient(clientId: string, data: Partial<CreateClientInput>): Promise<Client> {
  const response = await fetch(`${API_BASE}/clients/${clientId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Client>(response);
}

export async function deleteClient(clientId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/clients/${clientId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  await handleResponse<{ message: string }>(response);
}

// ============================================================================
// EXERCISE API
// ============================================================================

export interface Exercise {
  id: string;
  externalId?: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl: string;
  instructions: string[];
  isCustom: boolean;
}

export interface ExerciseFilters {
  search?: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  limit?: number;
  offset?: number;
}

export async function fetchExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.bodyPart) params.append('bodyPart', filters.bodyPart);
  if (filters?.target) params.append('target', filters.target);
  if (filters?.equipment) params.append('equipment', filters.equipment);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const url = `${API_BASE}/exercises${params.toString() ? `?${params}` : ''}`;
  const response = await fetch(url, {
    headers: getHeaders()
  });
  return handleResponse<Exercise[]>(response);
}

export async function getExerciseFilters(): Promise<{
  bodyParts: string[];
  targets: string[];
  equipment: string[];
}> {
  const response = await fetch(`${API_BASE}/exercises/filters`, {
    headers: getHeaders()
  });
  return handleResponse<{ bodyParts: string[]; targets: string[]; equipment: string[] }>(response);
}

export async function createCustomExercise(data: {
  name: string;
  bodyPart?: string;
  equipment?: string;
  target?: string;
  gifUrl?: string;
  instructions?: string[];
}): Promise<Exercise> {
  const response = await fetch(`${API_BASE}/exercises/custom`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Exercise>(response);
}

// ============================================================================
// WORKOUT API
// ============================================================================

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
  durationMinutes?: number;
  exerciseCount?: number;
  assignmentCount?: number;
  exercises?: WorkoutExercise[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWorkoutInput {
  name: string;
  description?: string;
  category?: string;
  difficulty?: string;
  durationMinutes?: number;
  exercises: WorkoutExercise[];
}

export async function fetchWorkouts(): Promise<Workout[]> {
  const response = await fetch(`${API_BASE}/workouts`, {
    headers: getHeaders()
  });
  return handleResponse<Workout[]>(response);
}

export async function createWorkout(data: CreateWorkoutInput): Promise<Workout> {
  const response = await fetch(`${API_BASE}/workouts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Workout>(response);
}

export async function getWorkout(workoutId: string): Promise<Workout> {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}`, {
    headers: getHeaders()
  });
  return handleResponse<Workout>(response);
}

export async function updateWorkout(workoutId: string, data: Partial<CreateWorkoutInput>): Promise<Workout> {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Workout>(response);
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  await handleResponse<{ message: string }>(response);
}

export async function assignWorkout(workoutId: string, data: {
  clientIds: string[];
  scheduledDate?: string;
}): Promise<{ message: string; assignmentCount: number }> {
  const response = await fetch(`${API_BASE}/workouts/${workoutId}/assign`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<{ message: string; assignmentCount: number }>(response);
}

// ============================================================================
// ASSIGNMENT & LOGGING API
// ============================================================================

export interface WorkoutAssignment {
  id: string;
  workoutId: string;
  workoutName: string;
  description?: string;
  category?: string;
  difficulty?: string;
  durationMinutes?: number;
  exerciseCount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedDate: string;
  scheduledDate?: string;
  startedAt?: string;
  completedAt?: string;
  loggedSets?: number;
}

export async function fetchAssignments(clientId: string): Promise<WorkoutAssignment[]> {
  const response = await fetch(`${API_BASE}/assignments?clientId=${clientId}`, {
    headers: getHeaders()
  });
  return handleResponse<WorkoutAssignment[]>(response);
}

export async function getAssignment(assignmentId: string): Promise<WorkoutAssignment> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}`, {
    headers: getHeaders()
  });
  return handleResponse<WorkoutAssignment>(response);
}

export async function startAssignment(assignmentId: string): Promise<{ id: string; status: string; startedAt: string }> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/start`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse<{ id: string; status: string; startedAt: string }>(response);
}

export async function logSet(assignmentId: string, data: {
  workoutExerciseId: string;
  setNumber: number;
  repsCompleted?: number;
  weightUsed?: number;
}): Promise<{
  id: string;
  setNumber: number;
  repsCompleted?: number;
  weightUsed?: number;
  loggedAt: string;
}> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/logs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function completeAssignment(assignmentId: string): Promise<{
  id: string;
  status: string;
  completedAt: string;
  durationMinutes?: number;
}> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/complete`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(response);
}
