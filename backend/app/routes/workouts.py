"""
Workout routes - F-013
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Workout, WorkoutExercise, WorkoutAssignment, Exercise
from datetime import datetime, date
import uuid

workouts_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')


@workouts_bp.route('', methods=['GET'])
def list_workouts():
    """List all workouts for authenticated trainer"""
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')

    workouts = Workout.query.filter_by(trainer_id=trainer_id).order_by(
        Workout.created_at.desc()
    ).all()

    result = []
    for workout in workouts:
        # Get exercise count
        exercise_count = workout.exercises.count()

        # Get assignment count
        assignment_count = workout.assignments.count()

        result.append({
            'id': workout.id,
            'name': workout.name,
            'description': workout.description,
            'category': workout.category,
            'difficulty': workout.difficulty,
            'durationMinutes': workout.duration_minutes,
            'exerciseCount': exercise_count,
            'assignmentCount': assignment_count,
            'createdAt': workout.created_at.isoformat(),
            'updatedAt': workout.updated_at.isoformat()
        })

    return jsonify(result), 200


@workouts_bp.route('', methods=['POST'])
def create_workout():
    """Create a new workout"""
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')
    data = request.get_json()

    # Validation
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400

    # Create workout
    workout = Workout(
        id=f"workout-{uuid.uuid4().hex[:8]}",
        trainer_id=trainer_id,
        name=data['name'],
        description=data.get('description', ''),
        category=data.get('category', ''),
        difficulty=data.get('difficulty', 'intermediate'),
        duration_minutes=data.get('durationMinutes', 45)
    )

    db.session.add(workout)

    # Add exercises
    exercises = data.get('exercises', [])
    for idx, ex_data in enumerate(exercises):
        workout_exercise = WorkoutExercise(
            id=f"we-{uuid.uuid4().hex[:8]}",
            workout_id=workout.id,
            exercise_id=ex_data['exerciseId'],
            order_index=idx,
            sets=ex_data.get('sets', 3),
            reps=ex_data.get('reps', '10'),
            rest_seconds=ex_data.get('restSeconds', 60),
            notes=ex_data.get('notes', '')
        )
        db.session.add(workout_exercise)

    db.session.commit()

    return jsonify({
        'id': workout.id,
        'name': workout.name,
        'description': workout.description,
        'category': workout.category,
        'difficulty': workout.difficulty,
        'durationMinutes': workout.duration_minutes,
        'createdAt': workout.created_at.isoformat()
    }), 201


@workouts_bp.route('/<workout_id>', methods=['GET'])
def get_workout(workout_id):
    """Get workout details with exercises"""
    workout = Workout.query.get_or_404(workout_id)

    # Get exercises with details
    workout_exercises = workout.exercises.order_by(WorkoutExercise.order_index).all()
    exercises = []

    for we in workout_exercises:
        exercise = we.exercise
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
            'orderIndex': we.order_index
        })

    return jsonify({
        'id': workout.id,
        'name': workout.name,
        'description': workout.description,
        'category': workout.category,
        'difficulty': workout.difficulty,
        'durationMinutes': workout.duration_minutes,
        'exercises': exercises,
        'createdAt': workout.created_at.isoformat(),
        'updatedAt': workout.updated_at.isoformat()
    }), 200


@workouts_bp.route('/<workout_id>', methods=['PUT'])
def update_workout(workout_id):
    """Update workout"""
    workout = Workout.query.get_or_404(workout_id)
    data = request.get_json()

    # Update basic fields
    if 'name' in data:
        workout.name = data['name']
    if 'description' in data:
        workout.description = data['description']
    if 'category' in data:
        workout.category = data['category']
    if 'difficulty' in data:
        workout.difficulty = data['difficulty']
    if 'durationMinutes' in data:
        workout.duration_minutes = data['durationMinutes']

    # Update exercises if provided
    if 'exercises' in data:
        # Delete existing exercises
        WorkoutExercise.query.filter_by(workout_id=workout_id).delete()

        # Add new exercises
        for idx, ex_data in enumerate(data['exercises']):
            workout_exercise = WorkoutExercise(
                id=f"we-{uuid.uuid4().hex[:8]}",
                workout_id=workout.id,
                exercise_id=ex_data['exerciseId'],
                order_index=idx,
                sets=ex_data.get('sets', 3),
                reps=ex_data.get('reps', '10'),
                rest_seconds=ex_data.get('restSeconds', 60),
                notes=ex_data.get('notes', '')
            )
            db.session.add(workout_exercise)

    workout.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'id': workout.id,
        'name': workout.name,
        'description': workout.description,
        'updatedAt': workout.updated_at.isoformat()
    }), 200


@workouts_bp.route('/<workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    """Delete workout"""
    workout = Workout.query.get_or_404(workout_id)
    db.session.delete(workout)
    db.session.commit()

    return jsonify({'message': 'Workout deleted successfully'}), 200


@workouts_bp.route('/<workout_id>/assign', methods=['POST'])
def assign_workout(workout_id):
    """Assign workout to clients"""
    workout = Workout.query.get_or_404(workout_id)
    data = request.get_json()

    client_ids = data.get('clientIds', [])
    scheduled_date = data.get('scheduledDate')

    if not client_ids:
        return jsonify({'error': 'At least one client is required'}), 400

    # Parse scheduled date
    sched_date = None
    if scheduled_date:
        try:
            sched_date = datetime.fromisoformat(scheduled_date.replace('Z', '+00:00')).date()
        except:
            sched_date = None

    # Create assignments
    assignments = []
    for client_id in client_ids:
        assignment = WorkoutAssignment(
            id=f"assignment-{uuid.uuid4().hex[:8]}",
            workout_id=workout_id,
            client_id=client_id,
            scheduled_date=sched_date,
            status='pending'
        )
        db.session.add(assignment)
        assignments.append(assignment)

    db.session.commit()

    return jsonify({
        'message': f'Workout assigned to {len(client_ids)} client(s)',
        'assignmentCount': len(assignments)
    }), 201
