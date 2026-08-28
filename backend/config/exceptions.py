from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    NotFound,
    PermissionDenied,
    ValidationError,
)
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """Return uniform JSON error responses.

    Format:
        {
            "error": true,
            "message": "<human-readable summary>",
            "details": { ... }   # field-level info when available
        }
    """
    response = exception_handler(exc, context)

    if response is None:
        return response

    if isinstance(exc, ValidationError):
        # Flatten nested error lists into simple strings where possible.
        details = {}
        if isinstance(exc.detail, dict):
            for field, messages in exc.detail.items():
                if isinstance(messages, list):
                    details[field] = [
                        str(m) for m in messages
                    ]
                else:
                    details[field] = str(messages)
        elif isinstance(exc.detail, list):
            details['non_field_errors'] = [str(m) for m in exc.detail]
        else:
            details['non_field_errors'] = [str(exc.detail)]

        response.data = {
            'error': True,
            'message': 'Validation failed.',
            'details': details,
        }

    elif isinstance(exc, AuthenticationFailed):
        response.data = {
            'error': True,
            'message': 'Authentication failed.',
            'details': {'detail': str(exc.detail)},
        }

    elif isinstance(exc, NotAuthenticated):
        response.data = {
            'error': True,
            'message': 'Authentication credentials were not provided.',
            'details': {'detail': str(exc.detail)},
        }

    elif isinstance(exc, PermissionDenied):
        response.data = {
            'error': True,
            'message': 'You do not have permission to perform this action.',
            'details': {'detail': str(exc.detail)},
        }

    elif isinstance(exc, NotFound):
        response.data = {
            'error': True,
            'message': 'The requested resource was not found.',
            'details': {'detail': str(exc.detail)},
        }

    else:
        # Generic DRF-handled error — preserve status code, normalize shape.
        detail = exc.detail if hasattr(exc, 'detail') else str(exc)
        response.data = {
            'error': True,
            'message': str(detail) if not isinstance(detail, (dict, list)) else 'An error occurred.',
            'details': detail if isinstance(detail, dict) else {'detail': detail},
        }

    return response
