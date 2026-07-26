# apps/backend/app/schemas/evolution_atlas.py

from typing import Dict, List

from pydantic import BaseModel


# Feature 41: Interactive Pattern Explorer
class PatternItem(BaseModel):
    id: str
    name: str
    category: str  # "Structural", "Behavioral", "Architectural", "Cloud-Native"
    description: str
    adoption_rate_pct: float
    code_example: str
    trade_offs: List[str]


class PatternExplorerResponse(BaseModel):
    patterns: List[PatternItem]
    total_patterns: int
    categories: List[str]


# Feature 42: Architecture Recommendation Dashboard
class RecommendationItem(BaseModel):
    id: str
    title: str
    impact: str  # "High", "Medium", "Low"
    risk: str  # "Low", "Medium", "High"
    effort_hours: float
    description: str
    refactor_action_trigger: str


class ArchitectureRecommendationDashboardResponse(BaseModel):
    recommendations: List[RecommendationItem]
    total_recommendations: int
    high_impact_count: int


# Feature 43: Software Evolution Atlas (🌟 WOW Feature)
class DomainArchitectureDetail(BaseModel):
    domain_key: (
        str  # "banking", "ecommerce", "healthcare", "gaming", "saas", "ai_infra"
    )
    domain_name: str
    common_architectures: List[str]
    common_databases: List[str]
    scaling_strategies: List[str]
    failure_patterns: List[str]
    best_practices: List[str]
    global_adoption_pct: float


class AtlasDomainNode(BaseModel):
    domain_key: str
    domain_name: str
    category: str
    node_coordinates: Dict[str, float]  # lat, lng for globe rendering
    active_repos_count: int


class SoftwareEvolutionAtlasResponse(BaseModel):
    globe_nodes: List[AtlasDomainNode]
    domains_detail: Dict[str, DomainArchitectureDetail]
    total_software_domains: int


# Feature 44: Engineering Radar
class RadarDimension(BaseModel):
    dimension: str  # "Quality", "Speed", "Security", "Reliability", "Scalability", "Maintainability"
    score: float  # 0 to 100
    industry_benchmark: float


class EngineeringRadarResponse(BaseModel):
    repo_id: str
    dimensions: List[RadarDimension]
    overall_radar_score: float


# Feature 45: Repository DNA Comparison
class DNAGeneComparison(BaseModel):
    gene_name: str  # "Language Family", "Architecture Paradigm", "Coupling Index", "Debt Density"
    repo_a_value: str
    repo_b_value: str
    similarity_match_pct: float


class RepositoryDNAComparisonResponse(BaseModel):
    repo_a_id: str
    repo_b_id: str
    overall_dna_similarity_pct: float
    genes: List[DNAGeneComparison]
    structural_diff_summary: str


# Feature 46: Enterprise Benchmark Reports
class EnterpriseReportResponse(BaseModel):
    report_id: str
    report_title: str
    generated_at: str
    portfolio_health_score: float
    compliance_overall_pct: float
    total_repositories_analyzed: int
    executive_summary: str


# Feature 47: AI Strategy Reports
class AIStrategyReportResponse(BaseModel):
    strategy_id: str
    cto_vision_title: str
    target_quarter: str
    key_modernization_goals: List[str]
    tech_stack_migrations: List[Dict[str, str]]
    budget_impact_reduction_pct: float


# Feature 48: Continuous Learning Engine
class ContinuousLearningResponse(BaseModel):
    engine_status: str
    indexed_repos_count: int
    learned_patterns_count: int
    last_sync_timestamp: str


# Feature 49: Plugin Marketplace for Patterns
class PatternPlugin(BaseModel):
    plugin_id: str
    plugin_name: str
    author: str
    rating_stars: float
    downloads_count: int
    description: str
    is_installed: bool


class PluginMarketplaceResponse(BaseModel):
    plugins: List[PatternPlugin]
    total_plugins: int


# Feature 50: Engineering Intelligence Network Dashboard (⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 10-Star Command Center)
class EngineeringIntelligenceDashboardResponse(BaseModel):
    global_health_index: float
    active_monitored_services: int
    total_patterns_detected: int
    ai_recommendations_active: int
    system_readiness_verdict: str
