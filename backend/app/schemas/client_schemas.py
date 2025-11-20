"""
Client Validation Schemas - Marshmallow schemas for client endpoints
"""
from marshmallow import Schema, fields, validate


class ClientCreateSchema(Schema):
    """Schema for creating a new client"""
    email = fields.Email(required=True, validate=validate.Length(max=120))
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    phone = fields.Str(validate=validate.Length(max=20), allow_none=True)
    notes = fields.Str(validate=validate.Length(max=5000), allow_none=True)
    gender = fields.Str(
        validate=validate.OneOf(['male', 'female', 'other', 'prefer-not-to-say']),
        allow_none=True
    )
    age = fields.Int(validate=validate.Range(min=1, max=120), allow_none=True)
    goals = fields.Str(validate=validate.Length(max=2000), allow_none=True)
    avatar_url = fields.Url(validate=validate.Length(max=500), allow_none=True)
    avatar = fields.Url(validate=validate.Length(max=500), allow_none=True)


class ClientUpdateSchema(Schema):
    """Schema for updating a client"""
    name = fields.Str(validate=validate.Length(min=1, max=100))
    phone = fields.Str(validate=validate.Length(max=20))
    notes = fields.Str(validate=validate.Length(max=5000))
    is_active = fields.Bool()
    gender = fields.Str(
        validate=validate.OneOf(['male', 'female', 'other', 'prefer-not-to-say'])
    )
    age = fields.Int(validate=validate.Range(min=1, max=120))
    goals = fields.Str(validate=validate.Length(max=2000))
    avatar_url = fields.Url(validate=validate.Length(max=500))
    avatar = fields.Url(validate=validate.Length(max=500))


class ClientQuerySchema(Schema):
    """Schema for client list query parameters"""
    active = fields.Str(validate=validate.OneOf(['true', 'false']))
    page = fields.Int(validate=validate.Range(min=1), missing=1)
    per_page = fields.Int(validate=validate.Range(min=1, max=100), missing=20)
    search = fields.Str(validate=validate.Length(max=100))
