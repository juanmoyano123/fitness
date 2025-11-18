"""
Database Models for FitCompass Pro
"""
from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class Trainer(db.Model):
    """Trainer model"""
    __tablename__ = 'trainers'

    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    clients = db.relationship('Client', backref='trainer', lazy='dynamic', cascade='all, delete-orphan')
    workouts = db.relationship('Workout', backref='trainer', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check hashed password"""
        return check_password_hash(self.password_hash, password)


class Client(db.Model):
    """Client model"""
    __tablename__ = 'clients'

    id = db.Column(db.String(36), primary_key=True)
    trainer_id = db.Column(db.String(36), db.ForeignKey('trainers.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(20))
    age = db.Column(db.Integer)
    goals = db.Column(db.Text)
    avatar = db.Column(db.String(255))
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assignments = db.relationship('WorkoutAssignment', backref='client', lazy='dynamic', cascade='all, delete-orphan')


class Exercise(db.Model):
    """Exercise model - includes ExerciseDB exercises and custom ones"""
    __tablename__ = 'exercises'

    id = db.Column(db.String(36), primary_key=True)
    external_id = db.Column(db.String(50))  # ExerciseDB ID
    name = db.Column(db.String(200), nullable=False)
    body_part = db.Column(db.String(100))
    equipment = db.Column(db.String(100))
    target = db.Column(db.String(100))
    gif_url = db.Column(db.String(500))
    instructions = db.Column(db.Text)
    is_custom = db.Column(db.Boolean, default=False)
    trainer_id = db.Column(db.String(36), db.ForeignKey('trainers.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Workout(db.Model):
    """Workout template model"""
    __tablename__ = 'workouts'

    id = db.Column(db.String(36), primary_key=True)
    trainer_id = db.Column(db.String(36), db.ForeignKey('trainers.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    difficulty = db.Column(db.String(20))
    duration_minutes = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    exercises = db.relationship('WorkoutExercise', backref='workout', lazy='dynamic', cascade='all, delete-orphan')
    assignments = db.relationship('WorkoutAssignment', backref='workout', lazy='dynamic', cascade='all, delete-orphan')


class WorkoutExercise(db.Model):
    """Join table for Workout-Exercise with sets/reps info"""
    __tablename__ = 'workout_exercises'

    id = db.Column(db.String(36), primary_key=True)
    workout_id = db.Column(db.String(36), db.ForeignKey('workouts.id'), nullable=False)
    exercise_id = db.Column(db.String(36), db.ForeignKey('exercises.id'), nullable=False)
    order_index = db.Column(db.Integer, nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.String(50))  # "10-12" or "AMRAP" or "10"
    rest_seconds = db.Column(db.Integer, default=60)
    notes = db.Column(db.Text)

    # Relationship to exercise
    exercise = db.relationship('Exercise')


class WorkoutAssignment(db.Model):
    """Assignment of workout to client"""
    __tablename__ = 'workout_assignments'

    id = db.Column(db.String(36), primary_key=True)
    workout_id = db.Column(db.String(36), db.ForeignKey('workouts.id'), nullable=False)
    client_id = db.Column(db.String(36), db.ForeignKey('clients.id'), nullable=False)
    assigned_date = db.Column(db.DateTime, default=datetime.utcnow)
    scheduled_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed, skipped
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    duration_minutes = db.Column(db.Integer)

    # Relationships
    logs = db.relationship('WorkoutLog', backref='assignment', lazy='dynamic', cascade='all, delete-orphan')


class WorkoutLog(db.Model):
    """Individual set logs for workout exercises"""
    __tablename__ = 'workout_logs'

    id = db.Column(db.String(36), primary_key=True)
    assignment_id = db.Column(db.String(36), db.ForeignKey('workout_assignments.id'), nullable=False)
    workout_exercise_id = db.Column(db.String(36), db.ForeignKey('workout_exercises.id'), nullable=False)
    set_number = db.Column(db.Integer, nullable=False)
    reps_completed = db.Column(db.Integer)
    weight_used = db.Column(db.Float)
    logged_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    workout_exercise = db.relationship('WorkoutExercise')
