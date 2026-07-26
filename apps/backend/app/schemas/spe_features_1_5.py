# apps/backend/app/schemas/spe_features_1_5.py

from typing import List

from pydantic import BaseModel


# Feature 1: Software Mass DTO (LOC, Complexity, Classes, Functions)
class SoftwareMassBreakdown(BaseModel):
    mass_score: float  # 0 to 10
    loc_count: int  # Lines of code
    cyclomatic_complexity: int
    class_count: int
    function_count: int
    mass_verdict: str


# Feature 2: Software Gravity DTO
class SoftwareGravityBreakdown(BaseModel):
    gravity_score: float  # 0 to 10
    dependent_services_count: int
    dependent_repos: List[str]
    orbital_pull_radius_km: float
    gravity_verdict: str


# Feature 3: Software Temperature DTO
class SoftwareTemperatureBreakdown(BaseModel):
    temperature_score: float  # 0 to 10
    recent_commits_14d: int
    active_authors_count: int
    hot_code_status: str  # "Overheated", "Warm", "Cool"
    temperature_verdict: str


# Feature 4: Software Pressure DTO
class SoftwarePressureBreakdown(BaseModel):
    pressure_score: float  # 0 to 10
    peak_rps: float
    concurrency_threads: int
    load_stress_psi: float
    pressure_verdict: str


# Feature 5: Software Velocity DTO
class SoftwareVelocityBreakdown(BaseModel):
    velocity_score: float  # 0 to 10
    loc_churn_per_day: float
    release_cadence_days: float
    velocity_verdict: str


class SPEFeatures1To5Response(BaseModel):
    component_id: str
    component_name: str
    mass: SoftwareMassBreakdown
    gravity: SoftwareGravityBreakdown
    temperature: SoftwareTemperatureBreakdown
    pressure: SoftwarePressureBreakdown
    velocity: SoftwareVelocityBreakdown
