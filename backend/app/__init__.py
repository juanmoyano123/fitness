"""
FitCompass Pro - Backend Flask Application
"""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/fitcompass_dev')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)

    # CORS configuration
    CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','))

    # Register blueprints (routes)
    from app.routes import (
        auth_bp, clients_bp, workouts_bp, assignments_bp,
        analytics_bp, trainers_bp, clients_analytics_bp, workout_logs_bp
    )
    from app.routes.health import health_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(workouts_bp)
    app.register_blueprint(assignments_bp)
    app.register_blueprint(analytics_bp)  # FASE 6 compatibility
    app.register_blueprint(trainers_bp)  # FASE 5 spec
    app.register_blueprint(clients_analytics_bp)  # FASE 5 spec
    app.register_blueprint(workout_logs_bp)

    # Create tables (for development only)
    with app.app_context():
        db.create_all()

    return app
