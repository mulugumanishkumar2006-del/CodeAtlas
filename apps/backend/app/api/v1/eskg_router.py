from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.enterprise.eskg_engine import eskg_engine
from app.models.user import User
from app.schemas.eskg import (
    ESKGAIGraphIntelligenceResponse,
    ESKGAIHiddenRelationshipRequest,
    ESKGAIHiddenRelationshipResponse,
    ESKGBlastRadiusRequest,
    ESKGBlastRadiusResponse,
    ESKGCircularDependencyResponse,
    ESKGCrossRepoIntelligenceResponse,
    ESKGEnterpriseDashboardResponse,
    ESKGEnterpriseIntelligenceResponse,
    ESKGGraphAnalyticsResponse,
    ESKGGraphTopologyResponse,
    ESKGMultiHopPathRequest,
    ESKGMultiHopPathResponse,
    ESKGMultiLevelNavResponse,
    ESKGNodeResponse,
    ESKGReasoningRequest,
    ESKGReasoningResponse,
    ESKGRepositoryIntelligenceResponse,
    ESKGSeedingResponse,
    ESKGSPOFAnalysisResponse,
    ESKGVisualizationSuiteResponse,
)

router = APIRouter()


@router.post(
    "/eskg/seed", response_model=ESKGSeedingResponse, status_code=status.HTTP_200_OK
)
def seed_enterprise_knowledge_graph(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Seed/ingest the Enterprise Software Knowledge Graph (ESKG) across all entity layers.
    """
    return eskg_engine.seed_enterprise_graph(db=db)


@router.get("/eskg/nodes", response_model=List[ESKGNodeResponse])
def search_eskg_nodes(
    query: str = Query("", description="Search query string"),
    entity_type: Optional[str] = Query("all", description="Entity type filter"),
    domain: Optional[str] = Query("all", description="Business domain filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Search and filter ESKG nodes.
    """
    return eskg_engine.search_nodes(
        db=db, query=query, entity_type=entity_type, domain=domain
    )


@router.get("/eskg/graph", response_model=ESKGGraphTopologyResponse)
def get_eskg_graph_topology(
    layer: Optional[str] = Query("all", description="Entity layer filter"),
    domain: Optional[str] = Query("all", description="Domain filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get full or filtered enterprise software knowledge graph topology (nodes + edges).
    """
    return eskg_engine.get_graph_topology(
        db=db, layer_filter=layer, domain_filter=domain
    )


@router.post("/eskg/blast-radius", response_model=ESKGBlastRadiusResponse)
def calculate_blast_radius(
    body: ESKGBlastRadiusRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Calculate blast radius and cascading system failure impact for a target node.
    """
    try:
        return eskg_engine.calculate_blast_radius(
            db=db, target_node_id=body.target_node_id, max_depth=body.max_depth
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "/eskg/circular-dependencies", response_model=ESKGCircularDependencyResponse
)
def detect_circular_dependencies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Detect circular dependencies and cyclical service communication loops.
    """
    return eskg_engine.detect_circular_dependencies(db=db)


@router.get("/eskg/spofs", response_model=ESKGSPOFAnalysisResponse)
def identify_spofs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Identify Single Points of Failure (SPOFs).
    """
    return eskg_engine.identify_spofs(db=db)


@router.post("/eskg/path", response_model=ESKGMultiHopPathResponse)
def find_dependency_path(
    body: ESKGMultiHopPathRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Find multi-hop dependency path between source and target nodes.
    """
    return eskg_engine.find_dependency_path(
        db=db,
        source_node_id=body.source_node_id,
        target_node_id=body.target_node_id,
        max_hops=body.max_hops,
    )


@router.post("/eskg/reason", response_model=ESKGReasoningResponse)
def reason_over_enterprise_graph(
    body: ESKGReasoningRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    AI Reasoning Engine over the Enterprise Software Knowledge Graph.
    """
    return eskg_engine.reason_over_enterprise_graph(
        db=db,
        query_text=body.query_text,
        target_domain=body.target_domain,
        target_layer=body.target_layer,
    )


@router.get("/eskg/dashboard", response_model=ESKGEnterpriseDashboardResponse)
def get_enterprise_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get comprehensive Enterprise Software Knowledge Graph dashboard metrics and alerts.
    """
    return eskg_engine.get_enterprise_dashboard(db=db)


# --- Phase 37 Features 6–20 Endpoints ---


@router.get("/eskg/analytics", response_model=ESKGGraphAnalyticsResponse)
def get_graph_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full Graph Analytics suite (Features 6–20: Centrality, SCCs, Communities, Density, Quality Score, Pruning).
    """
    return eskg_engine.get_graph_analytics(db=db)


@router.get("/eskg/navigation", response_model=ESKGMultiLevelNavResponse)
def get_multi_level_navigation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get multi-level hierarchical navigation tree (Company -> Function) (Feature 4).
    """
    return eskg_engine.get_multi_level_navigation(db=db)


@router.get("/eskg/cross-repo", response_model=ESKGCrossRepoIntelligenceResponse)
def get_cross_repo_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get cross-repository dependency intelligence chains (Feature 3).
    """
    return eskg_engine.get_cross_repo_intelligence(db=db)


@router.post("/eskg/ai-discover", response_model=ESKGAIHiddenRelationshipResponse)
def discover_ai_hidden_relationships(
    body: ESKGAIHiddenRelationshipRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Scan & discover implicit/hidden relationships using AI (Feature 5).
    """
    return eskg_engine.discover_ai_hidden_relationships(db=db, request=body)


# --- Phase 37 Features 21–40 Repository Intelligence Endpoints ---


@router.get(
    "/eskg/repository-intelligence", response_model=ESKGRepositoryIntelligenceResponse
)
def get_repository_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full Repository Intelligence suite (Features 21–40: Cross-repo APIs, shared code, duplicate libraries, SDKs, infra/deploy/release graphs, tech usage, language map, repo score).
    """
    return eskg_engine.get_repository_intelligence(db=db)


# --- Phase 37 Features 41–60 Enterprise Intelligence Endpoints ---


@router.get(
    "/eskg/enterprise-intelligence", response_model=ESKGEnterpriseIntelligenceResponse
)
def get_enterprise_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full Enterprise Intelligence suite (Features 41–60: DDD context, team/service ownership, customer journey, engineering investment, cost dependency, compliance, security, data lineage, governance, multi-cloud, portfolio intelligence).
    """
    return eskg_engine.get_enterprise_intelligence(db=db)


# --- Phase 37 Features 61–80 AI Graph Intelligence Endpoints ---


@router.get(
    "/eskg/ai-graph-intelligence", response_model=ESKGAIGraphIntelligenceResponse
)
def get_ai_graph_intelligence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full AI Graph Intelligence suite (Features 61–80: AI reasoning, dependency prediction, missing edge detection, recommendations, modernization, service extraction, tech replacement, root cause tracing, blast radius, optimization, anomalies, embeddings, confidence score).
    """
    return eskg_engine.get_ai_graph_intelligence(db=db)


# --- Phase 37 Features 81–100 Interactive Visualization & Software Universe Endpoints ---


@router.get("/eskg/visualization-suite", response_model=ESKGVisualizationSuiteResponse)
def get_visualization_suite(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full Interactive Visualization Suite (Features 81–100: Software Universe 3D Galaxy layout, infinite zoom, search index, semantic search, time-travel, heat maps, traffic animations, role dashboards, plugin SDK, software universe score).
    """
    return eskg_engine.get_visualization_suite(db=db)


@router.get("/eskg/export-graphml")
def export_graphml(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export full Enterprise Software Knowledge Graph to standard GraphML XML format (Feature 97).
    """
    xml_content = eskg_engine.export_graphml(db=db)
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={
            "Content-Disposition": "attachment; filename=enterprise_knowledge_graph.graphml"
        },
    )
