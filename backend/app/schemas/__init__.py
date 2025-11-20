"""
Validation Schemas Package
"""
from app.schemas.auth_schemas import (
    TrainerRegisterSchema,
    LoginSchema,
    ClientRegisterSchema
)
from app.schemas.client_schemas import (
    ClientCreateSchema,
    ClientUpdateSchema,
    ClientQuerySchema
)
from app.schemas.workout_schemas import (
    WorkoutCreateSchema,
    WorkoutUpdateSchema,
    WorkoutQuerySchema,
    WorkoutAssignmentCreateSchema,
    WorkoutAssignmentUpdateStatusSchema
)

__all__ = [
    'TrainerRegisterSchema',
    'LoginSchema',
    'ClientRegisterSchema',
    'ClientCreateSchema',
    'ClientUpdateSchema',
    'ClientQuerySchema',
    'WorkoutCreateSchema',
    'WorkoutUpdateSchema',
    'WorkoutQuerySchema',
    'WorkoutAssignmentCreateSchema',
    'WorkoutAssignmentUpdateStatusSchema',
]
