"""
Exercise routes - F-012
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Exercise
from app.services.exercisedb import exercise_db_service
import uuid

exercises_bp = Blueprint('exercises', __name__, url_prefix='/api/exercises')


@exercises_bp.route('', methods=['GET'])
def list_exercises():
    """List exercises with search and filters"""
    # Get query parameters
    search = request.args.get('search', '')
    body_part = request.args.get('bodyPart', '')
    target = request.args.get('target', '')
    equipment = request.args.get('equipment', '')
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))

    exercises = []

    # Search by name
    if search:
        exercises = exercise_db_service.search_exercises(search, limit=limit)
    # Filter by body part
    elif body_part:
        exercises = exercise_db_service.get_by_body_part(body_part, limit=limit)
    # Filter by target muscle
    elif target:
        exercises = exercise_db_service.get_by_target(target, limit=limit)
    # Filter by equipment
    elif equipment:
        exercises = exercise_db_service.get_by_equipment(equipment, limit=limit)
    # Default: get all exercises
    else:
        exercises = exercise_db_service.get_exercises(limit=limit, offset=offset)

    # Also include custom exercises from trainer
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')
    custom_exercises = Exercise.query.filter_by(
        trainer_id=trainer_id,
        is_custom=True
    ).all()

    for ex in custom_exercises:
        exercises.append({
            'id': ex.id,
            'externalId': ex.external_id,
            'name': ex.name,
            'bodyPart': ex.body_part,
            'equipment': ex.equipment,
            'target': ex.target,
            'gifUrl': ex.gif_url,
            'instructions': ex.instructions.split('\n') if ex.instructions else [],
            'isCustom': True
        })

    return jsonify(exercises), 200


@exercises_bp.route('/filters', methods=['GET'])
def get_filters():
    """Get available filters (body parts, targets, equipment)"""
    body_parts = exercise_db_service.get_body_parts()
    targets = exercise_db_service.get_target_muscles()
    equipment = exercise_db_service.get_equipment_list()

    return jsonify({
        'bodyParts': body_parts,
        'targets': targets,
        'equipment': equipment
    }), 200


@exercises_bp.route('/custom', methods=['POST'])
def create_custom_exercise():
    """Create a custom exercise"""
    trainer_id = request.headers.get('X-Trainer-Id', 'trainer-demo-1')
    data = request.get_json()

    # Validation
    if not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400

    exercise = Exercise(
        id=f"custom-{uuid.uuid4().hex[:8]}",
        name=data['name'],
        body_part=data.get('bodyPart', ''),
        equipment=data.get('equipment', ''),
        target=data.get('target', ''),
        gif_url=data.get('gifUrl', ''),
        instructions='\n'.join(data.get('instructions', [])),
        is_custom=True,
        trainer_id=trainer_id
    )

    db.session.add(exercise)
    db.session.commit()

    return jsonify({
        'id': exercise.id,
        'name': exercise.name,
        'bodyPart': exercise.body_part,
        'equipment': exercise.equipment,
        'target': exercise.target,
        'gifUrl': exercise.gif_url,
        'instructions': exercise.instructions.split('\n') if exercise.instructions else [],
        'isCustom': True
    }), 201


@exercises_bp.route('/<exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    """Get exercise details"""
    # Check if it's a custom exercise
    if exercise_id.startswith('custom-'):
        exercise = Exercise.query.get_or_404(exercise_id)
        return jsonify({
            'id': exercise.id,
            'name': exercise.name,
            'bodyPart': exercise.body_part,
            'equipment': exercise.equipment,
            'target': exercise.target,
            'gifUrl': exercise.gif_url,
            'instructions': exercise.instructions.split('\n') if exercise.instructions else [],
            'isCustom': True
        }), 200
    else:
        # It's from ExerciseDB - could fetch from API or cache
        # For now, return a simple response
        return jsonify({'error': 'Exercise details not implemented for ExerciseDB exercises'}), 501
