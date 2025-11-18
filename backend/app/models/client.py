"""
Client Model - Clientes de entrenadores
"""
from app import db
from datetime import datetime


class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id', ondelete='CASCADE'), nullable=False, index=True)
    email = db.Column(db.String(255), nullable=False, index=True)
    password_hash = db.Column(db.String(255))
    name = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Unique constraint: trainer can't have two clients with same email
    __table_args__ = (
        db.UniqueConstraint('trainer_id', 'email', name='uq_trainer_client_email'),
    )

    # Relationships
    trainer = db.relationship('Trainer', back_populates='clients')
    workout_assignments = db.relationship('WorkoutAssignment', back_populates='client', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'trainer_id': self.trainer_id,
            'email': self.email,
            'name': self.name,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Client {self.name} ({self.email})>'
