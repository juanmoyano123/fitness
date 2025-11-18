"""
Analytics Routes - F-018
Endpoints for trainer and client analytics
"""
from flask import Blueprint, jsonify, request, g
from datetime import datetime, timedelta
from sqlalchemy import func, case
from app import db
from app.models import Client, WorkoutAssignment, WorkoutLog, WorkoutExercise

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@analytics_bp.route('/trainers/me', methods=['GET'])
def get_trainer_analytics():
    """
    GET /api/analytics/trainers/me - Dashboard stats global

    Query params:
    - period: 'week', 'month', 'quarter', 'year' (default: 'week')

    Returns trainer analytics including adherence, activity, and client stats
    """
    # Get trainer_id from header (demo mode, will be from JWT in Phase 6)
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')
    period = request.args.get('period', 'week')

    # Calculate date range
    now = datetime.utcnow()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'month':
        start_date = now - timedelta(days=30)
    elif period == 'quarter':
        start_date = now - timedelta(days=90)
    elif period == 'year':
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=7)

    # Total clients
    total_clients = db.session.query(func.count(Client.id)).filter(
        Client.trainer_id == trainer_id
    ).scalar() or 0

    # Active clients (completed at least 1 workout in period)
    active_clients_query = db.session.query(func.count(func.distinct(WorkoutAssignment.client_id))).join(
        Client, Client.id == WorkoutAssignment.client_id
    ).filter(
        Client.trainer_id == trainer_id,
        WorkoutAssignment.status == 'completed',
        WorkoutAssignment.completed_at >= start_date
    ).scalar() or 0

    # Workouts stats in period
    workouts_stats = db.session.query(
        func.count(WorkoutAssignment.id).label('total_assigned'),
        func.sum(case((WorkoutAssignment.status == 'completed', 1), else_=0)).label('total_completed')
    ).join(
        Client, Client.id == WorkoutAssignment.client_id
    ).filter(
        Client.trainer_id == trainer_id,
        WorkoutAssignment.assigned_date >= start_date.date()
    ).first()

    total_assigned = int(workouts_stats.total_assigned or 0)
    total_completed = int(workouts_stats.total_completed or 0)
    avg_adherence = round((total_completed / total_assigned * 100), 1) if total_assigned > 0 else 0

    # Weekly activity (last 7 days regardless of period filter)
    weekly_start = now - timedelta(days=7)
    weekly_activity = db.session.query(
        func.date(WorkoutAssignment.completed_at).label('date'),
        func.count(WorkoutAssignment.id).label('completed')
    ).join(
        Client, Client.id == WorkoutAssignment.client_id
    ).filter(
        Client.trainer_id == trainer_id,
        WorkoutAssignment.status == 'completed',
        WorkoutAssignment.completed_at >= weekly_start
    ).group_by(
        func.date(WorkoutAssignment.completed_at)
    ).order_by(
        func.date(WorkoutAssignment.completed_at)
    ).all()

    weekly_activity_list = [
        {
            'date': activity.date if activity.date else None,
            'completed': activity.completed
        }
        for activity in weekly_activity
    ]

    # Adherence per client in period
    clients_adherence = db.session.query(
        Client.id,
        Client.name,
        func.count(WorkoutAssignment.id).label('total_assigned'),
        func.sum(case((WorkoutAssignment.status == 'completed', 1), else_=0)).label('total_completed')
    ).outerjoin(
        WorkoutAssignment, WorkoutAssignment.client_id == Client.id
    ).filter(
        Client.trainer_id == trainer_id,
        WorkoutAssignment.assigned_date >= start_date.date()
    ).group_by(
        Client.id, Client.name
    ).all()

    clients_adherence_list = [
        {
            'clientId': client.id,
            'name': client.name,
            'adherence': round((client.total_completed / client.total_assigned * 100), 1) if client.total_assigned > 0 else 0,
            'workoutsCompleted': int(client.total_completed or 0),
            'workoutsAssigned': int(client.total_assigned or 0)
        }
        for client in clients_adherence
    ]

    return jsonify({
        'totalClients': total_clients,
        'activeClients': active_clients_query,
        'avgAdherence': avg_adherence,
        'workoutsThisWeek': total_completed,
        'weeklyActivity': weekly_activity_list,
        'clientsAdherence': clients_adherence_list
    })


