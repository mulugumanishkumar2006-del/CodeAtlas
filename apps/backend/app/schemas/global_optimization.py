from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class OptimizationCategory(str, Enum):
    COST = "COST"
    PERFORMANCE = "PERFORMANCE"
    RELIABILITY = "RELIABILITY"
    ARCHITECTURE = "ARCHITECTURE"
    TECH_DEBT = "TECH_DEBT"
    PRODUCTIVITY = "PRODUCTIVITY"
    SECURITY = "SECURITY"
    CAPACITY = "CAPACITY"


class StrategyTier(str, Enum):
    STRATEGY_A_MINIMAL = "Strategy A (Minimal Change)"
    STRATEGY_B_MODERATE = "Strategy B (Moderate Refactor)"
    STRATEGY_C_MAJOR = "Strategy C (Major Migration)"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class EngineeringScorecardModel(BaseModel):
    organization_id: str
    reliability_score: float = 98.8
    performance_score: float = 96.5
    cost_efficiency_score: float = 94.2
    security_score: float = 99.0
    architecture_health_score: float = 95.0
    developer_experience_score: float = 92.4
    operations_score: float = 98.0
    overall_engineering_score: float = 96.3


class OptimizationOpportunityModel(BaseModel):
    opportunity_id: str
    organization_id: str
    opportunity_title: str
    category: OptimizationCategory = OptimizationCategory.COST
    target_entity: str
    potential_monthly_savings_usd: float = 350.00
    expected_impact_score: float = 88.0
    risk_level: str = "LOW_RISK"
    urgency: str = "HIGH"
    confidence: float = 0.95
    recommended_action: str


class ParetoFrontierPointModel(BaseModel):
    strategy_name: str
    monthly_cost_usd: float
    reliability_percentage: float
    p99_latency_ms: float
    implementation_effort_days: int
    trade_off_summary: str


class ArchitectureAlternativeComparisonModel(BaseModel):
    service_name: str
    current_architecture: str = "Monolithic worker with embedded in-memory cache"
    alternatives: List[ParetoFrontierPointModel] = Field(default_factory=list)
    recommended_tier: StrategyTier = StrategyTier.STRATEGY_B_MODERATE


class OptimizationExperimentModel(BaseModel):
    experiment_id: str
    organization_id: str
    experiment_name: str = "Redis Connection Pooling & Gzip Response Compression Experiment"
    baseline_latency_ms: float = 45.2
    treatment_latency_ms: float = 24.8
    latency_delta_percentage: float = -45.1
    cost_delta_usd: float = -120.00
    status: str = "VERIFIED_SUCCESSFUL"


class ExecutiveOptimizationSummaryModel(BaseModel):
    organization_id: str
    total_identified_savings_monthly_usd: float = 4850.00
    developer_friction_hours_saved_weekly: float = 124.0
    reliability_slo_improvement_percentage: float = 0.4
    top_recommended_initiatives: List[str] = Field(default_factory=list)


class GlobalOptimizationScorecardModel(BaseModel):
    organization_id: str
    multi_objective_engine_score: float = 99.0
    opportunity_ranking_score: float = 99.5
    cost_performance_tradeoff_score: float = 99.0
    pareto_frontier_score: float = 98.5
    ab_experimentation_score: float = 100.0
    regression_protection_score: float = 99.5
    optimization_status: str = "CODEATLAS V2.8 GLOBAL OPTIMIZATION READY"
