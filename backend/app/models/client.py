"""
Client Model - Represents a client/athlete being trained
"""
from app import db
from datetime import datetime
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
    avatar = db.Column(db.String(500))  # URL to avatar image

    # Invitation tracking
    invite_token = db.Column(db.String(255))  # JWT token for registration link
    invite_sent_at = db.Column(db.DateTime)
    registered_at = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trainer = db.relationship('Trainer', back_populates='clients')
    workout_logs = db.relationship('WorkoutLog', back_populates='client', lazy='dynamic', cascade='all, delete-orphan')
    assignments = db.relationship('WorkoutAssignment', back_populates='client', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password: str):
        """Hash and set password using bcrypt with cost factor 12"""
        salt = bcrypt.gensalt(rounds=12)
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Verify password against stored hash"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self, include_stats=False):
        """Convert client to dictionary representation"""
        from datetime import datetime

        # Calculate stats
        total_logs = self.workout_logs.count() if include_stats else 0
        total_assigned = self.assignments.count() if include_stats else 0
        completed_assigned = self.assignments.filter_by(status='completed').count() if include_stats else 0

        # Calculate adherence (compatible with FASE 1 mock)
        adherence = (completed_assigned / total_assigned * 100) if total_assigned > 0 else 0

        # Get last activity
        last_log = self.workout_logs.order_by(db.desc('completed_at')).first() if include_stats else None
        if last_log and last_log.completed_at:
            delta = datetime.utcnow() - last_log.completed_at
            if delta.days == 0:
                last_activity = "Hace {} horas".format(delta.seconds // 3600)
            else:
                last_activity = "Hace {} días".format(delta.days)
        else:
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
            'avatar': self.avatar,
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
