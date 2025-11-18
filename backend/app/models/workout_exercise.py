"""
WorkoutExercise Model - Junction table linking workouts to exercises with order/sets/reps
"""
from app import db


class WorkoutExercise(db.Model):
    """Junction model for workout-exercise relationship with prescription details"""
    __tablename__ = 'workout_exercises'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False, index=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False, index=True)

    # Exercise prescription
    order = db.Column(db.Integer, nullable=False)  # Order in workout
    sets = db.Column(db.Integer, default=3)
    reps = db.Column(db.Integer, default=10)
    rest_seconds = db.Column(db.Integer, default=60)
    weight = db.Column(db.Float)  # Optional weight in kg
    notes = db.Column(db.Text)

    # Relationships
    workout = db.relationship('Workout', back_populates='exercises')
    exercise = db.relationship('Exercise', back_populates='workout_exercises')

    def to_dict(self, include_exercise=True):
        """Convert workout exercise to dictionary representation"""
        data = {
            'id': self.id,
            'workout_id': self.workout_id,
            'exercise_id': self.exercise_id,
            'exerciseId': str(self.exercise_id),  # FASE 1 compatibility (as string)
            'order': self.order,
            'sets': self.sets,
            'reps': self.reps,
            'rest_seconds': self.rest_seconds,
            'rest': self.rest_seconds,  # FASE 1 compatibility
            'weight': self.weight,  # FASE 1 compatibility
            'notes': self.notes,
        }

        if include_exercise and self.exercise:
            data['exercise'] = self.exercise.to_dict()

        return data

    def __repr__(self):
        return f'<WorkoutExercise workout={self.workout_id} exercise={self.exercise_id}>'
