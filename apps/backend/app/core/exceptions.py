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
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}


class ValidationError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class AuthenticationError(CodeAtlasException):
    def __init__(self, message: str = "Authentication credentials were invalid or missing."):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="AUTH_ERROR",
        )


class PermissionError(CodeAtlasException):
    def __init__(self, message: str = "You do not have permission to access this resource."):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="PERMISSION_ERROR",
        )


class NotFoundError(CodeAtlasException):
    def __init__(self, resource_name: str, resource_id: Any):
        super().__init__(
            message=f"{resource_name} with identifier '{resource_id}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
            details={"resource": resource_name, "id": str(resource_id)},
        )


class AnalysisError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="ANALYSIS_ERROR",
            details=details,
        )


class GraphError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="GRAPH_ERROR",
            details=details,
        )


class SearchError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="SEARCH_ERROR",
            details=details,
        )


class AIReasoningError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="AI_ERROR",
            details=details,
        )


class SimulationError(CodeAtlasException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="SIMULATION_ERROR",
            details=details,
        )


class DatabaseError(CodeAtlasException):
    def __init__(self, message: str = "A database operation failed."):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="DATABASE_ERROR",
        )


class ExternalServiceError(CodeAtlasException):
    def __init__(self, service_name: str, message: str):
        super().__init__(
            message=f"External service '{service_name}' error: {message}",
            status_code=status.HTTP_502_BAD_GATEWAY,
            error_code="EXTERNAL_SERVICE_ERROR",
            details={"service": service_name},
        )


class InternalError(CodeAtlasException):
    def __init__(self, message: str = "An internal server error occurred."):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="INTERNAL_ERROR",
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
    """RFC-7807 Problem Details compliant exception response handler. Prevents stack/secret leaks."""
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
