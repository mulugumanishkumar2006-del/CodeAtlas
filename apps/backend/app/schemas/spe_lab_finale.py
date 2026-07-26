# apps/backend/app/schemas/spe_lab_finale.py

from typing import List, Optional

from pydantic import BaseModel


# 🌟 WOW Feature: Interactive Software Physics Lab DTOs
class InteractivePhysicsLabDragRequest(BaseModel):
    dragged_component_id: str  # e.g. "payments_service"
    new_orbit_distance_km: float  # e.g. 600.0
    new_mass_override: Optional[float] = None


class InteractivePhysicsLabDragResponse(BaseModel):
    dragged_component_id: str
    stress_redistribution_summary: str
    dependency_movement_nodes: List[str]
    performance_impact_pct: float
    technical_debt_delta: float
    stability_shift_verdict: str


# Features 16–30 DTOs
class TechnicalDebtGravityWell(BaseModel):
    well_id: str
    component_id: str
    debt_mass_score: float  # 0 to 10
    collapse_risk_rating: str  # "High", "Critical"
    trapped_modules_count: int


class ArchitectureBlackHole(BaseModel):
    black_hole_id: str
    center_service: str
    event_horizon_radius_km: float
    consumed_modules_count: int
    escape_velocity_needed_score: float


class DependencyOrbitMap(BaseModel):
    central_node: str
    orbiting_satellites_count: int
    satellites: List[str]
    gravitational_binding_energy_joules: float


class SPELabFinaleResponse(BaseModel):
    architecture_equilibrium_score: float  # e.g. 92.4
    long_term_entropy_forecast_12m: float
    gravity_wells: List[TechnicalDebtGravityWell]
    black_holes: List[ArchitectureBlackHole]
    orbit_maps: List[DependencyOrbitMap]
    enterprise_mental_model_verdict: str
