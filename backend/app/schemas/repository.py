from datetime import datetime
from typing import Optional, Literal, Any
from pydantic import BaseModel, Field


class RepositoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Repository identifier or name, e.g. owner/repo")
    url: str = Field(..., description="Repository git or web URL")
    provider: str = Field(default="github", max_length=50, description="VCS provider (github, gitlab, etc.)")
    owner_name: Optional[str] = Field(default=None, max_length=255, description="Owner or organization name")
    default_branch: str = Field(default="main", max_length=100, description="Default branch name")
    description: Optional[str] = Field(default=None, description="Optional repository description")
    workspace_id: Optional[str] = Field(default=None, description="Associated workspace ID")


class RepositoryCreate(RepositoryBase):
    pass


class RepositoryResponse(RepositoryBase):
    id: str
    workspace_id: str
    connection_status: str
    analysis_status: str
    acquisition_status: str = "NOT_CLONED"
    acquisition_error: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    current_commit_sha: Optional[str] = None
    metadata_json: Optional[dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    @property
    def status(self) -> str:
        return self.acquisition_status or self.connection_status

    model_config = {
        "from_attributes": True
    }


class RepositoryStatusResponse(BaseModel):
    repository_id: str
    status: str
    branch: Optional[str] = None
    commit_sha: Optional[str] = None
    last_synced_at: Optional[datetime] = None
    error: Optional[str] = None

    model_config = {
        "from_attributes": True
    }


class HealthStatus(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    version: str
    environment: str
    database: Literal["connected", "disconnected"]
    redis: Literal["connected", "disconnected"]
    timestamp: datetime


class LanguageStat(BaseModel):
    language: str
    file_count: int
    line_count: int
    size_bytes: int
    percentage: float


class AnalysisResponse(BaseModel):
    id: str
    repository_id: str
    status: str
    branch: Optional[str] = None
    commit_sha: Optional[str] = None
    version: int = 1
    summary: Optional[str] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    metadata_json: Optional[dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class AnalysisProgressResponse(BaseModel):
    repository_id: str
    status: str
    stage: str
    files_discovered: int = 0
    files_processed: int = 0
    symbols_extracted: int = 0
    progress_percent: int = 0
    error: Optional[str] = None
    partial_errors: list[dict[str, Any]] = []
    unsupported_languages: list[dict[str, Any]] = []
    updated_at: Optional[str] = None


class IndexStatusResponse(BaseModel):
    repository_id: str
    status: str
    progress: int = 0
    files_discovered: int = 0
    files_indexed: int = 0
    current_stage: str
    error: Optional[str] = None



class FileResponse(BaseModel):
    id: str
    repository_id: str
    analysis_id: Optional[str] = None
    path: str
    language: Optional[str] = None
    size_bytes: int
    line_count: int
    content_hash: Optional[str] = None
    created_at: datetime

    symbol_count: Optional[int] = None

    model_config = {
        "from_attributes": True
    }


class FileDetailResponse(BaseModel):
    id: str
    repository_id: str
    analysis_id: Optional[str] = None
    path: str
    language: Optional[str] = None
    size_bytes: int
    line_count: int
    content_hash: Optional[str] = None
    source: str = ""
    is_binary: bool = False
    is_missing: bool = False
    is_truncated: bool = False
    commit_sha: Optional[str] = None
    branch: Optional[str] = None
    symbols: list["SymbolResponse"] = []
    dependencies: list["DependencyResponse"] = []
    dependents: list["DependencyResponse"] = []
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class ContextSnippetLine(BaseModel):
    line_number: int
    content: str
    is_target: bool = False


class CodeSearchMatch(BaseModel):
    file_id: str
    file_path: str
    line_number: int
    line_content: str
    match_start: int
    match_end: int
    context_snippet: list[ContextSnippetLine] = []
    match_reason: Optional[str] = None


class SymbolSearchMatch(BaseModel):
    id: str
    name: str
    symbol_type: str
    qualified_name: str
    file_id: str
    file_path: str
    start_line: int
    end_line: int
    language: Optional[str] = None
    docstring: Optional[str] = None
    score: Optional[int] = None
    match_reason: Optional[str] = None
    repository_id: Optional[str] = None
    relevance: Optional[float] = 1.0


class FileSearchMatch(BaseModel):
    id: str
    path: str
    language: Optional[str] = None
    line_count: Optional[int] = 0
    size_bytes: Optional[int] = 0
    score: Optional[int] = None
    match_reason: Optional[str] = None
    repository_id: Optional[str] = None
    relevance: Optional[float] = 1.0


class DirectorySearchMatch(BaseModel):
    directory: str
    file_count: int = 0
    line_count: int = 0
    symbol_count: int = 0
    match_reason: Optional[str] = None
    repository_id: Optional[str] = None


class DependencySearchMatch(BaseModel):
    id: str
    dependency_type: str
    name: str
    source_file_id: Optional[str] = None
    source_path: Optional[str] = None
    target_file_id: Optional[str] = None
    target_path: Optional[str] = None
    line: Optional[int] = None
    resolved: bool = True
    relationship_type: str = "outgoing"
    match_reason: Optional[str] = None
    repository_id: Optional[str] = None
    relevance: Optional[float] = 1.0


class ArchitectureSearchMatch(BaseModel):
    id: str
    name: str
    node_type: str  # module, layer, entry_point, pattern, group
    description: Optional[str] = None
    file_count: Optional[int] = 0
    score: Optional[int] = None
    match_reason: Optional[str] = None
    repository_id: Optional[str] = None
    relevance: Optional[float] = 1.0


class RepositorySearchResponse(BaseModel):
    repository_id: str
    query: str
    intent: str = "KEYWORD_SEARCH"
    explanation: Optional[str] = None
    total_matches: int = 0
    symbols: list[SymbolSearchMatch] = []
    symbol_matches: list[SymbolSearchMatch] = []
    files: list[FileSearchMatch] = []
    code_matches: list[CodeSearchMatch] = []
    dependencies: list[DependencySearchMatch] = []
    directories: list[DirectorySearchMatch] = []
    architecture: list[ArchitectureSearchMatch] = []
    architecture_matches: list[ArchitectureSearchMatch] = []
    limit: int = 50
    offset: int = 0
    has_more: bool = False



class SymbolResponse(BaseModel):
    id: str
    repository_id: str
    file_id: str
    name: str
    symbol_type: str
    qualified_name: str
    start_line: int
    end_line: int
    start_column: Optional[int] = None
    end_column: Optional[int] = None
    docstring: Optional[str] = None
    ast_metadata: Optional[dict[str, Any]] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class DependencyResponse(BaseModel):
    id: str
    repository_id: str
    analysis_id: Optional[str] = None
    name: str
    dependency_type: str
    source_file_id: Optional[str] = None
    target_file_id: Optional[str] = None
    source_path: Optional[str] = None
    target_path: Optional[str] = None
    resolved: bool = True
    line: Optional[int] = None
    metadata_json: Optional[dict[str, Any]] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class GraphNodeResponse(BaseModel):
    id: str
    repository_id: str
    node_key: str
    node_type: str
    label: str
    file_id: Optional[str] = None
    symbol_id: Optional[str] = None
    properties: Optional[dict[str, Any]] = None

    model_config = {
        "from_attributes": True
    }


class GraphRelationshipResponse(BaseModel):
    id: str
    repository_id: str
    source_node_id: str
    target_node_id: str
    relationship_type: str
    weight: float = 1.0
    properties: Optional[dict[str, Any]] = None

    model_config = {
        "from_attributes": True
    }


class GraphResponse(BaseModel):
    repository_id: str
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]
    metrics: dict[str, Any]
    cycles: list[list[str]] = []


class ArchitectureGroupResponse(BaseModel):
    id: str
    repository_id: str
    name: str
    file_count: int
    line_count: int
    code_lines: int = 0
    symbol_count: int
    incoming_dependencies: int
    outgoing_dependencies: int
    internal_coupling: int = 0
    languages: dict[str, int] = {}
    files: list[dict[str, Any]] = []


class ArchitectureRelationshipResponse(BaseModel):
    id: str
    repository_id: str
    source: str
    target: str
    source_group_id: str
    target_group_id: str
    dependency_count: int
    dependencies: list[dict[str, Any]] = []


class ArchitectureHealthDeduction(BaseModel):
    category: str
    severity: str
    deduction: int
    description: str
    affected_entities: list[str] = []


class ArchitectureHealthResponse(BaseModel):
    score: int
    max_score: int = 100
    grade: str
    status_label: str
    deductions: list[ArchitectureHealthDeduction] = []
    metrics: dict[str, Any] = {}


class FrameworkEvidenceItem(BaseModel):
    name: str
    category: str  # backend_web, frontend_ui, database_orm, testing, cli, etc.
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    evidence_files: list[str] = []
    evidence_imports: list[str] = []
    description: Optional[str] = None


class EntryPointItem(BaseModel):
    file_path: str
    symbol: Optional[str] = None
    line: int = 1
    reason: str
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    framework: Optional[str] = None
    file_id: Optional[str] = None


class ArchitectureLayerItem(BaseModel):
    name: str
    category: str
    file_count: int = 0
    symbol_count: int = 0
    files: list[str] = []
    description: str


class ArchitectureModuleItem(BaseModel):
    id: str
    name: str
    layer: str
    file_count: int = 0
    symbol_count: int = 0
    line_count: int = 0
    incoming_dependencies: int = 0
    outgoing_dependencies: int = 0
    internal_coupling: int = 0
    languages: dict[str, int] = {}
    files: list[dict[str, Any]] = []
    description: str


class ArchitecturePatternItem(BaseModel):
    pattern: str  # Layered Architecture, MVC, Repository Pattern, Component-Based, etc.
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    evidence: list[str] = []
    description: str


class ArchitectureViolationItem(BaseModel):
    violation_type: str  # LAYER_INVERSION, ARCHITECTURE_DRIFT, DIRECT_DATA_ACCESS, CIRCULAR_MODULE
    title: str
    description: str
    severity: str = "MEDIUM"  # CRITICAL, HIGH, MEDIUM, LOW
    source_entity: str
    target_entity: str
    evidence_file: Optional[str] = None
    evidence_line: Optional[int] = None


class ArchitectureHotspotItem(BaseModel):
    file_path: str
    symbol_count: int = 0
    line_count: int = 0
    incoming_count: int = 0
    outgoing_count: int = 0
    hotspot_score: int = 0
    reasons: list[str] = []


class ArchitectureOverviewResponse(BaseModel):
    repository_id: str
    languages: dict[str, int] = {}
    language_percentages: dict[str, float] = {}
    frameworks: list[FrameworkEvidenceItem] = []
    module_count: int = 0
    file_count: int = 0
    symbol_count: int = 0
    entry_points: list[EntryPointItem] = []
    patterns: list[ArchitecturePatternItem] = []
    summary_text: str


class ArchitectureResponse(BaseModel):
    repository_id: str
    overview: Optional[ArchitectureOverviewResponse] = None
    languages: dict[str, int] = {}
    language_percentages: dict[str, float] = {}
    frameworks: list[FrameworkEvidenceItem] = []
    entry_points: list[EntryPointItem] = []
    layers: list[ArchitectureLayerItem] = []
    modules: list[ArchitectureModuleItem] = []
    patterns: list[ArchitecturePatternItem] = []
    hotspots: list[ArchitectureHotspotItem] = []
    violations: list[ArchitectureViolationItem] = []
    drift: list[ArchitectureViolationItem] = []
    
    # Existing architecture graph & health fields (maintained for backward compatibility)
    groups: list[ArchitectureGroupResponse] = []
    relationships: list[ArchitectureRelationshipResponse] = []
    health: ArchitectureHealthResponse
    summary: dict[str, Any] = {}
    highlights: dict[str, Any] = {}
    cycles: list[list[str]] = []
    explanation: Optional[str] = None


# =========================================================================
# Phase 9: Evidence-Grounded Repository Q&A / RAG Schemas
# =========================================================================

class SourceCitationItem(BaseModel):
    file_id: str
    path: str
    file_path: Optional[str] = None
    start_line: int
    end_line: int
    symbol_id: Optional[str] = None
    symbol: Optional[str] = None
    relevance: float = 1.0
    repository_id: Optional[str] = None


class RepositoryQueryRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None


class RepositoryQueryResponse(BaseModel):
    repository_id: str
    question: str
    answer: str
    intent: Optional[str] = "GENERAL"
    evidence: list[SourceCitationItem] = []
    sources: list[SourceCitationItem] = []
    related_symbols: list[str] = []
    related_files: list[str] = []
    related_dependencies: list[str] = []
    conversation_id: Optional[str] = None
    duration_ms: Optional[float] = None
    latency_breakdown: Optional[dict[str, float]] = None


class ConversationMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    sources: Optional[list[SourceCitationItem]] = None
    created_at: Optional[str] = None


class ConversationCreateRequest(BaseModel):
    title: Optional[str] = "Repository Q&A"


class ConversationResponse(BaseModel):
    id: str
    repository_id: Optional[str] = None
    title: str
    context_type: str = "repository"
    messages: list[dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class ConversationListResponse(BaseModel):
    repository_id: str
    conversations: list[ConversationResponse]


# =========================================================================
# Phase 10 & Phase 19: Dependency & Impact Intelligence Schemas
# =========================================================================

class ImpactTargetItem(BaseModel):
    id: str
    repository_id: Optional[str] = None
    target_type: str  # FILE, SYMBOL, CLASS, FUNCTION, METHOD, MODULE, API, DEPENDENCY, COMPONENT
    target_id: Optional[str] = None
    name: str
    file_id: Optional[str] = None
    file_path: Optional[str] = None
    symbol_id: Optional[str] = None
    qualified_name: Optional[str] = None
    start_line: Optional[int] = None
    end_line: Optional[int] = None
    symbol_count: int = 0
    direct_dependencies_count: int = 0
    direct_dependents_count: int = 0
    metadata: Optional[dict[str, Any]] = None


class ImpactEvidenceItem(BaseModel):
    source: str
    target: str
    relationship: str  # IMPORTS, CALLS, DEPENDS_ON, CONTAINS, REFERENCES
    file_path: str
    file_id: Optional[str] = None
    start_line: int = 1
    end_line: int = 1
    import_name: Optional[str] = None
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW


class ImpactNodeItem(BaseModel):
    id: str
    label: str
    node_type: str  # file, symbol, class, function, method, module, api, dependency, component
    depth: int = 0
    direction: str = "target"  # target, upstream, downstream, both
    file_path: Optional[str] = None
    file_id: Optional[str] = None
    start_line: Optional[int] = None
    end_line: Optional[int] = None
    properties: Optional[dict[str, Any]] = None


class ImpactEdgeItem(BaseModel):
    source: str
    target: str
    relationship: str
    depth: int = 1
    evidence: Optional[ImpactEvidenceItem] = None


class CallItem(BaseModel):
    name: str
    symbol_id: Optional[str] = None
    symbol_type: Optional[str] = "function"
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    call_expression: Optional[str] = None
    caller_context: Optional[str] = None


class AffectedApiItem(BaseModel):
    method: str
    path: str
    file_path: str
    line_number: Optional[int] = None
    framework: Optional[str] = None
    distance: int = 1
    handler_symbol: Optional[str] = None


class AffectedTestItem(BaseModel):
    test_file: str
    test_type: str = "unit"  # unit, integration, e2e
    framework: Optional[str] = None
    affected_test_cases: list[str] = []
    distance: int = 1


class BoundaryCrossingItem(BaseModel):
    source_layer: str
    target_layer: str
    source_component: Optional[str] = None
    target_component: Optional[str] = None
    violation_type: Optional[str] = None
    description: str


class UncertaintyItem(BaseModel):
    category: str  # DYNAMIC_DISPATCH, WILDCARD_IMPORT, REFLECTION, UNTESTED, DYNAMIC_EVAL, UNINDEXED_DEPENDENCY
    severity: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None


class ImpactMetrics(BaseModel):
    affected_files: int = 0
    affected_symbols: int = 0
    max_depth: int = 0
    direct_dependents: int = 0
    indirect_dependents: int = 0
    direct_dependencies: int = 0
    indirect_dependencies: int = 0
    risk: str = "LOW"  # LOW, MEDIUM, HIGH
    risk_score: float = 0.0
    risk_reasons: list[str] = []
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW


class ImpactAnalysisResponse(BaseModel):
    repository_id: str
    target: ImpactTargetItem
    direction: str = "both"  # upstream, downstream, both
    max_depth: int = 3
    nodes: list[ImpactNodeItem] = []
    edges: list[ImpactEdgeItem] = []
    direct_dependencies: list[ImpactNodeItem] = []
    direct_dependents: list[ImpactNodeItem] = []
    transitive_dependencies: list[ImpactNodeItem] = []
    transitive_dependents: list[ImpactNodeItem] = []
    impact: ImpactMetrics
    cycles: list[list[str]] = []
    is_truncated: bool = False
    total_nodes_found: int = 0

    # Phase 19 12-dimension extensions
    callers: list[CallItem] = []
    callees: list[CallItem] = []
    affected_files: list[str] = []
    affected_modules: list[str] = []
    affected_apis: list[AffectedApiItem] = []
    affected_tests: list[AffectedTestItem] = []
    affected_dependencies: list[str] = []
    boundaries_crossed: list[BoundaryCrossingItem] = []
    evidence: list[ImpactEvidenceItem] = []
    uncertainty: list[UncertaintyItem] = []
    explanation: Optional[str] = None


class TargetDependencyItem(BaseModel):
    id: str
    name: str
    target_type: str
    file_path: Optional[str] = None
    depth: int = 1
    relationship_type: str = "IMPORTS"
    evidence: Optional[ImpactEvidenceItem] = None


class TargetDependencyResponse(BaseModel):
    repository_id: str
    target: ImpactTargetItem
    direct_dependencies: list[TargetDependencyItem] = []
    direct_dependents: list[TargetDependencyItem] = []
    transitive_dependencies: list[TargetDependencyItem] = []
    transitive_dependents: list[TargetDependencyItem] = []


class ImpactTargetResolveRequest(BaseModel):
    target: str
    target_type: Optional[str] = None


class ImpactExplainRequest(BaseModel):
    target_id: str
    target_type: Optional[str] = None
    direction: Optional[str] = "both"
    max_depth: Optional[int] = 3


# =========================================================================
# Phase 12: Code Quality & Technical Debt Intelligence Schemas
# =========================================================================

class QualityFindingItem(BaseModel):
    id: str
    repository_id: str
    category: str  # COMPLEXITY, DUPLICATION, COUPLING, SIZE, DEAD_CODE, UNUSED_IMPORT, ARCHITECTURE_DRIFT, CYCLE, MAINTAINABILITY, CODE_SMELL
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    title: str
    description: str
    file_path: Optional[str] = None
    file_id: Optional[str] = None
    symbol: Optional[str] = None
    symbol_id: Optional[str] = None
    start_line: Optional[int] = None
    end_line: Optional[int] = None
    metric_value: Optional[float] = None
    threshold: Optional[float] = None
    evidence: Optional[dict[str, Any]] = None
    recommendation: Optional[str] = None
    created_at: Optional[datetime] = None


class QualityFileMetricItem(BaseModel):
    file_id: Optional[str] = None
    file_path: str
    language: str
    lines_of_code: int = 0
    code_lines: int = 0
    blank_lines: int = 0
    comment_lines: int = 0
    symbol_count: int = 0
    function_count: int = 0
    class_count: int = 0
    complexity: int = 0
    complexity_level: str = "Low"  # Low, Moderate, High, Very High
    duplication_percentage: float = 0.0
    incoming_dependencies: int = 0
    outgoing_dependencies: int = 0
    findings_count: int = 0
    risk_level: str = "LOW"  # LOW, MEDIUM, HIGH, CRITICAL
    is_test_file: bool = False
    is_generated: bool = False


class DuplicationClusterItem(BaseModel):
    id: str
    similarity_percentage: float
    token_count: int
    line_count: int
    source_file: str
    source_file_id: Optional[str] = None
    source_start_line: int
    source_end_line: int
    target_file: str
    target_file_id: Optional[str] = None
    target_start_line: int
    target_end_line: int
    snippet_preview: Optional[str] = None


class QualityScoreFactor(BaseModel):
    factor: str
    weight: float
    deduction: float
    score_impact: float
    description: str


class QualityScoreBreakdown(BaseModel):
    score: float
    max_score: float = 100.0
    grade: str  # A, B, C, D, F
    status_label: str
    complexity_deduction: float = 0.0
    duplication_deduction: float = 0.0
    coupling_deduction: float = 0.0
    cycles_deduction: float = 0.0
    size_deduction: float = 0.0
    dead_code_deduction: float = 0.0
    factors: list[QualityScoreFactor] = []


class QualitySummaryResponse(BaseModel):
    repository_id: str
    score: float
    grade: str
    status_label: str
    score_breakdown: QualityScoreBreakdown
    total_files: int
    total_lines: int
    total_findings: int
    critical_findings: int
    high_findings: int
    medium_findings: int
    low_findings: int
    category_counts: dict[str, int] = {}
    duplication_clusters_count: int = 0
    dead_code_candidates_count: int = 0
    top_findings: list[QualityFindingItem] = []
    top_hotspots: list[QualityFileMetricItem] = []
    summary_text: str


class QualityFindingsResponse(BaseModel):
    repository_id: str
    total: int
    findings: list[QualityFindingItem] = []
    limit: int = 50
    offset: int = 0


class QualityFilesResponse(BaseModel):
    repository_id: str
    total: int
    files: list[QualityFileMetricItem] = []
    limit: int = 50
    offset: int = 0


class QualityDuplicationsResponse(BaseModel):
    repository_id: str
    total: int
    clusters: list[DuplicationClusterItem] = []


# =========================================================================
# Phase 13: Security & Reliability Intelligence Schemas
# =========================================================================

class SecurityReliabilityFindingItem(BaseModel):
    id: str
    repository_id: str
    finding_type: str = "SECURITY"  # SECURITY or RELIABILITY
    category: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    title: str
    description: str
    file_path: Optional[str] = None
    file_id: Optional[str] = None
    symbol: Optional[str] = None
    symbol_id: Optional[str] = None
    start_line: Optional[int] = None
    end_line: Optional[int] = None
    evidence_snippet: Optional[str] = None  # Always redacted
    evidence_details: Optional[dict[str, Any]] = None
    recommendation: Optional[str] = None
    cwe_id: Optional[str] = None
    created_at: Optional[datetime] = None


class DependencyManifestItem(BaseModel):
    id: str
    package_name: str
    version: Optional[str] = None
    ecosystem: str  # PyPI, npm, Go, Maven, etc.
    manifest_file: str
    is_pinned: bool = True
    is_dev: bool = False
    risk_status: str = "No verified vulnerability data available"
    notes: Optional[str] = None


class ReliabilityHotspotItem(BaseModel):
    file_path: str
    file_id: Optional[str] = None
    risk_score: float
    risk_level: str  # CRITICAL, HIGH, MEDIUM, LOW
    incoming_dependents: int = 0
    outgoing_dependencies: int = 0
    missing_timeouts_count: int = 0
    unhandled_exceptions_count: int = 0
    unclosed_resources_count: int = 0
    is_spof: bool = False  # Single Point of Failure
    signals: list[str] = []
    recommendation: str


class ScoreFactorItem(BaseModel):
    factor: str
    weight: float
    deduction: float
    impact: float
    description: str


class SecurityScoreBreakdown(BaseModel):
    score: float
    grade: str
    status_label: str
    critical_deduction: float = 0.0
    high_deduction: float = 0.0
    medium_deduction: float = 0.0
    low_deduction: float = 0.0
    factors: list[ScoreFactorItem] = []


class ReliabilityScoreBreakdown(BaseModel):
    score: float
    grade: str
    status_label: str
    timeouts_deduction: float = 0.0
    exceptions_deduction: float = 0.0
    resources_deduction: float = 0.0
    spof_deduction: float = 0.0
    factors: list[ScoreFactorItem] = []


class SecurityReliabilitySummaryResponse(BaseModel):
    repository_id: str
    security_score: float
    security_grade: str
    security_status_label: str
    security_breakdown: SecurityScoreBreakdown
    reliability_score: float
    reliability_grade: str
    reliability_status_label: str
    reliability_breakdown: ReliabilityScoreBreakdown
    total_security_findings: int = 0
    total_reliability_findings: int = 0
    secrets_count: int = 0
    injections_count: int = 0
    missing_timeouts_count: int = 0
    spof_count: int = 0
    total_dependencies: int = 0
    external_services: list[str] = []
    category_counts: dict[str, int] = {}
    severity_counts: dict[str, int] = {}
    top_security_findings: list[SecurityReliabilityFindingItem] = []
    top_reliability_findings: list[SecurityReliabilityFindingItem] = []
    top_hotspots: list[ReliabilityHotspotItem] = []
    summary_text: str


class SecurityReliabilityFindingsResponse(BaseModel):
    repository_id: str
    total: int
    findings: list[SecurityReliabilityFindingItem] = []
    limit: int = 50
    offset: int = 0


class SecurityDependenciesResponse(BaseModel):
    repository_id: str
    total: int
    dependencies: list[DependencyManifestItem] = []


class SecurityHotspotsResponse(BaseModel):
    repository_id: str
    total: int
    hotspots: list[ReliabilityHotspotItem] = []


# =========================================================================
# Phase 14: Git History & Evolution Intelligence Schemas
# =========================================================================

class CommitFileChangeItem(BaseModel):
    file_path: str
    change_type: str  # Added, Modified, Deleted
    additions: int = 0
    deletions: int = 0
    net_lines: int = 0


class CommitItem(BaseModel):
    id: str
    repository_id: str
    commit_sha: str
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    message: str
    committed_at: datetime
    parent_shas: list[str] = []
    category: str = "UNKNOWN"  # FEATURE, FIX, REFACTOR, DOCS, TEST, BUILD, CHORE, PERFORMANCE, SECURITY
    is_source_and_test: bool = False
    files_changed_count: int = 0
    total_additions: int = 0
    total_deletions: int = 0
    file_changes: list[CommitFileChangeItem] = []


class FileAuthorOwnershipItem(BaseModel):
    author_name: str
    author_email: Optional[str] = None
    commits_count: int
    additions: int
    deletions: int
    ownership_percentage: float


class FileEvolutionMetricItem(BaseModel):
    file_path: str
    file_id: Optional[str] = None
    total_commits: int = 0
    first_commit_date: Optional[datetime] = None
    last_commit_date: Optional[datetime] = None
    age_days: int = 0
    inactivity_days: int = 0
    activity_status: str = "ACTIVE"  # ACTIVE, LOW_ACTIVITY, INACTIVE
    total_additions: int = 0
    total_deletions: int = 0
    total_churn: int = 0
    recent_churn_30d: int = 0
    change_frequency: float = 0.0  # commits per month
    unique_authors_count: int = 0
    primary_author: Optional[str] = None
    primary_author_ownership: float = 0.0
    knowledge_concentration: str = "BALANCED"  # HIGH, MEDIUM, BALANCED
    authors: list[FileAuthorOwnershipItem] = []
    complexity: Optional[float] = None
    is_high_evolution_risk: bool = False


class EvolutionHotspotItem(BaseModel):
    file_path: str
    file_id: Optional[str] = None
    hotspot_type: str  # HIGH_CHURN, COMPLEXITY_AND_CHURN, CORRECTION_HEAVY, KNOWLEDGE_CONCENTRATION
    score: float
    total_commits: int
    total_churn: int
    recent_churn_30d: int
    complexity: Optional[float] = None
    primary_author: Optional[str] = None
    ownership_percentage: float = 0.0
    signals: list[str] = []
    explanation: str


class ContributorSummaryItem(BaseModel):
    author_name: str
    author_email: Optional[str] = None
    total_commits: int = 0
    files_touched_count: int = 0
    total_additions: int = 0
    total_deletions: int = 0
    primary_owned_files_count: int = 0
    first_commit_date: Optional[datetime] = None
    last_commit_date: Optional[datetime] = None


class GitHistorySummaryResponse(BaseModel):
    repository_id: str
    total_commits: int
    total_contributors: int
    is_shallow: bool = False
    status_message: str = "Git history analyzed."
    first_commit_date: Optional[datetime] = None
    last_commit_date: Optional[datetime] = None
    total_churn: int = 0
    recent_churn_30d: int = 0
    weekly_velocity: float = 0.0
    category_counts: dict[str, int] = {}
    top_churn_files: list[FileEvolutionMetricItem] = []
    top_hotspots: list[EvolutionHotspotItem] = []
    top_contributors: list[ContributorSummaryItem] = []
    inactive_files_count: int = 0
    branches_count: int = 1
    tags_count: int = 0
    summary_text: str


class CommitListResponse(BaseModel):
    repository_id: str
    total: int
    commits: list[CommitItem] = []
    limit: int = 50
    offset: int = 0


class CommitDetailResponse(BaseModel):
    repository_id: str
    commit: CommitItem


class FileEvolutionListResponse(BaseModel):
    repository_id: str
    total: int
    files: list[FileEvolutionMetricItem] = []
    limit: int = 50
    offset: int = 0


class FileEvolutionDetailResponse(BaseModel):
    repository_id: str
    metric: FileEvolutionMetricItem
    commits: list[CommitItem] = []


# =========================================================================
# Phase 15: Dependency Intelligence & Supply-Chain Schemas
# =========================================================================

class DependencyUsageFileItem(BaseModel):
    file_path: str
    file_id: Optional[str] = None
    import_statement: str
    imported_symbols: list[str] = []
    line_number: Optional[int] = None


class DependencyHistoryChangeItem(BaseModel):
    commit_sha: str
    author: str
    date: datetime
    message: str
    change_type: str  # ADDED, UPGRADED, DOWNGRADED, REMOVED
    old_version: Optional[str] = None
    new_version: Optional[str] = None


class DependencyIntelligenceItem(BaseModel):
    id: str
    repository_id: str
    name: str
    ecosystem: str  # PyPI, npm, Go, Maven, Gradle
    declared_version: Optional[str] = None
    resolved_version: Optional[str] = None
    pinning_status: str = "PINNED"  # PINNED, CONSTRAINED, UNCONSTRAINED
    dependency_type: str = "DIRECT"  # DIRECT, TRANSITIVE, DEV, PEER
    package_source: str = "registry"  # registry, vcs, local, unknown
    manifest_file: str
    lock_file: Optional[str] = None
    usage_count: int = 0
    file_count: int = 0
    symbol_count: int = 0
    centrality: str = "LOW"  # HIGH, MEDIUM, LOW, UNUSED
    is_high_impact: bool = False
    is_potentially_unused: bool = False
    is_potentially_undeclared: bool = False
    has_version_drift: bool = False
    vcs_url: Optional[str] = None  # Credential redacted
    importing_files: list[DependencyUsageFileItem] = []
    affected_architecture_nodes: list[str] = []
    risk_status: str = "Verified vulnerability intelligence unavailable"
    notes: Optional[str] = None


class DependencySummaryResponse(BaseModel):
    repository_id: str
    total_dependencies: int
    direct_dependencies: int
    transitive_dependencies: int
    dev_dependencies: int
    unpinned_dependencies: int
    potentially_unused_dependencies: int
    potentially_undeclared_dependencies: int
    high_impact_dependencies: int
    lockfiles_detected: list[str] = []
    ecosystems_detected: list[str] = []
    top_central_dependencies: list[DependencyIntelligenceItem] = []
    high_impact_list: list[DependencyIntelligenceItem] = []
    summary_text: str


class DependencyListResponse(BaseModel):
    repository_id: str
    total: int
    dependencies: list[DependencyIntelligenceItem] = []
    limit: int = 50
    offset: int = 0


class DependencyDetailResponse(BaseModel):
    repository_id: str
    dependency: DependencyIntelligenceItem


class DependencyImpactResponse(BaseModel):
    repository_id: str
    dependency_id: str
    dependency_name: str
    affected_files: list[str] = []
    affected_symbols: list[str] = []
    affected_architecture_nodes: list[str] = []
    affected_test_files: list[str] = []
    total_affected_files: int = 0
    centrality: str = "LOW"
    explanation: str


# =========================================================================
# Phase 17: Universal Repository Analyzer Schemas
# =========================================================================

class RepositoryProfileResponse(BaseModel):
    repository_id: str
    commit_sha: Optional[str] = None
    analyzed_at: str
    languages: dict[str, Any] = {}
    frameworks: list[dict[str, Any]] = []
    package_managers: list[dict[str, Any]] = []
    monorepo: dict[str, Any] = {}
    entry_points: list[dict[str, Any]] = []
    api_endpoints: list[dict[str, Any]] = []
    databases: list[dict[str, Any]] = []
    configurations: dict[str, Any] = {}
    tests: dict[str, Any] = {}
    documentation: list[dict[str, Any]] = []
    infrastructure: list[dict[str, Any]] = []
    modules: list[dict[str, Any]] = []
    services: list[dict[str, Any]] = []
    architecture_tree: dict[str, Any] = {}


class AnalysisSnapshotResponse(BaseModel):
    repository_id: str
    commit_sha: str
    snapshot_timestamp: str
    profile: dict[str, Any] = {}
    statistics: dict[str, Any] = {}


# =========================================================================
# Phase 18: Advanced Architecture Intelligence Schemas
# =========================================================================

class ArchitectureGraphNode(BaseModel):
    id: str
    repository_id: str
    node_type: str
    name: str
    label: str
    source_reference: Optional[str] = None
    properties: dict[str, Any] = {}


class ArchitectureGraphEdge(BaseModel):
    source: str
    target: str
    relationship_type: str
    weight: float = 1.0
    evidence: dict[str, Any] = {}


class ArchitectureComponentItem(BaseModel):
    id: str
    name: str
    category: str
    description: str
    files_count: int = 0
    code_lines: int = 0
    symbol_count: int = 0
    files: list[str] = []
    incoming_coupling: int = 0
    outgoing_coupling: int = 0


class ArchitectureDataFlowPath(BaseModel):
    entry_point: str
    entry_file: str
    flow_steps: list[str] = []
    layer_sequence: list[str] = []
    target_datastore: str
    description: str


class CouplingMetricItem(BaseModel):
    module: str
    afferent_coupling_ca: int = 0
    efferent_coupling_ce: int = 0
    instability: float = 0.0
    total_coupling: int = 0
    classification: str
    dependents: list[str] = []
    dependencies: list[str] = []


class ArchitectureViolation(BaseModel):
    violation_type: str
    severity: str
    title: str
    description: str
    source_file: str
    target_file: str
    line: int = 1
    remediation: Optional[str] = None


class ArchitectureSnapshotDiffResponse(BaseModel):
    base_commit: str
    current_commit: str
    added_modules: list[dict[str, Any]] = []
    removed_modules: list[dict[str, Any]] = []
    added_services: list[dict[str, Any]] = []
    removed_services: list[dict[str, Any]] = []
    added_api_endpoints: list[dict[str, Any]] = []
    removed_api_endpoints: list[dict[str, Any]] = []
    net_module_delta: int = 0
    net_api_delta: int = 0


class AdvancedArchitectureIntelligenceResponse(BaseModel):
    repository_id: str
    repository_name: str
    analyzed_at: str
    graph: dict[str, Any]
    components: list[ArchitectureComponentItem]
    data_flows: list[ArchitectureDataFlowPath]
    coupling: dict[str, Any]
    cycles: dict[str, Any]
    violations: list[ArchitectureViolation]
    summary: dict[str, Any]


# =========================================================================
# Phase 20: Code Time Machine Schemas
# =========================================================================

class HistoricalSnapshotItem(BaseModel):
    snapshot_id: str
    repository_id: str
    commit_hash: str
    commit_timestamp: Optional[str] = None
    branch: Optional[str] = None
    analysis_version: str = "1.0.0"
    status: str = "COMPLETED"
    created_at: str
    summary: dict[str, Any] = {}


class HistoricalSnapshotListResponse(BaseModel):
    repository_id: str
    snapshots: list[HistoricalSnapshotItem] = []
    total_snapshots: int = 0


class FileRenameItem(BaseModel):
    from_path: str
    to_path: str
    commit_hash: str
    timestamp: Optional[str] = None
    similarity_score: Optional[int] = None


class FileCommitItem(BaseModel):
    commit_hash: str
    author: str
    author_email: Optional[str] = None
    timestamp: str
    message: str
    additions: int = 0
    deletions: int = 0
    is_rename: bool = False
    old_path: Optional[str] = None


class FileEvolutionHistoryResponse(BaseModel):
    file_id: Optional[str] = None
    repository_id: str
    file_path: str
    created_at: Optional[str] = None
    first_commit_hash: Optional[str] = None
    last_modified_at: Optional[str] = None
    last_commit_hash: Optional[str] = None
    commit_count: int = 0
    authors: list[str] = []
    total_additions: int = 0
    total_deletions: int = 0
    churn: int = 0
    commits: list[FileCommitItem] = []
    rename_history: list[FileRenameItem] = []
    available_snapshots: list[str] = []


class DiffHunk(BaseModel):
    old_start: int
    old_lines: int
    new_start: int
    new_lines: int
    heading: Optional[str] = None
    lines: list[str] = []


class FileDiffItem(BaseModel):
    old_path: Optional[str] = None
    new_path: Optional[str] = None
    change_type: str  # ADDED, DELETED, MODIFIED, RENAMED
    additions: int = 0
    deletions: int = 0
    hunks: list[DiffHunk] = []


class SymbolDiffItem(BaseModel):
    symbol_name: str
    symbol_type: str  # function, class, method, interface
    file_path: str
    change_type: str  # CREATED, MODIFIED, DELETED, RENAMED
    old_start_line: Optional[int] = None
    old_end_line: Optional[int] = None
    new_start_line: Optional[int] = None
    new_end_line: Optional[int] = None
    commit_hash: str
    evidence: str
    is_uncertain: bool = False


class CommitDetailPhase20Response(BaseModel):
    commit_hash: str
    parent_hashes: list[str] = []
    author: str
    author_email: Optional[str] = None
    timestamp: str
    message: str
    branch: Optional[str] = None
    files_changed_count: int = 0
    insertions: int = 0
    deletions: int = 0
    changed_files: list[FileDiffItem] = []
    symbol_changes: list[SymbolDiffItem] = []
    architecture_changes: list[str] = []
    metrics: dict[str, Any] = {}


class CommitCompareRequest(BaseModel):
    from_commit: str
    to_commit: str


class CommitCompareResponse(BaseModel):
    repository_id: str
    from_commit: str
    to_commit: str
    added_files: list[str] = []
    deleted_files: list[str] = []
    modified_files: list[str] = []
    renamed_files: list[dict[str, str]] = []
    file_diffs: list[FileDiffItem] = []
    added_symbols: list[SymbolDiffItem] = []
    deleted_symbols: list[SymbolDiffItem] = []
    modified_symbols: list[SymbolDiffItem] = []
    renamed_symbols: list[SymbolDiffItem] = []
    dependency_changes: list[dict[str, Any]] = []
    api_changes: list[dict[str, Any]] = []
    architecture_changes: list[dict[str, Any]] = []
    metrics_changes: dict[str, Any] = {}


# =========================================================================
# Phase 21: Technical Debt & Risk Intelligence Schemas
# =========================================================================

class TechnicalDebtFindingItem(BaseModel):
    id: str
    repository_id: str
    category: str  # COMPLEXITY, DUPLICATION, DEPENDENCY, ARCHITECTURE, TEST_GAP, DOCUMENTATION, CODE_SMELL
    type: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    title: str
    description: str
    evidence: dict[str, Any] = {}
    file_path: Optional[str] = None
    line_start: Optional[int] = None
    line_end: Optional[int] = None
    symbol_name: Optional[str] = None
    affected_files: list[str] = []
    affected_symbols: list[str] = []
    related_dependencies: list[str] = []
    historical_context: Optional[dict[str, Any]] = None
    impact: Optional[str] = None
    remediation: Optional[str] = None
    detection_source: str = "STATIC_AST_ANALYZER"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class TechnicalDebtSummaryResponse(BaseModel):
    repository_id: str
    debt_score: float  # 0 to 100 (100 = debt free)
    total_findings: int = 0
    findings_by_severity: dict[str, int] = {}
    findings_by_category: dict[str, int] = {}
    top_categories: list[dict[str, Any]] = []
    estimated_remediation_hours: float = 0.0
    summary_text: str = ""


class RiskSignalItem(BaseModel):
    signal_name: str
    value: float
    threshold: float
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    weight: float = 1.0
    explanation: str


class EngineeringHotspotItem(BaseModel):
    id: str
    file_path: str
    entity_type: str = "FILE"
    severity_rank: int = 1
    composite_score: float = 0.0
    risk_level: str = "LOW"  # CRITICAL, HIGH, MEDIUM, LOW
    signals_intersected: list[str] = []
    underlying_signals: list[RiskSignalItem] = []
    churn_count: int = 0
    complexity_score: int = 0
    blast_radius: int = 0
    has_test_coverage: bool = True
    explanation: str


class HotspotsListResponse(BaseModel):
    repository_id: str
    total_hotspots: int = 0
    hotspots: list[EngineeringHotspotItem] = []


class EntityRiskResponse(BaseModel):
    repository_id: str
    entity_type: str  # REPOSITORY, DIRECTORY, FILE, MODULE, SYMBOL, SERVICE, DEPENDENCY, API
    entity_id: str
    entity_name: str
    risk_level: str  # CRITICAL, HIGH, MEDIUM, LOW
    risk_score: float = 0.0
    risk_factors: list[str] = []
    signals: list[RiskSignalItem] = []
    evidence: list[dict[str, Any]] = []
    related_findings: list[TechnicalDebtFindingItem] = []
    change_frequency: int = 0
    churn: int = 0
    complexity: int = 0
    test_evidence: Optional[str] = None
    dependents_count: int = 0
    dependencies_count: int = 0
    blast_radius: int = 0
    remediation: Optional[str] = None


class DebtRiskTrendItem(BaseModel):
    commit_hash: str
    timestamp: str
    risk_score: float
    debt_finding_count: int
    complexity_delta: int = 0
    hotspot_count: int = 0
    trend_direction: str = "STABLE"  # INCREASING, DECREASING, STABLE


class DebtRiskTrendsResponse(BaseModel):
    repository_id: str
    overall_trend: str = "STABLE"  # INCREASING, DECREASING, STABLE, INSUFFICIENT_DATA
    timeline: list[DebtRiskTrendItem] = []
    summary: str = ""


class RepositoryRiskSummaryResponse(BaseModel):
    repository_id: str
    overall_risk_score: float = 0.0  # 0 to 100
    risk_level: str = "LOW"  # CRITICAL, HIGH, MEDIUM, LOW
    risk_distribution: dict[str, int] = {}
    top_risk_factors: list[str] = []
    signals_breakdown: list[RiskSignalItem] = []
    hotspots_count: int = 0
    methodology: str = "Evidence-weighted multi-signal risk synthesis"


class FindingDetailResponse(BaseModel):
    finding: TechnicalDebtFindingItem
    traceable_evidence: dict[str, Any] = {}
    impact_context: Optional[dict[str, Any]] = None
    time_machine_context: Optional[dict[str, Any]] = None





