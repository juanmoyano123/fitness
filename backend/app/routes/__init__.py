"""
Routes package - exports all blueprints
"""
from app.routes.health import health_bp
from app.routes.clients import clients_bp
from app.routes.exercises import exercises_bp
from app.routes.workouts import workouts_bp
from app.routes.assignments import assignments_bp
from app.routes.analytics import analytics_bp

__all__ = [
    'health_bp',
    'clients_bp',
    'exercises_bp',
    'workouts_bp',
    'assignments_bp',
    'analytics_bp'
]
