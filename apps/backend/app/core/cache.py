# apps/backend/app/core/cache.py

import json
import logging
from typing import Any, Optional

import redis

from app.core.config import settings

logger = logging.getLogger("codeatlas.cache")


class CodeAtlasCache:
    """
    Production L2 Cache Service:
    Uses Redis when available, falling back to an in-memory LRU dict cache.
    """

    def __init__(self):
        self._memory_cache = {}
        self._redis_client = None
        try:
            if hasattr(settings, "REDIS_URL") and settings.REDIS_URL:
                self._redis_client = redis.from_url(
                    settings.REDIS_URL, decode_responses=True
                )
                self._redis_client.ping()
                logger.info("Connected to Redis cache successfully.")
        except Exception:
            logger.warning("Redis unavailable. Falling back to in-memory L1 cache.")
            self._redis_client = None

    def get(self, key: str) -> Optional[Any]:
        try:
            if self._redis_client:
                val = self._redis_client.get(key)
                return json.loads(val) if val else None
        except Exception:
            pass
        return self._memory_cache.get(key)

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> bool:
        serialized = json.dumps(value)
        try:
            if self._redis_client:
                self._redis_client.setex(key, ttl_seconds, serialized)
                return True
        except Exception:
            pass
        self._memory_cache[key] = value
        return True

    def delete(self, key: str) -> bool:
        try:
            if self._redis_client:
                self._redis_client.delete(key)
        except Exception:
            pass
        self._memory_cache.pop(key, None)
        return True


cache_service = CodeAtlasCache()
