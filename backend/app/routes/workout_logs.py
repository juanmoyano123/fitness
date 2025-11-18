"""
Workout Logs Routes - CRUD operations for workout completion tracking
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from app import db
from app.models import WorkoutLog, WorkoutAssignment, WorkoutExercise

workout_logs_bp = Blueprint('workout_logs', __name__, url_prefix='/api/workout-logs')


@workout_logs_bp.route('', methods=['POST'])
@jwt_required()
def create_workout_log():
    """
    Log a completed workout (creates multiple WorkoutLog entries for each set)

    Request body:
    {
        "assignment_id": 1,
        "exercises": [
            {
                "workout_exercise_id": 1,
                "sets": [
                    {"set_number": 1, "reps_completed": 10, "weight_used": 50, "rpe": 7},
                    {"set_number": 2, "reps_completed": 10, "weight_used": 50, "rpe": 8}
                ]
            }
        ],
        "notes": "Felt strong today"
    }
    """
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_type = claims.get('type', 'client')

        data = request.get_json()

        if not data or not data.get('assignment_id'):
            return jsonify({
                'success': False,
                'error': 'assignment_id is required'
            }), 400

        assignment_id = data['assignment_id']
        exercises = data.get('exercises', [])

        # Verify assignment exists and belongs to user
        assignment = WorkoutAssignment.query.get(assignment_id)
        if not assignment:
            return jsonify({
                'success': False,
                'error': 'Assignment not found'
            }), 404

        if user_type == 'client' and assignment.client_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 403

        # Create workout logs for each set
        logs_created = []
        for exercise_data in exercises:
            workout_exercise_id = exercise_data.get('workout_exercise_id')
            sets = exercise_data.get('sets', [])

            for set_data in sets:
                workout_log = WorkoutLog(
                    assignment_id=assignment_id,
                    workout_exercise_id=workout_exercise_id,
                    set_number=set_data.get('set_number'),
                    reps_completed=set_data.get('reps_completed'),
                    weight_used=set_data.get('weight_used'),
                    rpe=set_data.get('rpe'),
                    notes=set_data.get('notes')
                )
                db.session.add(workout_log)
                logs_created.append(workout_log)

        # Update assignment status to completed
        assignment.status = 'completed'
        assignment.completed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Logged {len(logs_created)} sets successfully',
            'data': {
                'logs_count': len(logs_created),
                'assignment': assignment.to_dict()
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to log workout: {str(e)}'
        }), 500


@workout_logs_bp.route('/assignment/<int:assignment_id>', methods=['GET'])
@jwt_required()
def get_assignment_logs(assignment_id):
    """Get all workout logs for a specific assignment"""
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        user_type = claims.get('type', 'client')

        assignment = WorkoutAssignment.query.get(assignment_id)
        if not assignment:
            return jsonify({
                'success': False,
                'error': 'Assignment not found'
            }), 404

        # Verify access
        if user_type == 'client' and assignment.client_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 403

        if user_type == 'trainer' and assignment.trainer_id != user_id:
            return jsonify({
                'success': False,
                'error': 'Unauthorized'
            }), 403

        logs = WorkoutLog.query.filter_by(assignment_id=assignment_id).all()

        return jsonify({
            'success': True,
            'data': [log.to_dict() for log in logs]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get logs: {str(e)}'
        }), 500


@workout_logs_bp.route('/<int:log_id>', methods=['PUT'])
@jwt_required()
def update_workout_log(log_id):
    """Update a specific workout log entry"""
    try:
        log = WorkoutLog.query.get(log_id)
        if not log:
            return jsonify({
                'success': False,
                'error': 'Log not found'
            }), 404

        data = request.get_json()

        if 'reps_completed' in data:
            log.reps_completed = data['reps_completed']
        if 'weight_used' in data:
            log.weight_used = data['weight_used']
        if 'rpe' in data:
            log.rpe = data['rpe']
        if 'notes' in data:
            log.notes = data['notes']

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Log updated successfully',
            'data': log.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to update log: {str(e)}'
        }), 500


@workout_logs_bp.route('/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_workout_log(log_id):
    """Delete a specific workout log entry"""
    try:
        log = WorkoutLog.query.get(log_id)
        if not log:
            return jsonify({
                'success': False,
                'error': 'Log not found'
            }), 404

        db.session.delete(log)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Log deleted successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to delete log: {str(e)}'
        }), 500
