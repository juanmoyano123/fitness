"""
Routes Package - API Blueprints
"""
from app.routes.health import health_bp
from app.routes.clients import clients_bp
from app.routes.exercises import exercises_bp
from app.routes.workouts import workouts_bp
from app.routes.logs import logs_bp

__all__ = ['health_bp', 'clients_bp', 'exercises_bp', 'workouts_bp', 'logs_bp']
