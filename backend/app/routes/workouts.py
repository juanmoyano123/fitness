"""
Workout & Assignment Routes - CRUD operations for workouts and assignments
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from app import db
from app.models import Workout, WorkoutExercise, WorkoutAssignment, Client, Exercise

workouts_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')
assignments_bp = Blueprint('assignments', __name__, url_prefix='/api/assignments')


def require_trainer():
    """Helper to verify user is a trainer"""
    claims = get_jwt()
    if claims.get('type') != 'trainer':
        return jsonify({
            'success': False,
            'error': 'Trainer access required'
        }), 403
    return None


# ==================== WORKOUTS ENDPOINTS ====================

@workouts_bp.route('', methods=['GET'])
@jwt_required()
def get_workouts():
    """Get all workouts for the authenticated trainer"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        workouts = Workout.query.filter_by(trainer_id=trainer_id).all()

        return jsonify({
            'success': True,
            'data': [workout.to_dict(include_exercises=True) for workout in workouts]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get workouts: {str(e)}'
        }), 500


@workouts_bp.route('/<int:workout_id>', methods=['GET'])
@jwt_required()
def get_workout(workout_id):
    """Get a specific workout by ID"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        workout = Workout.query.filter_by(id=workout_id, trainer_id=trainer_id).first()

        if not workout:
            return jsonify({
                'success': False,
                'error': 'Workout not found'
            }), 404

        return jsonify({
            'success': True,
            'data': workout.to_dict(include_exercises=True)
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get workout: {str(e)}'
        }), 500


@workouts_bp.route('', methods=['POST'])
@jwt_required()
def create_workout():
    """
    Create a new workout

    Request body:
    {
        "name": "Upper Body Strength",
        "description": "Focus on chest and back",
        "exercises": [
            {
                "exercise_id": 1,
                "order": 1,
                "sets": 3,
                "reps": 10,
                "rest_seconds": 60,
                "notes": "Focus on form"
            }
        ]
    }
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('name'):
            return jsonify({
                'success': False,
                'error': 'Name is required'
            }), 400

        # Create workout (compatible with FASE 1 & 2 frontend)
        workout = Workout(
            name=data['name'],
            description=data.get('description', ''),
            trainer_id=trainer_id,
            category=data.get('category'),  # FASE 1 compatibility
            difficulty=data.get('difficulty'),  # FASE 1 compatibility
            duration=data.get('duration')  # FASE 1 compatibility
        )

        db.session.add(workout)
        db.session.flush()  # Get workout ID

        # Add exercises if provided
        if 'exercises' in data:
            for ex_data in data['exercises']:
                workout_exercise = WorkoutExercise(
                    workout_id=workout.id,
                    exercise_id=ex_data['exercise_id'],
                    order_index=ex_data.get('order') or ex_data.get('order_index', 0),  # Accept both
                    sets=ex_data.get('sets', 3),
                    reps=ex_data.get('reps', 10),
                    rest_seconds=ex_data.get('rest_seconds', 60),
                    weight=ex_data.get('weight'),  # FASE 1 compatibility
                    notes=ex_data.get('notes')
                )
                db.session.add(workout_exercise)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Workout created successfully',
            'data': workout.to_dict(include_exercises=True)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to create workout: {str(e)}'
        }), 500


@workouts_bp.route('/<int:workout_id>', methods=['PUT'])
@jwt_required()
def update_workout(workout_id):
    """Update a workout"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        workout = Workout.query.filter_by(id=workout_id, trainer_id=trainer_id).first()

        if not workout:
            return jsonify({
                'success': False,
                'error': 'Workout not found'
            }), 404

        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Update fields (compatible with FASE 1 & 2 frontend)
        if 'name' in data:
            workout.name = data['name']
        if 'description' in data:
            workout.description = data['description']
        if 'category' in data:
            workout.category = data['category']
        if 'difficulty' in data:
            workout.difficulty = data['difficulty']
        if 'duration' in data:
            workout.duration = data['duration']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Workout updated successfully',
            'data': workout.to_dict(include_exercises=True)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to update workout: {str(e)}'
        }), 500


@workouts_bp.route('/<int:workout_id>', methods=['DELETE'])
@jwt_required()
def delete_workout(workout_id):
    """Delete a workout"""
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        workout = Workout.query.filter_by(id=workout_id, trainer_id=trainer_id).first()

        if not workout:
            return jsonify({
                'success': False,
                'error': 'Workout not found'
            }), 404

        db.session.delete(workout)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Workout deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to delete workout: {str(e)}'
        }), 500


# ==================== ASSIGNMENTS ENDPOINTS ====================

@assignments_bp.route('', methods=['POST'])
@jwt_required()
def create_assignment():
    """
    Assign a workout to a client

    Request body:
    {
        "workout_id": 1,
        "client_id": 2,
        "due_date": "2025-11-20T00:00:00Z" (optional),
        "notes": "Focus on form" (optional)
    }
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        data = request.get_json()

        if not data or not data.get('workout_id') or not data.get('client_id'):
            return jsonify({
                'success': False,
                'error': 'workout_id and client_id are required'
            }), 400

        # Verify ownership
        workout = Workout.query.filter_by(id=data['workout_id'], trainer_id=trainer_id).first()
        client = Client.query.filter_by(id=data['client_id'], trainer_id=trainer_id).first()

        if not workout or not client:
            return jsonify({
                'success': False,
                'error': 'Workout or client not found'
            }), 404

        # Create assignment
        assignment = WorkoutAssignment(
            workout_id=data['workout_id'],
            client_id=data['client_id'],
            trainer_id=trainer_id,
            due_date=datetime.fromisoformat(data['due_date'].replace('Z', '+00:00')) if data.get('due_date') else None,
            notes=data.get('notes')
        )

        db.session.add(assignment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Workout assigned successfully',
            'data': assignment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to assign workout: {str(e)}'
        }), 500


@assignments_bp.route('/client/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client_assignments(client_id):
    """Get all assignments for a specific client"""
    try:
        # Can be accessed by trainer or the client themselves
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_type = claims.get('type', 'trainer')

        if user_type == 'trainer':
            assignments = WorkoutAssignment.query.filter_by(
                client_id=client_id,
                trainer_id=user_id
            ).all()
        else:
            # Client accessing their own assignments
            if user_id != client_id:
                return jsonify({
                    'success': False,
                    'error': 'Unauthorized'
                }), 403
            assignments = WorkoutAssignment.query.filter_by(client_id=client_id).all()

        return jsonify({
            'success': True,
            'data': [assignment.to_dict() for assignment in assignments]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get assignments: {str(e)}'
        }), 500


@assignments_bp.route('/<int:assignment_id>/status', methods=['PUT'])
@jwt_required()
def update_assignment_status(assignment_id):
    """
    Update assignment status

    Request body:
    {
        "status": "in_progress" | "completed" | "skipped"
    }
    """
    try:
        data = request.get_json()

        if not data or not data.get('status'):
            return jsonify({
                'success': False,
                'error': 'Status is required'
            }), 400

        assignment = WorkoutAssignment.query.get(assignment_id)

        if not assignment:
            return jsonify({
                'success': False,
                'error': 'Assignment not found'
            }), 404

        # Update status
        assignment.status = data['status']

        if data['status'] == 'in_progress' and not assignment.started_at:
            assignment.started_at = datetime.utcnow()
        elif data['status'] == 'completed' and not assignment.completed_at:
            assignment.completed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Status updated successfully',
            'data': assignment.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to update status: {str(e)}'
        }), 500
