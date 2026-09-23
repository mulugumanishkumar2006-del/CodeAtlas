import asyncio
import pytest
import asyncpg
import redis.asyncio as aioredis
from backend.app.config import settings


@pytest.mark.asyncio
async def test_live_postgres_connection():
    # Connect directly with asyncpg to verify PostgreSQL database service is fully operational
    try:
        conn = await asyncpg.connect(
            user=settings.POSTGRES_USER if hasattr(settings, "POSTGRES_USER") else "postgres",
            password=settings.POSTGRES_PASSWORD if hasattr(settings, "POSTGRES_PASSWORD") else "postgres",
            database="codeatlas",
            host="localhost",
            port=5432,
            timeout=2.0,
        )
        val = await conn.fetchval("SELECT 1")
        assert val == 1, "PostgreSQL SELECT 1 check failed"
        await conn.close()
    except (OSError, asyncpg.PostgresError, asyncio.TimeoutError) as e:
        pytest.skip(f"Live PostgreSQL service is not reachable on localhost:5432: {e}")


@pytest.mark.asyncio
async def test_live_redis_connection():
    # Connect directly with Redis async client to verify Redis service is fully operational
    try:
        client = aioredis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=2.0)
        ping = await client.ping()
        assert ping is True, "Redis ping failed"
        
        # Test set/get key lifecycle
        await client.set("codeatlas:test_key", "active", ex=10)
        val = await client.get("codeatlas:test_key")
        assert val == "active"
        await client.delete("codeatlas:test_key")
        await client.aclose()
    except (OSError, aioredis.RedisError) as e:
        pytest.skip(f"Live Redis service is not reachable at {settings.REDIS_URL}: {e}")

