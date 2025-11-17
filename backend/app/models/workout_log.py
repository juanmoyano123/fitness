"""
WorkoutLog Model - Represents a completed workout session by a client
"""
from app import db
from datetime import datetime


class WorkoutLog(db.Model):
    """Workout log model - tracks client workout completion"""
    __tablename__ = 'workout_logs'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False, index=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False, index=True)

    # Completion tracking
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    duration_seconds = db.Column(db.Integer)

    # Performance data (JSON stored as text)
    # Format: [{"exercise_id": 1, "sets": [{"reps": 10, "weight": 50}, ...]}, ...]
    performance_data = db.Column(db.Text)

    notes = db.Column(db.Text)

    # Relationships
    client = db.relationship('Client', back_populates='workout_logs')
    workout = db.relationship('Workout', back_populates='logs')

    def to_dict(self):
        """Convert workout log to dictionary representation"""
        import json

        return {
            'id': self.id,
            'client_id': self.client_id,
            'workout_id': self.workout_id,
            'workout': self.workout.to_dict() if self.workout else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_seconds': self.duration_seconds,
            'performance_data': json.loads(self.performance_data) if self.performance_data else [],
            'notes': self.notes,
        }

    def __repr__(self):
        return f'<WorkoutLog client={self.client_id} workout={self.workout_id}>'
