"""
WorkoutExercise Model - Ejercicios dentro de workouts con configuración
"""
from app import db
from datetime import datetime
from sqlalchemy import CheckConstraint, UniqueConstraint


class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id', ondelete='CASCADE'), nullable=False, index=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id', ondelete='CASCADE'), nullable=False, index=True)
    order_index = db.Column(db.Integer, nullable=False)
    sets = db.Column(db.Integer, default=3)
    reps = db.Column(db.Integer, default=10)
    weight = db.Column(db.Numeric(5, 2))
    rest_seconds = db.Column(db.Integer, default=60)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Constraints
    __table_args__ = (
        UniqueConstraint('workout_id', 'order_index', name='uq_workout_order'),
        CheckConstraint('sets >= 1 AND sets <= 10', name='check_sets_range'),
        CheckConstraint('reps >= 1 AND reps <= 100', name='check_reps_range'),
        CheckConstraint('weight >= 0', name='check_weight_positive'),
        CheckConstraint('rest_seconds >= 0', name='check_rest_positive'),
    )

    # Relationships
    workout = db.relationship('Workout', back_populates='workout_exercises')
    exercise = db.relationship('Exercise', back_populates='workout_exercises')
    logs = db.relationship('WorkoutLog', back_populates='workout_exercise', cascade='all, delete-orphan')

    def to_dict(self, include_exercise=True):
        """Convert to dictionary for JSON serialization"""
        result = {
            'id': self.id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id,
            'order_index': self.order_index,
            'sets': self.sets,
            'reps': self.reps,
            'weight': float(self.weight) if self.weight else None,
            'rest_seconds': self.rest_seconds,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

        if include_exercise and self.exercise:
            result['exercise'] = self.exercise.to_dict()

        return result

    def __repr__(self):
        return f'<WorkoutExercise workout_id={self.workout_id} order={self.order_index}>'
