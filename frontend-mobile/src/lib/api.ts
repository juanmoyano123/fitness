/**
 * API Client for FitCompass Pro Mobile - F-016
 * Handles all communication with backend API
 */

// For development, update this to your local IP or production URL
const API_BASE = 'http://localhost:5000/api';

// Demo client ID (will be replaced with JWT auth in Phase 6)
const DEMO_CLIENT_ID = 'client-1';

/**
 * Get auth headers
 */
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
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
// WORKOUT ASSIGNMENTS API
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

export interface AssignmentExercise {
  id: string;
  exerciseId: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  orderIndex: number;
  logs: SetLog[];
}

export interface SetLog {
  id: string;
  setNumber: number;
  repsCompleted?: number;
  weightUsed?: number;
  loggedAt: string;
}

export interface AssignmentDetail extends WorkoutAssignment {
  exercises: AssignmentExercise[];
}

/**
 * Fetch workout assignments for current client
 */
export async function fetchMyWorkouts(): Promise<WorkoutAssignment[]> {
  const response = await fetch(`${API_BASE}/assignments?clientId=${DEMO_CLIENT_ID}`, {
    headers: getHeaders()
  });
  return handleResponse<WorkoutAssignment[]>(response);
}

/**
 * Get assignment details with exercises and logs
 */
export async function getAssignmentDetail(assignmentId: string): Promise<AssignmentDetail> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}`, {
    headers: getHeaders()
  });
  return handleResponse<AssignmentDetail>(response);
}

/**
 * Start a workout
 */
export async function startWorkout(assignmentId: string): Promise<{
  id: string;
  status: string;
  startedAt: string;
}> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/start`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(response);
}

/**
 * Log a completed set
 */
export async function logSet(
  assignmentId: string,
  data: {
    workoutExerciseId: string;
    setNumber: number;
    repsCompleted?: number;
    weightUsed?: number;
  }
): Promise<SetLog> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/logs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<SetLog>(response);
}

/**
 * Complete a workout
 */
export async function completeWorkout(assignmentId: string): Promise<{
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

/**
 * Skip a workout
 */
export async function skipWorkout(assignmentId: string): Promise<{
  id: string;
  status: string;
}> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/skip`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(response);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if API is reachable
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE.replace('/api', '')}/health`, {
      headers: getHeaders()
    });
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
