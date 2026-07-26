# apps/backend/app/schemas/spe_features_11_15.py

from typing import List, Optional

from pydantic import BaseModel


# Feature 11: Force Simulation DTO
class ForceSimulationRequest(BaseModel):
    source_component_id: Optional[str] = "auth_service"
    proposed_change_description: Optional[str] = (
        "Migrate Auth Vault to gRPC Protobuf binary streaming"
    )


class ForceSimulationResponse(BaseModel):
    source_component_id: str
    proposed_change: str
    force_magnitude_newtons: float
    shockwave_radius_hops: int
    affected_nodes: List[str]
    propagation_verdict: str


# Feature 12: Collision Detector DTO
class PRCollisionItem(BaseModel):
    pr_id: str
    pr_title: str
    author: str
    conflicting_file: str
    risk_level: str  # "High", "Medium", "Low"
    resolution_recommendation: str


class CollisionDetectorResponse(BaseModel):
    total_active_prs_analyzed: int
    collisions_detected_count: int
    collisions: List[PRCollisionItem]
    collision_verdict: str


# Feature 13: Stability Index DTO
class StabilityIndexResponse(BaseModel):
    component_id: str
    component_name: str
    stability_index_pct: float
    mtbf_hours: float
    volatility_rating: str  # "Low", "Moderate", "High"
    stability_verdict: str


# Feature 14: Resonance Detection DTO
class RecurringResonancePattern(BaseModel):
    pattern_id: str
    cycle_period_days: int
    title: str
    impacted_subsystem: str
    recurring_symptom: str
    mitigation_action: str


class ResonanceDetectionResponse(BaseModel):
    total_patterns_detected: int
    resonance_patterns: List[RecurringResonancePattern]
    resonance_verdict: str


# Feature 15: Engineering Climate DTO (Calm, Warming, Storm, Critical)
class EngineeringClimateResponse(BaseModel):
    climate_state: str  # "Calm", "Warming", "Storm", "Critical"
    climate_index_score: float  # 0 to 100
    primary_weather_driver: str
    risk_level: str
    recommended_action: str


class SPEFeatures11To15Response(BaseModel):
    component_id: str
    force_simulation: ForceSimulationResponse
    collisions: CollisionDetectorResponse
    stability: StabilityIndexResponse
    resonance: ResonanceDetectionResponse
    climate: EngineeringClimateResponse
