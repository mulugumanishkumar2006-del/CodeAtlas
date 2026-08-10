"""
CodeAtlas v6.3 - Engineering Intelligence Learning System API Router
Exposes endpoints for Epistemological Claims, Evidence Graph, Contradiction Resolution, Persistent Memories, Pattern Discovery, Knowledge Chat & Recall, 14-Step Learning Test, and Learning Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.learning_v63.epistemology_evidence_graph import EpistemologyAndEvidenceGraphEngine
from app.learning_v63.memories_patterns_causality import MemoriesPatternsAndCausalityEngine
from app.learning_v63.profiles_knowledge_chat import ProfilesAndKnowledgeChatEngine
from app.learning_v63.uncertainty_governance_test_harness import UncertaintyAndGovernanceTestHarnessEngine

router = APIRouter(prefix="/learning-v63", tags=["Engineering Intelligence Learning System v6.3"])

epistemology_graph = EpistemologyAndEvidenceGraphEngine()
memories_causality = MemoriesPatternsAndCausalityEngine()
profiles_chat = ProfilesAndKnowledgeChatEngine()
uncertainty_harness = UncertaintyAndGovernanceTestHarnessEngine()


# --- Epistemology & Evidence Graph ---

@router.post("/claim/record")
def record_claim(
    claim_text: str = Body(...),
    category: str = Body("INFERENCE"),
    source: str = Body("OpenTelemetry + AST"),
    confidence: float = Body(0.98),
    evidence: List[str] = Body(None)
):
    return epistemology_graph.record_epistemological_claim(claim_text, category, source, confidence, evidence)

@router.post("/contradiction/resolve")
def resolve_contradiction(fact_a: Dict[str, Any] = Body(...), fact_b: Dict[str, Any] = Body(...)):
    return epistemology_graph.detect_and_resolve_contradiction(fact_a, fact_b)


# --- Persistent Memories & Causal Attribution ---

@router.post("/memory/decision")
def record_decision(
    decision: str = Body(...),
    reason: str = Body(...),
    alternatives: List[str] = Body(...),
    outcome: str = Body(...)
):
    return memories_causality.record_decision_memory(decision, reason, alternatives, outcome)

@router.get("/patterns/discover")
def discover_patterns(scope: str = Query("ORGANIZATION_WIDE")):
    return memories_causality.discover_engineering_patterns(scope)

@router.post("/counterfactual/analyze")
def analyze_counterfactual(scenario: str = Body("What if we did nothing during INC-9901?", embed=True)):
    return memories_causality.perform_counterfactual_analysis(scenario)


# --- Profiles & Knowledge Chat ---

@router.get("/profile/org")
def get_org_profile(org_id: str = Query("org_acme_corp")):
    return profiles_chat.get_organization_profile(org_id)

@router.post("/chat/ask")
def ask_knowledge_chat(question: str = Body("Why did this service fail last month?", embed=True), org_id: str = Body("org_acme_corp")):
    return profiles_chat.ask_knowledge_memory_chat(question, org_id)


# --- Uncertainty, 14-Step Test & Readiness ---

@router.get("/uncertainty/gaps")
def get_uncertainty_gaps(service: str = Query("checkout_service")):
    return uncertainty_harness.evaluate_uncertainty_and_knowledge_gaps(service)

@router.post("/test-harness/14-step-test")
def run_14_step_test(scenario: str = Body("Production incident on checkout endpoint", embed=True)):
    return uncertainty_harness.execute_14_step_end_to_end_learning_loop_test(scenario)

@router.get("/readiness")
def get_learning_readiness():
    return uncertainty_harness.audit_v63_learning_readiness()
