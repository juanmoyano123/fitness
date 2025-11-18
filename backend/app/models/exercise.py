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
    target = db.Column(db.String(100))
    gif_url = db.Column(db.String(500))
    instructions = db.Column(db.Text)

    # Additional fields for frontend compatibility (FASE 1 & 2)
    name_es = db.Column(db.String(200))  # Spanish name
    category = db.Column(db.String(50))  # "strength" | "cardio" | "flexibility" | "balance"
    muscle_group = db.Column(db.String(100))  # Display name for frontend
    equipment_list = db.Column(db.Text)  # JSON array as string
    difficulty = db.Column(db.String(20))  # "beginner" | "intermediate" | "advanced"
    video_url = db.Column(db.String(500))  # Optional video URL

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    workout_exercises = db.relationship('WorkoutExercise', back_populates='exercise', lazy='dynamic')

    def to_dict(self):
        """Convert exercise to dictionary representation"""
        import json

        # Parse equipment list if it's JSON string
        equipment_array = []
        if self.equipment_list:
            try:
                equipment_array = json.loads(self.equipment_list)
            except:
                equipment_array = [self.equipment] if self.equipment else []
        elif self.equipment:
            equipment_array = [self.equipment]

        return {
            'id': self.id,
            'external_id': self.external_id,
            'name': self.name,
            'nameEs': self.name_es or self.name,  # FASE 1 compatibility
            'body_part': self.body_part,
            'category': self.category,  # FASE 1 compatibility
            'muscleGroup': self.muscle_group or self.body_part,  # FASE 1 compatibility
            'equipment': equipment_array,  # FASE 1 compatibility (array)
            'target': self.target,
            'difficulty': self.difficulty,  # FASE 1 compatibility
            'gif_url': self.gif_url,
            'gifUrl': self.gif_url,  # FASE 1 compatibility
            'videoUrl': self.video_url,  # FASE 1 compatibility
            'instructions': self.instructions,
        }

    def __repr__(self):
        return f'<Exercise {self.name}>'
