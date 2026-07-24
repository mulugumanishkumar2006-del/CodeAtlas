# apps/backend/app/api/v1/council_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.council.consensus_engine import EngineeringCouncilEngine
from app.council.personas import COUNCIL_PERSONAS
from app.models.repository import Repository

router = APIRouter()
council_engine = EngineeringCouncilEngine()


class DeliberationRequest(BaseModel):
    question: str = Field(
        ...,
        description="Developer question or architectural decision proposal for the council",
        example="How do we reduce deployment time from 45 minutes to under 15 minutes?",
    )
    priority_focus: Optional[str] = Field(
        "balanced",
        description="Priority emphasis: 'balanced', 'velocity', 'security', 'reliability', 'cost'",
    )


@router.get(
    "/repositories/{repo_id}/council/personas",
    summary="List all 10 specialized AI Engineering Council personas",
)
def get_council_personas(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    return {
        "repository_id": repo_id,
        "total_personas": len(COUNCIL_PERSONAS),
        "personas": [p.to_dict() for p in COUNCIL_PERSONAS.values()],
    }


@router.post(
    "/repositories/{repo_id}/council/deliberate",
    summary="Run AI Engineering Council deliberation across 10 specialized personas",
)
def deliberate_engineering_council(
    repo_id: str,
    payload: DeliberationRequest,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    if not payload.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question parameter cannot be empty",
        )

    deliberation_result = council_engine.deliberate(
        db=db,
        repo_id=repo_id,
        question=payload.question,
        priority_focus=payload.priority_focus or "balanced",
    )

    return deliberation_result


@router.get(
    "/repositories/{repo_id}/council/cto-review",
    summary="Get specialized AI CTO deep-dive report (Architecture, ROI, Strategy, Growth)",
)
def get_cto_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_cto_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/staff-engineer-review",
    summary="Get specialized AI Staff Engineer review (Code Quality, Design Patterns, Refactoring)",
)
def get_staff_engineer_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_staff_engineer_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/security-review",
    summary="Get specialized AI Security Engineer audit (Vulnerabilities, Secrets, OWASP, Auth)",
)
def get_security_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_security_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/performance-review",
    summary="Get specialized AI Performance Engineer analysis (Memory, CPU, Latency, Caching, DB Queries)",
)
def get_performance_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_performance_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/sre-review",
    summary="Get specialized AI SRE Lead assessment (Reliability, Monitoring, Logging, DR, Availability)",
)
def get_sre_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_sre_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/qa-review",
    summary="Get specialized AI QA Lead audit (Test plans, Missing tests, Edge cases, Regression risks)",
)
def get_qa_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_qa_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/cloud-architect-review",
    summary="Get specialized AI Cloud Architect audit (Kubernetes, Autoscaling, CDN, Storage, Networking)",
)
def get_cloud_architect_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_cloud_architect_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/database-architect-review",
    summary="Get specialized AI Database Architect audit (Schema, Indexes, Query tuning, Partitioning, Replication)",
)
def get_database_architect_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_database_architect_review(db, repo_id)


