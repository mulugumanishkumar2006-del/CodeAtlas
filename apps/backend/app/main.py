from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.correlation_middleware import CorrelationIdMiddleware, global_exception_handler

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
    arc_router,
    architect,
    architecture_drift,
    are_router,
    ase_router,
    asip_router,
    auth,
    autonomous_router,
    benchmarking_router,
    biie_features_1_20_router,
    biie_features_21_40_router,
    biie_features_41_60_router,
    biie_features_61_80_router,
    biie_features_81_100_router,
    biie_router,
    caee_router,
    codeatlas_os_router,
    council_router,
    cross_org_risk_router,
    digital_twin,
    edg_features_1_5_router,
    edg_features_6_10_router,
    edg_features_11_15_router,
    edg_lab_finale_router,
    edg_organism_finale_router,
    edg_router,
    edie_router,
    engineering_agi_router,
    enterprise_ai_cto_router,
    enterprise_autonomous_optimization_router,
    enterprise_simulation_router,
    enterprise_router,
    enterprise_architecture_router,
    executive_intelligence_router,
    eskg_router,
    esl_router,
    evolution,
    evolution_atlas_router,
    governance_compliance_router,
    graph,
    health,
    health_intelligence,
    health_readiness_router,
    impact_router,
    knowledge,
    knowledge_insights_router,
    memory_router,
    network_router,
    oip_router,
    org_knowledge_graph_router,
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
    team_intelligence_router,
    visual_router,
    workspace_router,
    wskg_router,
    reasoning_engine_router,
    temporal_intelligence_router,
    simulation_studio_router,
    release_candidate_router,
    production_launch_router,
    v13_observation_router,
    developer_intelligence_router,
    predictive_intelligence_router,
    preventive_intelligence_router,
    autopilot_router,
    enterprise_governance_router,
    org_intelligence_router,
    engineering_strategy_router,
    continuous_intelligence_router,
    knowledge_fabric_router,
    autonomous_engineering_router,
    control_plane_router,
    platform_router,
    enterprise_scale_router,
    developer_platform_router,
    marketplace_intelligence_router,
    global_intelligence_router,
    predictive_cloud_router,
    autonomous_operations_router,
    self_healing_router,
    global_optimization_router,
    governance_router,
    autonomous_cloud_router,
    enterprise_expansion_router,
    ecosystem_router,
    intelligence_scale_router,
    autonomous_network_router,
    global_operations_router,
    intelligence_advanced_router,
    platform_hardening_router,
    global_intelligence_v4_router,
    product_adoption_v41_router,
    enterprise_os_v42_router,
    autonomous_v43_router,
    simulation_v44_router,
    network_v45_router,
    engineering_os_v50_router,
    production_v51_router,
    security_v52_router,
    ecosystem_v53_router,
    marketplace_v54_router,
    federation_v55_router,
    commercial_v60_router,
    workflows_v61_router,
    autonomy_v62_router,
    learning_v63_router,
    simulation_v64_router,
    autonomous_org_v65_router,
    governance_trust_v66_router,
    economy_v67_router,
    science_v68_router,
    ecosystem_v69_router,
    platform_v70_router,
    protocol_v71_router,
    network_v72_router,
    collective_v73_router,
    marketplace_v74_router,
    fabric_v75_router,
    autonomy_os_v76_router,
    self_healing_v77_router,
    immune_v78_router,
    evolution_v79_router,
)
from app.api.v1.production_launch_router import router as production_launch_v31_router, launch_v2_router

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
    try:
        neo4j_client.connect()
    except Exception as e:
        print(f"Notice: Optional Neo4j graph connection skipped: {str(e)}")
    import app.models  # noqa: F401
    from app.core.database import Base, engine

    Base.metadata.create_all(bind=engine)


@app.on_event("shutdown")
def shutdown_event():
    try:
        neo4j_client.close()
    except Exception:
        pass


# Exception Handler
app.add_exception_handler(CodeAtlasException, codeatlas_exception_handler)

