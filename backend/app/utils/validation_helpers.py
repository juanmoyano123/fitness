"""
Validation Helpers - Decorators and utilities for request validation
"""
from functools import wraps
from flask import request, jsonify
from marshmallow import ValidationError


def validate_json(schema_class, location='json'):
    """
    Decorator to validate request data with Marshmallow schema

    Args:
        schema_class: Marshmallow Schema class to use for validation
        location: Where to get data from ('json', 'args', 'form')

    Usage:
        @app.route('/api/clients', methods=['POST'])
        @jwt_required()
        @validate_json(ClientCreateSchema)
        def create_client(validated_data):
            # validated_data contains clean, validated data
            return jsonify({'success': True})
    """
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            try:
                schema = schema_class()

                # Get data from appropriate location
                if location == 'json':
                    data = request.get_json(silent=True) or {}
                elif location == 'args':
                    data = request.args.to_dict()
                elif location == 'form':
                    data = request.form.to_dict()
                else:
                    data = {}

                # Validate and deserialize
                validated_data = schema.load(data)

                # Pass validated data to route function
                return f(validated_data=validated_data, *args, **kwargs)

            except ValidationError as err:
                return jsonify({
                    'success': False,
                    'error': 'Validation failed',
                    'details': err.messages
                }), 400
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Validation error: {str(e)}'
                }), 400

        return wrapped
    return decorator


def validate_query(schema_class):
    """
    Decorator to validate query parameters

    Usage:
        @app.route('/api/clients', methods=['GET'])
        @jwt_required()
        @validate_query(ClientQuerySchema)
        def get_clients(validated_query):
            page = validated_query['page']
            per_page = validated_query['per_page']
            return jsonify({'success': True})
    """
    return validate_json(schema_class, location='args')
