from fastapi import APIRouter, Depends

from app.schemas.health import SystemHealth
from app.services.health import HealthService

router = APIRouter()


def get_health_service() -> HealthService:
    return HealthService()


@router.get("/health", response_model=SystemHealth)
def check_health(
    health_service: HealthService = Depends(get_health_service),
) -> SystemHealth:
    return health_service.check_health()
