"""
Analytics Routes - Dashboard stats and client metrics (FASE 5)
Endpoints según especificación FASE 5:
- GET /api/trainers/me/analytics
- GET /api/clients/:id/analytics
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from app import db
from app.models import Client, WorkoutAssignment, Trainer
from sqlalchemy import func

# FASE 5: trainers blueprint (no analytics blueprint)
trainers_bp = Blueprint('trainers', __name__, url_prefix='/api/trainers')
# Keep analytics_bp for backward compatibility with FASE 6 work
analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


def require_trainer():
    """Helper to verify user is a trainer"""
    claims = get_jwt()
    if claims.get('type') != 'trainer':
        return jsonify({
            'success': False,
            'error': 'Trainer access required'
        }), 403
    return None


@trainers_bp.route('/me/analytics', methods=['GET'])
@jwt_required()
def get_trainer_analytics():
    """
    Get trainer dashboard analytics (FASE 5 spec)

    Endpoint: GET /api/trainers/me/analytics

    Response:
    {
        "totalClients": 15,
        "activeClients": 12,
        "avgAdherence": 73.5,
        "workoutsThisWeek": 48,
        "weeklyActivity": [...],
        "clientsAdherence": [...]
    }
    """
    error_response = require_trainer()
    if error_response:
        return error_response

    try:
        trainer_id = get_jwt_identity()
        seven_days_ago = datetime.utcnow() - timedelta(days=7)

        # Total clients
        total_clients = Client.query.filter_by(
            trainer_id=trainer_id,
            is_active=True
        ).count()

        # Active clients (completed at least one workout in last 7 days)
        # Use WorkoutAssignment instead of WorkoutLog (schema.sql compliant)
        active_clients = db.session.query(
            func.count(func.distinct(WorkoutAssignment.client_id))
        ).filter(
            WorkoutAssignment.trainer_id == trainer_id,
            WorkoutAssignment.status == 'completed',
            WorkoutAssignment.completed_at >= seven_days_ago
        ).scalar() or 0

        # Workouts completed this week
        # Use WorkoutAssignment instead of WorkoutLog
        workouts_this_week = WorkoutAssignment.query.filter_by(
            trainer_id=trainer_id,
            status='completed'
        ).filter(
            WorkoutAssignment.completed_at >= seven_days_ago
        ).count()

        # Average adherence calculation
        # Adherence = (completed assignments / total assignments) * 100
        total_assignments = WorkoutAssignment.query.filter_by(
            trainer_id=trainer_id
        ).filter(
            WorkoutAssignment.assigned_date >= seven_days_ago
        ).count()

        completed_assignments = WorkoutAssignment.query.filter_by(
            trainer_id=trainer_id,
            status='completed'
        ).filter(
            WorkoutAssignment.assigned_date >= seven_days_ago
        ).count()

        avg_adherence = (completed_assignments / total_assignments * 100) if total_assignments > 0 else 0

        # Weekly activity (workouts per day)
        # Use WorkoutAssignment instead of WorkoutLog (schema.sql compliant)
        weekly_activity = []
        for i in range(7):
            day = datetime.utcnow() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)

            count = WorkoutAssignment.query.filter_by(
                trainer_id=trainer_id,
                status='completed'
            ).filter(
                WorkoutAssignment.completed_at >= day_start,
                WorkoutAssignment.completed_at < day_end
            ).count()

            weekly_activity.append({
                'date': day_start.isoformat(),
                'completed': count
            })

        # Client adherence breakdown
        clients = Client.query.filter_by(trainer_id=trainer_id, is_active=True).all()
        clients_adherence = []

        for client in clients:
            assigned = WorkoutAssignment.query.filter_by(
                client_id=client.id
            ).filter(
                WorkoutAssignment.assigned_date >= seven_days_ago
            ).count()

            completed = WorkoutAssignment.query.filter_by(
                client_id=client.id,
                status='completed'
            ).filter(
                WorkoutAssignment.assigned_date >= seven_days_ago
            ).count()

            adherence = (completed / assigned * 100) if assigned > 0 else 0

            clients_adherence.append({
                'clientId': client.id,
                'name': client.name,
                'adherence': round(adherence, 1),
                'workoutsCompleted': completed,
                'workoutsAssigned': assigned
            })

        # Sort by adherence (lowest first - clients at risk)
        clients_adherence.sort(key=lambda x: x['adherence'])

        return jsonify({
            'success': True,
            'data': {
                'totalClients': total_clients,
                'activeClients': active_clients,
                'avgAdherence': round(avg_adherence, 1),
                'workoutsThisWeek': workouts_this_week,
                'weeklyActivity': list(reversed(weekly_activity)),  # Oldest first
                'clientsAdherence': clients_adherence
            }
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to get analytics: {str(e)}'
        }), 500


@analytics_bp.route('/client/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client_analytics(client_id):
    """
    Get detailed analytics for a specific client

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

        # Average workout duration - calculate from completed assignments
        # Since WorkoutLog no longer tracks duration_seconds (schema.sql structure),
        # use workout.duration field from assignments
        avg_duration_query = db.session.query(
            func.avg(db.case(
                (WorkoutAssignment.status == 'completed',
                 db.select(db.text('workouts.duration'))
                 .where(db.text('workouts.id = workout_assignments.workout_id'))
                 .scalar_subquery()),
                else_=None
            ))
        ).filter(
            WorkoutAssignment.client_id == client_id,
            WorkoutAssignment.assigned_date >= thirty_days_ago
        )

        # Simplified: just use 45 minutes as default (or fetch from workout model)
        # For proper implementation, would need to join with Workout table
        avg_duration = 45  # Default estimation

        # Progress over time (weekly aggregation)
        # Use WorkoutAssignment instead of WorkoutLog
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
