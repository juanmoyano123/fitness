"""
Trainer Model - Represents a fitness trainer/coach
"""
from app import db
from datetime import datetime
import bcrypt


class Trainer(db.Model):
    """Trainer/Coach user model with authentication"""
    __tablename__ = 'trainers'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    business_name = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    clients = db.relationship('Client', back_populates='trainer', lazy='dynamic', cascade='all, delete-orphan')
    workouts = db.relationship('Workout', back_populates='trainer', lazy='dynamic', cascade='all, delete-orphan')
    assignments = db.relationship('WorkoutAssignment', back_populates='trainer', lazy='dynamic', cascade='all, delete-orphan')

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
        """Convert trainer to dictionary representation"""
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'business_name': self.business_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

        if include_stats:
            data['total_clients'] = self.clients.count()
            data['total_workouts'] = self.workouts.count()

        return data

    def __repr__(self):
        return f'<Trainer {self.email}>'
