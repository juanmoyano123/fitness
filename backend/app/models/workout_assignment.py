"""
WorkoutAssignment Model - Asignación de workouts a clientes
"""
from app import db
from datetime import datetime, date
from sqlalchemy import CheckConstraint, UniqueConstraint


class WorkoutAssignment(db.Model):
    __tablename__ = 'workout_assignments'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id', ondelete='CASCADE'), nullable=False, index=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id', ondelete='CASCADE'), nullable=False, index=True)
    assigned_date = db.Column(db.Date, nullable=False, default=date.today, index=True)
    status = db.Column(db.String(50), default='pending', index=True)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Constraints
    __table_args__ = (
        UniqueConstraint('workout_id', 'client_id', 'assigned_date', name='uq_workout_client_date'),
        CheckConstraint("status IN ('pending', 'in_progress', 'completed', 'skipped')", name='check_status_values'),
        db.Index('idx_assignments_client_date', 'client_id', 'assigned_date'),
    )

    # Relationships
    workout = db.relationship('Workout', back_populates='assignments')
    client = db.relationship('Client', back_populates='workout_assignments')
    logs = db.relationship('WorkoutLog', back_populates='assignment', cascade='all, delete-orphan')

    def to_dict(self, include_workout=False, include_logs=False):
        """Convert to dictionary for JSON serialization"""
        result = {
            'id': self.id,
            'workout_id': self.workout_id,
            'client_id': self.client_id,
            'assigned_date': self.assigned_date.isoformat() if self.assigned_date else None,
            'status': self.status,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

        if include_workout and self.workout:
            result['workout'] = self.workout.to_dict(include_exercises=True)

        if include_logs:
            result['logs'] = [log.to_dict() for log in self.logs]

        return result

    def __repr__(self):
        return f'<WorkoutAssignment workout={self.workout_id} client={self.client_id} status={self.status}>'
