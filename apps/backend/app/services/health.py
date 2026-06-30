from app.core.config import settings
from app.schemas.health import SystemHealth


class HealthService:
    def check_health(self) -> SystemHealth:
        # Business logic for health checks
        return SystemHealth(
            status="healthy",
            environment=settings.ENVIRONMENT,
            project_name=settings.PROJECT_NAME,
        )
