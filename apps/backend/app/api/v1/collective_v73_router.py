"""
CodeAtlas v7.3 - Engineering Collective Intelligence API Router
Exposes endpoints for Experience Ingestion, Pattern/Anti-Pattern Discovery, Research Question Graph, Causal Reasoning, Swarm Investigation, Poisoning Defense & Dissent Engine, Collective Dashboard, 15-Step Collective Test, Phase 95 Poisoning Test, Phase 99 Master Query, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.collective_v73.experience_evidence_patterns_playbooks import ExperienceEvidencePatternsPlaybooksEngine
from app.collective_v73.research_hypotheses_causal_forecasting import ResearchHypothesesCausalForecastingEngine
from app.collective_v73.marketplace_swarm_poisoning_dissent import MarketplaceSwarmPoisoningDissentEngine
from app.collective_v73.dashboard_gap_engine_master_test_harness import DashboardGapEngineMasterTestHarnessEngine

router = APIRouter(prefix="/collective-v73", tags=["Engineering Collective Intelligence v7.3"])

experience_playbooks = ExperienceEvidencePatternsPlaybooksEngine()
research_causal = ResearchHypothesesCausalForecastingEngine()
swarm_poisoning = MarketplaceSwarmPoisoningDissentEngine()
dashboard_admin = DashboardGapEngineMasterTestHarnessEngine()


# --- Experience Ingestion, Patterns & Playbooks ---

@router.post("/experience/ingest")
def ingest_experience(
    exp_type: str = Body("INCIDENT_POSTMORTEM"),
    summary: str = Body("Connection exhaustion under 500 RPS spike on RDS PostgreSQL"),
    evidence: Dict[str, Any] = Body(None)
):
    return experience_playbooks.ingest_and_score_engineering_experience(exp_type, summary, evidence)

@router.get("/patterns/discover")
def discover_patterns():
    return experience_playbooks.discover_patterns_and_antipatterns()


# --- Research Question Graph & Causal Reasoning ---

@router.get("/research/question-graph")
def get_question_graph(
    question: str = Query("Does adopting Valkey 8.0 reduce P99 cache latency compared to Redis BSL under 10k QPS?")
):
    return research_causal.evaluate_research_question_graph(question)

@router.get("/causal-reasoning/calibration")
def get_causal_calibration(pred_type: str = Query("P99_LATENCY_REDUCTION")):
    return research_causal.evaluate_causal_reasoning_and_prediction_calibration(pred_type)


# --- Swarm Investigation, Poisoning Defense & Dissent ---

@router.post("/swarm/investigate")
def run_swarm_investigation(problem: str = Body("P99 Latency degradation on Checkout API", embed=True)):
    return swarm_poisoning.execute_swarm_investigation(problem)

@router.post("/poisoning-defense/verify")
def verify_poisoning_defense(payload: Dict[str, Any] = Body(None)):
    return swarm_poisoning.verify_poisoning_defense_and_preserve_dissent(payload)


# --- Collective Dashboard, 15-Step Test, Phase 95/99 & Readiness ---

@router.get("/dashboard")
def get_collective_dashboard():
    return dashboard_admin.get_collective_intelligence_dashboard_payload()

@router.get("/test-harness/phase-95-poisoning")
def run_phase_95_test():
    return dashboard_admin.execute_phase_95_knowledge_poisoning_test()

@router.post("/test-harness/15-step-test")
def run_15_step_test(pattern: str = Body("Transaction-Level PgBouncer Connection Pooling", embed=True)):
    return dashboard_admin.execute_15_step_end_to_end_collective_test(pattern)

@router.get("/test-harness/phase-99-query")
def run_phase_99_query():
    return dashboard_admin.execute_phase_99_collective_intelligence_query()

@router.get("/readiness")
def get_collective_readiness():
    return dashboard_admin.audit_v73_collective_intelligence_readiness()
