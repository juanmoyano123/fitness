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
        'status': 'healthy',
        'database': db_status,
        'service': 'FitCompass Pro API'
    }), 200


@health_bp.route('/api/health', methods=['GET'])
def api_health_check():
    """
    API health check endpoint with version info
    """
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'

    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'service': 'FitCompass Pro API',
        'version': '1.0.0'
    }), 200


@health_bp.route('/health/ready', methods=['GET'])
def readiness_check():
    """
    Readiness check - verifies all dependencies are ready
    Used by Kubernetes/Docker for readiness probes
    """
    checks = {
        'database': False
    }

    # Check database
    try:
        db.session.execute(db.text('SELECT 1'))
        checks['database'] = True
    except Exception as e:
        pass

    all_ready = checks['database']
    status_code = 200 if all_ready else 503

    return jsonify({
        'status': 'ready' if all_ready else 'not_ready',
        'checks': checks
    }), status_code


@health_bp.route('/health/live', methods=['GET'])
def liveness_check():
    """
    Liveness check - verifies the app is alive
    Used by Kubernetes/Docker for liveness probes
    """
    return jsonify({
        'status': 'alive'
    }), 200
