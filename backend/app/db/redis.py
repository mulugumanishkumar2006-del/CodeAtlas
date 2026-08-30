import redis.asyncio as aioredis
from typing import Optional
from backend.app.config import settings

redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return redis_client


async def close_redis() -> None:
    global redis_client
    if redis_client is not None:
        try:
            await redis_client.aclose()
        except Exception:
            pass
        redis_client = None


async def check_redis_health() -> bool:
    client = None
    try:
        client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=3,
        )
        res = await client.ping()
        await client.aclose()
        return bool(res)
    except Exception:
        if client is not None:
            try:
                await client.aclose()
            except Exception:
                pass
        return False
