from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# pyrefly: ignore [missing-import]
from app.api.v1 import (
    architect,
    architecture_drift,
    auth,
    digital_twin,
    evolution,
    graph,
    health,
    health_intelligence,
    knowledge,
    reliability,
    repositories,
    tech_debt,
)

# pyrefly: ignore [missing-import]
from app.core.config import settings

# pyrefly: ignore [missing-import]
from app.core.logging import setup_logging
from app.core.neo4j_client import neo4j_client
from app.health.api.health_router import router as health_advisor_router

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


@app.on_event("startup")
def startup_event():
    neo4j_client.connect()
    import app.models  # noqa: F401
    from app.core.database import Base, engine

    Base.metadata.create_all(bind=engine)


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
app.include_router(graph.router, prefix=settings.API_V1_STR, tags=["graph"])
app.include_router(evolution.router, prefix=settings.API_V1_STR, tags=["evolution"])
app.include_router(
    health_advisor_router,
    prefix=settings.API_V1_STR,
    tags=["health_advisor"],
)
app.include_router(tech_debt.router, prefix=settings.API_V1_STR, tags=["tech_debt"])
app.include_router(
    architecture_drift.router, prefix=settings.API_V1_STR, tags=["architecture_drift"]
)
app.include_router(
    digital_twin.router, prefix=settings.API_V1_STR, tags=["digital_twin"]
)
app.include_router(architect.router, prefix=settings.API_V1_STR, tags=["architect"])
app.include_router(reliability.router, prefix=settings.API_V1_STR, tags=["reliability"])
app.include_router(knowledge.router, prefix=settings.API_V1_STR, tags=["knowledge"])
app.include_router(
    health_intelligence.router,
    prefix=settings.API_V1_STR,
    tags=["health_intelligence"],
)
