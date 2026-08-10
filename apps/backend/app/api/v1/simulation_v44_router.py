"""
CodeAtlas v4.4 - Advanced Engineering Simulation & Digital Twin API Router
Exposes endpoints for Digital Twin state, Natural Language Scenarios, Blast Radius, 100x Load Simulation, Failure Injection, Migration Strategies, Interactive What-If, and v4.4 Digital Twin Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.simulation_v44.digital_twin_core import DigitalTwinCoreEngine
from app.simulation_v44.scenario_blast_radius import ScenarioBlastRadiusEngine
from app.simulation_v44.multidimensional_simulators import MultiDimensionalSimulatorsEngine
from app.simulation_v44.migration_whatif_sync import MigrationWhatIfAndSyncEngine

router = APIRouter(prefix="/simulation-v44", tags=["Advanced Engineering Simulation v4.4"])

core_engine = DigitalTwinCoreEngine()
scenario_engine = ScenarioBlastRadiusEngine()
multidim_engine = MultiDimensionalSimulatorsEngine()
sync_engine = MigrationWhatIfAndSyncEngine()


# --- Digital Twin Core & State Engine ---

@router.get("/twin/current-state")
def get_current_state():
    return core_engine.current_state_v1

@router.post("/twin/compare-states")
def compare_states(state_a: str = Body(...), state_b: str = Body(...)):
    return core_engine.compare_system_states(state_a, state_b)


# --- Natural Language Scenario & Blast Radius ---

@router.post("/scenario/parse")
def parse_scenario(prompt: str = Body(..., embed=True)):
    return scenario_engine.parse_natural_language_scenario(prompt)

@router.post("/blast-radius")
def calculate_blast_radius(type: str = Body(...), target: str = Body(...)):
    return scenario_engine.calculate_multi_layer_blast_radius(type, target)


# --- Multi-Dimensional Simulation Suite ---

@router.post("/simulate/load")
def simulate_load(multiplier: int = Body(10, embed=True)):
    return multidim_engine.simulate_traffic_load_surge(multiplier)

@router.post("/simulate/failure")
def simulate_failure(component: str = Body(..., embed=True)):
    return multidim_engine.simulate_failure_injection_and_cascading(component)

@router.post("/simulate/security-cost")
def simulate_security_cost(change_type: str = Body(..., embed=True)):
    return multidim_engine.simulate_security_and_cost_impact(change_type)


# --- Migration Strategies, What-If Studio & Digital Twin Audit ---

@router.post("/migration/strategies")
def evaluate_migration_strategies(target_architecture: str = Body(..., embed=True)):
    return sync_engine.compare_migration_strategies(target_architecture)

@router.post("/what-if")
def run_what_if(parameters: Dict[str, Any] = Body(...)):
    return sync_engine.run_interactive_whatif_simulation(parameters)

@router.get("/readiness")
def get_digital_twin_readiness():
    return sync_engine.audit_v44_digital_twin_readiness()
