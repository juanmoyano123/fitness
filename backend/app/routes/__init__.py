"""
FitCompass Pro - API Routes
"""
from app.routes.auth import auth_bp
from app.routes.clients import clients_bp

__all__ = ['auth_bp', 'clients_bp']
