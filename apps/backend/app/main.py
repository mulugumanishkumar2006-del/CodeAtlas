from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# pyrefly: ignore [missing-import]
from app.api.v1 import auth, health, repositories, graph, evolution
from app.models import base_models
# pyrefly: ignore [missing-import]
from app.core.config import settings
# pyrefly: ignore [missing-import]
from app.core.logging import setup_logging
from app.core.neo4j_client import neo4j_client


setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


@app.on_event("startup")
def startup_event():
    neo4j_client.connect()


@app.on_event("shutdown")
def shutdown_event():
    neo4j_client.close()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(
    repositories.router, prefix=settings.API_V1_STR, tags=["repositories"]
)
app.include_router(
    graph.router, prefix=settings.API_V1_STR, tags=["graph"]
)
app.include_router(
    evolution.router, prefix=settings.API_V1_STR, tags=["evolution"]
)

