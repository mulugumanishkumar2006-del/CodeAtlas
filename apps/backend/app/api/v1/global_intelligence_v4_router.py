"""
CodeAtlas v4.0 - Global Engineering Intelligence Platform API Router
Exposes endpoints for Command Center, Entity Explorer, AI RCA, Simulation Studio, Operations Center, Agent Orchestrator, Org Intelligence, Governance & ROI.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.global_intelligence_v4.command_center_feed import CommandCenterAndPriorityEngine
from app.global_intelligence_v4.repository_architecture_knowledge import RepositoryArchitectureAndKnowledgeEngine
from app.global_intelligence_v4.ai_workspace_simulation import AIWorkspaceAndSimulationEngine
from app.global_intelligence_v4.ops_agents_org_governance import OpsAgentsOrgAndGovernanceEngine, AutonomyLevel

router = APIRouter(prefix="/global-intelligence-v4", tags=["Global Engineering Intelligence Platform v4.0"])

cmd_center = CommandCenterAndPriorityEngine()
repo_arch = RepositoryArchitectureAndKnowledgeEngine()
ai_sim = AIWorkspaceAndSimulationEngine()
ops_agents = OpsAgentsOrgAndGovernanceEngine()


# --- Command Center & Feed ---

@router.get("/command-center")
def get_command_center():
    return cmd_center.get_engineering_command_center_overview()

@router.get("/priority-problems")
def get_priority_problems():
    return cmd_center.get_prioritized_engineering_problems()

@router.get("/feed")
def get_feed():
    return cmd_center.get_intelligent_engineering_feed()


# --- Repository, Architecture & Knowledge ---

@router.get("/repository/intelligence")
def get_repo_intelligence(name: str = Query("payment-service")):
    return repo_arch.get_repository_intelligence(name)

@router.get("/architecture/map")
def get_architecture_map():
    return repo_arch.get_architecture_map_and_service_topology()

@router.get("/decisions")
def get_decisions():
    return repo_arch.get_decision_and_documentation_intelligence()


# --- AI Investigation & Simulation Studio ---

@router.post("/ai/investigate")
def run_ai_investigation(query: str = Body(..., embed=True)):
    return ai_sim.run_structured_ai_investigation_and_rca(query)

@router.post("/simulation/run")
def run_simulation(scenario: str = Body(..., embed=True), scale: str = Body("100x", embed=True)):
    return ai_sim.run_simulation_studio_scenario(scenario, scale)


# --- Operations, Agents, Org & ROI ---

@router.get("/ops/center")
def get_ops_center():
    return ops_agents.get_operations_and_security_center()

@router.post("/agent/orchestrate")
def orchestrate_agent(
    agent: str = Body(...),
    task: str = Body(...),
    autonomy: str = Body(AutonomyLevel.L3_APPROVE)
):
    return ops_agents.orchestrate_agent_network_action(agent, task, autonomy)

@router.get("/global-ops/dr")
def get_global_ops_dr():
    return ops_agents.get_global_ops_time_machine_and_org_risk()

@router.post("/command/parse")
def parse_command(command: str = Body(..., embed=True)):
    return ops_agents.parse_universal_command_palette(command)

@router.get("/roi")
def get_roi_analytics():
    return ops_agents.calculate_engineering_roi_analytics()
