# apps/backend/app/schemas/aeo_portfolio_coord.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# Feature 4: Cross-Repository Coordination DTOs
class DuplicatedLibraryItem(BaseModel):
    library_name: str
    repos_affected: List[str]
    similarity_pct: float
    recommendation: str


class InconsistentAPIItem(BaseModel):
    endpoint_path: str
    inconsistency_details: str
    repos_affected: List[str]
    remediation: str


class CrossRepoCoordinationResponse(BaseModel):
    duplicated_libraries: List[DuplicatedLibraryItem]
    inconsistent_apis: List[InconsistentAPIItem]
    overall_cross_repo_health_score: float


# Feature 5: Macro Business Goal Translator DTOs ("Expand to Europe")
class MacroBusinessGoalRequest(BaseModel):
    macro_goal: Optional[str] = "Expand to Europe."
    target_region: Optional[str] = "Europe (eu-central-1)"


class MacroBusinessGoalResponse(BaseModel):
    input_goal: str
    gdpr_work: List[str]
    auth_updates: List[str]
    localization_tasks: List[str]
    infra_changes: List[str]
    monitoring_improvements: List[str]
    security_checklist: List[str]
    sprint_roadmap: List[str]
    execution_verdict: str


# Feature 6: Engineering Portfolio Optimizer DTOs
class PortfolioInitiative(BaseModel):
    initiative_id: str
    title: str
    business_value_score: float  # 0 to 100
    engineering_effort_hours: float
    tech_debt_paydown_score: float
    risk_rating: str  # "Low", "Medium", "High"
    composite_priority_score: float
    rank: int


class PortfolioOptimizerRequest(BaseModel):
    initiatives: Optional[List[Dict[str, Any]]] = None


class PortfolioOptimizerResponse(BaseModel):
    prioritized_initiatives: List[PortfolioInitiative]
    recommended_focus: str


# Feature 7: AI Program Manager DTOs
class MultiProjectDependency(BaseModel):
    dependency_id: str
    upstream_project: str
    downstream_project: str
    blocking_deliverable: str
    status: str  # "On Track", "At Risk", "Blocked"


class AIProgramManagerResponse(BaseModel):
    active_projects_count: int
    dependencies: List[MultiProjectDependency]
    critical_path_bottleneck: str
    program_verdict: str
