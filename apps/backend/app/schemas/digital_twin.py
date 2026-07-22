from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class SimulationChangeCreate(BaseModel):
    action: str = Field(
        ...,
        description="Action to simulate: delete, modify, rename, add_dependency, remove_dependency",
    )
    target_type: str = Field(
        ..., description="Target node or relationship type: file, symbol, relationship"
    )
    target_name: str = Field(
        ..., description="Name or path of the target node or relationship"
    )
    new_name: Optional[str] = Field(
        None, description="Optional new name (e.g. for rename action)"
    )
    properties: Optional[Dict[str, Any]] = Field(
        None, description="Optional additional properties/metadata for the change"
    )


class SimulationChangeResponse(BaseModel):
    id: str
    session_id: str
    action: str
    target_type: str
    target_name: str
    new_name: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class DigitalTwinSessionCreate(BaseModel):
    name: str = Field(
        ..., description="The user-defined name of the simulation session"
    )


class DigitalTwinSessionResponse(BaseModel):
    id: str
    repository_id: str
    name: str
    created_at: datetime
    updated_at: datetime
    changes: List[SimulationChangeResponse] = []

    class Config:
        from_attributes = True


class AffectedNodeDetail(BaseModel):
    id: str
    name: str
    type: str
    file_path: Optional[str] = None
    impact_reason: str


class BlastRadiusNode(BaseModel):
    id: str
    name: str
    type: str
    depth: int  # 0: center/changed, 1: direct caller, 2: transitive caller
    virtual_status: str


class BlastRadiusEdge(BaseModel):
    source: str
    target: str
    type: str


class RiskPrediction(BaseModel):
    type: str  # Runtime Failures, Performance Loss, Deployment Risk, Architecture Drift, Security Impact, Test Failures, Dependency Issues
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    probability: float  # 0 to 100
    explanation: str
    confidence_score: float  # 0 to 100


class CostEstimate(BaseModel):
    developer_hours: float
    qa_hours: float
    review_hours: float
    deployment_hours: float
    rollback_cost_index: float  # dollar index
    total_hours: float
    explanation: str


class PerformanceImpact(BaseModel):
    latency_change_ms: float
    memory_change_mb: float
    cpu_change_percent: float
    db_queries_change: int
    network_calls_change: int
    caching_efficiency_change_percent: float
    explanation: str


class ArchitectureEvolution(BaseModel):
    compliance_before: float
    compliance_after: float
    tech_debt_before: float
    tech_debt_after: float
    coupling_before: float
    coupling_after: float
    explanation: str


class AIAlternativeRecommendation(BaseModel):
    original_action: str
    alternative_action: str
    expected_health_gain_percent: float
    explanation: str


class TimelineStep(BaseModel):
    step_number: int
    change_summary: str
    affected_nodes_count: int
    architecture_compliance_score: float
    estimated_failure_probability: float
    health_score: float


class SimulationReportResponse(BaseModel):
    session_id: str
    repository_id: str
    total_affected_nodes: int
    affected_counts: Dict[
        str, int
    ]  # keys: files, functions, apis, tests, microservices, databases, ci_pipelines, classes
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score: int  # 0 to 100
    risk_explanation: str
    estimated_repair_time: str
    confidence_level: str
    affected_details: List[AffectedNodeDetail]
    remediation_recommendations: List[str]
    rules_violated: List[str] = []
    tech_debt_score_change: float = 0.0
    architecture_compliance_score: float = 100.0
    estimated_failure_probability: float = 0.0
    blast_radius_nodes: List[BlastRadiusNode] = []
    blast_radius_edges: List[BlastRadiusEdge] = []
    risk_predictions: List[RiskPrediction] = []
    cost_estimate: Optional[CostEstimate] = None
    performance_impact: Optional[PerformanceImpact] = None
    architecture_evolution: Optional[ArchitectureEvolution] = None
    ai_alternative_recommendations: List[AIAlternativeRecommendation] = []
    simulation_timeline: List[TimelineStep] = []


class AIRefactoringRequest(BaseModel):
    refactoring_goal: str = Field(..., description="Refactoring task/goal description")


class AIRefactoringResponse(BaseModel):
    goal: str
    migration_plan: List[str]
    new_architecture: str
    new_dependencies: List[str]
    risk_analysis: str
    timeline: List[str]
    rollback_strategy: str
    expected_improvement: str


class ScenarioDetails(BaseModel):
    name: str
    cost_hours: float
    rollback_cost: float
    risk_level: str
    failure_probability: float
    coupling_ratio: float
    latency_ms: float
    tech_debt_change: float


class ScenarioComparisonRequest(BaseModel):
    scenario_a_session_id: str
    scenario_b_session_id: str


