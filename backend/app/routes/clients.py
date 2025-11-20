"""
Client Management Routes - CRUD operations for trainer's clients
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from app import db
from app.models import Client, Trainer
from app.utils.auth_helpers import require_trainer, verify_resource_ownership
from app.utils.validation_helpers import validate_json, validate_query
from app.schemas import ClientCreateSchema, ClientUpdateSchema, ClientQuerySchema

clients_bp = Blueprint('clients', __name__, url_prefix='/api/clients')


@clients_bp.route('', methods=['GET'])
@jwt_required()
@validate_query(ClientQuerySchema)
def get_clients(validated_query):
    """
    Get all clients for the authenticated trainer with pagination

    Query params:
    - active: true/false (filter by is_active status)
    - page: page number (default: 1)
    - per_page: items per page (default: 20, max: 100)
    - search: search by name or email
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()

        # Base query
        query = Client.query.filter_by(trainer_id=trainer_id)

        # Filter by active status
        if 'active' in validated_query:
            is_active = validated_query['active'].lower() == 'true'
            query = query.filter_by(is_active=is_active)

        # Search filter
        if 'search' in validated_query:
            search_term = f"%{validated_query['search']}%"
            query = query.filter(
                (Client.name.ilike(search_term)) |
                (Client.email.ilike(search_term))
            )

        # Pagination
        page = validated_query['page']
        per_page = validated_query['per_page']

        paginated = query.order_by(Client.name).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return jsonify({
            'success': True,
            'data': [client.to_dict(include_stats=True) for client in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages,
                'has_next': paginated.has_next,
                'has_prev': paginated.has_prev
            }
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
@validate_json(ClientCreateSchema)
def create_client(validated_data):
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

        email = validated_data['email'].lower()
        name = validated_data['name']

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
            phone=validated_data.get('phone'),
            notes=validated_data.get('notes'),
            is_active=True,
            gender=validated_data.get('gender'),
            age=validated_data.get('age'),
            goals=validated_data.get('goals'),
            avatar_url=validated_data.get('avatar_url') or validated_data.get('avatar')
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
@validate_json(ClientUpdateSchema)
def update_client(client_id, validated_data):
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

        # Update fields (compatible with FASE 1 frontend)
        if 'name' in validated_data:
            client.name = validated_data['name']
        if 'phone' in validated_data:
            client.phone = validated_data['phone']
        if 'notes' in validated_data:
            client.notes = validated_data['notes']
        if 'is_active' in validated_data:
            client.is_active = validated_data['is_active']
        if 'gender' in validated_data:
            client.gender = validated_data['gender']
        if 'age' in validated_data:
            client.age = validated_data['age']
        if 'goals' in validated_data:
            client.goals = validated_data['goals']
        if 'avatar' in validated_data or 'avatar_url' in validated_data:
            client.avatar_url = validated_data.get('avatar') or validated_data.get('avatar_url')

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
