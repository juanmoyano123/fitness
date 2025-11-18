"""
Authentication Routes - Login, Register, Token Refresh
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import timedelta
from app import db
from app.models import Trainer, Client

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new trainer account

    Request body:
    {
        "email": "trainer@example.com",
        "password": "securepassword",
        "name": "John Doe",
        "business_name": "Fit Training Co" (optional)
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({
                'success': False,
                'error': 'Email, password, and name are required'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']
        name = data['name'].strip()
        business_name = data.get('business_name', '').strip()

        # Check if email already exists
        existing_trainer = Trainer.query.filter_by(email=email).first()
        if existing_trainer:
            return jsonify({
                'success': False,
                'error': 'Email already registered'
            }), 409

        # Create new trainer
        trainer = Trainer(
            email=email,
            name=name,
            business_name=business_name if business_name else None
        )
        trainer.set_password(password)

        db.session.add(trainer)
        db.session.commit()

        # Generate tokens
        access_token = create_access_token(
            identity=trainer.id,
            expires_delta=timedelta(days=7),
            additional_claims={'type': 'trainer'}
        )
        refresh_token = create_refresh_token(
            identity=trainer.id,
            expires_delta=timedelta(days=30),
            additional_claims={'type': 'trainer'}
        )

        return jsonify({
            'success': True,
            'message': 'Trainer registered successfully',
            'token': access_token,
            'refresh_token': refresh_token,
            'user': trainer.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login with email and password

    Request body:
    {
        "email": "user@example.com",
        "password": "password",
        "user_type": "trainer" or "client" (optional, defaults to "trainer")
    }
    """
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']
        user_type = data.get('user_type', 'trainer')

        # Find user based on type
        if user_type == 'client':
            user = Client.query.filter_by(email=email).first()
        else:
            user = Trainer.query.filter_by(email=email).first()

        # Verify credentials
        if not user or not user.verify_password(password):
            return jsonify({
                'success': False,
                'error': 'Invalid email or password'
            }), 401

        # Generate tokens
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7),
            additional_claims={'type': user_type}
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30),
            additional_claims={'type': user_type}
        )

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(),
            'user_type': user_type
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token

    Headers: Authorization: Bearer <refresh_token>
    """
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        user_type = claims.get('type', 'trainer')

        # Generate new access token
        access_token = create_access_token(
            identity=identity,
            expires_delta=timedelta(days=7),
            additional_claims={'type': user_type}
        )

        return jsonify({
            'success': True,
            'token': access_token
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Token refresh failed: {str(e)}'
        }), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Get current authenticated user information

    Headers: Authorization: Bearer <access_token>
    """
    try:
        identity = get_jwt_identity()
        claims = get_jwt()
        user_type = claims.get('type', 'trainer')

        # Get user based on type
        if user_type == 'client':
            user = Client.query.get(identity)
        else:
            user = Trainer.query.get(identity)

        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404

        return jsonify({
            'success': True,
            'user': user.to_dict(include_stats=True),
            'user_type': user_type
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get user info: {str(e)}'
        }), 500


@auth_bp.route('/register-client', methods=['POST'])
def register_client():
    """
    Register a new client account (used with invite token)

    Request body:
    {
        "email": "client@example.com",
        "password": "securepassword",
        "name": "Jane Doe",
        "invite_token": "jwt_invite_token" (optional)
    }
    """
    try:
        data = request.get_json()

        if not data or not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({
                'success': False,
                'error': 'Email, password, and name are required'
            }), 400

        email = data['email'].lower().strip()
        password = data['password']
        name = data['name'].strip()
        invite_token = data.get('invite_token')

        # Check if email already exists
        existing_client = Client.query.filter_by(email=email).first()

        if existing_client:
            # If client exists with invite but no password, allow password setup
            if not existing_client.password_hash and existing_client.invite_token:
                existing_client.set_password(password)
                existing_client.name = name
                existing_client.registered_at = db.func.now()
                existing_client.invite_token = None
                db.session.commit()

                # Generate tokens
                access_token = create_access_token(
                    identity=existing_client.id,
                    expires_delta=timedelta(days=7),
                    additional_claims={'type': 'client'}
                )
                refresh_token = create_refresh_token(
                    identity=existing_client.id,
                    expires_delta=timedelta(days=30),
                    additional_claims={'type': 'client'}
                )

                return jsonify({
                    'success': True,
                    'message': 'Client registration completed',
                    'token': access_token,
                    'refresh_token': refresh_token,
                    'user': existing_client.to_dict()
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': 'Email already registered'
                }), 409

        # For new client registration without pre-existing invite
        # This shouldn't normally happen, but we'll allow it for testing
        return jsonify({
            'success': False,
            'error': 'Client registration requires an invitation from a trainer'
        }), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Client registration failed: {str(e)}'
        }), 500
