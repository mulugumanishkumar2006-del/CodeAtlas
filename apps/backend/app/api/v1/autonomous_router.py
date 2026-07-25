# apps/backend/app/api/v1/autonomous_router.py

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.autonomous.orchestrator import AutonomousOrchestrator
from app.core.database import get_db
from app.models.repository import Repository

router = APIRouter()
orchestrator = AutonomousOrchestrator()


class PipelineRequest(BaseModel):
    request: str = Field(
        ...,
        description="Engineering request or improvement goal for the autonomous pipeline",
        example="Refactor the analysis service, add missing tests, and update documentation",
    )
    priority_focus: Optional[str] = Field(
        "balanced",
        description="Priority emphasis: 'balanced', 'velocity', 'security', 'reliability', 'quality'",
    )
    use_council: Optional[bool] = Field(
        True,
        description="Whether to run AI Engineering Council deliberation before task planning",
    )


class TaskActionRequest(BaseModel):
    reason: Optional[str] = Field(
        None,
        description="Reason for approval or rejection",
    )


@router.post(
    "/repositories/{repo_id}/autonomous/pipeline",
    summary="Run full autonomous engineering pipeline (Council → Plan → Execute → Validate → PR)",
)
def run_autonomous_pipeline(
    repo_id: str,
    payload: PipelineRequest,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    """
    Triggers the full Autonomous Engineering Pipeline:
    1. AI Engineering Council evaluates the request
    2. Task Planner decomposes into engineering tasks
    3. Execution engines generate code changes
    4. Validation pipeline checks quality
    5. PR Generator creates ready-to-merge pull request
    6. Returns result awaiting human approval
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    if not payload.request.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request text cannot be empty",
        )

    result = orchestrator.execute_autonomous_pipeline(
        db=db,
        repo_id=repo_id,
        request_text=payload.request,
        priority_focus=payload.priority_focus or "balanced",
        use_council=payload.use_council if payload.use_council is not None else True,
    )

    return result


@router.get(
    "/repositories/{repo_id}/autonomous/tasks",
    summary="List all autonomous engineering tasks for a repository",
)
def get_autonomous_tasks(
    repo_id: str,
    pipeline_run_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    tasks = orchestrator.get_pipeline_tasks(db, repo_id, pipeline_run_id)
    return {
        "repository_id": repo_id,
        "pipeline_run_id": pipeline_run_id,
        "total_tasks": len(tasks),
        "tasks": tasks,
    }


@router.get(
    "/repositories/{repo_id}/autonomous/tasks/{task_id}",
    summary="Get single autonomous task detail with diffs and validation",
)
def get_autonomous_task_detail(
    repo_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.models.autonomous_task import AutonomousTask

    task = db.query(AutonomousTask).filter(AutonomousTask.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    return {
        "id": task.id,
        "pipeline_run_id": task.pipeline_run_id,
        "type": task.task_type,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "estimated_effort": task.estimated_effort,
        "confidence_score": task.confidence_score,
        "files_affected": task.files_affected,
        "generated_diff": task.generated_diff,
        "validation_result": task.validation_result,
        "pr_data": task.pr_data,
        "created_at": task.created_at.isoformat() if task.created_at else None,
    }


@router.post(
    "/repositories/{repo_id}/autonomous/tasks/{task_id}/approve",
    summary="Human approves an autonomous engineering task",
)
def approve_autonomous_task(
    repo_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    result = orchestrator.approve_task(db, task_id)
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=result["error"]
        )

    return result


@router.post(
    "/repositories/{repo_id}/autonomous/tasks/{task_id}/reject",
    summary="Human rejects an autonomous engineering task",
)
def reject_autonomous_task(
    repo_id: str,
    task_id: str,
    payload: TaskActionRequest,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    result = orchestrator.reject_task(db, task_id, payload.reason or "")
    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=result["error"]
        )

    return result


@router.get(
    "/repositories/{repo_id}/autonomous/pr/{pipeline_id}",
    summary="Get generated Pull Request for a pipeline run",
)
def get_pipeline_pr(
    repo_id: str,
    pipeline_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.models.autonomous_task import AutonomousTask

    tasks = (
        db.query(AutonomousTask)
        .filter(AutonomousTask.pipeline_run_id == pipeline_id)
        .all()
    )
    if not tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tasks found for this pipeline",
        )

    pr_data = tasks[0].pr_data if tasks[0].pr_data else {}
    return {
        "pipeline_run_id": pipeline_id,
        "repository_id": repo_id,
        "pr_data": pr_data,
        "tasks": [
            {
                "id": t.id,
                "type": t.task_type,
                "title": t.title,
                "status": t.status,
            }
            for t in tasks
        ],
    }


@router.post(
    "/repositories/{repo_id}/autonomous/pr/{pipeline_id}/merge",
    summary="Merge approved autonomous PR (human-triggered only)",
)
def merge_autonomous_pr(
    repo_id: str,
    pipeline_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    result = orchestrator.merge_pipeline(db, pipeline_id)
    return result
