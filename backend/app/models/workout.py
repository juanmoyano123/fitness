"""
Workout Model - Rutinas de entrenamiento
"""
from app import db
from datetime import datetime


class Workout(db.Model):
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    is_template = db.Column(db.Boolean, default=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trainer = db.relationship('Trainer', back_populates='workouts')
    workout_exercises = db.relationship('WorkoutExercise', back_populates='workout', cascade='all, delete-orphan', order_by='WorkoutExercise.order_index')
    assignments = db.relationship('WorkoutAssignment', back_populates='workout', cascade='all, delete-orphan')

    def to_dict(self, include_exercises=False):
        """Convert to dictionary for JSON serialization"""
        result = {
            'id': self.id,
            'trainer_id': self.trainer_id,
            'name': self.name,
            'description': self.description,
            'is_template': self.is_template,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

        if include_exercises:
            result['exercises'] = [we.to_dict() for we in self.workout_exercises]

        return result

    def __repr__(self):
        return f'<Workout {self.name}>'
