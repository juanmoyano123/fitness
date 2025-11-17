/**
 * Type definitions for workouts and exercises
 */

export type WorkoutStatus = 'pending' | 'in_progress' | 'completed';

export interface WorkoutAssignment {
  id: string;
  workoutId: string;
  workoutName: string;
  assignedDate: string; // YYYY-MM-DD
  status: WorkoutStatus;
  estimatedDuration: number; // Minutes
  exerciseCount: number;
  thumbnailUrl?: string;
  completedAt?: Date;
}

export interface ExerciseLog {
  setNumber: number;
  repsCompleted: number;
  weightUsed: number; // kg
  completed: boolean;
  timestamp?: Date;
}

export interface WorkoutExerciseDetail {
  id: string;
  exerciseId: string;
  exerciseName: string;
  gifUrl: string;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  restSeconds: number;
  logs: ExerciseLog[];
}

export interface WorkoutDetail {
  id: string;
  name: string;
  assignedDate: string;
  status: WorkoutStatus;
  exercises: WorkoutExerciseDetail[];
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // Minutes
}
