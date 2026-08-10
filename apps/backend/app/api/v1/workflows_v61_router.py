"""
CodeAtlas v6.1 - Autonomous Engineering Workflows API Router
Exposes endpoints for Workflow State Machine, Flagship Workflows Execution, Human Review Center, Workflow SDK, 15-Step Test, and Autonomous Workflows Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.workflows_v61.orchestrator_state_machine import CentralizedOrchestratorAndStateMachineEngine
from app.workflows_v61.flagship_workflows_suite import FlagshipWorkflowsSuiteEngine
from app.workflows_v61.composition_human_review import CompositionAndHumanReviewEngine
from app.workflows_v61.sdk_replay_test_harness import SDKReplayAndTestHarnessEngine

router = APIRouter(prefix="/workflows-v61", tags=["Autonomous Engineering Workflows v6.1"])

orchestrator_state = CentralizedOrchestratorAndStateMachineEngine()
flagships_suite = FlagshipWorkflowsSuiteEngine()
composition_review = CompositionAndHumanReviewEngine()
sdk_replay_harness = SDKReplayAndTestHarnessEngine()


# --- Orchestrator & State Machine ---

@router.post("/workflow/create")
def create_workflow(
    name: str = Body(...),
    purpose: str = Body(...),
    risk_level: str = Body("WRITE"),
    budget: int = Body(50000)
):
    return orchestrator_state.create_autonomous_workflow(name, purpose, risk_level, budget)

@router.post("/workflow/state")
def transition_state(workflow_id: str = Body(...), target_state: str = Body(...), details: Optional[str] = Body(None)):
    return orchestrator_state.transition_workflow_state(workflow_id, target_state, details)

@router.post("/workflow/evidence")
def record_evidence(workflow_id: str = Body(...), source: str = Body(...), observation: str = Body(...), confidence: float = Body(0.95)):
    return orchestrator_state.record_evidence(workflow_id, source, observation, confidence)


# --- Flagship Workflows ---

@router.post("/flagship/incident")
def run_incident_workflow(trigger: str = Body("Latency spike > 500ms on /checkout", embed=True)):
    return flagships_suite.run_incident_investigator(trigger)

@router.post("/flagship/security")
def run_security_workflow(vulnerability_id: str = Body("CVE-2026-9901", embed=True)):
    return flagships_suite.run_security_remediator(vulnerability_id)

@router.post("/flagship/dependency")
def run_dependency_workflow(dep: str = Body("pydantic", embed=True)):
    return flagships_suite.run_dependency_upgrader(dep)

@router.post("/flagship/performance")
def run_performance_workflow(endpoint: str = Body("/api/v1/orders", embed=True)):
    return flagships_suite.run_performance_optimizer(endpoint)


# --- Composition, Human Review & Rollback ---

@router.post("/composition/compose")
def compose_workflows(primary: str = Body("Incident Investigator"), children: List[str] = Body(["Security Remediator", "Test Engineer"])):
    return composition_review.compose_cross_workflows(primary, children)

@router.post("/review/submit")
def submit_review(workflow_id: str = Body(...), action: str = Body(...), diff: str = Body(...), risk: str = Body("MEDIUM")):
    return composition_review.submit_for_human_review(workflow_id, action, diff, risk)

@router.post("/rollback/execute")
def execute_rollback(workflow_id: str = Body(...), reason: str = Body("Verification failed", embed=True)):
    return composition_review.execute_automated_rollback(workflow_id, reason)


# --- SDK, Replay, 15-Step Test & Readiness ---

@router.post("/replay/run")
def run_replay(workflow_id: str = Body("wf_inc_001", embed=True)):
    return sdk_replay_harness.replay_workflow_execution(workflow_id)

@router.post("/test-harness/15-step-test")
def run_15_step_test(trigger: str = Body("Latency spike on checkout endpoint", embed=True)):
    return sdk_replay_harness.execute_15_step_final_autonomous_engineering_test(trigger)

@router.get("/readiness")
def get_workflows_readiness():
    return sdk_replay_harness.audit_v61_workflows_readiness()
