"""
CodeAtlas v3.4 - Intelligence at Scale API Router
Exposes comprehensive REST API endpoints for Canonical Temporal Graph, Engineering Memory,
Semantic Search, Evidence AI, Risk Models, Predictive Forecasters, Priority Recommendations, Simulations, and Health Scoring.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.intelligence_scale.canonical_temporal_graph import CanonicalTemporalGraphEngine
from app.intelligence_scale.engineering_memory import EngineeringMemoryEngine
from app.intelligence_scale.semantic_contextual_search import SemanticContextualSearchEngine, SearchMode
from app.intelligence_scale.evidence_grounded_ai import EvidenceGroundedAIEngine
from app.intelligence_scale.pattern_and_risk_engine import PatternAndRiskEngine
from app.intelligence_scale.predictive_engineering import PredictiveEngineeringEngine
from app.intelligence_scale.recommendation_and_simulation import RecommendationAndSimulationEngine
from app.intelligence_scale.learning_and_copilot import LearningAndCopilotEngine
from app.intelligence_scale.analytics_eval_platform import AnalyticsEvalPlatformEngine

router = APIRouter(prefix="/intelligence-scale", tags=["Intelligence at Scale"])

temporal_graph_engine = CanonicalTemporalGraphEngine()
memory_engine = EngineeringMemoryEngine()
search_engine = SemanticContextualSearchEngine()
evidence_ai_engine = EvidenceGroundedAIEngine()
pattern_risk_engine = PatternAndRiskEngine()
predictive_engine = PredictiveEngineeringEngine()
rec_sim_engine = RecommendationAndSimulationEngine()
learning_copilot_engine = LearningAndCopilotEngine()
analytics_eval_engine = AnalyticsEvalPlatformEngine()


# --- Temporal Graph & Canonical Memory ---

@router.get("/temporal-graph")
def get_temporal_graph_stats():
    return temporal_graph_engine.get_canonical_graph_stats()

@router.get("/temporal-graph/history/{entity_id}")
def get_entity_temporal_history(entity_id: str):
    return temporal_graph_engine.query_temporal_history(entity_id)

@router.get("/memory/incidents")
def search_incident_memory(symptoms: List[str] = Query([]), service: str = Query("payment-service")):
    return memory_engine.search_incident_memory(symptoms, service)

@router.get("/memory/conflicts")
def get_knowledge_conflicts():
    return memory_engine.get_detected_conflicts()

@router.get("/memory/stale")
def get_stale_knowledge():
    return memory_engine.detect_stale_knowledge()


# --- Search & Evidence AI ---

@router.get("/search/nl")
def natural_language_query(query: str = Query(...), mode: str = Query(SearchMode.GENERAL_MODE)):
    return search_engine.execute_natural_language_query(query, mode)

@router.get("/search/graph")
def graph_query(target: str = Query(...), type: str = Query("AFFECTED_BY")):
    return search_engine.execute_graph_query(target, type)

@router.post("/ai/grounded-answer")
def generate_grounded_answer(prompt: str = Body(...), context: List[Dict[str, Any]] = Body([])):
    return evidence_ai_engine.generate_grounded_answer(prompt, context)


# --- Pattern Detection, Risk & Predictive Forecasters ---

@router.get("/patterns")
def detect_patterns():
    return pattern_risk_engine.detect_engineering_patterns()

@router.get("/risk/service/{service_name}")
def get_service_risk_model(service_name: str):
    return pattern_risk_engine.calculate_unified_risk_model(service_name)

@router.get("/risk/blast-radius/{component_name}")
def get_blast_radius(component_name: str):
    return pattern_risk_engine.calculate_blast_radius(component_name)

@router.get("/predict/incidents/{service_name}")
def predict_incidents(service_name: str):
    return predictive_engine.predict_incident_probability(service_name)

@router.get("/forecast/tech-debt")
def forecast_tech_debt(repo: str = Query("payment-service")):
    return predictive_engine.forecast_tech_debt_and_architecture(repo)

@router.get("/forecast/capacity-cost")
def forecast_capacity_cost():
    return predictive_engine.forecast_capacity_and_cost()

@router.get("/forecast/security")
def forecast_security():
    return predictive_engine.forecast_security_trends()


# --- Recommendations & Simulation Studio ---

@router.get("/recommendations")
def get_prioritized_recommendations():
    return rec_sim_engine.get_recommendations()

@router.post("/simulation/scenario")
def run_simulation(type: str = Body(...), target: str = Body(...)):
    return rec_sim_engine.simulate_change(type, target)

@router.post("/simulation/architecture-compare")
def compare_architectures(current_arch: str = Body(...), proposed_arch: str = Body(...)):
    return rec_sim_engine.compare_architectures(current_arch, proposed_arch)


# --- Copilot, Feeds & Profiles ---

@router.get("/copilot/feed")
def get_intelligence_feed():
    return learning_copilot_engine.get_proactive_feed()

@router.get("/copilot/daily-brief")
def get_daily_brief():
    return learning_copilot_engine.generate_daily_brief()

@router.get("/profiles/service/{service_name}")
def get_service_profile(service_name: str):
    return learning_copilot_engine.get_service_intelligence_profile(service_name)


# --- Health Scoring & AI Eval ---

@router.get("/health-score")
def get_health_score():
    return analytics_eval_engine.calculate_overall_engineering_health_score()

@router.get("/analytics/graph")
def get_graph_analytics():
    return analytics_eval_engine.calculate_graph_analytics()

@router.get("/ai/eval-metrics")
def get_ai_eval_metrics():
    return analytics_eval_engine.get_ai_eval_metrics()

@router.get("/data/lineage")
def get_data_lineage(asset: str = Query("Temporal Knowledge Graph")):
    return analytics_eval_engine.get_data_lineage(asset)
