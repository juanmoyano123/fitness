"""
Workout Validation Schemas - Marshmallow schemas for workout endpoints
"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class WorkoutExerciseSchema(Schema):
    """Schema for exercise within a workout"""
    exercise_id = fields.Int(required=True)
    order = fields.Int(validate=validate.Range(min=0), allow_none=True)
    order_index = fields.Int(validate=validate.Range(min=0), allow_none=True)
    sets = fields.Int(validate=validate.Range(min=1, max=50), missing=3)
    reps = fields.Int(validate=validate.Range(min=1, max=500), missing=10)
    rest_seconds = fields.Int(validate=validate.Range(min=0, max=600), missing=60)
    weight = fields.Float(validate=validate.Range(min=0), allow_none=True)
    notes = fields.Str(validate=validate.Length(max=500), allow_none=True)


class WorkoutCreateSchema(Schema):
    """Schema for creating a new workout"""
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(validate=validate.Length(max=2000), allow_none=True)
    category = fields.Str(
        validate=validate.OneOf(['strength', 'cardio', 'hybrid', 'flexibility']),
        allow_none=True
    )
    difficulty = fields.Str(
        validate=validate.OneOf(['beginner', 'intermediate', 'advanced']),
        allow_none=True
    )
    duration = fields.Int(validate=validate.Range(min=1, max=300), allow_none=True)
    exercises = fields.List(fields.Nested(WorkoutExerciseSchema), allow_none=True)


class WorkoutUpdateSchema(Schema):
    """Schema for updating a workout"""
    name = fields.Str(validate=validate.Length(min=1, max=200))
    description = fields.Str(validate=validate.Length(max=2000))
    category = fields.Str(
        validate=validate.OneOf(['strength', 'cardio', 'hybrid', 'flexibility'])
    )
    difficulty = fields.Str(
        validate=validate.OneOf(['beginner', 'intermediate', 'advanced'])
    )
    duration = fields.Int(validate=validate.Range(min=1, max=300))


class WorkoutQuerySchema(Schema):
    """Schema for workout list query parameters"""
    page = fields.Int(validate=validate.Range(min=1), missing=1)
    per_page = fields.Int(validate=validate.Range(min=1, max=100), missing=20)
    search = fields.Str(validate=validate.Length(max=100))
    category = fields.Str(
        validate=validate.OneOf(['strength', 'cardio', 'hybrid', 'flexibility'])
    )
    difficulty = fields.Str(
        validate=validate.OneOf(['beginner', 'intermediate', 'advanced'])
    )


class WorkoutAssignmentCreateSchema(Schema):
    """Schema for creating a workout assignment"""
    workout_id = fields.Int(required=True)
    client_id = fields.Int(required=True)
    due_date = fields.DateTime(allow_none=True)
    notes = fields.Str(validate=validate.Length(max=1000), allow_none=True)


class WorkoutAssignmentUpdateStatusSchema(Schema):
    """Schema for updating assignment status"""
    status = fields.Str(
        required=True,
        validate=validate.OneOf(['pending', 'in_progress', 'completed', 'skipped'])
    )
