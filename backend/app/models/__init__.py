"""
FitCompass Pro - Database Models
"""
from app.models.trainer import Trainer
from app.models.client import Client
from app.models.workout import Workout
from app.models.exercise import Exercise
from app.models.workout_exercise import WorkoutExercise
from app.models.workout_assignment import WorkoutAssignment
from app.models.workout_log import WorkoutLog

__all__ = [
    'Trainer',
    'Client',
    'Workout',
    'Exercise',
    'WorkoutExercise',
    'WorkoutAssignment',
    'WorkoutLog'
]
