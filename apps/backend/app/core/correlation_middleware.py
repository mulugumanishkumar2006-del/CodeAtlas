# apps/backend/app/core/correlation_middleware.py

import logging
import uuid
from typing import Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("codeatlas.correlation")


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """
    Middleware attaching X-Correlation-ID header to every HTTP request and response.
    Ensures end-to-end request correlation across logs, services, and APIs.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id

        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler wrapping unhandled exceptions into safe JSON responses.
    Prevents exposure of raw internal stack traces in production environments.
    """
    correlation_id = getattr(request.state, "correlation_id", "unknown-correlation-id")
    logger.error(
        f"Unhandled Exception [Correlation ID: {correlation_id}] Path: {request.url.path}: {str(exc)}",
        exc_info=True,
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Our engineering team has been notified.",
            "correlation_id": correlation_id,
            "path": request.url.path,
        },
    )
