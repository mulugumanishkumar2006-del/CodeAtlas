"""
CodeAtlas v7.7 - Engineering Self-Healing System API Router
Exposes endpoints for System Health Scores, Anomaly & Incident Detection, Root-Cause Hypotheses, Failure Forecasts, Remediation Simulation & Canary Execution, Specialized Domain Healing, Error Budget Status, Test Harnesses (Phases 94, 95, 96, 97, 98), and 45-Point Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.self_healing_v77.health_anomaly_hypothesis_forecaster import HealthAnomalyHypothesisForecasterEngine, SystemEntityType, HealthDimension
from app.self_healing_v77.remediation_canary_recovery_engine import RemediationCanaryRecoveryEngine, RemediationRiskLevel, RemediationActionCategory
from app.self_healing_v77.slo_prevention_master_harness import SLOPreventionMasterHarnessEngine

router = APIRouter(prefix="/self-healing-v77", tags=["Engineering Self-Healing System v7.7"])

forecaster_engine = HealthAnomalyHypothesisForecasterEngine()
remediation_engine = RemediationCanaryRecoveryEngine()
harness_engine = SLOPreventionMasterHarnessEngine()


# --- System Health, Anomalies, Hypotheses & Forecasting ---

@router.get("/health/explainable-score")
def get_explainable_health(entity_id: str = Query("ent_checkout_service")):
    return forecaster_engine.get_explainable_health_score(entity_id)

@router.post("/anomalies/detect-and-correlate")
def detect_anomalies(entity_id: str = Body("ent_checkout_service", embed=True)):
    return forecaster_engine.detect_and_correlate_anomalies(entity_id)

@router.get("/root-cause/hypotheses")
def get_root_cause_hypotheses(entity_id: str = Query("ent_checkout_service")):
    return forecaster_engine.construct_root_cause_graph_and_hypotheses(entity_id)

@router.get("/forecasting/failure-precursors")
def forecast_failures(entity_id: str = Query("ent_checkout_service")):
    return forecaster_engine.forecast_failures_and_precursors(entity_id)


# --- Remediation Catalog, Canary Rollout & Domain Healing ---

@router.get("/remediation/candidate-plans")
def get_candidate_plans(
    incident_id: str = Query("inc_9012_checkout_latency"),
    target_service: str = Query("ent_checkout_service")
):
    return remediation_engine.generate_and_compare_repair_plans(incident_id, target_service)

@router.post("/remediation/execute-canary")
def execute_canary_repair(
    plan_id: str = Body("repair_plan_A"),
    target_service: str = Body("ent_checkout_service"),
    canary_percentage: int = Body(10)
):
    return remediation_engine.execute_canary_and_progressive_repair(plan_id, target_service, canary_percentage)

@router.post("/domain-healing/execute")
def execute_domain_healing(
    domain: str = Body("DATABASE", embed=True),
    target_entity: str = Body("ent_postgres_db", embed=True)
):
    return remediation_engine.execute_specialized_domain_healing(domain, target_entity)


# --- SLO, Error Budget, Test Harnesses & Readiness Audit ---

@router.get("/slo/error-budget-status")
def get_error_budget_status(service_id: str = Query("ent_checkout_service")):
    return harness_engine.get_slo_and_error_budget_status(service_id)

@router.get("/test-harness/phase-94-18-step")
def run_phase_94_18_step_test():
    return harness_engine.execute_phase_94_18_step_end_to_end_self_healing_test()

@router.get("/test-harness/phase-95-cascading-failure")
def run_phase_95_cascading_failure():
    return harness_engine.execute_phase_95_cascading_failure_test()

@router.get("/test-harness/phase-96-bad-repair")
def run_phase_96_bad_repair():
    return harness_engine.execute_phase_96_bad_repair_test()

@router.get("/test-harness/phase-97-adversarial-healing")
def run_phase_97_adversarial_healing():
    return harness_engine.execute_phase_97_adversarial_healing_test()

@router.get("/test-harness/phase-98-chaos")
def run_phase_98_chaos():
    return harness_engine.execute_phase_98_chaos_test()

@router.get("/readiness")
def get_self_healing_readiness():
    return harness_engine.audit_v77_self_healing_readiness()
