/**
 * Mock data for workout detail
 * Used for F-009: UI Detalle Workout y Logging
 */

import { WorkoutDetail } from '../types/workout';

export const MOCK_WORKOUT_DETAIL: WorkoutDetail = {
  id: 'workout-1',
  name: 'Full Body Strength A',
  assignedDate: '2025-11-17',
  status: 'pending',
  exercises: [
    {
      id: 'we-1',
      exerciseId: 'ex-1',
      exerciseName: 'Barbell Squat',
      gifUrl: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
      targetSets: 4,
      targetReps: 8,
      targetWeight: 60,
      restSeconds: 90,
      logs: []
    },
    {
      id: 'we-2',
      exerciseId: 'ex-2',
      exerciseName: 'Bench Press',
      gifUrl: 'https://media.giphy.com/media/l0HlDWQCCZHHKxX3O/giphy.gif',
      targetSets: 4,
      targetReps: 8,
      targetWeight: 50,
      restSeconds: 90,
      logs: []
    },
    {
      id: 'we-3',
      exerciseId: 'ex-3',
      exerciseName: 'Deadlift',
      gifUrl: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
      targetSets: 3,
      targetReps: 5,
      targetWeight: 80,
      restSeconds: 120,
      logs: []
    },
    {
      id: 'we-4',
      exerciseId: 'ex-4',
      exerciseName: 'Pull-ups',
      gifUrl: 'https://media.giphy.com/media/xT8qBu8F2D8mZQnpVC/giphy.gif',
      targetSets: 3,
      targetReps: 10,
      restSeconds: 90,
      logs: []
    },
    {
      id: 'we-5',
      exerciseId: 'ex-5',
      exerciseName: 'Plank Hold',
      gifUrl: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
      targetSets: 3,
      targetReps: 60, // 60 segundos
      restSeconds: 60,
      logs: []
    },
  ]
};

/**
 * Mock workout details for different workouts
 */
export const MOCK_WORKOUT_DETAILS: Record<string, WorkoutDetail> = {
  'workout-1': MOCK_WORKOUT_DETAIL,
  'workout-2': {
    id: 'workout-2',
    name: 'Upper Body Push',
    assignedDate: '2025-11-18',
    status: 'pending',
    exercises: [
      {
        id: 'we-6',
        exerciseId: 'ex-6',
        exerciseName: 'Overhead Press',
        gifUrl: 'https://media.giphy.com/media/xT8qBeEqnpdMbIbtVK/giphy.gif',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 40,
        restSeconds: 90,
        logs: []
      },
      {
        id: 'we-7',
        exerciseId: 'ex-7',
        exerciseName: 'Incline Dumbbell Press',
        gifUrl: 'https://media.giphy.com/media/3o7TKNWLhfgWIaZo64/giphy.gif',
        targetSets: 3,
        targetReps: 10,
        targetWeight: 22.5,
        restSeconds: 90,
        logs: []
      },
      {
        id: 'we-8',
        exerciseId: 'ex-8',
        exerciseName: 'Dips',
        gifUrl: 'https://media.giphy.com/media/xT8qBfGWfB9WMg5fJm/giphy.gif',
        targetSets: 3,
        targetReps: 12,
        restSeconds: 90,
        logs: []
      },
      {
        id: 'we-9',
        exerciseId: 'ex-9',
        exerciseName: 'Lateral Raises',
        gifUrl: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
        targetSets: 3,
        targetReps: 15,
        targetWeight: 10,
        restSeconds: 60,
        logs: []
      },
      {
        id: 'we-10',
        exerciseId: 'ex-10',
        exerciseName: 'Tricep Pushdowns',
        gifUrl: 'https://media.giphy.com/media/l0HlDWQCCZHHKxX3O/giphy.gif',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 30,
        restSeconds: 60,
        logs: []
      },
      {
        id: 'we-11',
        exerciseId: 'ex-11',
        exerciseName: 'Face Pulls',
        gifUrl: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
        targetSets: 3,
        targetReps: 15,
        targetWeight: 20,
        restSeconds: 60,
        logs: []
      },
    ]
  },
};

/**
 * Helper to get workout detail by ID
 */
export const getWorkoutDetailById = (workoutId: string): WorkoutDetail => {
  return MOCK_WORKOUT_DETAILS[workoutId] || MOCK_WORKOUT_DETAIL;
};
