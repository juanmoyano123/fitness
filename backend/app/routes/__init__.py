"""
FitCompass Pro - API Routes
"""
from app.routes.auth import auth_bp
from app.routes.clients import clients_bp
from app.routes.workouts import workouts_bp, assignments_bp
from app.routes.analytics import analytics_bp, trainers_bp
from app.routes.clients_analytics import clients_analytics_bp
from app.routes.workout_logs import workout_logs_bp

__all__ = [
    'auth_bp',
    'clients_bp',
    'workouts_bp',
    'assignments_bp',
    'analytics_bp',
    'trainers_bp',  # FASE 5 spec
    'clients_analytics_bp',  # FASE 5 spec
    'workout_logs_bp'
]
