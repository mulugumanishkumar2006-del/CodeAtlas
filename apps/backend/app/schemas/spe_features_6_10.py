# apps/backend/app/schemas/spe_features_6_10.py

from typing import List

from pydantic import BaseModel


# Feature 6: Software Acceleration DTO
class SoftwareAccelerationBreakdown(BaseModel):
    acceleration_score: float  # 0 to 10
    velocity_delta_pct: float
    acceleration_verdict: str


# Feature 7: Software Friction DTO (Coupling, Complexity, Test Coverage, Docs)
class SoftwareFrictionBreakdown(BaseModel):
    friction_score: float  # 0 to 10
    coupling_score: float
    complexity_score: float
    test_coverage_pct: float
    documentation_score: float
    friction_verdict: str


# Feature 8: Software Elasticity DTO
class SoftwareElasticityBreakdown(BaseModel):
    elasticity_score: float  # 0 to 10
    resilience_recovery_time_sec: float
    elasticity_verdict: str


# Feature 9: Software Entropy DTO ⭐ (Historical Disorder Tracker)
class HistoricalEntropySnapshot(BaseModel):
    quarter: str  # e.g. "Q1 2025", "Q2 2025"
    entropy_score: float
    status: str  # "Organized", "Drifting", "Disorganized"


class SoftwareEntropyBreakdown(BaseModel):
    entropy_score: float  # 0 to 10
    architectural_disorder_index: float
    trend_direction: str  # "Improving", "Degrading", "Stable"
    historical_snapshots: List[HistoricalEntropySnapshot]
    entropy_verdict: str


# Feature 10: Software Energy DTO
class SoftwareEnergyBreakdown(BaseModel):
    energy_score: float  # 0 to 10
    engineering_effort_hours: float
    compute_power_kwh: float
    energy_verdict: str


class SPEFeatures6To10Response(BaseModel):
    component_id: str
    component_name: str
    acceleration: SoftwareAccelerationBreakdown
    friction: SoftwareFrictionBreakdown
    elasticity: SoftwareElasticityBreakdown
    entropy: SoftwareEntropyBreakdown
    energy: SoftwareEnergyBreakdown