@analytics_bp.route('/clients/<string:client_id>', methods=['GET'])
def get_client_analytics(client_id):
    """
    GET /api/analytics/clients/:id - Analytics for specific client

    Query params:
    - period: 'week', 'month', 'quarter', 'year' (default: 'month')

    Returns client analytics including adherence and progress by exercise
    """
    period = request.args.get('period', 'month')

    # Calculate date range
    now = datetime.utcnow()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'month':
        start_date = now - timedelta(days=30)
    elif period == 'quarter':
        start_date = now - timedelta(days=90)
    elif period == 'year':
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=30)

    # Get client
    client = db.session.query(Client).filter(Client.id == client_id).first()
    if not client:
        return jsonify({'error': 'Client not found'}), 404

    # Workouts stats
    workouts_stats = db.session.query(
        func.count(WorkoutAssignment.id).label('total_assigned'),
        func.sum(case((WorkoutAssignment.status == 'completed', 1), else_=0)).label('total_completed'),
        func.max(WorkoutAssignment.completed_at).label('last_workout')
    ).filter(
        WorkoutAssignment.client_id == client_id,
        WorkoutAssignment.assigned_date >= start_date.date()
    ).first()

    total_assigned = int(workouts_stats.total_assigned or 0)
    total_completed = int(workouts_stats.total_completed or 0)
    adherence = round((total_completed / total_assigned * 100), 1) if total_assigned > 0 else 0
    last_workout = workouts_stats.last_workout.isoformat() if workouts_stats.last_workout else None

    # Progress by exercise
    progress_query = db.session.query(
        WorkoutExercise.exercise_id,
        func.date(WorkoutLog.logged_at).label('workout_date'),
        func.avg(WorkoutLog.weight_used).label('avg_weight'),
        func.max(WorkoutLog.weight_used).label('max_weight'),
        func.sum(WorkoutLog.reps_completed).label('total_reps')
    ).join(
        WorkoutLog, WorkoutLog.workout_exercise_id == WorkoutExercise.id
    ).join(
        WorkoutAssignment, WorkoutAssignment.id == WorkoutLog.assignment_id
    ).filter(
        WorkoutAssignment.client_id == client_id,
        WorkoutLog.logged_at >= start_date
    ).group_by(
        WorkoutExercise.exercise_id,
        func.date(WorkoutLog.logged_at)
    ).order_by(
        WorkoutExercise.exercise_id,
        func.date(WorkoutLog.logged_at).desc()
    ).all()

    # Group by exercise
    progress_by_exercise = {}
    for row in progress_query:
        exercise_id = row.exercise_id
        if exercise_id not in progress_by_exercise:
            progress_by_exercise[exercise_id] = {
                'exerciseId': exercise_id,
                'sessions': []
            }

        progress_by_exercise[exercise_id]['sessions'].append({
            'date': row.workout_date if row.workout_date else None,
            'avgWeight': round(float(row.avg_weight), 1) if row.avg_weight else 0,
            'maxWeight': round(float(row.max_weight), 1) if row.max_weight else 0,
            'totalReps': int(row.total_reps or 0)
        })

    progress_by_exercise_list = list(progress_by_exercise.values())

    return jsonify({
        'client': {
            'id': client.id,
            'name': client.name,
            'email': client.email
        },
        'adherence': adherence,
        'workoutsCompleted': total_completed,
        'workoutsAssigned': total_assigned,
        'lastWorkout': last_workout,
        'progressByExercise': progress_by_exercise_list
    })
