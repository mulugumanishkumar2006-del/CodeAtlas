# apps/backend/app/schemas/benchmarking.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# Feature 21: Repository Evolution Comparison
class EvolutionComparisonRequest(BaseModel):
    base_repo_id: str
    target_repo_id: str
    baseline_commit: Optional[str] = None
    comparison_commit: Optional[str] = None


class EvolutionMetricDelta(BaseModel):
    metric_name: str
    base_value: float
    target_value: float
    change_delta: float
    pct_change: float
    status: str  # "improved", "degraded", "neutral"


class EvolutionComparisonResponse(BaseModel):
    base_repo_name: str
    target_repo_name: str
    comparison_timestamp: str
    metric_deltas: List[EvolutionMetricDelta]
    churn_comparison: Dict[str, Any]
    architectural_diff_summary: Dict[str, Any]
    refactoring_velocity_comparison: Dict[str, Any]
    overall_comparison_verdict: str


# Feature 22: Team Workflow Intelligence
class WorkflowBottleneck(BaseModel):
    stage: str
    lead_time_hours: float
    severity: str  # "high", "medium", "low"
    recommendation: str


class TeamWorkflowIntelligenceResponse(BaseModel):
    repo_id: str
    pr_lead_time_hours: float
    review_turnaround_hours: float
    deployment_frequency_per_week: float
    context_switch_frequency_index: float  # 0 to 10
    collaboration_density_score: float  # 0 to 100
    developer_burnout_risk: str  # "Low", "Moderate", "High"
    workflow_bottlenecks: List[WorkflowBottleneck]
    team_productivity_percentile: float


# Feature 23: Engineering Maturity Model
class PillarMaturityScore(BaseModel):
    pillar: str  # Architecture, Testing, Security, CI/CD, Code Quality, Operational Readiness
    score: float  # 0 to 100
    level: int  # 1 to 5
    level_title: str
    key_strengths: List[str]
    improvement_gaps: List[str]


class EngineeringMaturityResponse(BaseModel):
    repo_id: str
    overall_maturity_level: int  # Level 1 to 5
    overall_level_name: str  # "Initial", "Managed", "Defined", "Measured", "Optimized"
    overall_score: float  # 0 to 100
    pillars: List[PillarMaturityScore]
    roadmap_to_next_level: List[str]
    industry_percentile: float


# Feature 24: Technical Debt Benchmarking
class DebtCategoryBenchmark(BaseModel):
    category: str
    debt_hours: float
    code_smells_count: int
    percentile_rank: float
    industry_median_hours: float


class TechDebtBenchmarkResponse(BaseModel):
    repo_id: str
    total_debt_hours: float
    debt_density_per_kloc: float
    financial_debt_cost_usd: float
    cognitive_complexity_score: float
    code_duplication_pct: float
    industry_percentile: float
    categories: List[DebtCategoryBenchmark]
    remediation_priority_list: List[str]


# Feature 25: Scalability Benchmarking
class BottleneckRiskPoint(BaseModel):
    component: str
    risk_level: str  # "Critical", "Moderate", "Low"
    max_concurrency_limit: int
    mitigation_strategy: str


class ScalabilityBenchmarkResponse(BaseModel):
    repo_id: str
    scalability_readiness_score: float  # 0 to 100
    max_estimated_rps: int
    horizontal_scale_readiness: (
        str  # "Optimal", "Needs Decoupling", "Monolithic Bottleneck"
    )
    memory_leak_risk_index: float  # 0 to 10
    db_query_scalability_factor: float  # 0 to 100
    bottlenecks: List[BottleneckRiskPoint]
    architecture_concurrency_tier: str


# Feature 26: Reliability Benchmarking
class ReliabilityBenchmarkResponse(BaseModel):
    repo_id: str
    reliability_index: float  # 0 to 100
    mtbf_estimated_hours: float
    circuit_breaker_coverage_pct: float
    error_boundary_coverage_pct: float
    fallback_safety_rating: str  # "A+", "A", "B", "C", "F"
    retry_policy_compliance_pct: float
    sla_readiness_tier: str  # "99.999%", "99.99%", "99.9%", "99.0%"
    resilience_anti_patterns: List[str]


# Feature 27: Observability Benchmarking
class ObservabilityBenchmarkResponse(BaseModel):
    repo_id: str
    observability_score: float  # 0 to 100
    tracing_coverage_pct: float
    structured_logging_pct: float
    metric_instrumentation_pct: float
    trace_context_propagation_pct: float
    alert_signal_to_noise_ratio: float  # 0 to 1.0
    uninstrumented_hotspots: List[str]
    maturity_tier: (
        str  # "Basic Logs", "Correlated Telemetry", "Full Distributed Observability"
    )


# Feature 28: Release Maturity Benchmarking
class ReleaseMaturityResponse(BaseModel):
    repo_id: str
    release_maturity_score: float  # 0 to 100
    feature_flag_adoption_pct: float
    canary_deployment_readiness: bool
    automated_rollback_capability: bool
    deployment_frequency_dora_tier: str  # "Elite", "High", "Medium", "Low"
    mean_time_to_restore_minutes: float
    change_failure_rate_pct: float
    automated_release_verification_pct: float


# Feature 29: AI Recommendation Confidence Engine
class AIConfidenceRequest(BaseModel):
    recommendation_id: Optional[str] = None
    prompt_or_context: str
    proposed_code_changes: Optional[str] = None


class ConfidenceEvidence(BaseModel):
    source: (
        str  # e.g., "AST Graph Analysis", "Pattern Repository", "Security Benchmark"
    )
    weight: float
    findings: str


class AIConfidenceResponse(BaseModel):
    confidence_score_pct: float  # 0 to 100
    confidence_tier: str  # "High Confidence", "Moderate Confidence", "Low Confidence"
    evidence_trail: List[ConfidenceEvidence]
    risk_indices: Dict[str, float]
    explainable_rationale: str
    alternative_action_pathways: List[str]


# Feature 30: Industry-Specific Recommendations
class ComplianceStandardMetric(BaseModel):
    standard: str  # PCI-DSS, HIPAA, GDPR, SOC 2 Type II, ISO 27001
    status: str  # "Compliant", "Gaps Identified", "Critical Violation"
    compliance_pct: float


class IndustryRecommendationsResponse(BaseModel):
    target_industry: (
        str  # FinTech, HealthTech, E-Commerce, SaaS, CyberSecurity, Cloud-Native
    )
    industry_architecture_align_score: float  # 0 to 100
    compliance_standards: List[ComplianceStandardMetric]
    tailored_recommendations: List[str]
    best_practice_patterns: List[str]
