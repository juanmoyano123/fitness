"""
Exercises API Routes
F-012: Integración ExerciseDB API + Cache
"""
from flask import Blueprint, request, jsonify
from app import db
from app.models import Exercise, Trainer
from app.services.exercisedb_service import exercisedb_service
from marshmallow import Schema, fields, ValidationError
from sqlalchemy import or_

exercises_bp = Blueprint('exercises', __name__, url_prefix='/api/exercises')


# ==================== VALIDATION SCHEMAS ====================

class CustomExerciseSchema(Schema):
    """Schema for creating custom exercises"""
    trainer_id = fields.Int(required=True)
    name = fields.Str(required=True)
    body_part = fields.Str(required=False)
    equipment = fields.Str(required=False)
    target_muscle = fields.Str(required=False)
    instructions = fields.Str(required=False)
    gif_url = fields.Str(required=False)


custom_exercise_schema = CustomExerciseSchema()


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

@exercises_bp.route('', methods=['GET'])
def list_exercises():
    """
    GET /api/exercises
    Lista ejercicios con filtros opcionales
    Query params:
        - search: Buscar por nombre (opcional)
        - body_part: Filtrar por parte del cuerpo (opcional)
        - equipment: Filtrar por equipamiento (opcional)
        - trainer_id: Ver ejercicios custom del trainer (opcional)
        - page: Número de página (default: 1)
        - per_page: Items por página (default: 30, max: 100)
    """
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 30, type=int), 100)

    # Filters
    search = request.args.get('search', '').strip()
    body_part = request.args.get('body_part', '').strip()
    equipment = request.args.get('equipment', '').strip()
    trainer_id = request.args.get('trainer_id', type=int)

    # Build query
    query = Exercise.query

    # Search filter
    if search:
        query = query.filter(Exercise.name.ilike(f'%{search}%'))

    # Body part filter
    if body_part:
        query = query.filter(Exercise.body_part == body_part)

    # Equipment filter
    if equipment:
        query = query.filter(Exercise.equipment == equipment)

    # Trainer filter (show both public and trainer's custom exercises)
    if trainer_id:
        query = query.filter(
            or_(
                Exercise.is_custom == False,
                Exercise.trainer_id == trainer_id
            )
        )
    else:
        # Only show public exercises
        query = query.filter(Exercise.is_custom == False)

    # Order by name
    query = query.order_by(Exercise.name)

    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return success_response({
        'exercises': [ex.to_dict() for ex in pagination.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': pagination.total,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    })


@exercises_bp.route('/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    """
    GET /api/exercises/:id
    Obtiene detalles de un ejercicio específico
    """
    exercise = Exercise.query.get(exercise_id)

    if not exercise:
        return error_response('Exercise not found', status=404)

    return success_response(exercise.to_dict())


@exercises_bp.route('/custom', methods=['POST'])
def create_custom_exercise():
    """
    POST /api/exercises/custom
    Crea un ejercicio personalizado para un trainer
    Body: { trainer_id, name, body_part?, equipment?, target_muscle?, instructions?, gif_url? }
    """
    try:
        # Validate request data
        data = custom_exercise_schema.load(request.json)
    except ValidationError as err:
        return error_response('Validation failed', errors=err.messages, status=400)

    # Verificar que el trainer existe
    trainer = Trainer.query.get(data['trainer_id'])
    if not trainer:
        return error_response('Trainer not found', status=404)

    # Crear ejercicio custom
    exercise = Exercise(
        name=data['name'],
        body_part=data.get('body_part'),
        equipment=data.get('equipment'),
        target_muscle=data.get('target_muscle'),
        instructions=data.get('instructions'),
        gif_url=data.get('gif_url'),
        is_custom=True,
        trainer_id=data['trainer_id']
    )

    db.session.add(exercise)
    db.session.commit()

    return success_response(
        exercise.to_dict(),
        message='Custom exercise created successfully',
        status=201
    )


@exercises_bp.route('/sync', methods=['POST'])
def sync_exercises():
    """
    POST /api/exercises/sync
    Sincroniza ejercicios desde ExerciseDB API
    Body: { limit?: number } (for testing, limits number of exercises)

    NOTE: Requires valid EXERCISEDB_API_KEY in environment
    """
    limit = request.json.get('limit') if request.json else None

    try:
        result = exercisedb_service.sync_exercises_to_database(limit=limit)
        return success_response(result, message='Exercises synced successfully')
    except Exception as e:
        return error_response(f'Failed to sync exercises: {str(e)}', status=500)


@exercises_bp.route('/body-parts', methods=['GET'])
def get_body_parts():
    """
    GET /api/exercises/body-parts
    Obtiene lista de partes del cuerpo disponibles desde la base de datos local
    """
    # Get unique body parts from database
    body_parts = db.session.query(Exercise.body_part)\
        .filter(Exercise.body_part.isnot(None))\
        .distinct()\
        .order_by(Exercise.body_part)\
        .all()

    return success_response([bp[0] for bp in body_parts if bp[0]])


@exercises_bp.route('/equipment', methods=['GET'])
def get_equipment():
    """
    GET /api/exercises/equipment
    Obtiene lista de equipamiento disponible desde la base de datos local
    """
    # Get unique equipment from database
    equipment_list = db.session.query(Exercise.equipment)\
        .filter(Exercise.equipment.isnot(None))\
        .distinct()\
        .order_by(Exercise.equipment)\
        .all()

    return success_response([eq[0] for eq in equipment_list if eq[0]])


@exercises_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    GET /api/exercises/stats
    Obtiene estadísticas de ejercicios
    """
    total = Exercise.query.count()
    custom = Exercise.query.filter_by(is_custom=True).count()
    public = Exercise.query.filter_by(is_custom=False).count()

    # Group by body part
    by_body_part = db.session.query(
        Exercise.body_part,
        db.func.count(Exercise.id)
    ).filter(Exercise.body_part.isnot(None))\
     .group_by(Exercise.body_part)\
     .all()

    return success_response({
        'total': total,
        'custom': custom,
        'public': public,
        'by_body_part': {bp: count for bp, count in by_body_part}
    })
