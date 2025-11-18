"""
Workout Logs API Routes - Track workout progress
F-014: API Logging de Entrenamientos
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import WorkoutLog, WorkoutAssignment, WorkoutExercise
from marshmallow import Schema, fields, ValidationError, validates_schema
from datetime import datetime

logs_bp = Blueprint('logs', __name__, url_prefix='/api/assignments')


# ==================== VALIDATION SCHEMAS ====================

class LogSetSchema(Schema):
    """Schema for logging a single set"""
    workout_exercise_id = fields.Int(required=True)
    set_number = fields.Int(required=True)
    reps_completed = fields.Int(required=True)
    weight_used = fields.Float(required=False, allow_none=True)
    rpe = fields.Int(required=False, allow_none=True)
    notes = fields.Str(required=False, allow_none=True)

    @validates_schema
    def validate_ranges(self, data, **kwargs):
        if data['set_number'] < 1:
            raise ValidationError({'set_number': ['Set number must be >= 1']})
        if data['reps_completed'] < 0:
            raise ValidationError({'reps_completed': ['Reps completed cannot be negative']})
        if 'weight_used' in data and data['weight_used'] is not None and data['weight_used'] < 0:
            raise ValidationError({'weight_used': ['Weight cannot be negative']})
        if 'rpe' in data and data['rpe'] is not None:
            if data['rpe'] < 1 or data['rpe'] > 10:
                raise ValidationError({'rpe': ['RPE must be between 1 and 10']})


log_set_schema = LogSetSchema()


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

@logs_bp.route('/<int:assignment_id>', methods=['GET'])
def get_assignment(assignment_id):
    """
    GET /api/assignments/:id
    Obtiene detalles de una asignación de workout con logs
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    return success_response(assignment.to_dict(include_workout=True, include_logs=True))


@logs_bp.route('/<int:assignment_id>/start', methods=['POST'])
def start_workout(assignment_id):
    """
    POST /api/assignments/:id/start
    Marca un workout como "in_progress"
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    if assignment.status != 'pending':
        return error_response(
            f'Cannot start workout. Current status is: {assignment.status}',
            status=400
        )

    assignment.status = 'in_progress'
    db.session.commit()

    return success_response(
        assignment.to_dict(),
        message='Workout started successfully'
    )


@logs_bp.route('/<int:assignment_id>/logs', methods=['POST'])
def log_set(assignment_id):
    """
    POST /api/assignments/:id/logs
    Registra un set completado
    Body: { workout_exercise_id, set_number, reps_completed, weight_used?, rpe?, notes? }
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    try:
        # Validate request data
        data = log_set_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Verificar que el workout_exercise pertenece al workout de esta asignación
    workout_exercise = WorkoutExercise.query.get(data['workout_exercise_id'])

    if not workout_exercise:
        return error_response('Workout exercise not found', status=404)

    if workout_exercise.workout_id != assignment.workout_id:
        return error_response(
            'Workout exercise does not belong to this workout assignment',
            status=400
        )

    # Verificar si ya existe un log para este set
    existing_log = WorkoutLog.query.filter_by(
        assignment_id=assignment_id,
        workout_exercise_id=data['workout_exercise_id'],
        set_number=data['set_number']
    ).first()

    if existing_log:
        # Actualizar log existente
        existing_log.reps_completed = data['reps_completed']
        existing_log.weight_used = data.get('weight_used')
        existing_log.rpe = data.get('rpe')
        existing_log.notes = data.get('notes')
        existing_log.logged_at = datetime.utcnow()

        db.session.commit()

        return success_response(
            existing_log.to_dict(),
            message='Set log updated successfully'
        )

    # Crear nuevo log
    workout_log = WorkoutLog(
        assignment_id=assignment_id,
        workout_exercise_id=data['workout_exercise_id'],
        set_number=data['set_number'],
        reps_completed=data['reps_completed'],
        weight_used=data.get('weight_used'),
        rpe=data.get('rpe'),
        notes=data.get('notes')
    )

    db.session.add(workout_log)

    # Auto-cambiar status a in_progress si está pending
    if assignment.status == 'pending':
        assignment.status = 'in_progress'

    db.session.commit()

    return success_response(
        workout_log.to_dict(),
        message='Set logged successfully',
        status=201
    )


@logs_bp.route('/<int:assignment_id>/complete', methods=['POST'])
def complete_workout(assignment_id):
    """
    POST /api/assignments/:id/complete
    Finaliza un workout (marca como completed)
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    if assignment.status == 'completed':
        return error_response('Workout is already completed', status=400)

    assignment.status = 'completed'
    assignment.completed_at = datetime.utcnow()
    db.session.commit()

    return success_response(
        assignment.to_dict(include_logs=True),
        message='Workout completed successfully'
    )


@logs_bp.route('/<int:assignment_id>/skip', methods=['POST'])
def skip_workout(assignment_id):
    """
    POST /api/assignments/:id/skip
    Marca un workout como "skipped"
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    assignment.status = 'skipped'
    db.session.commit()

    return success_response(
        assignment.to_dict(),
        message='Workout skipped'
    )


@logs_bp.route('/<int:assignment_id>/logs', methods=['GET'])
def get_assignment_logs(assignment_id):
    """
    GET /api/assignments/:id/logs
    Obtiene todos los logs de una asignación
    """
    assignment = WorkoutAssignment.query.get(assignment_id)

    if not assignment:
        return error_response('Assignment not found', status=404)

    logs = WorkoutLog.query.filter_by(assignment_id=assignment_id)\
        .order_by(WorkoutLog.logged_at)\
        .all()

    # Agrupar logs por ejercicio
    logs_by_exercise = {}
    for log in logs:
        ex_id = log.workout_exercise_id
        if ex_id not in logs_by_exercise:
            workout_exercise = WorkoutExercise.query.get(ex_id)
            logs_by_exercise[ex_id] = {
                'workout_exercise': workout_exercise.to_dict(include_exercise=True),
                'sets': []
            }
        logs_by_exercise[ex_id]['sets'].append(log.to_dict())

    return success_response({
        'assignment_id': assignment_id,
        'status': assignment.status,
        'exercises': list(logs_by_exercise.values())
    })
