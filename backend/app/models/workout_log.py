"""
WorkoutLog Model - Registro de ejercicios completados
"""
from app import db
from datetime import datetime
from sqlalchemy import CheckConstraint, UniqueConstraint


class WorkoutLog(db.Model):
    __tablename__ = 'workout_logs'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('workout_assignments.id', ondelete='CASCADE'), nullable=False, index=True)
    workout_exercise_id = db.Column(db.Integer, db.ForeignKey('workout_exercises.id', ondelete='CASCADE'), nullable=False, index=True)
    set_number = db.Column(db.Integer, nullable=False)
    reps_completed = db.Column(db.Integer, nullable=False)
    weight_used = db.Column(db.Numeric(5, 2))
    rpe = db.Column(db.SmallInteger)  # Rate of Perceived Exertion (1-10)
    notes = db.Column(db.Text)
    logged_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    # Constraints
    __table_args__ = (
        UniqueConstraint('assignment_id', 'workout_exercise_id', 'set_number', name='uq_assignment_exercise_set'),
        CheckConstraint('set_number >= 1', name='check_set_number_positive'),
        CheckConstraint('reps_completed >= 0', name='check_reps_completed_positive'),
        CheckConstraint('weight_used >= 0', name='check_weight_used_positive'),
        CheckConstraint('rpe >= 1 AND rpe <= 10', name='check_rpe_range'),
    )

    # Relationships
    assignment = db.relationship('WorkoutAssignment', back_populates='logs')
    workout_exercise = db.relationship('WorkoutExercise', back_populates='logs')

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'assignment_id': self.assignment_id,
            'workout_exercise_id': self.workout_exercise_id,
            'set_number': self.set_number,
            'reps_completed': self.reps_completed,
            'weight_used': float(self.weight_used) if self.weight_used else None,
            'rpe': self.rpe,
            'notes': self.notes,
            'logged_at': self.logged_at.isoformat() if self.logged_at else None
        }

    def __repr__(self):
        return f'<WorkoutLog assignment={self.assignment_id} set={self.set_number}>'
