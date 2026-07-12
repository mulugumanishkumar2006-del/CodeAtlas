from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.advisor import (
    ADRReport,
    AIReviewReport,
    CouplingReport,
    MultiLevelReport,
    PatternAdvisoryReport,
    RefactoringAdvisoryReport,
    ScalabilityReport,
    SprintReport,
)
from app.schemas.architect import (
    ArchitectReportResponse,
    ArchitectSummaryResponse,
    ArchitectureCopilotReport,
    DashboardResponse,
    DashboardSprintTask,
    RoadmapMilestone,
    RoadmapResponse,
)
from app.services.adr_generator import AdrGeneratorService
from app.services.ai_engineering_review import AiEngineeringReviewService
from app.services.architect_service import ArchitectService
from app.services.architecture_copilot import ArchitectureCopilotService
from app.services.coupling_reduction_advisor import CouplingReductionAdvisorService
from app.services.design_pattern_advisor import DesignPatternAdvisorService
from app.services.multi_level_recommendation import MultiLevelRecommendationService
from app.services.refactoring_advisor import RefactoringAdvisorService
from app.services.scalability_advisor import ScalabilityAdvisorService
from app.services.sprint_recommendation import SprintRecommendationService

router = APIRouter()
architect_service = ArchitectService()
pattern_advisor = DesignPatternAdvisorService()
scalability_advisor = ScalabilityAdvisorService()
refactoring_advisor = RefactoringAdvisorService()
coupling_advisor = CouplingReductionAdvisorService()
adr_generator = AdrGeneratorService()
sprint_service = SprintRecommendationService()
multi_level_service = MultiLevelRecommendationService()
copilot_service = ArchitectureCopilotService()
review_service = AiEngineeringReviewService()


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


