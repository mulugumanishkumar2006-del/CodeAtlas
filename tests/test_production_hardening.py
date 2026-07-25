# tests/test_production_hardening.py

from app.core.cache import cache_service
from app.core.exceptions import (
    AuthenticationError,
    CodeAtlasException,
    NotFoundError,
    RateLimitError,
    ValidationError,
    codeatlas_exception_handler,
)
from app.core.middleware import CorrelationAndLoggingMiddleware
from fastapi import FastAPI
from fastapi.testclient import TestClient

test_app = FastAPI()
test_app.add_exception_handler(CodeAtlasException, codeatlas_exception_handler)
test_app.add_middleware(CorrelationAndLoggingMiddleware)


@test_app.get("/test/not-found")
def trigger_not_found():
    raise NotFoundError("Repository", "repo-123")


@test_app.get("/test/validation")
def trigger_validation():
    raise ValidationError("Invalid pagination parameters.", {"page": -1})


@test_app.get("/test/auth")
def trigger_auth():
    raise AuthenticationError()


@test_app.get("/test/rate-limit")
def trigger_rate_limit():
    raise RateLimitError()


@test_app.get("/test/ok")
def trigger_ok():
    return {"status": "ok"}


client = TestClient(test_app)


def test_rfc7807_exception_responses():
    # 1. NotFoundError
    res1 = client.get("/test/not-found")
    assert res1.status_code == 404
    data1 = res1.json()
    assert data1["title"] == "RESOURCE_NOT_FOUND"
    assert "repo-123" in data1["detail"]
    assert "correlation_id" in data1

    # 2. ValidationError
    res2 = client.get("/test/validation")
    assert res2.status_code == 400
    data2 = res2.json()
    assert data2["title"] == "VALIDATION_ERROR"

    # 3. AuthenticationError
    res3 = client.get("/test/auth")
    assert res3.status_code == 401
    data3 = res3.json()
    assert data3["title"] == "AUTHENTICATION_FAILED"

    # 4. RateLimitError
    res4 = client.get("/test/rate-limit")
    assert res4.status_code == 429
    data4 = res4.json()
    assert data4["title"] == "RATE_LIMIT_EXCEEDED"


def test_correlation_and_logging_middleware_headers():
    res = client.get("/test/ok", headers={"X-Request-ID": "custom-corr-999"})
    assert res.status_code == 200
    assert res.headers["X-Request-ID"] == "custom-corr-999"
    assert "X-Response-Time-Ms" in res.headers
    assert res.headers["X-Frame-Options"] == "DENY"


def test_cache_service_fallback():
    key = "test_key_123"
    val = {"status": "cached", "metric": 99.5}

    cache_service.set(key, val, ttl_seconds=60)
    cached_val = cache_service.get(key)
    assert cached_val == val

    cache_service.delete(key)
    assert cache_service.get(key) is None
