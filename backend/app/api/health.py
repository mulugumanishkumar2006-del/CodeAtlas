from datetime import datetime, timezone
from fastapi import APIRouter
from backend.app.config import settings
from backend.app.db.session import check_db_health
from backend.app.db.redis import check_redis_health
from backend.app.schemas.repository import HealthStatus

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthStatus)
async def get_health() -> HealthStatus:
    db_ok = await check_db_health()
    redis_ok = await check_redis_health()

    if db_ok and redis_ok:
        overall_status = "healthy"
    elif db_ok or redis_ok:
        overall_status = "degraded"
    else:
        overall_status = "unhealthy"

    return HealthStatus(
        status=overall_status,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database="connected" if db_ok else "disconnected",
        redis="connected" if redis_ok else "disconnected",
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/ready")
async def get_readiness():
    db_ok = await check_db_health()
    redis_ok = await check_redis_health()
    
    return {
        "status": "ready" if db_ok else "unready",
        "database": "connected" if db_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

