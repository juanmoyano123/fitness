"""
Exercise Model - Biblioteca de ejercicios (ExerciseDB + custom)
"""
from app import db
from datetime import datetime
import json


class Exercise(db.Model):
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(255), nullable=False)
    body_part = db.Column(db.String(100), index=True)
    equipment = db.Column(db.String(100), index=True)
    gif_url = db.Column(db.Text)
    target_muscle = db.Column(db.String(100))
    _secondary_muscles = db.Column('secondary_muscles', db.Text)  # JSON string for SQLite compatibility
    instructions = db.Column(db.Text)
    is_custom = db.Column(db.Boolean, default=False)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id', ondelete='CASCADE'), index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def secondary_muscles(self):
        """Get secondary_muscles as list"""
        if self._secondary_muscles:
            try:
                return json.loads(self._secondary_muscles)
            except:
                return []
        return []

    @secondary_muscles.setter
    def secondary_muscles(self, value):
        """Set secondary_muscles from list"""
        if value:
            self._secondary_muscles = json.dumps(value)
        else:
            self._secondary_muscles = None

    # Relationships
    trainer = db.relationship('Trainer', back_populates='custom_exercises')
    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercise', cascade='all, delete-orphan')

    # Check constraint: custom exercises must have trainer_id
    __table_args__ = (
        db.CheckConstraint(
            '(is_custom = FALSE AND trainer_id IS NULL) OR (is_custom = TRUE AND trainer_id IS NOT NULL)',
            name='check_custom_trainer'
        ),
    )

    @classmethod
    def upsert(cls, external_id, name, body_part, equipment, gif_url, target_muscle=None, secondary_muscles=None, instructions=None):
        """
        Upsert exercise from ExerciseDB API
        Creates if doesn't exist, updates if exists
        """
        exercise = cls.query.filter_by(external_id=external_id).first()

        if exercise:
            # Update existing
            exercise.name = name
            exercise.body_part = body_part
            exercise.equipment = equipment
            exercise.gif_url = gif_url
            exercise.target_muscle = target_muscle
            exercise.secondary_muscles = secondary_muscles
            exercise.instructions = instructions
            exercise.updated_at = datetime.utcnow()
        else:
            # Create new
            exercise = cls(
                external_id=external_id,
                name=name,
                body_part=body_part,
                equipment=equipment,
                gif_url=gif_url,
                target_muscle=target_muscle,
                secondary_muscles=secondary_muscles,
                instructions=instructions,
                is_custom=False
            )
            db.session.add(exercise)

        return exercise

    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'external_id': self.external_id,
            'name': self.name,
            'body_part': self.body_part,
            'equipment': self.equipment,
            'gif_url': self.gif_url,
            'target_muscle': self.target_muscle,
            'secondary_muscles': self.secondary_muscles,
            'instructions': self.instructions,
            'is_custom': self.is_custom,
            'trainer_id': self.trainer_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Exercise {self.name}>'
