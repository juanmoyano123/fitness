"""
Client Management Routes - CRUD operations for trainer's clients
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from app import db
from app.models import Client, Trainer
from app.utils.auth_helpers import require_trainer, verify_resource_ownership

clients_bp = Blueprint('clients', __name__, url_prefix='/api/clients')


@clients_bp.route('', methods=['GET'])
@jwt_required()
def get_clients():
    """
    Get all clients for the authenticated trainer

    Query params:
    - active: true/false (filter by is_active status)
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        query = Client.query.filter_by(trainer_id=trainer_id)

        # Filter by active status if specified
        active_filter = request.args.get('active')
        if active_filter is not None:
            is_active = active_filter.lower() == 'true'
            query = query.filter_by(is_active=is_active)

        clients = query.all()

        return jsonify({
            'success': True,
            'data': [client.to_dict(include_stats=True) for client in clients]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get clients: {str(e)}'
        }), 500


@clients_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    """Get a specific client by ID"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()

        if not client:
            return jsonify({
                'success': False,
                'error': 'Client not found'
            }), 404

        return jsonify({
            'success': True,
            'data': client.to_dict(include_stats=True)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get client: {str(e)}'
        }), 500


@clients_bp.route('', methods=['POST'])
@jwt_required()
def create_client():
    """
    Create a new client

    Request body:
    {
        "email": "client@example.com",
        "name": "Jane Doe",
        "phone": "+1234567890" (optional),
        "notes": "Client notes" (optional)
    }
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('email') or not data.get('name'):
            return jsonify({
                'success': False,
                'error': 'Email and name are required'
            }), 400

        email = data['email'].lower().strip()
        name = data['name'].strip()

        # Check if client email already exists
        existing_client = Client.query.filter_by(email=email).first()
        if existing_client:
            return jsonify({
                'success': False,
                'error': 'Client with this email already exists'
            }), 409

        # Create new client (compatible with FASE 1 frontend)
        client = Client(
            email=email,
            name=name,
            trainer_id=trainer_id,
            phone=data.get('phone'),
            notes=data.get('notes'),
            is_active=True,
            gender=data.get('gender'),  # FASE 1 compatibility
            age=data.get('age'),  # FASE 1 compatibility
            goals=data.get('goals'),  # FASE 1 compatibility
            avatar_url=data.get('avatar') or data.get('avatar_url')  # Accept both field names
        )

        db.session.add(client)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Client created successfully',
            'data': client.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to create client: {str(e)}'
        }), 500


@clients_bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    """
    Update a client

    Request body:
    {
        "name": "Updated Name" (optional),
        "phone": "+1234567890" (optional),
        "notes": "Updated notes" (optional),
        "is_active": true/false (optional)
    }
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()

        if not client:
            return jsonify({
                'success': False,
                'error': 'Client not found'
            }), 404

        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Update fields (compatible with FASE 1 frontend)
        if 'name' in data:
            client.name = data['name'].strip()
        if 'phone' in data:
            client.phone = data['phone']
        if 'notes' in data:
            client.notes = data['notes']
        if 'is_active' in data:
            client.is_active = data['is_active']
        if 'gender' in data:
            client.gender = data['gender']
        if 'age' in data:
            client.age = data['age']
        if 'goals' in data:
            client.goals = data['goals']
        if 'avatar' in data or 'avatar_url' in data:
            client.avatar_url = data.get('avatar') or data.get('avatar_url')

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Client updated successfully',
            'data': client.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to update client: {str(e)}'
        }), 500


@clients_bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    """Delete a client"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()

        if not client:
            return jsonify({
                'success': False,
                'error': 'Client not found'
            }), 404

        db.session.delete(client)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Client deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to delete client: {str(e)}'
        }), 500


@clients_bp.route('/<int:client_id>/invite', methods=['POST'])
@jwt_required()
def invite_client(client_id):
    """
    Send invitation email to a client

    Request body: {} (empty, client must already exist)
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        from flask_jwt_extended import create_access_token
        from datetime import timedelta
        import os

        trainer_id = get_jwt_identity()
        trainer = Trainer.query.get(trainer_id)
        client = Client.query.filter_by(id=client_id, trainer_id=trainer_id).first()

        if not client:
            return jsonify({
                'success': False,
                'error': 'Client not found'
            }), 404

        # Generate invite token (7 days expiry)
        invite_token = create_access_token(
            identity=client.id,
            expires_delta=timedelta(days=7),
            additional_claims={'type': 'invite', 'client_id': client.id, 'trainer_id': trainer_id}
        )

        # Store invite token and timestamp
        client.invite_token = invite_token
        client.invite_sent_at = datetime.utcnow()
        db.session.commit()

        # Build registration link
        frontend_url = os.getenv('FRONTEND_MOBILE_URL', 'exp://localhost:8081')
        registration_link = f"{frontend_url}/register?token={invite_token}"

        # Send invitation email
        from app.services.email_service import EmailService
        email_service = EmailService()
        email_sent = email_service.send_client_invitation(
            client_email=client.email,
            client_name=client.name,
            trainer_name=trainer.name,
            invite_link=registration_link
        )

        # Return response
        response = {
            'success': True,
            'client': client.to_dict()
        }

        if email_sent:
            response['message'] = f'Invitación enviada a {client.email}'
        else:
            # If SendGrid is not configured, return the link for manual sharing
            response['message'] = f'Invitación preparada (email no configurado)'
            response['invite_link'] = registration_link  # For development/testing
            response['note'] = 'SendGrid no está configurado. Comparte este link manualmente.'

        return jsonify(response), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to send invitation: {str(e)}'
        }), 500
