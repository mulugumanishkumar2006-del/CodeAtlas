# apps/backend/app/schemas/spe.py

from typing import Dict, List, Optional

from pydantic import BaseModel


class SoftwarePhysicsMetrics(BaseModel):
    mass: float  # 0 to 10 (Module size & LOC complexity)
    gravity: float  # 0 to 10 (Dependency orbital pull)
    energy: float  # 0 to 10 (Active compute workload)
    momentum: float  # 0 to 10 (Release velocity & momentum)
    friction: float  # 0 to 10 (Technical debt & refactoring friction)
    temperature: float  # 0 to 10 (Commit frequency & hot code velocity)
    pressure: float  # 0 to 10 (Production traffic load & RPS)
    velocity: float  # 0 to 10 (Speed of changes over time)
    elasticity: float  # 0 to 10 (Resilience & autoscaling recovery)
    entropy: float  # 0 to 10 (Architectural disorganization)


class ComponentPhysicsProfile(BaseModel):
    component_id: str
    component_name: str
    physics: SoftwarePhysicsMetrics
    visual_gauges: Dict[str, str]  # e.g. {"mass": "██████████", "gravity": "█████████"}
    intuition_summary: str
    physical_law_verdict: str


class SPEUniverseRequest(BaseModel):
    environment: Optional[str] = "production"


class SPEUniverseResponse(BaseModel):
    universe_title: str
    total_components_simulated: int
    system_total_mass: float
    system_avg_entropy: float
    components: List[ComponentPhysicsProfile]
    physics_simulation_verdict: str