# Correlation & Logging Middleware
app.add_middleware(CorrelationIdMiddleware)
app.add_exception_handler(Exception, global_exception_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_readiness_router.router, prefix=settings.API_V1_STR, tags=["health_readiness"])
app.include_router(impact_router.router, prefix=settings.API_V1_STR, tags=["Impact Intelligence Engine"])
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(reasoning_engine_router.router, prefix=settings.API_V1_STR, tags=["Engineering Reasoning"])
app.include_router(temporal_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Temporal Software Intelligence"])
app.include_router(simulation_studio_router.router, prefix=settings.API_V1_STR, tags=["Engineering Simulation Studio"])
app.include_router(release_candidate_router.router, prefix=settings.API_V1_STR, tags=["Release Candidate & Hardening"])
app.include_router(production_launch_router.router, prefix=settings.API_V1_STR, tags=["Production Deployment & Launch"])
app.include_router(v13_observation_router.router, prefix=settings.API_V1_STR, tags=["Production Observation & v1.3 Planning"])
app.include_router(developer_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Core Developer Intelligence"])
app.include_router(predictive_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Predictive Engineering Intelligence"])
app.include_router(preventive_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Preventive Engineering Intelligence"])
app.include_router(autopilot_router.router, prefix=settings.API_V1_STR, tags=["Engineering Autopilot"])
app.include_router(enterprise_governance_router.router, prefix=settings.API_V1_STR, tags=["Enterprise Governance & Multi-Repo Intelligence"])
app.include_router(org_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Organizational Intelligence"])
app.include_router(engineering_strategy_router.router, prefix=settings.API_V1_STR, tags=["Engineering Strategy & Optimization"])
app.include_router(continuous_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Continuous Engineering Intelligence"])
app.include_router(knowledge_fabric_router.router, prefix=settings.API_V1_STR, tags=["Engineering Knowledge Fabric"])
app.include_router(autonomous_engineering_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering"])
app.include_router(control_plane_router.router, prefix=settings.API_V1_STR, tags=["Engineering Control Plane"])
app.include_router(platform_router.router, prefix=settings.API_V1_STR, tags=["Platform & Production Launch"])
app.include_router(enterprise_scale_router.router, prefix=settings.API_V1_STR, tags=["Production Growth & Enterprise Scale"])
app.include_router(developer_platform_router.router, prefix=settings.API_V1_STR, tags=["Ecosystem & Developer Platform"])
app.include_router(marketplace_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Intelligence Marketplace"])
app.include_router(global_intelligence_router.router, prefix=settings.API_V1_STR, tags=["Global Engineering Intelligence"])
app.include_router(predictive_cloud_router.router, prefix=settings.API_V1_STR, tags=["Predictive Engineering Cloud"])
app.include_router(autonomous_operations_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering Operations"])
app.include_router(self_healing_router.router, prefix=settings.API_V1_STR, tags=["Self-Healing Engineering Platform"])
app.include_router(global_optimization_router.router, prefix=settings.API_V1_STR, tags=["Global Engineering Optimization"])
app.include_router(governance_router.router, prefix=settings.API_V1_STR, tags=["Engineering Autonomy & Governance"])
app.include_router(autonomous_cloud_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering Cloud"])
app.include_router(production_launch_v31_router, prefix=settings.API_V1_STR, tags=["Production Launch & Growth"])
app.include_router(launch_v2_router, prefix=settings.API_V1_STR, tags=["Production Deployment & Launch"])
app.include_router(enterprise_expansion_router.router, prefix=settings.API_V1_STR, tags=["Enterprise Expansion"])
app.include_router(ecosystem_router.router, prefix=settings.API_V1_STR, tags=["Engineering Ecosystem & Integrations"])
app.include_router(intelligence_scale_router.router, prefix=settings.API_V1_STR, tags=["Intelligence at Scale"])
app.include_router(autonomous_network_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering Network"])
app.include_router(global_operations_router.router, prefix=settings.API_V1_STR, tags=["Global Engineering Operations"])
app.include_router(intelligence_advanced_router.router, prefix=settings.API_V1_STR, tags=["Advanced Engineering Intelligence"])
app.include_router(platform_hardening_router.router, prefix=settings.API_V1_STR, tags=["Platform Hardening & v4.0 Readiness"])
app.include_router(global_intelligence_v4_router.router, prefix=settings.API_V1_STR, tags=["Global Engineering Intelligence Platform v4.0"])
app.include_router(product_adoption_v41_router.router, prefix=settings.API_V1_STR, tags=["Product Adoption, DX & Market Readiness v4.1"])
app.include_router(enterprise_os_v42_router.router, prefix=settings.API_V1_STR, tags=["Enterprise Intelligence & Organizational OS v4.2"])
app.include_router(autonomous_v43_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering 2.0 v4.3"])
app.include_router(simulation_v44_router.router, prefix=settings.API_V1_STR, tags=["Advanced Engineering Simulation v4.4"])
app.include_router(network_v45_router.router, prefix=settings.API_V1_STR, tags=["Global Engineering Network v4.5"])
app.include_router(engineering_os_v50_router.router, prefix=settings.API_V1_STR, tags=["Engineering Intelligence OS v5.0"])
app.include_router(production_v51_router.router, prefix=settings.API_V1_STR, tags=["Production Platform v5.1"])
app.include_router(security_v52_router.router, prefix=settings.API_V1_STR, tags=["Security & Enterprise Trust v5.2"])
app.include_router(ecosystem_v53_router.router, prefix=settings.API_V1_STR, tags=["Developer & Enterprise Ecosystem v5.3"])
app.include_router(marketplace_v54_router.router, prefix=settings.API_V1_STR, tags=["Intelligence Marketplace v5.4"])
app.include_router(federation_v55_router.router, prefix=settings.API_V1_STR, tags=["Federated Intelligence Network v5.5"])
app.include_router(commercial_v60_router.router, prefix=settings.API_V1_STR, tags=["Commercial Autonomous Platform v6.0"])
app.include_router(workflows_v61_router.router, prefix=settings.API_V1_STR, tags=["Autonomous Engineering Workflows v6.1"])
app.include_router(autonomy_v62_router.router, prefix=settings.API_V1_STR, tags=["Engineering Autonomy v6.2"])
app.include_router(learning_v63_router.router, prefix=settings.API_V1_STR, tags=["Engineering Intelligence Learning System v6.3"])
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
    asip_router.router,
    prefix=settings.API_V1_STR,
    tags=["asip"],
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
    ase_router.router,
    prefix=settings.API_V1_STR,
    tags=["ase"],
)
app.include_router(
    wskg_router.router,
    prefix=settings.API_V1_STR,
    tags=["wskg"],
)


app.include_router(
    org_knowledge_graph_router.router,
    prefix=settings.API_V1_STR,
    tags=["org_knowledge_graph"],
)
app.include_router(
    team_intelligence_router.router,
    prefix=settings.API_V1_STR,
    tags=["team_intelligence"],
)
app.include_router(
    workspace_router.router,
    prefix=settings.API_V1_STR,
    tags=["workspaces"],
)
app.include_router(
    enterprise_autonomous_optimization_router.router,
    prefix=settings.API_V1_STR,
    tags=["enterprise_autonomous_optimization"],
)
app.include_router(
    enterprise_simulation_router.router,
    prefix=settings.API_V1_STR,
    tags=["enterprise_simulation"],
)
app.include_router(
    governance_compliance_router.router,
    prefix=settings.API_V1_STR,
    tags=["governance_compliance"],
)
app.include_router(
    enterprise_ai_cto_router.router,
    prefix=settings.API_V1_STR,
    tags=["enterprise_ai_cto"],
)
app.include_router(
    cross_org_risk_router.router,
    prefix=settings.API_V1_STR,
    tags=["cross_org_risk"],
)
app.include_router(
    enterprise_architecture_router.router,
    prefix=settings.API_V1_STR,
    tags=["enterprise_architecture"],
)
app.include_router(
    executive_intelligence_router.router,
    prefix=settings.API_V1_STR,
    tags=["executive_intelligence"],
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
app.include_router(
    are_router.router,
    prefix=settings.API_V1_STR,
    tags=["are"],
)
app.include_router(
    esl_router.router,
    prefix=settings.API_V1_STR,
    tags=["esl"],
)
app.include_router(
    arc_router.router,
    prefix=settings.API_V1_STR,
    tags=["arc"],
)
app.include_router(
    caee_router.router,
    prefix=settings.API_V1_STR,
    tags=["caee"],
)
app.include_router(
    edie_router.router,
    prefix=settings.API_V1_STR,
    tags=["edie"],
)
app.include_router(
    oip_router.router,
    prefix=settings.API_V1_STR,
    tags=["oip"],
)
app.include_router(
    eskg_router.router,
    prefix=settings.API_V1_STR,
    tags=["eskg"],
)
app.include_router(
    biie_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie"],
)
app.include_router(
    biie_features_1_20_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie_analytics"],
)
app.include_router(
    biie_features_21_40_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie_economics"],
)
app.include_router(
    biie_features_41_60_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie_risk"],
)
app.include_router(
    biie_features_61_80_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie_ai_advisor"],
)
app.include_router(
    biie_features_81_100_router.router,
    prefix=settings.API_V1_STR,
    tags=["biie_command_center"],
)
app.include_router(
    learning_v63_router.router,
    prefix=settings.API_V1_STR,
    tags=["learning_v63"],
)
app.include_router(
    simulation_v64_router.router,
    prefix=settings.API_V1_STR,
    tags=["simulation_v64"],
)
app.include_router(
    autonomous_org_v65_router.router,
    prefix=settings.API_V1_STR,
    tags=["autonomous_org_v65"],
)
app.include_router(
    governance_trust_v66_router.router,
    prefix=settings.API_V1_STR,
    tags=["governance_trust_v66"],
)
app.include_router(
    economy_v67_router.router,
    prefix=settings.API_V1_STR,
    tags=["economy_v67"],
)
app.include_router(
    science_v68_router.router,
    prefix=settings.API_V1_STR,
    tags=["science_v68"],
)
app.include_router(
    ecosystem_v69_router.router,
    prefix=settings.API_V1_STR,
    tags=["ecosystem_v69"],
)
app.include_router(
    platform_v70_router.router,
    prefix=settings.API_V1_STR,
    tags=["platform_v70"],
)
app.include_router(
    protocol_v71_router.router,
    prefix=settings.API_V1_STR,
    tags=["protocol_v71"],
)
app.include_router(
    network_v72_router.router,
    prefix=settings.API_V1_STR,
    tags=["network_v72"],
)
app.include_router(
    collective_v73_router.router,
    prefix=settings.API_V1_STR,
    tags=["collective_v73"],
)
app.include_router(
    marketplace_v74_router.router,
    prefix=settings.API_V1_STR,
    tags=["marketplace_v74"],
)
app.include_router(
    fabric_v75_router.router,
    prefix=settings.API_V1_STR,
    tags=["fabric_v75"],
)
app.include_router(
    autonomy_os_v76_router.router,
    prefix=settings.API_V1_STR,
    tags=["autonomy_os_v76"],
)
app.include_router(
    self_healing_v77_router.router,
    prefix=settings.API_V1_STR,
    tags=["self_healing_v77"],
)
app.include_router(
    immune_v78_router.router,
    prefix=settings.API_V1_STR,
    tags=["immune_v78"],
)
app.include_router(
    evolution_v79_router.router,
    prefix=settings.API_V1_STR,
    tags=["evolution_v79"],
)











