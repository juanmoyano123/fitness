"""
Clients API Routes - CRUD operations for clients
F-011: API CRUD Clientes
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Client, Trainer
from marshmallow import Schema, fields, ValidationError, validates, validates_schema
import re

clients_bp = Blueprint('clients', __name__, url_prefix='/api/clients')


# ==================== VALIDATION SCHEMAS ====================

class ClientSchema(Schema):
    """Schema for client validation"""
    id = fields.Int(dump_only=True)
    trainer_id = fields.Int(required=True)
    email = fields.Email(required=True)
    name = fields.Str(required=True)
    avatar_url = fields.Str(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates('name')
    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise ValidationError('Name must be at least 2 characters long')
        if len(value) > 255:
            raise ValidationError('Name must be less than 255 characters')

    @validates('email')
    def validate_email(self, value):
        if not value or len(value.strip()) < 3:
            raise ValidationError('Email is required')
        # Basic email format validation
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValidationError('Invalid email format')


class ClientUpdateSchema(Schema):
    """Schema for client update validation (all fields optional)"""
    email = fields.Email(required=False)
    name = fields.Str(required=False)
    avatar_url = fields.Str(required=False, allow_none=True)

    @validates('name')
    def validate_name(self, value):
        if value is not None:
            if len(value.strip()) < 2:
                raise ValidationError('Name must be at least 2 characters long')
            if len(value) > 255:
                raise ValidationError('Name must be less than 255 characters')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)
client_update_schema = ClientUpdateSchema()


# ==================== HELPER FUNCTIONS ====================

def success_response(data, message=None, status=200):
    """Standard success response format"""
    response = {
        'success': True,
        'data': data
    }
    if message:
        response['message'] = message
    return jsonify(response), status


def error_response(message, errors=None, status=400):
    """Standard error response format"""
    response = {
        'success': False,
        'message': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), status


# ==================== ROUTES ====================

@clients_bp.route('', methods=['GET'])
def list_clients():
    """
    GET /api/clients
    Lista todos los clientes de un trainer
    Query params:
        - trainer_id: ID del trainer (required)
    """
    trainer_id = request.args.get('trainer_id')

    if not trainer_id:
        return error_response('trainer_id is required', status=400)

    try:
        trainer_id = int(trainer_id)
    except ValueError:
        return error_response('trainer_id must be a valid integer', status=400)

    # Verificar que el trainer existe
    trainer = Trainer.query.get(trainer_id)
    if not trainer:
        return error_response('Trainer not found', status=404)

    # Obtener clientes del trainer
    clients = Client.query.filter_by(trainer_id=trainer_id).all()

    return success_response([client.to_dict() for client in clients])


@clients_bp.route('', methods=['POST'])
def create_client():
    """
    POST /api/clients
    Crea un nuevo cliente
    Body: { trainer_id, email, name, avatar_url? }
    """
    try:
        # Validate request data
        data = client_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Verificar que el trainer existe
    trainer = Trainer.query.get(data['trainer_id'])
    if not trainer:
        return error_response('Trainer not found', status=404)

    # Verificar que el email no esté duplicado para este trainer
    existing_client = Client.query.filter_by(
        trainer_id=data['trainer_id'],
        email=data['email']
    ).first()

    if existing_client:
        return error_response(
            'A client with this email already exists for this trainer',
            status=409
        )

    # Crear cliente
    client = Client(
        trainer_id=data['trainer_id'],
        email=data['email'],
        name=data['name'],
        avatar_url=data.get('avatar_url')
    )

    db.session.add(client)
    db.session.commit()

    return success_response(
        client.to_dict(),
        message='Client created successfully',
        status=201
    )


@clients_bp.route('/<int:client_id>', methods=['GET'])
def get_client(client_id):
    """
    GET /api/clients/:id
    Obtiene detalles de un cliente específico
    """
    client = Client.query.get(client_id)

    if not client:
        return error_response('Client not found', status=404)

    return success_response(client.to_dict())


@clients_bp.route('/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    """
    PUT /api/clients/:id
    Actualiza un cliente existente
    Body: { email?, name?, avatar_url? }
    """
    client = Client.query.get(client_id)

    if not client:
        return error_response('Client not found', status=404)

    try:
        # Validate request data
        data = client_update_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Si se actualiza el email, verificar que no esté duplicado
    if 'email' in data and data['email'] != client.email:
        existing_client = Client.query.filter_by(
            trainer_id=client.trainer_id,
            email=data['email']
        ).first()

        if existing_client:
            return error_response(
                'A client with this email already exists for this trainer',
                status=409
            )

        client.email = data['email']

    # Actualizar campos
    if 'name' in data:
        client.name = data['name']

    if 'avatar_url' in data:
        client.avatar_url = data['avatar_url']

    db.session.commit()

    return success_response(
        client.to_dict(),
        message='Client updated successfully'
    )


@clients_bp.route('/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    """
    DELETE /api/clients/:id
    Elimina un cliente (soft delete - podría ser archivado en futuro)
    """
    client = Client.query.get(client_id)

    if not client:
        return error_response('Client not found', status=404)

    # Hard delete for now (could be soft delete with status field later)
    db.session.delete(client)
    db.session.commit()

    return success_response(
        {'id': client_id},
        message='Client deleted successfully'
    )
