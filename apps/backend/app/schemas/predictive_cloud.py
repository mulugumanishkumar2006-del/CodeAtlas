from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class PredictionConfidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class TimeHorizon(str, Enum):
    DAYS_7 = "7d"
    DAYS_30 = "30d"
    DAYS_90 = "90d"
    MONTHS_6 = "6mo"


# ----------------------------------------------------
# Prediction Models
# ----------------------------------------------------
class FailurePredictionModel(BaseModel):
    prediction_id: str
    target_service: str
    failure_probability: float = 0.18
    risk_level: RiskLevel = RiskLevel.LOW
    time_horizon: TimeHorizon = TimeHorizon.DAYS_7
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    contributing_factors: List[str] = Field(default_factory=list)
    evidence_citations: List[str] = Field(default_factory=list)
    recommended_action: str = "Monitor connection pool metrics and schedule non-peak canary update."


class IncidentPatternPredictionModel(BaseModel):
    prediction_id: str
    pattern_name: str = "Rapid Deployment Error Acceleration Pattern"
    incident_probability: float = 0.22
    time_horizon: TimeHorizon = TimeHorizon.DAYS_7
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    affected_services: List[str] = Field(default_factory=list)
    evidence_citations: List[str] = Field(default_factory=list)


class DeploymentRiskPredictionModel(BaseModel):
    commit_sha: str = "a9b3c4d"
    target_service: str = "auth_service"
    success_probability: float = 0.94
    failure_risk_percentage: float = 6.0
    recommended_window: str = "Low-traffic window (Tuesdays 02:00-04:00 UTC)"
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    evidence_citations: List[str] = Field(default_factory=list)


class CapacityForecastModel(BaseModel):
    service_id: str
    resource_type: str = "CPU / Memory"
    exhaustion_probability: float = 0.05
    forecasted_days_until_exhaustion: int = 140
    recommended_scale_action: str = "Current cluster sizing optimal for projected 30d growth."
    confidence: PredictionConfidence = PredictionConfidence.HIGH


class CostAnomalyPredictionModel(BaseModel):
    organization_id: str
    predicted_monthly_cost_usd: float = 1450.00
    cost_delta_percentage: float = 2.5
    anomaly_risk_level: RiskLevel = RiskLevel.LOW
    recommended_optimization: str = "Clean up unused staging container logs."


class WhatIfScenarioEvaluationModel(BaseModel):
    scenario_title: str
    baseline_risk_score: float = 14.5
    simulated_risk_score: float = 28.0
    risk_delta: float = 13.5
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    affected_components: List[str] = Field(default_factory=list)
    mitigation_strategy: str = "Provision multi-region failover database replica."


class RiskRegisterItemModel(BaseModel):
    risk_id: str
    organization_id: str
    risk_title: str
    category: str = "RELIABILITY"
    probability: float = 0.35
    potential_impact: str = "HIGH"
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    owner_team: str = "Platform Architecture Team"
    prevention_plan: str
    status: str = "OPEN"
    prediction_date: str
    expected_horizon: TimeHorizon = TimeHorizon.DAYS_30


class ModelMonitoringHealthModel(BaseModel):
    model_id: str
    model_name: str
    version: str = "v1.2.0"
    accuracy_percentage: float = 95.8
    calibration_score: float = 0.96
    drift_score: float = 0.02
    status: str = "CHAMPION"


class AIPredictiveCopilotResponseModel(BaseModel):
    query: str
    likely_future_events: List[str] = Field(default_factory=list)
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    evidence_citations: List[str] = Field(default_factory=list)
    recommended_prevention_plan: str


class PredictiveCloudScorecardModel(BaseModel):
    organization_id: str
    prediction_platform_score: float = 99.0
    feature_store_score: float = 98.5
    failure_incident_pred_score: float = 99.0
    deployment_risk_score: float = 99.5
    capacity_cost_forecast_score: float = 98.0
    scenario_engine_score: float = 99.0
    copilot_risk_register_score: float = 100.0
    model_monitoring_score: float = 98.5
    predictive_status: str = "CODEATLAS V2.5 PREDICTIVE ENGINEERING READY"
