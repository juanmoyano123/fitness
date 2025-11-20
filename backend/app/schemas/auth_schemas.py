"""
Validation Schemas - Marshmallow schemas for request validation
"""
from marshmallow import Schema, fields, validate, ValidationError, validates_schema
import re


class TrainerRegisterSchema(Schema):
    """Schema for trainer registration"""
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=100))
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    business_name = fields.Str(validate=validate.Length(max=200), allow_none=True)

    @validates_schema
    def validate_password_strength(self, data, **kwargs):
        """Validate password has minimum strength"""
        password = data.get('password', '')
        if len(password) < 8:
            raise ValidationError('Password must be at least 8 characters', 'password')


class LoginSchema(Schema):
    """Schema for login"""
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    user_type = fields.Str(validate=validate.OneOf(['trainer', 'client']), missing='trainer')


class ClientRegisterSchema(Schema):
    """Schema for client registration with invite token"""
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(required=True, validate=validate.Length(min=8, max=100))
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    invite_token = fields.Str(allow_none=True)
