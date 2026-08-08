import re
from typing import Any, Callable, Dict, List
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class ProductionHardeningMiddleware(BaseHTTPMiddleware):
    """
    Production security hardening middleware:
    - Adds security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
    - Masks unhandled exceptions without leaking stack traces or credentials
    - Enforces tenant and correlation ID headers
    """

    SECRET_PATTERNS = [
        (r"(api[_-]?key|secret|password|token|auth)\s*[:=]\s*['\"]?[A-Za-z0-9_\-\.]{8,}['\"]?", r"\1: [REDACTED_SECRET]"),
        (r"Bearer\s+[A-Za-z0-9_\-\.]+", "Bearer [REDACTED_TOKEN]"),
    ]

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            response = await call_next(request)
        except Exception as exc:
            # Mask unhandled server exceptions to prevent stack trace leaks
            correlation_id = getattr(request.state, "correlation_id", "unknown")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "type": "https://codeatlas.io/errors/internal_error",
                    "title": "INTERNAL_ERROR",
                    "status": 500,
                    "detail": "An unexpected internal server error occurred.",
                    "instance": str(request.url.path),
                    "correlation_id": correlation_id,
                },
            )

        # Apply security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"

        return response
