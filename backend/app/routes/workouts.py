"""
Workouts API Routes - CRUD and assignment operations
F-013: API Workouts (crear, asignar, listar)
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Workout, WorkoutExercise, WorkoutAssignment, Exercise, Trainer, Client
from marshmallow import Schema, fields, ValidationError, validates_schema
from datetime import datetime, date

workouts_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')


# ==================== VALIDATION SCHEMAS ====================

class WorkoutExerciseInputSchema(Schema):
    """Schema for workout exercise input"""
    exercise_id = fields.Int(required=True)
    order_index = fields.Int(required=True)
    sets = fields.Int(required=True)
    reps = fields.Int(required=True)
    weight = fields.Float(required=False, allow_none=True)
    rest_seconds = fields.Int(required=False, allow_none=True)
    notes = fields.Str(required=False, allow_none=True)

    @validates_schema
    def validate_ranges(self, data, **kwargs):
        if data['sets'] < 1 or data['sets'] > 10:
            raise ValidationError({'sets': ['Sets must be between 1 and 10']})
        if data['reps'] < 1 or data['reps'] > 100:
            raise ValidationError({'reps': ['Reps must be between 1 and 100']})
        if 'weight' in data and data['weight'] is not None and data['weight'] < 0:
            raise ValidationError({'weight': ['Weight cannot be negative']})
        if 'rest_seconds' in data and data['rest_seconds'] is not None and data['rest_seconds'] < 0:
            raise ValidationError({'rest_seconds': ['Rest seconds cannot be negative']})


class WorkoutCreateSchema(Schema):
    """Schema for creating workouts"""
    trainer_id = fields.Int(required=True)
    name = fields.Str(required=True)
    description = fields.Str(required=False, allow_none=True)
    is_template = fields.Bool(required=False)
    exercises = fields.List(fields.Nested(WorkoutExerciseInputSchema), required=False)


class WorkoutUpdateSchema(Schema):
    """Schema for updating workouts"""
    name = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    is_template = fields.Bool(required=False)
    exercises = fields.List(fields.Nested(WorkoutExerciseInputSchema), required=False)


class AssignWorkoutSchema(Schema):
    """Schema for assigning workout to clients"""
    client_ids = fields.List(fields.Int(), required=True)
    assigned_date = fields.Date(required=False)

    @validates_schema
    def validate_client_ids(self, data, **kwargs):
        if not data['client_ids'] or len(data['client_ids']) == 0:
            raise ValidationError({'client_ids': ['At least one client_id is required']})


workout_create_schema = WorkoutCreateSchema()
workout_update_schema = WorkoutUpdateSchema()
assign_workout_schema = AssignWorkoutSchema()


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

@workouts_bp.route('', methods=['GET'])
def list_workouts():
    """
    GET /api/workouts
    Lista workouts de un trainer
    Query params:
        - trainer_id: ID del trainer (required)
        - is_template: Filtrar por templates (optional: true/false)
    """
    trainer_id = request.args.get('trainer_id')
    is_template = request.args.get('is_template')

    if not trainer_id:
        return error_response('trainer_id is required', status=400)

    try:
        trainer_id = int(trainer_id)
    except ValueError:
        return error_response('trainer_id must be a valid integer', status=400)

    # Verificar que el trainer existe
    trainer = Trainer.query.get(trainer_id)
    if not trainer:
        return error_response('Trainer not found', status=404)

    # Build query
    query = Workout.query.filter_by(trainer_id=trainer_id)

    # Filter by template status if specified
    if is_template is not None:
        is_template_bool = is_template.lower() == 'true'
        query = query.filter_by(is_template=is_template_bool)

    workouts = query.order_by(Workout.created_at.desc()).all()

    return success_response([workout.to_dict(include_exercises=True) for workout in workouts])


@workouts_bp.route('/<int:workout_id>', methods=['GET'])
def get_workout(workout_id):
    """
    GET /api/workouts/:id
    Obtiene detalles de un workout con sus ejercicios
    """
    workout = Workout.query.get(workout_id)

    if not workout:
        return error_response('Workout not found', status=404)

    return success_response(workout.to_dict(include_exercises=True))


@workouts_bp.route('', methods=['POST'])
def create_workout():
    """
    POST /api/workouts
    Crea un nuevo workout
    Body: { trainer_id, name, description?, is_template?, exercises? }
    """
    try:
        # Validate request data
        data = workout_create_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Verificar que el trainer existe
    trainer = Trainer.query.get(data['trainer_id'])
    if not trainer:
        return error_response('Trainer not found', status=404)

    # Crear workout
    workout = Workout(
        trainer_id=data['trainer_id'],
        name=data['name'],
        description=data.get('description'),
        is_template=data.get('is_template', False)
    )

    db.session.add(workout)
    db.session.flush()  # Flush to get workout.id before adding exercises

    # Agregar ejercicios si se especificaron
    if 'exercises' in data and data['exercises']:
        for ex_data in data['exercises']:
            # Verificar que el ejercicio existe
            exercise = Exercise.query.get(ex_data['exercise_id'])
            if not exercise:
                db.session.rollback()
                return error_response(f'Exercise with id {ex_data["exercise_id"]} not found', status=404)

            workout_exercise = WorkoutExercise(
                workout_id=workout.id,
                exercise_id=ex_data['exercise_id'],
                order_index=ex_data['order_index'],
                sets=ex_data['sets'],
                reps=ex_data['reps'],
                weight=ex_data.get('weight'),
                rest_seconds=ex_data.get('rest_seconds', 60),
                notes=ex_data.get('notes')
            )
            db.session.add(workout_exercise)

    db.session.commit()

    return success_response(
        workout.to_dict(include_exercises=True),
        message='Workout created successfully',
        status=201
    )


@workouts_bp.route('/<int:workout_id>', methods=['PUT'])
def update_workout(workout_id):
    """
    PUT /api/workouts/:id
    Actualiza un workout existente
    Body: { name?, description?, is_template?, exercises? }
    """
    workout = Workout.query.get(workout_id)

    if not workout:
        return error_response('Workout not found', status=404)

    try:
        # Validate request data
        data = workout_update_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Actualizar campos básicos
    if 'name' in data:
        workout.name = data['name']
    if 'description' in data:
        workout.description = data['description']
    if 'is_template' in data:
        workout.is_template = data['is_template']

    # Si se especificaron ejercicios, reemplazar todos
    if 'exercises' in data:
        # Eliminar ejercicios existentes
        WorkoutExercise.query.filter_by(workout_id=workout_id).delete()

        # Agregar nuevos ejercicios
        for ex_data in data['exercises']:
            # Verificar que el ejercicio existe
            exercise = Exercise.query.get(ex_data['exercise_id'])
            if not exercise:
                db.session.rollback()
                return error_response(f'Exercise with id {ex_data["exercise_id"]} not found', status=404)

            workout_exercise = WorkoutExercise(
                workout_id=workout.id,
                exercise_id=ex_data['exercise_id'],
                order_index=ex_data['order_index'],
                sets=ex_data['sets'],
                reps=ex_data['reps'],
                weight=ex_data.get('weight'),
                rest_seconds=ex_data.get('rest_seconds', 60),
                notes=ex_data.get('notes')
            )
            db.session.add(workout_exercise)

    db.session.commit()

    return success_response(
        workout.to_dict(include_exercises=True),
        message='Workout updated successfully'
    )


@workouts_bp.route('/<int:workout_id>', methods=['DELETE'])
def delete_workout(workout_id):
    """
    DELETE /api/workouts/:id
    Elimina un workout
    """
    workout = Workout.query.get(workout_id)

    if not workout:
        return error_response('Workout not found', status=404)

    db.session.delete(workout)
    db.session.commit()

    return success_response(
        {'id': workout_id},
        message='Workout deleted successfully'
    )


@workouts_bp.route('/<int:workout_id>/assign', methods=['POST'])
def assign_workout(workout_id):
    """
    POST /api/workouts/:id/assign
    Asigna un workout a uno o más clientes
    Body: { client_ids: [1, 2, 3], assigned_date?: '2025-11-20' }
    """
    workout = Workout.query.get(workout_id)

    if not workout:
        return error_response('Workout not found', status=404)

    try:
        # Validate request data
        data = assign_workout_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    assigned_date = data.get('assigned_date', date.today())
    assignments = []

    for client_id in data['client_ids']:
        # Verificar que el cliente existe y pertenece al mismo trainer
        client = Client.query.get(client_id)
        if not client:
            db.session.rollback()
            return error_response(f'Client with id {client_id} not found', status=404)

        if client.trainer_id != workout.trainer_id:
            db.session.rollback()
            return error_response(
                f'Client {client_id} does not belong to the same trainer',
                status=403
            )

        # Verificar si ya existe una asignación para este cliente/workout/fecha
        existing_assignment = WorkoutAssignment.query.filter_by(
            workout_id=workout_id,
            client_id=client_id,
            assigned_date=assigned_date
        ).first()

        if existing_assignment:
            # Skip si ya existe
            continue

        # Crear asignación
        assignment = WorkoutAssignment(
            workout_id=workout_id,
            client_id=client_id,
            assigned_date=assigned_date,
            status='pending'
        )
        db.session.add(assignment)
        assignments.append(assignment)

    db.session.commit()

    return success_response(
        {
            'workout_id': workout_id,
            'assigned_count': len(assignments),
            'assignments': [a.to_dict() for a in assignments]
        },
        message=f'Workout assigned to {len(assignments)} client(s)',
        status=201
    )


@workouts_bp.route('/client/<int:client_id>', methods=['GET'])
def get_client_workouts(client_id):
    """
    GET /api/workouts/client/:clientId
    Obtiene workouts asignados a un cliente específico
    Query params:
        - status: Filtrar por status (optional: pending, in_progress, completed, skipped)
        - from_date: Fecha desde (optional: YYYY-MM-DD)
        - to_date: Fecha hasta (optional: YYYY-MM-DD)
    """
    client = Client.query.get(client_id)

    if not client:
        return error_response('Client not found', status=404)

    # Build query
    query = WorkoutAssignment.query.filter_by(client_id=client_id)

    # Filter by status
    status = request.args.get('status')
    if status:
        query = query.filter_by(status=status)

    # Filter by date range
    from_date = request.args.get('from_date')
    to_date = request.args.get('to_date')

    if from_date:
        try:
            from_date_obj = datetime.strptime(from_date, '%Y-%m-%d').date()
            query = query.filter(WorkoutAssignment.assigned_date >= from_date_obj)
        except ValueError:
            return error_response('Invalid from_date format. Use YYYY-MM-DD', status=400)

    if to_date:
        try:
            to_date_obj = datetime.strptime(to_date, '%Y-%m-%d').date()
            query = query.filter(WorkoutAssignment.assigned_date <= to_date_obj)
        except ValueError:
            return error_response('Invalid to_date format. Use YYYY-MM-DD', status=400)

    assignments = query.order_by(WorkoutAssignment.assigned_date.desc()).all()

    return success_response([
        assignment.to_dict(include_workout=True)
        for assignment in assignments
    ])
