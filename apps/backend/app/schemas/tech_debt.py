from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class HeatmapNodeResponse(BaseModel):
    name: str
    path: str
    type: str  # "file" or "directory"
    value: float = 0.0  # representing lines of code
    score: float = 0.0  # risk score from 0 to 100
    complexity: int = 0
    coupling: int = 0
    coverage: float = 0.0
    changes: int = 0
    is_cyclic: bool = False
    
    # Feature 1 — Technical Debt Scanner fields
    cognitive_complexity: int = 0
    has_long_methods: bool = False
    has_god_classes: bool = False
    has_duplicate_code: bool = False
    has_dead_code: bool = False
    has_large_file: bool = False
    has_deep_inheritance: bool = False
    has_excessive_nesting: bool = False
    has_high_coupling: bool = False
    
    children: Optional[List["HeatmapNodeResponse"]] = None

# Feature 4 — AI Debt Analyzer (Module Level)
class RemediationActionResponse(BaseModel):
    file_path: str
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    reasons: List[str]
    action: str
    estimated_effort: str
    expected_improvement: str
    
    # AI Analyzer Details
    why_debt_exists: str
    why_debt_increased: str
    causing_dependencies: List[str]
    how_to_reduce: str

class TechDebtSummaryResponse(BaseModel):
    average_debt_score: float
    high_risk_components_count: int
    circular_dependencies_count: int
    average_doc_coverage: float

# Feature 2 — Repository Risk Scorecard
class RepositoryRiskScorecard(BaseModel):
    architecture: float
    maintainability: float
    security: float
    testing: float
    performance: float
    documentation: float
    technical_debt: float
    overall_health: float

# Feature 4 — AI Debt Analyzer (Repository Level)
class RepositoryAIDebtAnalysis(BaseModel):
    why_debt_exists: str
    why_debt_increased: str
    causing_dependencies: List[str]
    how_to_reduce: str
    expected_improvement: str

# Feature 5 — Debt Timeline
class TimelineSnapshotResponse(BaseModel):
    year: str
    score: float
    status: str  # "HEALTHY", "WARNING", "HIGH_RISK", "CRITICAL"

# Feature 6 — Hotspot Detection
class HotspotDetectionResponse(BaseModel):
    most_dangerous_file: str
    most_dangerous_file_score: float
    most_dangerous_module: str
    most_dangerous_module_score: float
    most_unstable_service: str
    most_unstable_service_changes: int
    fastest_growing_complexity: str
    fastest_growing_complexity_value: int
    most_modified_component: str
    most_modified_component_changes: int

# Feature 7 — Refactoring Recommendations
class RefactoringRecommendationResponse(BaseModel):
    category: str  # "Split service", "Extract module", "Introduce interface", "Reduce coupling", "Remove dead code", "Simplify dependency chain"
    target: str
    action: str
    benefits: str
    risks: str
    estimated_effort: str
    expected_improvement: str

# Feature 8 — Repository Health Dashboard Trend Data
class HealthDashboardTrendResponse(BaseModel):
    debt_score: float
    health_score: float
    risk_trend: List[float]
    complexity_trend: List[int]
    coverage_trend: List[float]
    dependency_growth: List[int]
    trend_labels: List[str]

# Feature 9 — Technical Debt Forecast
class ForecastSnapshotResponse(BaseModel):
    label: str  # "Current", "30 days", "90 days", "180 days"
    score: float
    estimated_maintenance_cost: str

# Feature 10 — AI Risk Explanations
class RiskExplanationResponse(BaseModel):
    module_name: str
    risk_level: str  # "CRITICAL", "HIGH", "WARNING", "HEALTHY"
    reasons: List[str]

# Feature 11 — Cost of Delay Calculator
class CostOfDelayResponse(BaseModel):
    time_lost_per_sprint: str
    bug_probability: float
    refactoring_effort: str
    long_term_maintenance_cost: str

# Feature 12 — Executive Dashboard
class ExecutiveDashboardResponse(BaseModel):
    overall_health: float
    top_risky_services: List[Dict[str, Any]]
    team_debt_distribution: Dict[str, float]
    sprint_debt_trend: List[float]
    high_priority_fixes: List[Dict[str, Any]]

class TechDebtReportResponse(BaseModel):
    summary: TechDebtSummaryResponse
    scorecard: RepositoryRiskScorecard
    heatmap: HeatmapNodeResponse
    remediations: List[RemediationActionResponse]
    ai_analysis: RepositoryAIDebtAnalysis
    timeline: List[TimelineSnapshotResponse]
    hotspots: HotspotDetectionResponse
    recommendations: List[RefactoringRecommendationResponse]
    dashboard_trend: HealthDashboardTrendResponse
    forecast: List[ForecastSnapshotResponse]
    risk_explanations: List[RiskExplanationResponse]
    cost_of_delay: CostOfDelayResponse
    executive_dashboard: ExecutiveDashboardResponse
