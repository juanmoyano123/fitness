"""
Clients Analytics Routes - Client-specific analytics (FASE 5)
Endpoint según especificación FASE 5:
- GET /api/clients/:id/analytics
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from app import db
from app.models import Client, WorkoutAssignment
from sqlalchemy import func

clients_analytics_bp = Blueprint('clients_analytics', __name__)


def require_trainer():
    """Helper to verify user is a trainer"""
    claims = get_jwt()
    if claims.get('type') != 'trainer':
        return jsonify({
            'success': False,
            'error': 'Trainer access required'
        }), 403
    return None


@clients_analytics_bp.route('/api/clients/<int:client_id>/analytics', methods=['GET'])
@jwt_required()
def get_client_analytics_fase5(client_id):
    """
    Get detailed analytics for a specific client (FASE 5 spec)

    Endpoint: GET /api/clients/:id/analytics

    Response:
    {
        "adherence": 75.0,
        "totalWorkouts": 20,
        "completedWorkouts": 15,
        "averageDuration": 45,
        "progressData": [...]
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

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        # Assignments stats
        total_assignments = WorkoutAssignment.query.filter_by(
            client_id=client_id
        ).filter(
            WorkoutAssignment.assigned_date >= thirty_days_ago
        ).count()

        completed_assignments = WorkoutAssignment.query.filter_by(
            client_id=client_id,
            status='completed'
        ).filter(
            WorkoutAssignment.assigned_date >= thirty_days_ago
        ).count()

        adherence = (completed_assignments / total_assignments * 100) if total_assignments > 0 else 0

        # Average workout duration (simplified - uses default 45 minutes)
        # For production: join with Workout table and calculate avg(workout.duration)
        avg_duration = 45

        # Progress over time (weekly aggregation)
        progress_data = []
        for i in range(4):  # Last 4 weeks
            week_start = datetime.utcnow() - timedelta(weeks=i+1)
            week_end = datetime.utcnow() - timedelta(weeks=i)

            workouts = WorkoutAssignment.query.filter(
                WorkoutAssignment.client_id == client_id,
                WorkoutAssignment.status == 'completed',
                WorkoutAssignment.completed_at >= week_start,
                WorkoutAssignment.completed_at < week_end
            ).count()

            progress_data.append({
                'week': f'Week {4-i}',
                'workouts': workouts
            })

        return jsonify({
            'success': True,
            'data': {
                'clientId': client_id,
                'name': client.name,
                'adherence': round(adherence, 1),
                'totalWorkouts': total_assignments,
                'completedWorkouts': completed_assignments,
                'averageDuration': int(avg_duration),
                'progressData': list(reversed(progress_data))
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get client analytics: {str(e)}'
        }), 500
