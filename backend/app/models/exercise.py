"""
Exercise Model - Represents an exercise from the exercise database
"""
from app import db
from datetime import datetime


class Exercise(db.Model):
    """Exercise model - populated from ExerciseDB API"""
    __tablename__ = 'exercises'

    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String(50), unique=True)  # ID from ExerciseDB API
    name = db.Column(db.String(200), nullable=False, index=True)
    body_part = db.Column(db.String(100))
    equipment = db.Column(db.String(100))
    gif_url = db.Column(db.String(500))
    target_muscle = db.Column('target_muscle', db.String(100))  # Matches schema.sql
    secondary_muscles = db.Column(db.ARRAY(db.String))  # Matches schema.sql (PostgreSQL array)
    instructions = db.Column(db.Text)
    is_custom = db.Column(db.Boolean, default=False)  # Matches schema.sql
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id'))  # For custom exercises (schema.sql)

    # Additional fields for frontend compatibility (FASE 1 & 2)
    name_es = db.Column(db.String(200))  # Spanish name
    category = db.Column(db.String(50))  # "strength" | "cardio" | "flexibility" | "balance"
    muscle_group = db.Column(db.String(100))  # Display name for frontend
    difficulty = db.Column(db.String(20))  # "beginner" | "intermediate" | "advanced"
    video_url = db.Column(db.String(500))  # Optional video URL

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercise', lazy='dynamic')
    trainer = db.relationship('Trainer', backref='custom_exercises')  # For custom exercises

    def to_dict(self):
        """Convert exercise to dictionary representation"""
        # Equipment as array (frontend expects array)
        equipment_array = [self.equipment] if self.equipment else []

        return {
            'id': self.id,
            'external_id': self.external_id,
            'name': self.name,
            'nameEs': self.name_es or self.name,  # FASE 1 compatibility
            'body_part': self.body_part,
            'category': self.category,  # FASE 1 compatibility
            'muscleGroup': self.muscle_group or self.body_part or self.target_muscle,  # FASE 1 compatibility
            'equipment': equipment_array,  # FASE 1 compatibility (array)
            'target': self.target_muscle,  # Backward compatibility
            'targetMuscle': self.target_muscle,  # Schema.sql field
            'secondaryMuscles': self.secondary_muscles or [],  # Schema.sql field
            'difficulty': self.difficulty,  # FASE 1 compatibility
            'gif_url': self.gif_url,
            'gifUrl': self.gif_url,  # FASE 1 compatibility
            'videoUrl': self.video_url,  # FASE 1 compatibility
            'instructions': self.instructions,
            'isCustom': self.is_custom,  # Schema.sql field
            'trainerId': self.trainer_id if self.is_custom else None,  # Schema.sql field
        }

    def __repr__(self):
        return f'<Exercise {self.name}>'
