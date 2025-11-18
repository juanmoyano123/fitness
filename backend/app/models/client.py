"""
Client Model - Represents a client/athlete being trained
"""
from app import db
from datetime import datetime, timedelta
import bcrypt


class Client(db.Model):
    """Client/Athlete user model"""
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255))  # Optional - can be invited without password
    name = db.Column(db.String(100), nullable=False)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'), nullable=False, index=True)

    # Client details
    phone = db.Column(db.String(20))
    notes = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)

    # Additional fields for frontend compatibility (FASE 1)
    gender = db.Column(db.String(30))  # "male" | "female" | "other" | "prefer-not-to-say"
    age = db.Column(db.Integer)
    goals = db.Column(db.Text)
    avatar_url = db.Column('avatar_url', db.String(500))  # URL to avatar image (matches schema.sql)

    # Invitation tracking
    invite_token = db.Column(db.String(255))  # JWT token for registration link
    invite_sent_at = db.Column(db.DateTime)
    registered_at = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trainer = db.relationship('Trainer', back_populates='clients')
    assignments = db.relationship('WorkoutAssignment', back_populates='client', lazy='dynamic', cascade='all, delete-orphan')
    # Note: workout_logs accessed via assignments.workout_logs (schema.sql structure)

    def set_password(self, password: str):
        """Hash and set password using bcrypt with cost factor 12"""
        salt = bcrypt.gensalt(rounds=12)
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Verify password against stored hash"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self, include_stats=False, stats_period_days=None):
        """
        Convert client to dictionary representation

        Args:
            include_stats: Include workout statistics
            stats_period_days: Period for stats calculation (None = all time, e.g. 7, 30)
        """
        # Calculate stats
        if include_stats:
            # Import here to avoid circular imports
            from app.models.workout_assignment import WorkoutAssignment

            # Filter by period if specified (for FASE 5 analytics compatibility)
            if stats_period_days:
                period_start = datetime.utcnow() - timedelta(days=stats_period_days)
                total_assigned = self.assignments.filter(
                    WorkoutAssignment.assigned_date >= period_start
                ).count()
                completed_assigned = self.assignments.filter_by(
                    status='completed'
                ).filter(
                    WorkoutAssignment.assigned_date >= period_start
                ).count()
            else:
                # All time stats (default for FASE 1 compatibility)
                total_assigned = self.assignments.count()
                completed_assigned = self.assignments.filter_by(status='completed').count()

            # total_logs same as completed_assigned (schema.sql structure)
            total_logs = completed_assigned

            # Calculate adherence (compatible with FASE 1 mock and FASE 5 analytics)
            adherence = (completed_assigned / total_assigned * 100) if total_assigned > 0 else 0

            # Get last activity from completed assignments (compatible with FASE 5 analytics)
            last_assignment = self.assignments.filter(
                WorkoutAssignment.completed_at.isnot(None)
            ).order_by(
                WorkoutAssignment.completed_at.desc()
            ).first()

            if last_assignment and last_assignment.completed_at:
                delta = datetime.utcnow() - last_assignment.completed_at
                if delta.days == 0:
                    hours = delta.seconds // 3600
                    if hours == 0:
                        last_activity = "Hace minutos"
                    else:
                        last_activity = "Hace {} horas".format(hours)
                elif delta.days == 1:
                    last_activity = "Hace 1 día"
                else:
                    last_activity = "Hace {} días".format(delta.days)
            else:
                last_activity = "Nunca"
        else:
            total_logs = 0
            total_assigned = 0
            adherence = 0
            last_activity = "Nunca"

        data = {
            'id': self.id,  # Keep as int for backend compatibility
            'email': self.email,
            'name': self.name,
            'trainer_id': self.trainer_id,
            'phone': self.phone,
            'notes': self.notes,
            'is_active': self.is_active,
            'status': 'active' if self.is_active else 'archived',  # FASE 1 compatibility
            'gender': self.gender,
            'age': self.age,
            'goals': self.goals,
            'avatar': self.avatar_url,  # Frontend expects 'avatar'
            'avatar_url': self.avatar_url,  # Backend compatibility
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,  # FASE 1 compatibility
        }

        if include_stats:
            data['total_workouts_completed'] = total_logs
            data['workoutsCompleted'] = total_logs  # FASE 1 compatibility
            data['workoutsAssigned'] = total_assigned  # FASE 1 compatibility
            data['adherence'] = round(adherence, 0)  # FASE 1 compatibility
            data['lastActivity'] = last_activity  # FASE 1 compatibility

        return data

    def __repr__(self):
        return f'<Client {self.email}>'
