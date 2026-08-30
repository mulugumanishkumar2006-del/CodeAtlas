import pytest
import asyncpg
import redis.asyncio as aioredis
from backend.app.config import settings


@pytest.mark.asyncio
async def test_live_postgres_connection():
    # Connect directly with asyncpg to verify PostgreSQL database service is fully operational
    conn = await asyncpg.connect(
        user=settings.POSTGRES_USER if hasattr(settings, "POSTGRES_USER") else "postgres",
        password=settings.POSTGRES_PASSWORD if hasattr(settings, "POSTGRES_PASSWORD") else "postgres",
        database="codeatlas",
        host="localhost",
        port=5432,
    )
    val = await conn.fetchval("SELECT 1")
    assert val == 1, "PostgreSQL SELECT 1 check failed"
    await conn.close()


@pytest.mark.asyncio
async def test_live_redis_connection():
    # Connect directly with Redis async client to verify Redis service is fully operational
    client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    ping = await client.ping()
    assert ping is True, "Redis ping failed"
    
    # Test set/get key lifecycle
    await client.set("codeatlas:test_key", "active", ex=10)
    val = await client.get("codeatlas:test_key")
    assert val == "active"
    await client.delete("codeatlas:test_key")
    await client.aclose()
