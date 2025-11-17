"""
Workout Assignment and Logging routes - F-014
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import WorkoutAssignment, WorkoutLog, Workout, WorkoutExercise
from datetime import datetime
import uuid

assignments_bp = Blueprint('assignments', __name__, url_prefix='/api/assignments')


@assignments_bp.route('', methods=['GET'])
def list_assignments():
    """List workout assignments for a client"""
    client_id = request.args.get('clientId')

    if not client_id:
        return jsonify({'error': 'clientId is required'}), 400

    assignments = WorkoutAssignment.query.filter_by(
        client_id=client_id
    ).order_by(WorkoutAssignment.assigned_date.desc()).all()

    result = []
    for assignment in assignments:
        workout = assignment.workout

        # Get exercise count
        exercise_count = workout.exercises.count()

        # Get logged sets count
        logged_sets = assignment.logs.count()

        result.append({
            'id': assignment.id,
            'workoutId': workout.id,
            'workoutName': workout.name,
            'description': workout.description,
            'category': workout.category,
            'difficulty': workout.difficulty,
            'durationMinutes': workout.duration_minutes,
            'exerciseCount': exercise_count,
            'status': assignment.status,
            'assignedDate': assignment.assigned_date.isoformat(),
            'scheduledDate': assignment.scheduled_date.isoformat() if assignment.scheduled_date else None,
            'startedAt': assignment.started_at.isoformat() if assignment.started_at else None,
            'completedAt': assignment.completed_at.isoformat() if assignment.completed_at else None,
            'loggedSets': logged_sets
        })

    return jsonify(result), 200


@assignments_bp.route('/<assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    """Get assignment details with exercises and logs"""
    assignment = WorkoutAssignment.query.get_or_404(assignment_id)
    workout = assignment.workout

    # Get exercises with logs
    workout_exercises = workout.exercises.order_by(WorkoutExercise.order_index).all()
    exercises = []

    for we in workout_exercises:
        exercise = we.exercise

        # Get logs for this exercise
        logs = WorkoutLog.query.filter_by(
            assignment_id=assignment_id,
            workout_exercise_id=we.id
        ).order_by(WorkoutLog.set_number).all()

        exercise_logs = []
        for log in logs:
            exercise_logs.append({
                'id': log.id,
                'setNumber': log.set_number,
                'repsCompleted': log.reps_completed,
                'weightUsed': log.weight_used,
                'loggedAt': log.logged_at.isoformat()
            })

        exercises.append({
            'id': we.id,
            'exerciseId': exercise.id,
            'name': exercise.name,
            'bodyPart': exercise.body_part,
            'equipment': exercise.equipment,
            'target': exercise.target,
            'gifUrl': exercise.gif_url,
            'sets': we.sets,
            'reps': we.reps,
            'restSeconds': we.rest_seconds,
            'notes': we.notes,
            'orderIndex': we.order_index,
            'logs': exercise_logs
        })

    return jsonify({
        'id': assignment.id,
        'workoutId': workout.id,
        'workoutName': workout.name,
        'description': workout.description,
        'category': workout.category,
        'difficulty': workout.difficulty,
        'durationMinutes': workout.duration_minutes,
        'status': assignment.status,
        'assignedDate': assignment.assigned_date.isoformat(),
        'scheduledDate': assignment.scheduled_date.isoformat() if assignment.scheduled_date else None,
        'startedAt': assignment.started_at.isoformat() if assignment.started_at else None,
        'completedAt': assignment.completed_at.isoformat() if assignment.completed_at else None,
        'exercises': exercises
    }), 200


@assignments_bp.route('/<assignment_id>/start', methods=['POST'])
def start_assignment(assignment_id):
    """Start a workout"""
    assignment = WorkoutAssignment.query.get_or_404(assignment_id)

    if assignment.status != 'pending':
        return jsonify({'error': 'Workout already started'}), 400

    assignment.status = 'in_progress'
    assignment.started_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'id': assignment.id,
        'status': assignment.status,
        'startedAt': assignment.started_at.isoformat()
    }), 200


@assignments_bp.route('/<assignment_id>/logs', methods=['POST'])
def log_set(assignment_id):
    """Log a completed set"""
    assignment = WorkoutAssignment.query.get_or_404(assignment_id)
    data = request.get_json()

    # Validation
    if not data.get('workoutExerciseId'):
        return jsonify({'error': 'workoutExerciseId is required'}), 400

    # Create log
    log = WorkoutLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        assignment_id=assignment_id,
        workout_exercise_id=data['workoutExerciseId'],
        set_number=data.get('setNumber', 1),
        reps_completed=data.get('repsCompleted'),
        weight_used=data.get('weightUsed')
    )

    db.session.add(log)

    # Update assignment status to in_progress if not already
    if assignment.status == 'pending':
        assignment.status = 'in_progress'
        assignment.started_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        'id': log.id,
        'setNumber': log.set_number,
        'repsCompleted': log.reps_completed,
        'weightUsed': log.weight_used,
        'loggedAt': log.logged_at.isoformat()
    }), 201


@assignments_bp.route('/<assignment_id>/complete', methods=['POST'])
def complete_assignment(assignment_id):
    """Mark workout as completed"""
    assignment = WorkoutAssignment.query.get_or_404(assignment_id)

    if assignment.status == 'completed':
        return jsonify({'error': 'Workout already completed'}), 400

    assignment.status = 'completed'
    assignment.completed_at = datetime.utcnow()

    # Calculate duration
    if assignment.started_at:
        duration = (assignment.completed_at - assignment.started_at).total_seconds() / 60
        assignment.duration_minutes = int(duration)

    db.session.commit()

    return jsonify({
        'id': assignment.id,
        'status': assignment.status,
        'completedAt': assignment.completed_at.isoformat(),
        'durationMinutes': assignment.duration_minutes
    }), 200


@assignments_bp.route('/<assignment_id>/skip', methods=['POST'])
def skip_assignment(assignment_id):
    """Mark workout as skipped"""
    assignment = WorkoutAssignment.query.get_or_404(assignment_id)

    assignment.status = 'skipped'
    db.session.commit()

    return jsonify({
        'id': assignment.id,
        'status': assignment.status
    }), 200