class ScenarioComparisonResponse(BaseModel):
    scenario_a: ScenarioDetails
    scenario_b: ScenarioDetails
    recommendation: str


class WhatIfRequest(BaseModel):
    scenario_type: str  # developer_attrition, db_failure, cache_removal, cloud_migration, monolith_to_microservices


class WhatIfResponse(BaseModel):
    scenario_title: str
    impact_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    failure_probability: float
    remediation_hours: float
    affected_components: List[str]
    verdict: str
    details: str


class SimulationScenarioCreate(BaseModel):
    scenario_name: str


class SimulationScenarioResponse(BaseModel):
    id: str
    repository_id: str
    scenario_name: str
    created_by: str
    created_at: datetime

    class Config:
        orm_mode = True


class SimulationResultResponse(BaseModel):
    scenario_id: str
    risk_score: int
    impact_score: int
    health_score: float
    estimated_effort: float
    confidence: float

    class Config:
        orm_mode = True


class BlastRadiusEntityResponse(BaseModel):
    entity: str
    affected_nodes: int
    affected_files: int
    affected_services: int
    affected_tests: int

    class Config:
        orm_mode = True


class SimulationRunRequest(BaseModel):
    changed_node_id: str
    action: str = "delete"
    target_type: str = "symbol"


class SimulationCompareRequest(BaseModel):
    scenario_a_id: str
    scenario_b_id: str


class SimulationCompareResponse(BaseModel):
    scenario_a: SimulationResultResponse
    scenario_b: SimulationResultResponse
    recommendation: str


class IncidentSimulationRequest(BaseModel):
    query: str


class IncidentSimulationResponse(BaseModel):
    query: str
    apis_affected: List[str]
    services_affected: List[str]
    user_impact: str
    recovery_path: List[str]
    estimated_downtime: str


# --- Software City / Digital Twin schemas (Phase 15) ---


class SoftwareCityRoom(BaseModel):
    id: str
    name: str
    is_async: bool = False


class SoftwareCityBuilding(BaseModel):
    id: str
    name: str
    type: str  # Class, Interface, File
    rooms: List[SoftwareCityRoom] = []
    height_meters: float  # Represents size/complexity
    technical_debt_traffic_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    danger_zone_bugs_count: int = 0
    documentation_quality: float = 0.0


class SoftwareCityNeighborhood(BaseModel):
    id: str
    name: str
    buildings: List[SoftwareCityBuilding] = []


class SoftwareCityDistrict(BaseModel):
    id: str
    name: str
    neighborhoods: List[SoftwareCityNeighborhood] = []
    health_score: float = 100.0


class SoftwareCityRoad(BaseModel):
    id: str
    name: str
    source_id: str
    target_id: str
    traffic_level: str  # LOW, MEDIUM, HIGH, CRITICAL


class SoftwareCityHighway(BaseModel):
    id: str
    source_id: str
    target_id: str
    type: str
    traffic_level: str  # LOW, MEDIUM, HIGH, CRITICAL


class SoftwareCityPowerStation(BaseModel):
    id: str
    name: str
    db_type: str
    tables_count: int
    health_status: str  # OPERATIONAL, DEGRADED, OFFLINE


class SoftwareCityRailwayStation(BaseModel):
    id: str
    name: str
    queue_count: int
    health_status: str


class SoftwareCityWarehouse(BaseModel):
    id: str
    name: str
    cache_type: str
    hit_rate: float
    health_status: str


class SoftwareCityCitizen(BaseModel):
    name: str
    role: str
    contributions_count: int
    active_building_ids: List[str] = []


class SoftwareCityAirport(BaseModel):
    id: str
    name: str
    status: str  # SUCCESS, FAILED, RUNNING


class SoftwareCityControlTower(BaseModel):
    id: str
    name: str
    active_alerts_count: int
    health_status: str


class SoftwareCityUtilityPlant(BaseModel):
    id: str
    name: str
    resource_type: str
    status: str


class SoftwareCityResponse(BaseModel):
    city_name: str
    districts: List[SoftwareCityDistrict] = []
    roads: List[SoftwareCityRoad] = []
    highways: List[SoftwareCityHighway] = []
    power_stations: List[SoftwareCityPowerStation] = []
    railway_stations: List[SoftwareCityRailwayStation] = []
    warehouses: List[SoftwareCityWarehouse] = []
    citizens: List[SoftwareCityCitizen] = []
    airports: List[SoftwareCityAirport] = []
    control_towers: List[SoftwareCityControlTower] = []
    utility_plants: List[SoftwareCityUtilityPlant] = []
    overall_health: float = 100.0
    congestion_index: float = 0.0
