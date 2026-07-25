# apps/backend/app/core/middleware.py

import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("codeatlas.access")


class CorrelationAndLoggingMiddleware(BaseHTTPMiddleware):
    """
    Production HTTP middleware providing:
    1. Request correlation tracking via X-Request-ID header.
    2. Structured performance timing per API request.
    3. Custom security response headers.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        correlation_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id

        start_time = time.perf_counter()
        response: Response = await call_next(request)
        process_time = (time.perf_counter() - start_time) * 1000.0

        # Attach headers
        response.headers["X-Request-ID"] = correlation_id
        response.headers["X-Response-Time-Ms"] = f"{process_time:.2f}"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"

        logger.info(
            f"method={request.method} path={request.url.path} status={response.status_code} "
            f"latency_ms={process_time:.2f} correlation_id={correlation_id}"
        )

        return response
