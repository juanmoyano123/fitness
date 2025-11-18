"""
Client routes - F-011
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Client, WorkoutAssignment
from datetime import datetime
import uuid

clients_bp = Blueprint('clients', __name__, url_prefix='/api/clients')


@clients_bp.route('', methods=['GET'])
def list_clients():
    """List all clients for the authenticated trainer"""
    # TODO: Add JWT authentication - for now using hardcoded trainer_id
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')

    clients = Client.query.filter_by(trainer_id=trainer_id).all()

    # Calculate adherence and stats for each client
    result = []
    for client in clients:
        # Get assignments for last 30 days
        assignments = client.assignments.all()
        total_assigned = len(assignments)
        total_completed = sum(1 for a in assignments if a.status == 'completed')

        adherence = (total_completed / total_assigned * 100) if total_assigned > 0 else 0

        # Get last activity
        last_completed = client.assignments.filter_by(status='completed').order_by(
            WorkoutAssignment.completed_at.desc()
        ).first()

        last_activity = "Nunca"
        if last_completed and last_completed.completed_at:
            delta = datetime.utcnow() - last_completed.completed_at
            if delta.days == 0:
                last_activity = "Hoy"
            elif delta.days == 1:
                last_activity = "Hace 1 día"
            else:
                last_activity = f"Hace {delta.days} días"

        result.append({
            'id': client.id,
            'name': client.name,
            'email': client.email,
            'gender': client.gender,
            'age': client.age,
            'goals': client.goals,
            'avatar': client.avatar,
            'adherence': round(adherence, 1),
            'lastActivity': last_activity,
            'status': client.status,
            'createdAt': client.created_at.isoformat(),
            'workoutsCompleted': total_completed,
            'workoutsAssigned': total_assigned
        })

    return jsonify(result), 200


@clients_bp.route('', methods=['POST'])
def create_client():
    """Create a new client"""
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')
    data = request.get_json()

    # Validation
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400

    # Create client
    client = Client(
        id=f"client-{uuid.uuid4().hex[:8]}",
        trainer_id=trainer_id,
        name=data['name'],
        email=data['email'],
        gender=data.get('gender'),
        age=data.get('age'),
        goals=data.get('goals'),
        avatar=data.get('avatar'),
        status='active'
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({
        'id': client.id,
        'name': client.name,
        'email': client.email,
        'gender': client.gender,
        'age': client.age,
        'goals': client.goals,
        'avatar': client.avatar,
        'adherence': 0,
        'lastActivity': 'Nunca',
        'status': client.status,
        'createdAt': client.created_at.isoformat(),
        'workoutsCompleted': 0,
        'workoutsAssigned': 0
    }), 201


@clients_bp.route('/<client_id>', methods=['GET'])
def get_client(client_id):
    """Get client details"""
    client = Client.query.get_or_404(client_id)

    assignments = client.assignments.all()
    total_assigned = len(assignments)
    total_completed = sum(1 for a in assignments if a.status == 'completed')
    adherence = (total_completed / total_assigned * 100) if total_assigned > 0 else 0

    return jsonify({
        'id': client.id,
        'name': client.name,
        'email': client.email,
        'gender': client.gender,
        'age': client.age,
        'goals': client.goals,
        'avatar': client.avatar,
        'adherence': round(adherence, 1),
        'status': client.status,
        'createdAt': client.created_at.isoformat(),
        'workoutsCompleted': total_completed,
        'workoutsAssigned': total_assigned
    }), 200


@clients_bp.route('/<client_id>', methods=['PUT'])
def update_client(client_id):
    """Update client"""
    client = Client.query.get_or_404(client_id)
    data = request.get_json()

    # Update fields
    if 'name' in data:
        client.name = data['name']
    if 'email' in data:
        client.email = data['email']
    if 'gender' in data:
        client.gender = data['gender']
    if 'age' in data:
        client.age = data['age']
    if 'goals' in data:
        client.goals = data['goals']
    if 'avatar' in data:
        client.avatar = data['avatar']
    if 'status' in data:
        client.status = data['status']

    client.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'id': client.id,
        'name': client.name,
        'email': client.email,
        'gender': client.gender,
        'age': client.age,
        'goals': client.goals,
        'avatar': client.avatar,
        'status': client.status,
        'updatedAt': client.updated_at.isoformat()
    }), 200


@clients_bp.route('/<client_id>', methods=['DELETE'])
def delete_client(client_id):
    """Delete client"""
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()

    return jsonify({'message': 'Client deleted successfully'}), 200
