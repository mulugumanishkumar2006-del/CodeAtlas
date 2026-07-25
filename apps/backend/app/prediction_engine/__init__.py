# apps/backend/app/prediction_engine/__init__.py

from app.prediction_engine.ai_arch_evolution import AIArchitectureEvolutionAdvisor
from app.prediction_engine.ai_strategic_planner import AIStrategicPlannerEngine
from app.prediction_engine.architecture_evolution import ArchitectureEvolutionPredictor
from app.prediction_engine.architecture_forecast import ArchitectureForecastAI
from app.prediction_engine.cloud_cost_forecast import CloudCostForecastEngine
from app.prediction_engine.dependency_risk import DependencyFutureRiskPredictor
from app.prediction_engine.engineering_calendar import EngineeringCalendarPredictor
from app.prediction_engine.engineering_time_machine import EngineeringTimeMachineEngine
from app.prediction_engine.experiment_simulator import AIExperimentSimulator
from app.prediction_engine.explainable_predictions import ExplainablePredictionsEngine
from app.prediction_engine.failure_chain_simulator import FailureChainSimulator
from app.prediction_engine.future_dependency_graph import FutureDependencyGraphEngine
from app.prediction_engine.future_digital_twin import FutureDigitalTwinEngine
from app.prediction_engine.growth_ai import GrowthAI
from app.prediction_engine.incident_ai import IncidentAI
from app.prediction_engine.incident_predictor import IncidentPredictionAI
from app.prediction_engine.knowledge_decay import KnowledgeDecayPredictor
from app.prediction_engine.maintainability_forecast import MaintainabilityForecastEngine
from app.prediction_engine.monolith_risk import MonolithRiskPredictor
from app.prediction_engine.performance_prediction import PerformancePredictionEngine
from app.prediction_engine.refactoring_deadline import RefactoringDeadlinePredictor
from app.prediction_engine.repo_future_forecast import RepoFutureForecastEngine
from app.prediction_engine.scaling_timeline import ScalingTimelineEngine
from app.prediction_engine.team_growth_planner import TeamGrowthPlanner
from app.prediction_engine.tech_debt_ai import TechnicalDebtAI
from app.prediction_engine.tech_debt_growth import TechDebtGrowthSimulator
from app.prediction_engine.tech_obsolescence import TechObsolescenceDetector
from app.prediction_engine.timeline import FutureEngineeringTimeline

__all__ = [
    "ArchitectureForecastAI",
    "TechnicalDebtAI",
    "IncidentAI",
    "GrowthAI",
    "FutureEngineeringTimeline",
    "RepoFutureForecastEngine",
    "ArchitectureEvolutionPredictor",
    "TechDebtGrowthSimulator",
    "IncidentPredictionAI",
    "TeamGrowthPlanner",
    "PerformancePredictionEngine",
    "CloudCostForecastEngine",
    "AIArchitectureEvolutionAdvisor",
    "TechObsolescenceDetector",
    "DependencyFutureRiskPredictor",
    "FailureChainSimulator",
    "KnowledgeDecayPredictor",
    "RefactoringDeadlinePredictor",
    "ScalingTimelineEngine",
    "AIStrategicPlannerEngine",
    "MaintainabilityForecastEngine",
    "MonolithRiskPredictor",
    "AIExperimentSimulator",
    "FutureDependencyGraphEngine",
    "EngineeringCalendarPredictor",
    "FutureDigitalTwinEngine",
    "ExplainablePredictionsEngine",
    "EngineeringTimeMachineEngine",
]
