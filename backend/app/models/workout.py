"""
Workout Model - Represents a workout template created by a trainer
"""
from app import db
from datetime import datetime


class Workout(db.Model):
    """Workout template model"""
    __tablename__ = 'workouts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=False, index=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trainer = db.relationship('Trainer', back_populates='workouts')
    exercises = db.relationship('WorkoutExercise', back_populates='workout', lazy='dynamic', cascade='all, delete-orphan')
    logs = db.relationship('WorkoutLog', back_populates='workout', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_exercises=False):
        """Convert workout to dictionary representation"""
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'trainer_id': self.trainer_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

        if include_exercises:
            data['exercises'] = [we.to_dict() for we in self.exercises.all()]

        return data

    def __repr__(self):
        return f'<Workout {self.name}>'