@router.get(
    "/repositories/{repo_id}/council/product-architect-review",
    summary="Get specialized AI Product Architect audit (Product goals, Customer impact, DX, API Contract)",
)
def get_product_architect_review(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.specialized_reviews import SpecializedCouncilReviews

    reviews = SpecializedCouncilReviews()
    return reviews.generate_product_architect_review(db, repo_id)


@router.post(
    "/repositories/{repo_id}/council/memory",
    summary="Save Engineering Decision Memory (Accepted, Rejected, Deferred)",
)
def save_decision_memory(
    repo_id: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.learning_engine import CouncilLearningEngine

    engine = CouncilLearningEngine()
    rec_id = payload.get("recommendation_id", "rec-1")
    rec_title = payload.get("recommendation_title", "Engineering Decision")
    rec_status = payload.get("status", "Accepted")  # Accepted, Rejected, Deferred
    why = payload.get("why")
    confidence = payload.get("confidence_score", 90.0)

    user_id = current_user.id if hasattr(current_user, "id") else None
    return engine.save_decision_memory(
        db, repo_id, user_id, rec_id, rec_title, rec_status, why, confidence
    )


@router.get(
    "/repositories/{repo_id}/council/memory",
    summary="Get Engineering Decision Memory History",
)
def get_decision_memory(
    repo_id: str,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.learning_engine import CouncilLearningEngine

    engine = CouncilLearningEngine()
    return engine.get_decision_history(db, repo_id)


@router.post(
    "/repositories/{repo_id}/council/learn",
    summary="Learning Engine: Compare recommendations with actual outcomes to improve future advice",
)
def evaluate_learning(
    repo_id: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.learning_engine import CouncilLearningEngine

    engine = CouncilLearningEngine()
    memory_id = payload.get("memory_id")
    actual_outcome = payload.get(
        "actual_outcome", {"actual_latency_reduction_pct": 42.0}
    )
    return engine.evaluate_outcomes_and_learn(db, memory_id, actual_outcome)


@router.post(
    "/repositories/{repo_id}/council/simulate",
    summary="Engineering Simulation: Predict change impact across 10 personas before implementation",
)
def simulate_engineering_change(
    repo_id: str,
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.learning_engine import CouncilLearningEngine

    engine = CouncilLearningEngine()
    proposal = payload.get("proposal", "Deploy Redis caching and session encryption")
    return engine.simulate_engineering_impact(db, repo_id, proposal)


@router.get(
    "/repositories/{repo_id}/council/meeting",
    summary="Feature 18: AI Meeting Generator (Architecture Review Board Meetings)",
)
def get_architecture_meeting(
    repo_id: str,
    question: str = "How do we optimize deployment velocity and backend latency?",
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.enterprise_meeting_engine import EnterpriseMeetingAndConflictEngine

    engine = EnterpriseMeetingAndConflictEngine()
    return engine.generate_architecture_meeting(db, repo_id, question)


@router.get(
    "/repositories/{repo_id}/council/conflicts",
    summary="Feature 19: Cross-Agent Conflict Detection Engine",
)
def get_cross_agent_conflicts(
    repo_id: str,
    question: str = "Deployment and Caching Strategy",
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    from app.council.enterprise_meeting_engine import EnterpriseMeetingAndConflictEngine

    engine = EnterpriseMeetingAndConflictEngine()
    return engine.detect_cross_agent_conflicts(db, repo_id, question)


# -------------------------------------------------------------------------
# Feature 20: Engineering Decision Public External APIs (For CI/CD, Jira, Slack)
# -------------------------------------------------------------------------


@router.post(
    "/external/council/decisions",
    summary="Feature 20: Engineering Decision API (Public API for external CI/CD & Slack integrations)",
)
def external_request_decision(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
):
    """
    Allows external tools (GitHub Actions, Jenkins, Jira, Slack bots) to request recommendations
    and engineering decisions from the AI Engineering Council.
    """
    repo_id = payload.get("repository_id")
    question = payload.get("question", "Assess architectural impact of proposed commit")
    if not repo_id:
        repo = db.query(Repository).first()
        repo_id = repo.id if repo else "test-repo-id"

    from app.council.consensus_engine import EngineeringCouncilEngine

    engine = EngineeringCouncilEngine()
    deliberation = engine.deliberate(db, repo_id, question)

    return {
        "status": "SUCCESS",
        "api_version": "v1.0-external",
        "repository_id": repo_id,
        "question": question,
        "consensus_score": deliberation["consensus_score"],
        "recommended_verdict": deliberation["final_decision"]["verdict_title"],
        "top_recommendation": deliberation["final_decision"]["top_decision"],
        "explainable_recommendations": deliberation["explainable_recommendations"],
    }
