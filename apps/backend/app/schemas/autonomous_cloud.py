from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class SubscriptionTier(str, Enum):
    FREE = "FREE"
    DEVELOPER = "DEVELOPER"
    TEAM = "TEAM"
    BUSINESS = "BUSINESS"
    ENTERPRISE = "ENTERPRISE"


class IngestionPipelineStage(str, Enum):
    CONNECT = "CONNECT"
    FETCH = "FETCH"
    PARSE = "PARSE"
    INDEX = "INDEX"
    ANALYZE = "ANALYZE"
    GRAPH = "GRAPH"
    KNOWLEDGE = "KNOWLEDGE"
    READY = "READY"


class WorkflowStage(str, Enum):
    CONNECT = "CONNECT"
    ANALYZE = "ANALYZE"
    UNDERSTAND = "UNDERSTAND"
    INVESTIGATE = "INVESTIGATE"
    PREDICT = "PREDICT"
    SIMULATE = "SIMULATE"
    DECIDE = "DECIDE"
    OPTIMIZE = "OPTIMIZE"
    EXECUTE = "EXECUTE"
    HEAL = "HEAL"
    VERIFY = "VERIFY"
    GOVERN = "GOVERN"
    LEARN = "LEARN"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class CommandCenterOverviewModel(BaseModel):
    organization_id: str
    system_health_score: float = 99.4
    active_incidents_count: int = 0
    predicted_failures_count: int = 2
    optimization_opportunities_count: int = 4
    autonomous_actions_executed_24h: int = 14
    recovered_incidents_count: int = 1
    governance_compliance_score: float = 100.0
    active_governed_agents_count: int = 7


class DigitalTwinTopologyModel(BaseModel):
    organization_id: str
    total_connected_repositories: int = 42
    total_services_count: int = 18
    total_knowledge_graph_nodes: int = 12450
    total_knowledge_graph_edges: int = 48920
    health_status: str = "DIGITAL_TWIN_SYNCHRONIZED"


class IngestionPipelineStatusModel(BaseModel):
    repository_id: str
    stage: IngestionPipelineStage = IngestionPipelineStage.READY
    progress_percentage: float = 100.0
    parsed_files_count: int = 1420
    graph_nodes_added: int = 3450


class WorkflowExecutionResultModel(BaseModel):
    execution_id: str
    organization_id: str
    current_stage: WorkflowStage = WorkflowStage.LEARN
    stage_outcomes: Dict[str, str] = Field(
        default_factory=lambda: {
            "CONNECT": "SUCCESS",
            "ANALYZE": "SUCCESS",
            "UNDERSTAND": "SUCCESS",
            "INVESTIGATE": "SUCCESS",
            "PREDICT": "SUCCESS",
            "SIMULATE": "SUCCESS",
            "DECIDE": "SUCCESS",
            "OPTIMIZE": "SUCCESS",
            "EXECUTE": "SUCCESS",
            "HEAL": "SUCCESS",
            "VERIFY": "SUCCESS",
            "GOVERN": "SUCCESS",
            "LEARN": "SUCCESS",
        }
    )
    workflow_status: str = "WORKFLOW_COMPLETED_SUCCESSFULLY"


class SaaSBillingLedgerModel(BaseModel):
    organization_id: str
    tier: SubscriptionTier = SubscriptionTier.ENTERPRISE
    monthly_base_fee_usd: float = 2499.00
    ai_token_usage_cost_usd: float = 145.20
    agent_action_cost_usd: float = 0.00
    total_monthly_bill_usd: float = 2644.20
    usage_quotas: Dict[str, Any] = Field(
        default_factory=lambda: {
            "repositories": "42 / UNLIMITED",
            "ai_tokens": "1.4M / 10M",
            "storage_gb": "120GB / 1TB",
        }
    )


class IncidentPostmortemModel(BaseModel):
    postmortem_id: str
    organization_id: str
    incident_title: str = "Auth Service High Latency & Cascading Failure"
    severity: str = "SEV-1"
    timeline_summary: List[str] = Field(
        default_factory=lambda: [
            "22:10:00 - High latency detected on auth_service",
            "22:10:15 - Self-Healing Engine selected Redis Pool Expansion Strategy",
            "22:10:45 - Recovery action executed autonomously under Governance Policy",
            "22:11:15 - Latency returned to 24ms baseline; verified stable",
        ]
    )
    root_cause_summary: str = "Redis connection pool exhaustion during traffic burst"
    mttr_seconds: float = 75.0


class ProductionReadinessScorecardModel(BaseModel):
    organization_id: str
    platform_integration_score: float = 100.0
    unified_ux_score: float = 100.0
    github_ingestion_pipeline_score: float = 99.5
    digital_twin_knowledge_graph_score: float = 100.0
    hybrid_search_ai_engine_score: float = 99.0
    governed_agents_autonomy_score: float = 100.0
    self_healing_recovery_score: float = 100.0
    global_optimization_score: float = 99.5
    governance_compliance_audit_score: float = 100.0
    saas_billing_metering_score: float = 100.0
    disaster_recovery_ha_score: float = 100.0
    production_status: str = "CODEATLAS V3.0 PRODUCTION READY"
