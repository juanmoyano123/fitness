"""
WorkoutAssignment Model - Represents a workout assigned to a client
"""
from app import db
from datetime import datetime, timedelta


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

    # Program period tracking (for metrics calculation)
    start_date = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)  # Program start date
    end_date = db.Column(db.DateTime, nullable=True)  # Program end date (calculated)
    expected_sessions = db.Column(db.Integer, nullable=True)  # Expected sessions (days_per_week × weeks)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workout = db.relationship('Workout', back_populates='assignments')
    client = db.relationship('Client', back_populates='assignments')
    trainer = db.relationship('Trainer', back_populates='assignments')
    # One-to-many with WorkoutLogs (one log per set of each exercise)
    workout_logs = db.relationship('WorkoutLog', back_populates='assignment', lazy='dynamic', cascade='all, delete-orphan')

    def calculate_program_metrics(self):
        """Calculate end_date and expected_sessions based on workout.program_duration_weeks"""
        if not self.workout or not self.workout.program_duration_weeks:
            return

        # Get scheduled days - use own value or inherit from workout
        days = self.scheduled_days if self.scheduled_days is not None else self.workout.scheduled_days
        if not days:
            return

        # Parse scheduled days: "0,2,4" -> 3 days per week
        scheduled_days_list = days.split(',')
        days_per_week = len(scheduled_days_list)

        # Calculate expected sessions
        self.expected_sessions = days_per_week * self.workout.program_duration_weeks

        # Calculate end date
        if self.start_date:
            self.end_date = self.start_date + timedelta(weeks=self.workout.program_duration_weeks)

    def get_adherence_percentage(self):
        """Calculate program adherence (completed_sessions / expected_sessions × 100)"""
        if not self.expected_sessions or self.expected_sessions == 0:
            return None

        # Count completed workout logs for this assignment
        # WorkoutLog has status field: 'completed', 'in_progress', 'skipped'
        completed_count = self.workout_logs.filter_by(status='completed').count()

        if completed_count == 0:
            return 0.0

        return round((completed_count / self.expected_sessions) * 100, 1)

    def get_time_progress_percentage(self):
        """Calculate time progress (elapsed_days / total_days × 100)"""
        if not self.start_date or not self.end_date:
            return None

        now = datetime.utcnow()
        total_days = (self.end_date - self.start_date).days
        elapsed_days = (now - self.start_date).days

        if total_days == 0:
            return 0.0

        # Clamp between 0 and 100
        progress = (elapsed_days / total_days) * 100
        return round(min(max(progress, 0), 100), 1)

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
            # NEW: Program period metrics
            'startDate': self.start_date.isoformat() if self.start_date else None,
            'endDate': self.end_date.isoformat() if self.end_date else None,
            'expectedSessions': self.expected_sessions,
            'adherencePercentage': self.get_adherence_percentage(),
            'timeProgressPercentage': self.get_time_progress_percentage(),
        }

        if include_workout and self.workout:
            data['workout'] = self.workout.to_dict(include_exercises=True)

        return data

    def __repr__(self):
        return f'<WorkoutAssignment workout={self.workout_id} client={self.client_id} status={self.status}>'
