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

    # Invitation tracking
    invite_token = db.Column(db.String(255))  # JWT token for registration link
    invite_sent_at = db.Column(db.DateTime)
    registered_at = db.Column(db.DateTime)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trainer = db.relationship('Trainer', back_populates='clients')
    workout_logs = db.relationship('WorkoutLog', back_populates='client', lazy='dynamic', cascade='all, delete-orphan')

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
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'trainer_id': self.trainer_id,
            'phone': self.phone,
            'notes': self.notes,
            'is_active': self.is_active,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

        if include_stats:
            total_logs = self.workout_logs.count()
            data['total_workouts_completed'] = total_logs

        return data

    def __repr__(self):
        return f'<Client {self.email}>'
