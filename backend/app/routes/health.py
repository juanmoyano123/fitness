"""
Health Check Routes
"""
from flask import Blueprint, jsonify
from app import db

health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Returns database connection status
    """
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'

    return jsonify({
        'status': 'ok',
        'database': db_status
    }), 200


@health_bp.route('/api/health', methods=['GET'])
def api_health_check():
    """
    API health check endpoint
    """
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'

    return jsonify({
        'status': 'ok',
        'database': db_status,
        'version': '1.0.0'
    }), 200
