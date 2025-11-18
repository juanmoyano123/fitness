"""
WorkoutLog Model - Represents a completed SET of an exercise by a client
MATCHES schema.sql: Each row is ONE SET of ONE EXERCISE
"""
from app import db
from datetime import datetime


class WorkoutLog(db.Model):
    """Workout log model - tracks individual sets completed by clients (matches schema.sql)"""
    __tablename__ = 'workout_logs'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('workout_assignments.id', ondelete='CASCADE'), nullable=False, index=True)
    workout_exercise_id = db.Column(db.Integer, db.ForeignKey('workout_exercises.id', ondelete='CASCADE'), nullable=False, index=True)

    # Set tracking (schema.sql structure)
    set_number = db.Column(db.Integer, nullable=False)  # 1-based (1, 2, 3, ...)
    reps_completed = db.Column(db.Integer, nullable=False)  # Actual reps completed
    weight_used = db.Column(db.Numeric(5, 2))  # Actual weight used in kg
    rpe = db.Column(db.SmallInteger)  # Rate of Perceived Exertion (1-10)

    notes = db.Column(db.Text)
    logged_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (schema.sql compliant)
    assignment = db.relationship('WorkoutAssignment', back_populates='workout_logs')
    workout_exercise = db.relationship('WorkoutExercise', backref='logs')

    def to_dict(self):
        """Convert workout log to dictionary representation"""
        return {
            'id': self.id,
            'assignment_id': self.assignment_id,
            'workout_exercise_id': self.workout_exercise_id,
            'set_number': self.set_number,
            'reps_completed': self.reps_completed,
            'weight_used': float(self.weight_used) if self.weight_used else None,
            'rpe': self.rpe,
            'notes': self.notes,
            'logged_at': self.logged_at.isoformat() if self.logged_at else None,
            'exercise': self.workout_exercise.exercise.to_dict() if self.workout_exercise and self.workout_exercise.exercise else None,
        }

    def __repr__(self):
        return f'<WorkoutLog assignment={self.assignment_id} exercise={self.workout_exercise_id} set={self.set_number}>'
