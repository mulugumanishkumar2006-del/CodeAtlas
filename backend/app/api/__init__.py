from fastapi import APIRouter
from backend.app.api.health import router as health_router
from backend.app.api.repositories import router as repositories_router
from backend.app.api.collaboration import router as collaboration_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(repositories_router)
api_router.include_router(collaboration_router)

__all__ = ["api_router"]
