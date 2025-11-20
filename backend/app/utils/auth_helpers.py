"""
Authentication & Authorization Helpers
Provides reusable functions for role-based access control and resource ownership verification
"""
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, get_jwt
from functools import wraps


def require_trainer():
    """
    Verify that the current user is a trainer

    Returns:
        tuple | None: Error response tuple (json, status_code) if not trainer, None if valid
    """
    claims = get_jwt()
    if claims.get('type') != 'trainer':
        return jsonify({
            'success': False,
            'error': 'Trainer access required'
        }), 403
    return None


def require_client():
    """
    Verify that the current user is a client

    Returns:
        tuple | None: Error response tuple (json, status_code) if not client, None if valid
    """
    claims = get_jwt()
    if claims.get('type') != 'client':
        return jsonify({
            'success': False,
            'error': 'Client access required'
        }), 403
    return None


def verify_resource_ownership(resource, trainer_id_field='trainer_id'):
    """
    Verify that a resource belongs to the authenticated trainer

    Args:
        resource: SQLAlchemy model instance
        trainer_id_field: Name of the field containing trainer_id (default: 'trainer_id')

    Returns:
        tuple | None: Error response if unauthorized, None if valid
    """
    trainer_id = get_jwt_identity()
    resource_trainer_id = getattr(resource, trainer_id_field, None)

    if resource_trainer_id != trainer_id:
        return jsonify({
            'success': False,
            'error': 'Unauthorized - resource does not belong to you'
        }), 403

    return None


def verify_client_access(client_id: int):
    """
    Verify that the authenticated user has access to a specific client

    For trainers: Verifies the client belongs to them
    For clients: Verifies they are accessing their own data

    Args:
        client_id: ID of the client to verify access to

    Returns:
        tuple | None: Error response if unauthorized, None if valid
    """
    user_id = get_jwt_identity()
    claims = get_jwt()
    user_type = claims.get('type', 'trainer')

    if user_type == 'trainer':
        # Trainer: verify the client belongs to them
        from app.models import Client
        client = Client.query.get(client_id)
        if not client or client.trainer_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized - client does not belong to you'
            }), 403
    else:
        # Client: verify they are accessing their own data
        if client_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized - you can only access your own data'
            }), 403

    return None


def verify_client_resource_access(resource, client_id_field='client_id'):
    """
    Verify access to a resource that belongs to a client

    For trainers: Verifies the resource's client belongs to them
    For clients: Verifies the resource belongs to them

    Args:
        resource: SQLAlchemy model instance
        client_id_field: Name of the field containing client_id (default: 'client_id')

    Returns:
        tuple | None: Error response if unauthorized, None if valid
    """
    user_id = get_jwt_identity()
    claims = get_jwt()
    user_type = claims.get('type', 'trainer')
    resource_client_id = getattr(resource, client_id_field, None)

    if user_type == 'trainer':
        # Trainer: verify the resource's client belongs to them
        from app.models import Client
        client = Client.query.get(resource_client_id)
        if not client or client.trainer_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized - resource does not belong to your client'
            }), 403
    else:
        # Client: verify the resource belongs to them
        if resource_client_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized - you can only access your own data'
            }), 403

    return None


def require_user_type(user_type: str):
    """
    Decorator to require a specific user type for an endpoint

    Args:
        user_type: 'trainer' or 'client'

    Example:
        @app.route('/trainer-only')
        @jwt_required()
        @require_user_type('trainer')
        def trainer_endpoint():
            return 'Only trainers can see this'
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get('type') != user_type:
                return jsonify({
                    'success': False,
                    'error': f'{user_type.capitalize()} access required'
                }), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator
