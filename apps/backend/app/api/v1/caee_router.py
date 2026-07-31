from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.caee import (
    AIEngineeringIntelligenceResponse,
    ArchitectureEvolutionTimelineResponse,
    ArchitectureGapAnalysisResponse,
    ArchitectureIntelligenceResponse,
    ArchitectureTimeNavigatorResponse,
    CAEEAnalysisRequest,
    CAEEControlCenterResponse,
    CAEESessionResponse,
    CloudInfrastructureEvolutionResponse,
    ContinuousMonitoringStatusResponse,
    EvolutionRiskAnalysisResponse,
    ExecutiveIntelligenceResponse,
    MigrationPlanResponse,
    ServiceEvolutionResponse,
    TargetArchitectureVisionResponse,
    TechnicalDebtEvolutionResponse,
)
from app.services.caee_service import CAEEService

router = APIRouter()


@router.post(
    "/caee/analyze",
    response_model=CAEESessionResponse,
    status_code=status.HTTP_200_OK,
)
def analyze_architecture_evolution(
    req: CAEEAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    Run Continuous Architecture Evolution Engine (CAEE) analysis.
    """
    service = CAEEService(db=db)
    res = service.analyze_architecture_evolution(
        repository_id=req.repository_id,
        target_horizon_years=req.target_horizon_years,
    )
    return res


@router.get(
    "/caee/current-state/{repository_id}",
    response_model=CAEESessionResponse,
    status_code=status.HTTP_200_OK,
)
def get_current_architecture_state(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch current architecture evolution baseline and health scores.
    """
    service = CAEEService(db=db)
    res = service.analyze_architecture_evolution(repository_id=repository_id)
    return res


@router.get(
    "/caee/target-vision/{repository_id}",
    response_model=TargetArchitectureVisionResponse,
    status_code=status.HTTP_200_OK,
)
def get_target_architecture_vision(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch 1-Year, 3-Year, and 5-Year Target Architecture Projections.
    """
    service = CAEEService(db=db)
    res = service.get_target_architecture_vision(repository_id=repository_id)
    return res


@router.get(
    "/caee/gap-analysis/{repository_id}",
    response_model=ArchitectureGapAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
def get_gap_analysis(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch architectural gap analysis and coupling drift items.
    """
    service = CAEEService(db=db)
    res = service.get_gap_analysis(repository_id=repository_id)
    return res


@router.get(
    "/caee/migration-plan/{repository_id}",
    response_model=MigrationPlanResponse,
    status_code=status.HTTP_200_OK,
)
def get_migration_plan(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch phase-by-phase architectural migration plan.
    """
    service = CAEEService(db=db)
    res = service.get_migration_plan(repository_id=repository_id)
    return res


@router.get(
    "/caee/risk-analysis/{repository_id}",
    response_model=EvolutionRiskAnalysisResponse,
    status_code=status.HTTP_200_OK,
)
def get_evolution_risk_analysis(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch architectural evolution risk and blast radius analysis.
    """
    service = CAEEService(db=db)
    res = service.get_evolution_risk_analysis(repository_id=repository_id)
    return res


@router.get(
    "/caee/timeline/{repository_id}",
    response_model=ArchitectureEvolutionTimelineResponse,
    status_code=status.HTTP_200_OK,
)
def get_evolution_timeline(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch quarterly evolution milestones across 1Y, 3Y, 5Y horizons.
    """
    service = CAEEService(db=db)
    res = service.get_evolution_timeline(repository_id=repository_id)
    return res


@router.get(
    "/caee/monitoring/{repository_id}",
    response_model=ContinuousMonitoringStatusResponse,
    status_code=status.HTTP_200_OK,
)
def get_continuous_monitoring_status(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    Fetch continuous architectural drift tracking status.
    """
    service = CAEEService(db=db)
    res = service.get_continuous_monitoring_status(repository_id=repository_id)
    return res


@router.get(
    "/caee/control-center/{repository_id}",
    response_model=CAEEControlCenterResponse,
    status_code=status.HTTP_200_OK,
)
def get_caee_control_center(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    🌟 Signature Feature: CAEE Control Center Data Payload.
    """
    service = CAEEService(db=db)
    res = service.get_caee_control_center(repository_id=repository_id)
    return res


@router.get(
    "/caee/architecture-intelligence/{repository_id}",
    response_model=ArchitectureIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_architecture_intelligence(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 1–5: Architecture Intelligence (Roadmap 6M/1Y/3Y/5Y, Progression, Maturity 0-100, Drift Timeline, Forecast)
    """
    service = CAEEService(db=db)
    res = service.get_architecture_intelligence(repository_id=repository_id)
    return res


@router.get(
    "/caee/service-evolution/{repository_id}",
    response_model=ServiceEvolutionResponse,
    status_code=status.HTTP_200_OK,
)
def get_service_evolution(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 6–10: Service Evolution (Microservice Readiness, Split Planner, Dependency Growth, DDD Validation, Event-Driven Plan)
    """
    service = CAEEService(db=db)
    res = service.get_service_evolution(repository_id=repository_id)
    return res


@router.get(
    "/caee/technical-debt-evolution/{repository_id}",
    response_model=TechnicalDebtEvolutionResponse,
    status_code=status.HTTP_200_OK,
)
def get_technical_debt_evolution(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 11–25: Technical Debt Evolution (Debt Forecast, Modernization, Violations, Layering, Coupling, Cohesion, Modularization, API Gateway)
    """
    service = CAEEService(db=db)
    res = service.get_technical_debt_evolution(repository_id=repository_id)
    return res


@router.get(
    "/caee/cloud-infrastructure-evolution/{repository_id}",
    response_model=CloudInfrastructureEvolutionResponse,
    status_code=status.HTTP_200_OK,
)
def get_cloud_infrastructure_evolution(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 26–40: Cloud & Infrastructure Evolution (K8s, Serverless, Cloud-Native, Multi-Region, DR, HA, HPA, CDN, Edge, Storage, IaC, Observability)
    """
    service = CAEEService(db=db)
    res = service.get_cloud_infrastructure_evolution(repository_id=repository_id)
    return res


@router.get(
    "/caee/ai-engineering-intelligence/{repository_id}",
    response_model=AIEngineeringIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_ai_engineering_intelligence(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 41–55: AI Engineering Intelligence (CTO Recs, Staff Review, Debate, Migration, Cost, Scalability, Reliability, Mentor, Memory, Governance)
    """
    service = CAEEService(db=db)
    res = service.get_ai_engineering_intelligence(repository_id=repository_id)
    return res


@router.get(
    "/caee/executive-intelligence/{repository_id}",
    response_model=ExecutiveIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_executive_intelligence(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 56–70: Executive Intelligence & Global Command Center (ROI, Health, Capability, Maturity, Timeline, OKRs, Sustainability)
    """
    service = CAEEService(db=db)
    res = service.get_executive_intelligence(repository_id=repository_id)
    return res


@router.get(
    "/caee/time-navigator/{repository_id}",
    response_model=ArchitectureTimeNavigatorResponse,
    status_code=status.HTTP_200_OK,
)
def get_architecture_time_navigator(
    repository_id: str,
    timeframe: str = Query("3Y", description="Timeframe: Today, 1Y, 3Y, 5Y"),
    db: Session = Depends(get_db),
):
    """
    🌟 Signature Feature: 🧭 Architecture Time Navigator (Select Today, +1Y, +3Y, +5Y to watch architecture transform visually)
    """
    service = CAEEService(db=db)
    res = service.get_time_navigator(repository_id=repository_id, timeframe=timeframe)
    return res
