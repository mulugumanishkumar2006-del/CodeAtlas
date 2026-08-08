from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class FailureCategory(str, Enum):
    TRANSIENT = "TRANSIENT"
    CONFIGURATION = "CONFIGURATION"
    DEPENDENCY = "DEPENDENCY"
    RESOURCE = "RESOURCE"
    DEPLOYMENT = "DEPLOYMENT"
    APPLICATION = "APPLICATION"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    NETWORK = "NETWORK"
    DATABASE = "DATABASE"
    SECURITY = "SECURITY"
    UNKNOWN = "UNKNOWN"


class SystemHealthState(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"
    RECOVERING = "RECOVERING"
    RECOVERED = "RECOVERED"
    UNKNOWN = "UNKNOWN"


class RecoveryStateMachine(str, Enum):
    DETECTED = "DETECTED"
    DIAGNOSING = "DIAGNOSING"
    PLANNED = "PLANNED"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    EXECUTING = "EXECUTING"
    VERIFYING = "VERIFYING"
    RECOVERED = "RECOVERED"
    FAILED = "FAILED"
    ROLLED_BACK = "ROLLED_BACK"
    ESCALATED = "ESCALATED"


class CircuitBreakerStatus(str, Enum):
    CLOSED = "CLOSED"
    HALF_OPEN = "HALF_OPEN"
    OPEN = "OPEN"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class RecoveryStrategyModel(BaseModel):
    strategy_id: str
    strategy_name: str
    failure_category: FailureCategory = FailureCategory.TRANSIENT
    action_type: str = "RESTART"
    preconditions: List[str] = Field(default_factory=lambda: ["Worker unhealthy", "Zero DB mutation pending"])
    risk_level: str = "LOW_RISK"
    historical_success_rate: float = 0.96
    expected_recovery_time_seconds: float = 15.0
    rollback_strategy: str = "Failover to secondary worker instance"


class RecoveryPlanSimulationModel(BaseModel):
    target_service: str
    failure_type: FailureCategory = FailureCategory.RESOURCE
    selected_strategy_name: str = "Worker Restart & Connection Pool Refresh"
    simulated_blast_radius: List[str] = Field(default_factory=lambda: ["auth_service"])
    risk_score: float = 8.5
    confidence: float = 0.94
    is_safe_to_execute: bool = True


class SelfHealingRunRecordModel(BaseModel):
    run_id: str
    organization_id: str
    target_service: str
    failure_type: FailureCategory = FailureCategory.TRANSIENT
    current_state: RecoveryStateMachine = RecoveryStateMachine.RECOVERED
    strategy_name: str = "Worker Restart & Connection Pool Refresh"
    verification_passed: bool = True
    execution_time_seconds: float = 4.2
    observed_latency_ms: float = 22.5
    evidence_citations: List[str] = Field(default_factory=list)


class MTTRIntelligenceModel(BaseModel):
    service_id: str
    mean_time_to_detect_seconds: float = 12.0
    mean_time_to_diagnose_seconds: float = 18.0
    mean_time_to_recover_seconds: float = 45.0
    total_mttr_seconds: float = 75.0
    optimization_recommendation: str = "Current MTTR optimal; pre-cache runbook dependencies to trim 5s off diagnosis."


class SelfHealingRunbookModel(BaseModel):
    runbook_id: str
    runbook_title: str
    target_service: str
    version: str = "v1.0.0"
    trigger_condition: str = "p99 Latency > 300ms for 3 consecutive minutes"
    steps: List[str] = Field(default_factory=lambda: ["Check DB connections", "Refresh worker pool", "Verify latency < 50ms"])
    is_validated: bool = True


class CascadingFailureProtectionModel(BaseModel):
    detected_cascade_risk: bool = False
    recovery_ordering: List[str] = Field(default_factory=lambda: ["res_eks_prod_01", "res_rds_auth_01", "auth_service", "api_gateway_router"])
    circuit_breaker_status: CircuitBreakerStatus = CircuitBreakerStatus.CLOSED
    isolation_boundary: str = "SINGLE_SERVICE_CANARY"


class SelfHealingScorecardModel(BaseModel):
    organization_id: str
    self_healing_engine_score: float = 99.0
    failure_detection_classification_score: float = 99.5
    recovery_kb_strategy_score: float = 99.0
    domain_recoveries_score: float = 99.5
    simulation_verification_score: float = 98.5
    mttr_runbooks_score: float = 100.0
    cascading_protection_score: float = 99.0
    self_healing_status: str = "CODEATLAS V2.7 SELF-HEALING READY"