# ---------------------------------------------------------------------------
# Feature 1 & 2 — Recommendations
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/recommendations",
    response_model=ArchitectReportResponse,
    summary="Generate full architecture recommendation report (Feature 1 & 2)",
    tags=["architect"],
)
def get_architecture_recommendations(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return architect_service.get_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Recommendations failed: {str(e)}")


@router.get(
    "/repositories/{repo_id}/architect/summary",
    response_model=ArchitectSummaryResponse,
    summary="Lightweight summary — category counts + verdict",
    tags=["architect"],
)
def get_architecture_summary(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return architect_service.get_summary(db, repo_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary failed: {str(e)}")


# ---------------------------------------------------------------------------
# Feature 3 — Design Pattern Advisor
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/patterns",
    response_model=PatternAdvisoryReport,
    summary="Design Pattern Advisor — 11 patterns analysed against the codebase (Feature 3)",
    description=(
        "Analyses the repository knowledge graph against 11 design patterns "
        "(Repository, Factory, Strategy, Observer, Adapter, Facade, DI, CQRS, "
        "Event Sourcing, Saga, Circuit Breaker) and returns: why, where, "
        "benefits, drawbacks, and implementation hints."
    ),
    tags=["architect"],
)
def get_pattern_advisories(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return pattern_advisor.get_advisories(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Pattern analysis failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 4 — Scalability Advisor
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/scalability",
    response_model=ScalabilityReport,
    summary="Scalability Advisor — 9 bottleneck detectors (Feature 4)",
    description=(
        "Detects scalability bottlenecks (Caching, CDN, Load Balancer, Queue, Read Replica, "
        "Database Partitioning, Sharding, Service Mesh, Horizontal Scaling) "
        "and provides step-by-step implementation guidance."
    ),
    tags=["architect"],
)
def get_scalability_advisories(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return scalability_advisor.get_advisories(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Scalability analysis failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 5 — Refactoring Advisor
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/refactoring",
    response_model=RefactoringAdvisoryReport,
    summary="Refactoring Advisor — Decomposition plan generator (Feature 5)",
    description="Generates a structured component split plan for complex God Modules/monolith services.",
    tags=["architect"],
)
def get_refactoring_advisories(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return refactoring_advisor.get_plans(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Refactoring plans failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 6 — Coupling Reduction Advisor
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/coupling",
    response_model=CouplingReport,
    summary="Coupling Reduction Advisor — Detects coupling issues and suggests fixes (Feature 6)",
    description="Identifies circular dependencies, God Objects, high coupling, and large modules.",
    tags=["architect"],
)
def get_coupling_advisories(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return coupling_advisor.get_coupling_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Coupling analysis failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 7 — Architecture Decision Generator (ADR)
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/adrs",
    response_model=ADRReport,
    summary="Architecture Decision Generator — Auto ADRs (Feature 7)",
    description="Generates ADRs automatically based on detected database bottlenecks and service boundaries.",
    tags=["architect"],
)
def get_adr_proposals(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return adr_generator.get_adr_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"ADR generation failed: {str(e)}")


# ---------------------------------------------------------------------------
# Feature 8 — AI Engineering Review
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/review",
    response_model=AIReviewReport,
    summary="AI Engineering Review — Health audit report (Feature 8)",
    description="Generates a full codebase engineering review specifying strengths, weaknesses, and concrete recommendations.",
    tags=["architect"],
)
def get_engineering_review(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return review_service.get_review_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Engineering review failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 9 — Sprint Recommendation Engine
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/sprints",
    response_model=SprintReport,
    summary="Sprint Recommendation Engine — Prioritize engineering work (Feature 9)",
    description="Groups refactoring and database tasks into sprints (e.g. Sprint 14, estimated days, expected improvements).",
    tags=["architect"],
)
def get_sprint_recommendations(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return sprint_service.get_sprint_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Sprint generation failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Feature 10 — Multi-Level Recommendation
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/multi-level",
    response_model=MultiLevelReport,
    summary="Multi-Level Recommendation — Nested boundaries advice (Feature 10)",
    description="Provides scoped advice at Function, Class, Module, Service, Repository, and Enterprise boundaries.",
    tags=["architect"],
)
def get_multi_level_recommendations(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return multi_level_service.get_multi_level_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Multi-level recommendations failed: {str(e)}"
        )


# ---------------------------------------------------------------------------
# Dynamic Analysis and Orchestration Endpoints
# ---------------------------------------------------------------------------


@router.post(
    "/repositories/{repo_id}/architect/analyze",
    summary="Trigger full rule-based and MCDA architecture analysis (Feature 12 / Algorithms)",
    tags=["architect"],
)
def analyze_repository(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return architect_service.analyze(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post(
    "/repositories/{repo_id}/architect/roadmap",
    response_model=RoadmapResponse,
    summary="Interactive architecture improvement roadmap (Feature 12)",
    tags=["architect"],
)
def get_architecture_roadmap(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        report = architect_service.get_report(db, repo_id)
        milestones = []
        phase = 1
        for rec in report.recommendations[:4]:
            milestones.append(
                RoadmapMilestone(
                    id=f"ms_{rec.id}",
                    phase=phase,
                    title=rec.title,
                    description=rec.expected_impact or rec.reason,
                    priority=rec.priority,
                    estimated_days=10 if rec.priority == 1 else 5,
                    dependencies=(
                        []
                        if phase == 1
                        else [f"ms_{report.recommendations[phase-2].id}"]
                    ),
                    risk=rec.risk.value,
                )
            )
            phase += 1
        return RoadmapResponse(repo_id=repo_id, milestones=milestones)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Roadmap failed: {str(e)}")


@router.get(
    "/repositories/{repo_id}/architect/dashboard",
    response_model=DashboardResponse,
    summary="Executive Dashboard metrics (Feature 12)",
    tags=["architect"],
)
def get_architecture_dashboard(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        report = architect_service.get_report(db, repo_id)
        sprints = sprint_service.get_sprint_report(db, repo_id)

        top_rec = report.top_priority_recommendation or (
            report.recommendations[0] if report.recommendations else None
        )
        active_recs = len(report.recommendations)
        priority_score = top_rec.composite_priority_score if top_rec else 86.0
        health_improvement = top_rec.health_improvement_pct if top_rec else 18.0
        risk_reduction = top_rec.risk_reduction_score if top_rec else 97.0

        est_cost = "4 Weeks"
        try:
            from app.services.refactoring_advisor import RefactoringAdvisorService

            ref_service = RefactoringAdvisorService()
            ref_rep = ref_service.get_refactoring_report(db, repo_id)
            if ref_rep.plans:
                est_cost = f"{ref_rep.total_effort_weeks} Weeks"
        except Exception:
            pass

        suggested_sprint = "Sprint 14"
        sprint_tasks = []
        if sprints.sprints:
            suggested_sprint = sprints.sprints[0].sprint_name
            for t in sprints.sprints[0].tasks:
                sprint_tasks.append(
                    DashboardSprintTask(
                        title=t.title, priority=t.priority_level, days=t.estimated_days
                    )
                )

        return DashboardResponse(
            repo_id=repo_id,
            active_recommendations=active_recs,
            priority_score=priority_score,
            health_improvement_potential=health_improvement,
            risk_reduction=risk_reduction,
            estimated_engineering_cost=est_cost,
            suggested_sprint_plan=suggested_sprint,
            sprint_tasks=sprint_tasks,
            health_history=[72.0, 75.0, 78.0, 86.0],
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Dashboard failed: {str(e)}")


@router.get(
    "/repositories/{repo_id}/architect/sprint-plan",
    response_model=SprintReport,
    summary="Sprint Recommendation Engine (Feature 9 Alias)",
    tags=["architect"],
)
def get_sprint_plan(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return get_sprint_recommendations(repo_id, db, user)


# ---------------------------------------------------------------------------
# Feature 11 — Flagship Architecture Copilot Proactive Insights
# ---------------------------------------------------------------------------


@router.get(
    "/repositories/{repo_id}/architect/copilot",
    response_model=ArchitectureCopilotReport,
    summary="Architecture Copilot proactive alerts (Feature 11 Flagship)",
    description="Proactively compiles weekly reviews and high-priority refactoring opportunities.",
    tags=["architect"],
)
def get_copilot_alerts(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return copilot_service.get_copilot_report(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Copilot failed: {str(e)}")
