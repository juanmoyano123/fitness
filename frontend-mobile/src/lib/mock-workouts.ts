/**
 * Mock data for workout assignments
 * Used for F-008: UI Lista Workouts Cliente
 */

import { WorkoutAssignment } from '../types/workout';

export const MOCK_WORKOUT_ASSIGNMENTS: WorkoutAssignment[] = [
  {
    id: 'assign-1',
    workoutId: 'workout-1',
    workoutName: 'Full Body Strength A',
    assignedDate: '2025-11-17', // Hoy
    status: 'pending',
    estimatedDuration: 45,
    exerciseCount: 5,
    thumbnailUrl: 'https://via.placeholder.com/150/37322f/ffffff?text=Squat'
  },
  {
    id: 'assign-2',
    workoutId: 'workout-2',
    workoutName: 'Upper Body Push',
    assignedDate: '2025-11-18', // Mañana
    status: 'pending',
    estimatedDuration: 50,
    exerciseCount: 6,
    thumbnailUrl: 'https://via.placeholder.com/150/37322f/ffffff?text=Bench'
  },
  {
    id: 'assign-3',
    workoutId: 'workout-3',
    workoutName: 'Lower Body',
    assignedDate: '2025-11-20', // Miércoles
    status: 'pending',
    estimatedDuration: 55,
    exerciseCount: 5,
    thumbnailUrl: 'https://via.placeholder.com/150/37322f/ffffff?text=Deadlift'
  },
  {
    id: 'assign-4',
    workoutId: 'workout-4',
    workoutName: 'Cardio HIIT',
    assignedDate: '2025-11-22', // Viernes
    status: 'pending',
    estimatedDuration: 30,
    exerciseCount: 4,
    thumbnailUrl: 'https://via.placeholder.com/150/f59e0b/ffffff?text=HIIT'
  },
  {
    id: 'assign-5',
    workoutId: 'workout-1',
    workoutName: 'Full Body Strength A',
    assignedDate: '2025-11-16', // Ayer - Completado
    status: 'completed',
    estimatedDuration: 45,
    exerciseCount: 5,
    completedAt: new Date('2025-11-16T18:30:00'),
    thumbnailUrl: 'https://via.placeholder.com/150/37322f/ffffff?text=Squat'
  },
  {
    id: 'assign-6',
    workoutId: 'workout-2',
    workoutName: 'Upper Body Push',
    assignedDate: '2025-11-15', // Hace 2 días - Completado
    status: 'completed',
    estimatedDuration: 50,
    exerciseCount: 6,
    completedAt: new Date('2025-11-15T19:00:00'),
    thumbnailUrl: 'https://via.placeholder.com/150/37322f/ffffff?text=Bench'
  },
  {
    id: 'assign-7',
    workoutId: 'workout-5',
    workoutName: 'Core & Mobility',
    assignedDate: '2025-11-14', // En progreso
    status: 'in_progress',
    estimatedDuration: 30,
    exerciseCount: 8,
    thumbnailUrl: 'https://via.placeholder.com/150/0ea5e9/ffffff?text=Core'
  },
];

/**
 * Helper function to get workouts by status
 */
export const getWorkoutsByStatus = (status?: WorkoutAssignment['status']): WorkoutAssignment[] => {
  if (!status) return MOCK_WORKOUT_ASSIGNMENTS;
  return MOCK_WORKOUT_ASSIGNMENTS.filter(w => w.status === status);
};

/**
 * Helper function to get workout by ID
 */
export const getWorkoutById = (id: string): WorkoutAssignment | undefined => {
  return MOCK_WORKOUT_ASSIGNMENTS.find(w => w.id === id);
};
