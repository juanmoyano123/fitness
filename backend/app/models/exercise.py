"""
Exercise Model - Represents an exercise from the exercise database
"""
from app import db
from datetime import datetime


class Exercise(db.Model):
    """Exercise model - populated from ExerciseDB API"""
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String(50), unique=True)  # ID from ExerciseDB API
    name = db.Column(db.String(200), nullable=False, index=True)
    body_part = db.Column(db.String(100))
    equipment = db.Column(db.String(100))
    target = db.Column(db.String(100))
    gif_url = db.Column(db.String(500))
    instructions = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercise', lazy='dynamic')

    def to_dict(self):
        """Convert exercise to dictionary representation"""
        return {
            'id': self.id,
            'external_id': self.external_id,
            'name': self.name,
            'body_part': self.body_part,
            'equipment': self.equipment,
            'target': self.target,
            'gif_url': self.gif_url,
            'instructions': self.instructions,
        }

    def __repr__(self):
        return f'<Exercise {self.name}>'
