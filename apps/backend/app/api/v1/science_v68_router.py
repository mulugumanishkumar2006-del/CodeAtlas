"""
CodeAtlas v6.8 - Engineering Knowledge & Scientific Intelligence API Router
Exposes endpoints for Evidence Ranking, Conflict Explanations, Research Paper Ingestion, Benchmark Normalization, Uncertainty Map, Technical Question & Hypotheses, Experiment Registry, Negative Knowledge Memory, Technology Radar, Scientific Decision Center, 12-Step Test, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.science_v68.epistemology_scientific_graph import EpistemologyScientificGraphEngine
from app.science_v68.literature_benchmarks_uncertainty import LiteratureBenchmarksUncertaintyEngine
from app.science_v68.question_hypothesis_experiment_registry import QuestionHypothesisExperimentRegistryEngine
from app.science_v68.playbooks_scientific_decision_center import PlaybooksScientificDecisionCenterEngine

router = APIRouter(prefix="/science-v68", tags=["Engineering Knowledge & Scientific Intelligence v6.8"])

epistemology_graph = EpistemologyScientificGraphEngine()
literature_benchmarks = LiteratureBenchmarksUncertaintyEngine()
question_registry = QuestionHypothesisExperimentRegistryEngine()
playbooks_center = PlaybooksScientificDecisionCenterEngine()


# --- Epistemology, Authority & Conflicts ---

@router.get("/evidence/rank")
def rank_evidence(node_id: str = Query("sci_obs_001")):
    return epistemology_graph.rank_evidence_authority(node_id)

@router.get("/knowledge/conflicts")
def get_knowledge_conflicts():
    return epistemology_graph.detect_and_explain_knowledge_conflicts()


# --- Literature, Benchmarks & Uncertainty ---

@router.post("/literature/ingest")
def ingest_paper(
    title: str = Body("CockroachDB: The Resilient Distributed SQL Database", embed=True),
    authors: List[str] = Body(None)
):
    return literature_benchmarks.ingest_and_parse_research_paper(title, authors)

@router.post("/benchmarks/compare")
def compare_benchmarks(
    bench_a: str = Body("PostgreSQL RDS 15 (Internal 8-vCPU)"),
    bench_b: str = Body("CockroachDB Cloud (Internal 3-Node Dedicated)")
):
    return literature_benchmarks.normalize_and_compare_benchmarks(bench_a, bench_b)

@router.get("/uncertainty/map")
def get_uncertainty_map():
    return literature_benchmarks.generate_uncertainty_map_and_knowledge_gaps()


# --- Question Engine, Experiments & Negative Knowledge ---

@router.post("/question/ask")
def ask_technical_question(question: str = Body("Why is checkout service latency increasing during peak traffic?", embed=True)):
    return question_registry.process_technical_question_and_hypotheses(question)

@router.post("/experiment/record")
def record_experiment(
    title: str = Body(...),
    hypothesis: str = Body(...),
    expected_outcome: str = Body(...),
    observed_outcome: str = Body(...),
    passed: bool = Body(True)
):
    return question_registry.register_and_record_experiment_result(title, hypothesis, expected_outcome, observed_outcome, passed)

@router.get("/negative-knowledge")
def get_negative_knowledge():
    return question_registry.get_negative_knowledge_memory()


# --- Technology Radar, 12-Step Test, Phase 99 Audit & Readiness ---

@router.get("/technology-radar")
def get_technology_radar():
    return playbooks_center.get_technology_radar_and_architecture_patterns()

@router.post("/test-harness/12-step-test")
def run_12_step_test(question: str = Body("Our API latency is increasing during peak load.", embed=True)):
    return playbooks_center.execute_12_step_final_end_to_end_research_test(question)

@router.get("/test-harness/phase-99-question")
def run_phase_99_question():
    return playbooks_center.execute_final_scientific_question_audit()

@router.get("/readiness")
def get_science_readiness():
    return playbooks_center.audit_v68_scientific_intelligence_readiness()
