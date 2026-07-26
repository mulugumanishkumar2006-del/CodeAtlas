from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# pyrefly: ignore [missing-import]
from app.api.v1 import (
    aeo_boardroom_router,
    aeo_planning_alloc_router,
    aeo_portfolio_coord_router,
    aeo_router,
    agi_reasoning_router,
    agi_simulation_insights_router,
    agi_whiteboard_router,
    ai_cto_router,
    architect,
    architecture_drift,
    auth,
    autonomous_router,
    benchmarking_router,
    codeatlas_os_router,
    council_router,
    digital_twin,
    edg_features_1_5_router,
    edg_features_6_10_router,
    edg_features_11_15_router,
    edg_lab_finale_router,
    edg_organism_finale_router,
    edg_router,
    engineering_agi_router,
    enterprise_router,
    evolution,
    evolution_atlas_router,
    graph,
    health,
    health_intelligence,
    knowledge,
    knowledge_insights_router,
    memory_router,
    network_router,
    prediction_router,
    reality_router,
    reliability,
    repositories,
    software_world,
    spe_features_1_5_router,
    spe_features_6_10_router,
    spe_features_11_15_router,
    spe_lab_finale_router,
    spe_router,
    tech_debt,
    visual_router,
)

# pyrefly: ignore [missing-import]
from app.core.config import settings
from app.core.exceptions import CodeAtlasException, codeatlas_exception_handler

# pyrefly: ignore [missing-import]
from app.core.logging import setup_logging
from app.core.middleware import CorrelationAndLoggingMiddleware
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


# Exception Handler
app.add_exception_handler(CodeAtlasException, codeatlas_exception_handler)

# Correlation & Logging Middleware
app.add_middleware(CorrelationAndLoggingMiddleware)

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
    software_world.router, prefix=settings.API_V1_STR, tags=["software_world"]
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
app.include_router(
    ai_cto_router.router,
    prefix=settings.API_V1_STR,
    tags=["ai_cto"],
)
app.include_router(
    council_router.router,
    prefix=settings.API_V1_STR,
    tags=["council"],
)
app.include_router(
    autonomous_router.router,
    prefix=settings.API_V1_STR,
    tags=["autonomous"],
)
app.include_router(
    enterprise_router.router,
    prefix=settings.API_V1_STR,
    tags=["enterprise"],
)
app.include_router(
    codeatlas_os_router.router,
    prefix=settings.API_V1_STR,
    tags=["os"],
)
app.include_router(
    visual_router.router,
    prefix=settings.API_V1_STR,
    tags=["visual"],
)
app.include_router(
    reality_router.router,
    prefix=settings.API_V1_STR,
    tags=["reality"],
)
app.include_router(
    prediction_router.router,
    prefix=settings.API_V1_STR,
    tags=["prediction"],
)
app.include_router(
    memory_router.router,
    prefix=settings.API_V1_STR,
    tags=["memory"],
)
app.include_router(
    network_router.router,
    prefix=settings.API_V1_STR,
    tags=["network"],
)
app.include_router(
    benchmarking_router.router,
    prefix=settings.API_V1_STR,
    tags=["maturity_benchmarking"],
)
app.include_router(
    knowledge_insights_router.router,
    prefix=settings.API_V1_STR,
    tags=["knowledge_insights"],
)
app.include_router(
    evolution_atlas_router.router,
    prefix=settings.API_V1_STR,
    tags=["evolution_atlas_command"],
)
app.include_router(
    engineering_agi_router.router,
    prefix=settings.API_V1_STR,
    tags=["engineering_agi"],
)
app.include_router(
    agi_reasoning_router.router,
    prefix=settings.API_V1_STR,
    tags=["agi_reasoning"],
)
app.include_router(
    agi_simulation_insights_router.router,
    prefix=settings.API_V1_STR,
    tags=["agi_simulation_insights"],
)
app.include_router(
    agi_whiteboard_router.router,
    prefix=settings.API_V1_STR,
    tags=["agi_whiteboard"],
)
app.include_router(
    aeo_router.router,
    prefix=settings.API_V1_STR,
    tags=["aeo"],
)
app.include_router(
    aeo_planning_alloc_router.router,
    prefix=settings.API_V1_STR,
    tags=["aeo_planning"],
)
app.include_router(
    aeo_portfolio_coord_router.router,
    prefix=settings.API_V1_STR,
    tags=["aeo_portfolio"],
)
app.include_router(
    aeo_boardroom_router.router,
    prefix=settings.API_V1_STR,
    tags=["aeo_boardroom"],
)
app.include_router(
    spe_router.router,
    prefix=settings.API_V1_STR,
    tags=["spe"],
)
app.include_router(
    spe_features_1_5_router.router,
    prefix=settings.API_V1_STR,
    tags=["spe_primary"],
)
app.include_router(
    spe_features_6_10_router.router,
    prefix=settings.API_V1_STR,
    tags=["spe_secondary"],
)
app.include_router(
    spe_features_11_15_router.router,
    prefix=settings.API_V1_STR,
    tags=["spe_dynamics"],
)
app.include_router(
    spe_lab_finale_router.router,
    prefix=settings.API_V1_STR,
    tags=["spe_lab"],
)
app.include_router(
    edg_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg"],
)
app.include_router(
    edg_features_1_5_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg_primary"],
)
app.include_router(
    edg_features_6_10_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg_secondary"],
)
app.include_router(
    edg_features_11_15_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg_dynamics"],
)
app.include_router(
    edg_lab_finale_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg_lab"],
)
app.include_router(
    edg_organism_finale_router.router,
    prefix=settings.API_V1_STR,
    tags=["edg_organism"],
)
