from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.autonomous.wskg_engine import wskg_engine
from app.core.database import get_db
from app.models.user import User
from app.schemas.wskg import (
    AIModelEcosystemResponse,
    APIKnowledgeGraphResponse,
    ArchitectureCaseStudyResponse,
    ArchitectureDiscoveryResponse,
    ArchitectureEncyclopediaResponse,
    ArchitecturePatternDetailResponse,
    ContextualRecommendationRequest,
    DevOpsKubernetesGraphResponse,
    EcosystemReportResponse,
    EngineeringInternetDashboardResponse,
    EngineeringLearningPathResponse,
    EngineeringRecommendationResponse,
    FrameworkComparisonRequest,
    FrameworkComparisonResponse,
    FrameworkIntelligenceResponse,
    LibraryIntelligenceResponse,
    SemanticEngineeringSearchRequest,
    SemanticEngineeringSearchResponse,
    TechnologyCompatibilityRequest,
    TechnologyCompatibilityResponse,
    TechnologyMigrationPathResponse,
    TechnologyRelationshipPathResponse,
    UniversalRepoSearchRequest,
    UniversalRepoSearchResponse,
    WorldSoftwareAtlasResponse,
    WSKGGraphTopologyResponse,
    WSKGNodeAlternativesResponse,
    WSKGNodeResponse,
    WSKGReasoningRequest,
    WSKGReasoningResponse,
)

router = APIRouter()


@router.post("/wskg/seed", status_code=status.HTTP_200_OK)
def seed_world_knowledge_graph(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    res = wskg_engine.seed_world_knowledge_graph(db=db)
    return res


@router.get("/wskg/nodes", response_model=List[WSKGNodeResponse])
def search_wskg_nodes(
    query: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default="all"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    nodes = wskg_engine.search_nodes(query=query, category=category, db=db)
    return nodes


@router.get("/wskg/graph", response_model=WSKGGraphTopologyResponse)
def get_wskg_graph_topology(
    category: Optional[str] = Query(default="all"),
    relationship: Optional[str] = Query(default="all"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    topology = wskg_engine.get_graph_topology(
        category_filter=category, relationship_filter=relationship, db=db
    )
    return topology


@router.post("/wskg/reason", response_model=WSKGReasoningResponse)
def reason_over_ecosystem(
    body: WSKGReasoningRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    res = wskg_engine.reason_over_ecosystem(
        prompt=body.prompt,
        target_category=body.target_category,
        repository_id=body.repository_id,
        db=db,
    )
    return res


# 🌟 Signature Feature: World Software Atlas
@router.get("/wskg/atlas", response_model=WorldSoftwareAtlasResponse)
def get_world_software_atlas(
    zoom: Optional[str] = Query(default="earth"),
    parent_id: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_world_software_atlas(
        zoom_level=zoom, parent_id=parent_id, db=db
    )


# ⭐ Feature 56: Engineering Internet Dashboard
@router.get(
    "/wskg/internet-dashboard", response_model=EngineeringInternetDashboardResponse
)
def get_engineering_internet_dashboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_engineering_internet_dashboard(db=db)


# ⭐ Feature 42: Semantic Engineering Search
@router.post("/wskg/search/semantic", response_model=SemanticEngineeringSearchResponse)
def semantic_engineering_search(
    body: SemanticEngineeringSearchRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.semantic_engineering_search(
        prompt=body.prompt, limit=body.limit, db=db
    )


# ⭐ Feature 43: Architecture Encyclopedia
@router.get("/wskg/encyclopedia", response_model=ArchitectureEncyclopediaResponse)
def get_architecture_encyclopedia(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_architecture_encyclopedia(db=db)


@router.post("/wskg/search/universal", response_model=UniversalRepoSearchResponse)
def universal_repository_search(
    body: UniversalRepoSearchRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.universal_repository_search(request=body, db=db)


@router.get(
    "/wskg/architecture/discovery", response_model=ArchitectureDiscoveryResponse
)
def discover_similar_architectures(
    target: str = Query(default="Netflix"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.discover_similar_architectures(query_target=target, db=db)


@router.get(
    "/wskg/relationship-path", response_model=TechnologyRelationshipPathResponse
)
def get_technology_relationship_path(
    source: str = Query(default="Redis"),
    target: str = Query(default="Event Sourcing Pattern"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_technology_relationship_path(
        source_name=source, target_name=target, db=db
    )


@router.get(
    "/wskg/frameworks/{framework_name}", response_model=FrameworkIntelligenceResponse
)
def get_framework_intelligence(
    framework_name: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_framework_intelligence(framework_name=framework_name, db=db)


@router.get(
    "/wskg/libraries/{library_name}", response_model=LibraryIntelligenceResponse
)
def get_library_intelligence(
    library_name: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_library_intelligence(library_name=library_name, db=db)


@router.get("/wskg/apis", response_model=APIKnowledgeGraphResponse)
def get_api_knowledge_graph(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_api_knowledge_graph(db=db)


@router.get(
    "/wskg/patterns/{pattern_name}", response_model=ArchitecturePatternDetailResponse
)
def explore_architecture_pattern(
    pattern_name: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.explore_architecture_pattern(pattern_name=pattern_name, db=db)


@router.post("/wskg/compatibility", response_model=TechnologyCompatibilityResponse)
def evaluate_technology_compatibility(
    body: TechnologyCompatibilityRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.evaluate_technology_compatibility(request=body, db=db)


@router.post("/wskg/recommendations", response_model=EngineeringRecommendationResponse)
def generate_contextual_engineering_recommendations(
    body: ContextualRecommendationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.generate_contextual_engineering_recommendations(
        request=body, db=db
    )


@router.get("/wskg/migration-path", response_model=TechnologyMigrationPathResponse)
def get_technology_migration_path(
    from_tech: str = Query(default="Django"),
    to_tech: str = Query(default="FastAPI"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_technology_migration_path(
        from_tech=from_tech, to_tech=to_tech, db=db
    )


@router.post("/wskg/frameworks/compare", response_model=FrameworkComparisonResponse)
def compare_frameworks(
    body: FrameworkComparisonRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.compare_frameworks(request=body, db=db)


@router.get("/wskg/ai-models", response_model=AIModelEcosystemResponse)
def get_ai_model_ecosystem_graph(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_ai_model_ecosystem_graph(db=db)


@router.get("/wskg/devops-k8s", response_model=DevOpsKubernetesGraphResponse)
def get_devops_kubernetes_graph(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_devops_kubernetes_graph(db=db)


@router.get("/wskg/case-studies", response_model=ArchitectureCaseStudyResponse)
def get_architecture_case_studies(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_architecture_case_studies(db=db)


@router.get("/wskg/learning-paths", response_model=EngineeringLearningPathResponse)
def get_engineering_learning_paths(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.get_engineering_learning_paths(db=db)


@router.get("/wskg/ecosystem-report", response_model=EcosystemReportResponse)
def generate_ecosystem_report(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return wskg_engine.generate_ecosystem_report(db=db)


@router.get(
    "/wskg/nodes/{node_id}/alternatives", response_model=WSKGNodeAlternativesResponse
)
def get_node_alternatives(
    node_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        res = wskg_engine.get_alternatives(node_id=node_id, db=db)
        return res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
