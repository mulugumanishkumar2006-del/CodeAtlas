from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class WSKGNodeBase(BaseModel):
    name: str
    label: str
    category: str
    ecosystem: str = "global"
    description: Optional[str] = None
    website_url: Optional[str] = None
    github_url: Optional[str] = None
    popularity_score: float = 50.0
    maturity_level: str = "stable"
    properties: Dict[str, Any] = Field(default_factory=dict)


class WSKGNodeCreate(WSKGNodeBase):
    id: Optional[str] = None


class WSKGNodeResponse(WSKGNodeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WSKGEdgeBase(BaseModel):
    source_id: str
    target_id: str
    relationship_type: str
    weight: float = 1.0
    description: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class WSKGEdgeResponse(WSKGEdgeBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WSKGGraphTopologyResponse(BaseModel):
    total_nodes: int
    total_edges: int
    nodes: List[WSKGNodeResponse]
    edges: List[WSKGEdgeResponse]
    categories_breakdown: Dict[str, int]


class WSKGReasoningRequest(BaseModel):
    prompt: str
    repository_id: Optional[str] = None
    target_category: Optional[str] = None


class WSKGReasoningResponse(BaseModel):
    query_id: str
    prompt: str
    synthesized_answer: str
    recommended_nodes: List[WSKGNodeResponse]
    confidence_score: float = 0.95
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WSKGNodeAlternativesResponse(BaseModel):
    node_id: str
    node_name: str
    category: str
    alternatives: List[WSKGNodeResponse]
    compatible_tools: List[WSKGNodeResponse]
    best_practices: List[WSKGNodeResponse]


# ⭐ Feature 2: Universal Repository Search
class UniversalRepoSearchRequest(BaseModel):
    architecture: Optional[str] = None
    domain: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    pattern: Optional[str] = None
    scale: Optional[str] = None
    language: Optional[str] = None


class UniversalRepoSearchResult(BaseModel):
    repo_id: str
    name: str
    full_name: str
    description: str
    architecture: str
    tech_stack: List[str]
    stars: int
    matched_score: float


class UniversalRepoSearchResponse(BaseModel):
    total_matched: int
    results: List[UniversalRepoSearchResult]


# ⭐ Feature 3: AI Architecture Discovery
class ArchitectureDiscoveryResponse(BaseModel):
    target_query: str
    similar_architectures: List[Dict[str, Any]]
    key_patterns_found: List[str]
    recommended_components: List[WSKGNodeResponse]


# ⭐ Feature 4: Technology Relationship Path Graph
class RelationshipPathHop(BaseModel):
    hop: int
    from_node: WSKGNodeResponse
    relationship: str
    to_node: WSKGNodeResponse


class TechnologyRelationshipPathResponse(BaseModel):
    source_node: str
    target_node: str
    total_hops: int
    path: List[RelationshipPathHop]


# ⭐ Feature 5: Framework Intelligence
class FrameworkIntelligenceResponse(BaseModel):
    framework_name: str
    category: str
    best_practices: List[Dict[str, Any]]
    recommended_architecture: Dict[str, Any]
    performance_guidelines: List[str]
    security_hardening: List[str]
    deployment_patterns: List[str]


# ⭐ Feature 6: Library Intelligence
class LibraryIntelligenceResponse(BaseModel):
    library_name: str
    popularity_score: float
    maturity: str
    maintenance_status: str
    community_rating: float
    alternatives: List[WSKGNodeResponse]
    security_advisories_count: int


# ⭐ Feature 7: API Knowledge Graph
class APIKnowledgeGraphResponse(BaseModel):
    total_apis: int
    total_sdks: int
    api_nodes: List[WSKGNodeResponse]
    integrations: List[Dict[str, Any]]


# ⭐ Feature 8: Architecture Pattern Explorer
class ArchitecturePatternDetailResponse(BaseModel):
    pattern_name: str
    description: str
    pros: List[str]
    cons: List[str]
    ideal_use_cases: List[str]
    implementing_repositories: List[str]
    compatible_frameworks: List[WSKGNodeResponse]


# ⭐ Feature 9: Technology Compatibility Engine
class TechnologyCompatibilityRequest(BaseModel):
    technologies: List[str]  # e.g. ["Redis", "CockroachDB", "Kafka"]


class TechnologyCompatibilityResponse(BaseModel):
    technologies: List[str]
    compatibility_score: float  # 0.0 - 100.0
    overall_status: str  # Highly Compatible, Compatible, Caution Required, Incompatible
    trade_offs: List[str]
    empirical_evidence: List[Dict[str, Any]]


# ⭐ Feature 10: Engineering Recommendation Engine
class ContextualRecommendationRequest(BaseModel):
    architecture_style: str  # microservices, monolith, serverless
    traffic_profile: str  # high_concurrency, low_latency, batch
    tech_stack: List[str]


class EngineeringRecommendationResponse(BaseModel):
    recommended_stack: List[WSKGNodeResponse]
    rationale: str
    similar_team_patterns: List[Dict[str, Any]]
    confidence_score: float


# ⭐ Feature 13: Technology Migration Path
class TechnologyMigrationPathResponse(BaseModel):
    from_technology: str
    to_technology: str
    title: str
    description: str
    estimated_effort_weeks: float
    complexity_score: float
    migration_steps: List[Dict[str, Any]]
    risk_factors: List[str]


# ⭐ Feature 14: Framework Comparison Matrix
class FrameworkComparisonRequest(BaseModel):
    frameworks: List[str]  # e.g., ["FastAPI", "Next.js", "Django"]


class FrameworkComparisonResponse(BaseModel):
    compared_frameworks: List[str]
    matrix: List[
        Dict[str, Any]
    ]  # Property breakdown (Performance, Security, Learning Curve, Ecosystem)
    recommended_choice: str
    summary_verdict: str


# ⭐ Feature 24: AI Model Ecosystem Graph
class AIModelEcosystemResponse(BaseModel):
    total_models: int
    models: List[WSKGNodeResponse]
    serving_frameworks: List[WSKGNodeResponse]
    benchmarks: Dict[str, Any]


# ⭐ Feature 25 & 26: DevOps & Kubernetes Graph
class DevOpsKubernetesGraphResponse(BaseModel):
    total_components: int
    orchestration_nodes: List[WSKGNodeResponse]
    mesh_and_ingress: List[WSKGNodeResponse]
    ci_cd_tools: List[WSKGNodeResponse]


# ⭐ Feature 30: Architecture Case Studies
class ArchitectureCaseStudyResponse(BaseModel):
    case_studies_count: int
    case_studies: List[Dict[str, Any]]


# ⭐ Feature 31: Engineering Learning Paths & FAQs
class EngineeringLearningPathResponse(BaseModel):
    paths_count: int
    learning_paths: List[Dict[str, Any]]
    faqs: List[Dict[str, Any]]


# ⭐ Feature 38: Ecosystem Reports & Knowledge APIs
class EcosystemReportResponse(BaseModel):
    report_title: str
    generated_at: datetime
    top_frameworks: List[WSKGNodeResponse]
    top_databases: List[WSKGNodeResponse]
    trending_patterns: List[str]
    ecosystem_health_index: float

    model_config = ConfigDict(from_attributes=True)


# 🌟 Signature Feature: World Software Atlas Schemas
class AtlasZoomNode(BaseModel):
    id: str
    parent_id: Optional[str] = None
    zoom_level: (
        str  # earth, domain, language, framework, database, infra, repository, symbol
    )
    name: str
    title: str
    description: Optional[str] = None
    child_count: int = 0
    node_metadata: Dict[str, Any] = Field(default_factory=dict)


class WorldSoftwareAtlasResponse(BaseModel):
    current_zoom_level: str
    active_node: AtlasZoomNode
    child_nodes: List[AtlasZoomNode]
    breadcrumb_path: List[Dict[str, str]]


# ⭐ Feature 56: Engineering Internet Dashboard
class EngineeringInternetDashboardResponse(BaseModel):
    live_pulse_status: str
    active_global_entities: int
    trending_technologies: List[WSKGNodeResponse]
    recent_security_advisories: List[Dict[str, Any]]
    framework_adoption_rates: Dict[str, float]


# ⭐ Feature 42: Semantic Engineering Search
class SemanticEngineeringSearchRequest(BaseModel):
    prompt: str
    limit: int = 5


class SemanticSearchResultItem(BaseModel):
    entity_name: str
    entity_type: str
    relevance_score: float
    summary: str


class SemanticEngineeringSearchResponse(BaseModel):
    query: str
    results: List[SemanticSearchResultItem]


# ⭐ Feature 43: Architecture Encyclopedia
class ArchitectureEncyclopediaResponse(BaseModel):
    total_articles: int
    categories: List[str]
    articles: List[Dict[str, Any]]
