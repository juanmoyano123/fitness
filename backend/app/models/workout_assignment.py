"""
WorkoutAssignment Model - Represents a workout assigned to a client
"""
from app import db
from datetime import datetime


class WorkoutAssignment(db.Model):
    """Workout assignment model - links workouts to clients with status tracking"""
    __tablename__ = 'workout_assignments'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False, index=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False, index=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=False, index=True)

    # Assignment details
    assigned_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    due_date = db.Column(db.DateTime)  # Optional deadline

    # Status tracking
    status = db.Column(
        db.String(20),
        default='pending',
        nullable=False
    )  # pending, in_progress, completed, skipped

    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)

    # Notes from trainer
    notes = db.Column(db.Text)

    # Scheduled days - if null, inherits from workout. Format: "0,2,4" where 0=Mon, 6=Sun
    scheduled_days = db.Column(db.String(50), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workout = db.relationship('Workout', back_populates='assignments')
    client = db.relationship('Client', back_populates='assignments')
    trainer = db.relationship('Trainer', back_populates='assignments')
    # One-to-many with WorkoutLogs (one log per set of each exercise)
    workout_logs = db.relationship('WorkoutLog', back_populates='assignment', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self, include_workout=True):
        """Convert assignment to dictionary representation"""
        # Get scheduled days - use own value or inherit from workout
        days = self.scheduled_days
        if days is None and self.workout:
            days = self.workout.scheduled_days

        data = {
            'id': self.id,
            'workout_id': self.workout_id,
            'client_id': self.client_id,
            'trainer_id': self.trainer_id,
            'assigned_date': self.assigned_date.isoformat() if self.assigned_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'notes': self.notes,
            'scheduledDays': [int(d) for d in days.split(',')] if days else [],
            'scheduledDaysCustom': self.scheduled_days is not None,  # True if client has custom days
        }

        if include_workout and self.workout:
            data['workout'] = self.workout.to_dict(include_exercises=True)

        return data

    def __repr__(self):
        return f'<WorkoutAssignment workout={self.workout_id} client={self.client_id} status={self.status}>'
