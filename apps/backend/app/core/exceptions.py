# apps/backend/app/core/exceptions.py

from typing import Any, Dict, Optional

from fastapi import Request, status
from fastapi.responses import JSONResponse


class CodeAtlasException(Exception):
    """Base exception for all CodeAtlas domain errors."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}


class NotFoundError(CodeAtlasException):
    def __init__(self, resource_name: str, resource_id: Any):
        super().__init__(
            message=f"{resource_name} with identifier '{resource_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="RESOURCE_NOT_FOUND",
            details={"resource": resource_name, "id": str(resource_id)},
        )


class ValidationError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class AuthenticationError(CodeAtlasException):
    def __init__(
        self, message: str = "Authentication credentials were invalid or missing."
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTHENTICATION_FAILED",
        )


class RateLimitError(CodeAtlasException):
    def __init__(self, message: str = "Rate limit exceeded. Please retry later."):
        super().__init__(
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="RATE_LIMIT_EXCEEDED",
        )


async def codeatlas_exception_handler(
    request: Request, exc: CodeAtlasException
) -> JSONResponse:
    """RFC-7807 Problem Details compliant exception response handler."""
    correlation_id = getattr(request.state, "correlation_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "type": f"https://codeatlas.io/errors/{exc.error_code.lower()}",
            "title": exc.error_code,
            "status": exc.status_code,
            "detail": exc.message,
            "instance": str(request.url.path),
            "correlation_id": correlation_id,
            "error_details": exc.details,
        },
    )
