# apps/backend/app/api/v1/prediction_router.py

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.prediction_engine.ai_arch_evolution import AIArchitectureEvolutionAdvisor
from app.prediction_engine.architecture_evolution import ArchitectureEvolutionPredictor
from app.prediction_engine.architecture_forecast import ArchitectureForecastAI
from app.prediction_engine.cloud_cost_forecast import CloudCostForecastEngine
from app.prediction_engine.dependency_risk import DependencyFutureRiskPredictor
from app.prediction_engine.failure_chain_simulator import FailureChainSimulator
from app.prediction_engine.growth_ai import GrowthAI
from app.prediction_engine.incident_ai import IncidentAI
from app.prediction_engine.incident_predictor import IncidentPredictionAI
from app.prediction_engine.knowledge_decay import KnowledgeDecayPredictor
from app.prediction_engine.performance_prediction import PerformancePredictionEngine
from app.prediction_engine.refactoring_deadline import RefactoringDeadlinePredictor
from app.prediction_engine.repo_future_forecast import RepoFutureForecastEngine
from app.prediction_engine.team_growth_planner import TeamGrowthPlanner
from app.prediction_engine.tech_debt_ai import TechnicalDebtAI
from app.prediction_engine.tech_debt_growth import TechDebtGrowthSimulator
from app.prediction_engine.tech_obsolescence import TechObsolescenceDetector
from app.prediction_engine.timeline import FutureEngineeringTimeline

router = APIRouter(
    prefix="/prediction", tags=["Engineering Prediction Engine (Future Intelligence)"]
)


@router.get("/performance-prediction")
def get_performance_prediction(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return PerformancePredictionEngine().predict_performance(db)


@router.get("/cloud-cost-forecast")
def get_cloud_cost_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return CloudCostForecastEngine().forecast_cloud_costs(db)


@router.get("/ai-architecture-evolution")
def get_ai_architecture_evolution(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return AIArchitectureEvolutionAdvisor().suggest_architecture_evolution(db)


@router.get("/tech-obsolescence")
def get_tech_obsolescence(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechObsolescenceDetector().detect_obsolescence(db)


@router.get("/dependency-future-risk")
def get_dependency_future_risk(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return DependencyFutureRiskPredictor().predict_dependency_risks(db)


@router.get("/simulate-failure-chain")
def simulate_failure_chain(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return FailureChainSimulator().simulate_failure_chain(db)


@router.get("/knowledge-decay")
def get_knowledge_decay(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return KnowledgeDecayPredictor().predict_knowledge_decay(db)


@router.get("/refactoring-deadlines")
def get_refactoring_deadlines(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RefactoringDeadlinePredictor().predict_refactoring_deadlines(db)


@router.get("/repo-future-forecast")
def get_repo_future_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RepoFutureForecastEngine().forecast_repo_future(db)


@router.get("/architecture-evolution")
def get_architecture_evolution(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ArchitectureEvolutionPredictor().forecast_architecture_evolution(db)


@router.get("/tech-debt-growth")
def get_tech_debt_growth(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechDebtGrowthSimulator().simulate_tech_debt_growth(db)


@router.get("/incident-predictions")
def get_incident_predictions(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return IncidentPredictionAI().predict_incidents(db)


@router.get("/team-growth-planner")
def get_team_growth_planner(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TeamGrowthPlanner().plan_team_growth(db)


@router.get("/architecture-forecast")
def get_architecture_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ArchitectureForecastAI().forecast_architecture(db)


@router.get("/tech-debt-forecast")
def get_tech_debt_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechnicalDebtAI().forecast_tech_debt(db)


@router.get("/incident-risk-forecast")
def get_incident_risk_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return IncidentAI().forecast_incidents(db)


@router.get("/growth-forecast")
def get_growth_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GrowthAI().forecast_growth(db)


@router.get("/future-timeline")
def get_future_timeline(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return FutureEngineeringTimeline().generate_future_timeline(db)


@router.get("/rewrite-recommendations")
def get_rewrite_recommendations(db: Session = Depends(get_db)) -> Dict[str, Any]:
    debt_data = TechnicalDebtAI().forecast_tech_debt(db)
    return {"rewrite_recommendations": debt_data.get("rewrite_advisor", [])}
