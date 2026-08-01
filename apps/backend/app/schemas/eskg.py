from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ESKGNodeBase(BaseModel):
    name: str
    label: str
    entity_type: str  # repository, microservice, package, function, class, api, database, infrastructure, documentation, business_domain, queue, team
    domain: str = "core"
    tier: str = "tier_1"
    status: str = "healthy"
    criticality_score: float = 85.0
    owner_team: str = "platform_team"
    description: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class ESKGNodeCreate(ESKGNodeBase):
    id: Optional[str] = None


class ESKGNodeResponse(ESKGNodeBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ESKGEdgeBase(BaseModel):
    source_id: str
    target_id: str
    relationship_type: str
    weight: float = 1.0
    description: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class ESKGEdgeCreate(ESKGEdgeBase):
    id: Optional[str] = None


class ESKGEdgeResponse(ESKGEdgeBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ESKGGraphTopologyResponse(BaseModel):
    total_nodes: int
    total_edges: int
    nodes: List[ESKGNodeResponse]
    edges: List[ESKGEdgeResponse]
    layer_breakdown: Dict[str, int]
    domain_breakdown: Dict[str, int]


class ESKGBlastRadiusRequest(BaseModel):
    target_node_id: str
    max_depth: int = 4
    include_mitigations: bool = True


class ESKGBlastRadiusResponse(BaseModel):
    target_node_id: str
    target_node_name: str
    target_entity_type: str
    blast_radius_score: float
    impacted_nodes_count: int
    direct_dependents_count: int
    transitive_dependents_count: int
    impacted_nodes: List[Dict[str, Any]]
    mitigation_recommendations: List[str]


class ESKGCircularDependency(BaseModel):
    cycle_id: str
    cycle_length: int
    nodes_in_cycle: List[Dict[str, Any]]
    severity: str
    description: str


class ESKGCircularDependencyResponse(BaseModel):
    total_cycles: int
    cycles: List[ESKGCircularDependency]
    recommendations: List[str]


class ESKGSPOFItem(BaseModel):
    node_id: str
    name: str
    entity_type: str
    domain: str
    dependent_services_count: int
    risk_level: str
    reason: str


class ESKGSPOFAnalysisResponse(BaseModel):
    total_spofs: int
    spofs: List[ESKGSPOFItem]
    risk_reduction_strategies: List[str]


class ESKGMultiHopPathRequest(BaseModel):
    source_node_id: str
    target_node_id: str
    max_hops: int = 6


class ESKGMultiHopPathResponse(BaseModel):
    found: bool
    path_length: int
    path_nodes: List[ESKGNodeResponse]
    path_edges: List[ESKGEdgeResponse]
    description: str


class ESKGReasoningRequest(BaseModel):
    query_text: str
    target_domain: Optional[str] = None
    target_layer: Optional[str] = None


class ESKGReasoningResponse(BaseModel):
    query_text: str
    synthesized_answer: str
    confidence_score: float
    traversed_nodes_count: int
    traversed_path: List[Dict[str, Any]]
    recommended_actions: List[str]


class ESKGEnterpriseDashboardResponse(BaseModel):
    enterprise_name: str
    total_nodes: int
    total_edges: int
    spof_count: int
    circular_deps_count: int
    health_score: float
    layer_breakdown: Dict[str, int]
    domain_breakdown: Dict[str, int]
    top_critical_services: List[ESKGNodeResponse]
    system_alerts: List[str]


class ESKGSeedingResponse(BaseModel):
    status: str
    nodes_created: int
    edges_created: int
    message: str


# --- Phase 37 Features 6–20 Schemas ---


class ESKGGraphAnalyticsResponse(BaseModel):
    centrality_ranking: List[Dict[str, Any]]
    community_clusters: List[Dict[str, Any]]
    strongly_connected_components: List[Dict[str, Any]]
    critical_nodes: List[Dict[str, Any]]
    bottlenecks: List[Dict[str, Any]]
    graph_density: float
    relationship_scores: List[Dict[str, Any]]
    architecture_influence_map: Dict[str, float]
    dependency_evolution_trend: List[Dict[str, Any]]
    circular_graph_loops_count: int
    long_dependency_chains: List[Dict[str, Any]]
    graph_pruning_suggestions: List[Dict[str, Any]]
    graph_quality_score: float


class ESKGMultiLevelNavResponse(BaseModel):
    company_name: str
    total_domains: int
    hierarchy_tree: List[Dict[str, Any]]


class ESKGCrossRepoIntelligenceResponse(BaseModel):
    total_chains: int
    cross_repo_chains: List[Dict[str, Any]]


class ESKGAIHiddenRelationshipRequest(BaseModel):
    scan_scope: str = "all"
    min_confidence: float = 0.8


class ESKGAIHiddenRelationshipResponse(BaseModel):
    total_discovered: int
    discovered_relationships: List[Dict[str, Any]]
    summary: str


# --- Phase 37 Features 21–40 Repository Intelligence Schemas ---


class ESKGRepositoryIntelligenceResponse(BaseModel):
    cross_repo_apis: List[Dict[str, Any]]
    shared_code_blocks: List[Dict[str, Any]]
    duplicate_libraries: List[Dict[str, Any]]
    package_reuse_analysis: Dict[str, Any]
    internal_sdks: List[Dict[str, Any]]
    hidden_coupling_vectors: List[Dict[str, Any]]
    cross_repo_refactorings: List[Dict[str, Any]]
    shared_ownership_graph: List[Dict[str, Any]]
    infrastructure_dependency_graph: List[Dict[str, Any]]
    deployment_dependency_graph: List[Dict[str, Any]]
    release_dependency_graph: List[Dict[str, Any]]
    version_compatibility_matrix: List[Dict[str, Any]]
    api_evolution_graph: List[Dict[str, Any]]
    technology_usage_graph: Dict[str, int]
    language_ecosystem_map: Dict[str, float]
    framework_dependency_map: Dict[str, int]
    storage_dependency_graph: List[Dict[str, Any]]
    cloud_resource_graph: List[Dict[str, Any]]
    build_dependency_graph: List[Dict[str, Any]]
    repository_ecosystem_score: float


# --- Phase 37 Features 41–60 Enterprise Intelligence Schemas ---


class ESKGEnterpriseIntelligenceResponse(BaseModel):
    business_capability_graph: List[Dict[str, Any]]
    ddd_visualization: List[Dict[str, Any]]
    team_ownership_graph: List[Dict[str, Any]]
    knowledge_ownership_graph: List[Dict[str, Any]]
    service_ownership: List[Dict[str, Any]]
    platform_dependency_map: List[Dict[str, Any]]
    customer_journey_map: List[Dict[str, Any]]
    engineering_investment_graph: Dict[str, float]
    cost_dependency_graph: List[Dict[str, Any]]
    compliance_graph: List[Dict[str, Any]]
    security_relationship_graph: List[Dict[str, Any]]
    data_lineage: List[Dict[str, Any]]
    infrastructure_ownership: List[Dict[str, Any]]
    architecture_governance_graph: List[Dict[str, Any]]
    multi_cloud_graph: Dict[str, Any]
    organizational_dependency_graph: List[Dict[str, Any]]
    incident_propagation_graph: List[Dict[str, Any]]
    business_impact_graph: List[Dict[str, Any]]
    enterprise_health_graph: Dict[str, Any]
    portfolio_intelligence: Dict[str, Any]


# --- Phase 37 Features 61–80 AI Graph Intelligence Schemas ---


class ESKGAIGraphIntelligenceResponse(BaseModel):
    ai_graph_reasoning: Dict[str, Any]
    ai_dependency_predictions: List[Dict[str, Any]]
    ai_missing_edges: List[Dict[str, Any]]
    ai_architecture_recommendations: List[Dict[str, Any]]
    ai_modernization_graph: List[Dict[str, Any]]
    ai_service_extractions: List[Dict[str, Any]]
    ai_technology_replacements: List[Dict[str, Any]]
    ai_graph_summary: str
    ai_graph_query_insights: List[Dict[str, Any]]
    ai_root_cause_traces: List[Dict[str, Any]]
    ai_blast_radius_predictions: List[Dict[str, Any]]
    ai_graph_optimizations: List[Dict[str, Any]]
    ai_anomalies_detected: List[Dict[str, Any]]
    ai_pattern_minings: List[Dict[str, Any]]
    ai_architecture_similarity: List[Dict[str, Any]]
    ai_graph_embeddings: Dict[str, List[float]]
    ai_engineering_memory_integration: Dict[str, Any]
    ai_relationship_explanations: List[Dict[str, Any]]
    ai_recommendation_engine: List[Dict[str, Any]]
    ai_graph_confidence_score: float


# --- Phase 37 Features 81–100 Interactive Visualization & Software Universe Schemas ---


class ESKGVisualizationSuiteResponse(BaseModel):
    software_universe_3d: Dict[str, Any]  # (81, 82, 100)
    graph_search_index: List[Dict[str, Any]]  # (83)
    semantic_search_results: List[Dict[str, Any]]  # (84)
    time_travel_snapshots: List[Dict[str, Any]]  # (85)
    heat_maps: Dict[str, Any]  # (86)
    risk_overlays: List[Dict[str, Any]]  # (87)
    dependency_animation_packets: List[Dict[str, Any]]  # (88)
    service_traffic_animation: List[Dict[str, Any]]  # (89)
    architecture_replay_timeline: List[Dict[str, Any]]  # (90)
    dark_mode_theme_tokens: Dict[str, str]  # (91)
    executive_dashboard_metrics: Dict[str, Any]  # (92)
    team_dashboard_metrics: Dict[str, Any]  # (93)
    engineering_dashboard_metrics: Dict[str, Any]  # (94)
    business_dashboard_metrics: Dict[str, Any]  # (95)
    mobile_viewport_config: Dict[str, Any]  # (96)
    graphml_export_url: str  # (97)
    graph_api_endpoints: List[str]  # (98)
    plugin_sdk_manifest: Dict[str, Any]  # (99)
    software_universe_score: float  # (100)
