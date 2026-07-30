from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.are import (
    ADRResponse,
    AIRefactoringStudioSessionResponse,
    ArchitectureMigrationResponse,
    CycleEliminationRequest,
    CycleEliminationResponse,
    DeadCodeRequest,
    DeadCodeResponse,
    DependencyCleanupRequest,
    DependencyCleanupResponse,
    DuplicateIntelligenceRequest,
    DuplicateIntelligenceResponse,
    GeneratePRRequest,
    GeneratePRResponse,
    LayerValidationResponse,
    MonolithDecompositionRequest,
    MonolithDecompositionResponse,
    NamingIntelligenceResponse,
    PlanGenerationRequest,
    PriorityEvaluationRequest,
    PriorityEvaluationResponse,
    RefactoringPlanResponse,
    RefactoringScanRequest,
    RefactoringScanResponse,
    RoadmapResponse,
    RollbackPlannerResponse,
    SimulationRequest,
    SimulationResponse,
    StaticSmellExplorerResponse,
)
from app.services.are_service import AREService

router = APIRouter()


@router.post(
    "/are/scan",
    response_model=RefactoringScanResponse,
    status_code=status.HTTP_200_OK,
)
def scan_repository(
    req: RefactoringScanRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 1 & 15: Repository Refactoring Scanner & Cleanup Score
    """
    service = AREService(db=db)
    res = service.scan_repository(
        repository_id=req.repository_id,
        target_path=req.target_path,
        deep_ast_analysis=req.deep_ast_analysis,
    )
    return res


@router.post(
    "/are/plan",
    response_model=RefactoringPlanResponse,
    status_code=status.HTTP_200_OK,
)
def generate_plan(
    req: PlanGenerationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 2: AI Refactoring Planner
    """
    service = AREService(db=db)
    res = service.generate_plan(
        repository_id=req.repository_id,
        timeframe_weeks=req.timeframe_weeks,
        focus_areas=req.focus_areas,
    )
    return res


@router.get(
    "/are/roadmap/{repository_id}",
    response_model=RoadmapResponse,
    status_code=status.HTTP_200_OK,
)
def get_roadmap(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 3: Repository Modernization Roadmap
    """
    service = AREService(db=db)
    res = service.get_roadmap(repository_id=repository_id)
    return res


@router.post(
    "/are/priority",
    response_model=PriorityEvaluationResponse,
    status_code=status.HTTP_200_OK,
)
def prioritize_opportunities(
    req: PriorityEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 4: Refactoring Priority Engine
    """
    service = AREService(db=db)
    res = service.prioritize_opportunities(
        repository_id=req.repository_id,
        opportunity_ids=req.opportunity_ids,
    )
    return res


@router.post(
    "/are/simplify",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def simplify_architecture(
    req: PriorityEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 5: Architecture Simplifier
    """
    service = AREService(db=db)
    res = service.simplify_architecture(repository_id=req.repository_id)
    return res


@router.post(
    "/are/decompose-monolith",
    response_model=MonolithDecompositionResponse,
    status_code=status.HTTP_200_OK,
)
def decompose_monolith(
    req: MonolithDecompositionRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 6: Monolith Decomposer
    """
    service = AREService(db=db)
    res = service.decompose_monolith(
        repository_id=req.repository_id,
        target_monolith_module=req.target_monolith_module or "apps/backend",
        preferred_architecture=req.preferred_architecture,
    )
    return res


@router.post(
    "/are/eliminate-cycles",
    response_model=CycleEliminationResponse,
    status_code=status.HTTP_200_OK,
)
def eliminate_cycles(
    req: CycleEliminationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 7: Circular Dependency Eliminator
    """
    service = AREService(db=db)
    res = service.eliminate_circular_dependencies(repository_id=req.repository_id)
    return res


@router.post(
    "/are/duplicate-intelligence",
    response_model=DuplicateIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def duplicate_code_intelligence(
    req: DuplicateIntelligenceRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 8: Duplicate Code Intelligence
    """
    service = AREService(db=db)
    res = service.duplicate_code_intelligence(
        repository_id=req.repository_id,
        min_duplicate_lines=req.min_duplicate_lines,
    )
    return res


@router.post(
    "/are/dependency-cleanup",
    response_model=DependencyCleanupResponse,
    status_code=status.HTTP_200_OK,
)
def dependency_cleanup(
    req: DependencyCleanupRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 9: Dependency Cleanup Engine
    """
    service = AREService(db=db)
    res = service.dependency_cleanup(repository_id=req.repository_id)
    return res


@router.post(
    "/are/dead-code",
    response_model=DeadCodeResponse,
    status_code=status.HTTP_200_OK,
)
def dead_code_eliminator(
    req: DeadCodeRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 10: Dead Code Eliminator
    """
    service = AREService(db=db)
    res = service.dead_code_eliminator(repository_id=req.repository_id)
    return res


@router.get(
    "/are/naming/{repository_id}",
    response_model=NamingIntelligenceResponse,
    status_code=status.HTTP_200_OK,
)
def naming_intelligence(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 11: Naming Intelligence
    """
    service = AREService(db=db)
    res = service.naming_intelligence(repository_id=repository_id)
    return res


@router.get(
    "/are/layer-validation/{repository_id}",
    response_model=LayerValidationResponse,
    status_code=status.HTTP_200_OK,
)
def validate_layers(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 12: Layer Validation Engine
    """
    service = AREService(db=db)
    res = service.validate_layers(repository_id=repository_id)
    return res


@router.get(
    "/are/static-smells/{repository_id}",
    response_model=StaticSmellExplorerResponse,
    status_code=status.HTTP_200_OK,
)
def static_smell_explorer(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 16–30: Static Code Smell Explorer
    """
    service = AREService(db=db)
    res = service.static_smell_explorer(repository_id=repository_id)
    return res


@router.post(
    "/are/adr",
    response_model=ADRResponse,
    status_code=status.HTTP_200_OK,
)
def generate_adr(
    req: PriorityEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 32: Automatic Architecture Decision Record (ADR) Generator
    """
    service = AREService(db=db)
    res = service.generate_adr(repository_id=req.repository_id)
    return res


@router.get(
    "/are/rollback/{repository_id}",
    response_model=RollbackPlannerResponse,
    status_code=status.HTTP_200_OK,
)
def rollback_planner(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 33: Safe Rollback Planner
    """
    service = AREService(db=db)
    res = service.rollback_planner(repository_id=repository_id)
    return res


@router.post(
    "/are/architecture-migration",
    response_model=ArchitectureMigrationResponse,
    status_code=status.HTTP_200_OK,
)
def architecture_migration(
    req: PriorityEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Features 46–55: Clean Architecture & Hexagonal Architecture Migration
    """
    service = AREService(db=db)
    res = service.architecture_migration_planner(repository_id=req.repository_id)
    return res


@router.post(
    "/are/simulate",
    response_model=SimulationResponse,
    status_code=status.HTTP_200_OK,
)
def simulate_refactoring(
    req: SimulationRequest,
    db: Session = Depends(get_db),
):
    """
    Simulates refactoring execution, safety validation, and risk score prediction.
    """
    service = AREService(db=db)
    res = service.simulate_refactoring(
        repository_id=req.repository_id,
        opportunity_id=req.opportunity_id,
        apply_pattern=req.apply_pattern,
    )
    return res


@router.post(
    "/are/studio",
    response_model=AIRefactoringStudioSessionResponse,
    status_code=status.HTTP_200_OK,
)
def run_ai_refactoring_studio(
    req: PriorityEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    🌟 Signature Feature: AI Refactoring Studio
    Simulates full repository transformation from 72% health -> 93% health across 4 sprints.
    """
    service = AREService(db=db)
    res = service.run_ai_refactoring_studio(repository_id=req.repository_id)
    return res


@router.post(
    "/are/generate-pr",
    response_model=GeneratePRResponse,
    status_code=status.HTTP_200_OK,
)
def generate_pull_request(
    req: GeneratePRRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Feature 31: AI Pull Request Generator
    """
    service = AREService(db=db)
    res = service.generate_pull_request(
        repository_id=req.repository_id,
        simulation_id=req.simulation_id,
        target_branch=req.target_branch,
    )
    return res
