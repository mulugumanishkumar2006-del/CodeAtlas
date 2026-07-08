from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.architecture import (
    ArchitectureBaseline,
    ArchitectureViolation,
    ComplianceHistory,
    GovernancePolicy,
)
from app.models.repository import Repository
from app.models.user import User
from app.schemas.architecture import (
    ArchitectureDriftReportResponse,
    ArchitectureRulesSchema,
    BaselineRequest,
    DriftTimelinePoint,
    EnterprisePolicyReportResponse,
    PoliciesListRequest,
    PRArchitectureReviewResponse,
    PRReviewRequest,
)
from app.services.drift_detection_service import DriftDetectionService

router = APIRouter()
drift_service = DriftDetectionService()


def validate_repository_access(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


@router.get(
    "/repositories/{repo_id}/architecture/drift",
    response_model=ArchitectureDriftReportResponse,
)
def get_architecture_drift_report(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        report = drift_service.detect_drift(db, repo_id)
        return report
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate architectural drift: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/architecture/drift/timeline",
    response_model=List[DriftTimelinePoint],
)
def get_architecture_drift_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        timeline = drift_service.get_drift_timeline(db, repo_id)
        return timeline
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load architectural drift timeline: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/architecture/rules",
    response_model=ArchitectureRulesSchema,
)
def get_architecture_rules(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        rules = drift_service.load_rules(repo_id)
        return rules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load architectural rules: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/architecture/rules",
    response_model=ArchitectureRulesSchema,
)
def update_architecture_rules(
    repo_id: str,
    rules: ArchitectureRulesSchema,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        drift_service.save_rules(repo_id, rules.model_dump())
        return rules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save architectural rules: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/architecture/pr/review",
    response_model=PRArchitectureReviewResponse,
)
def get_pr_architecture_review(
    repo_id: str,
    base_sha: str,
    head_sha: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        review = drift_service.analyze_pr_architecture(db, repo_id, base_sha, head_sha)
        return review
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze Pull Request architecture: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/architecture/policies",
    response_model=EnterprisePolicyReportResponse,
)
def get_enterprise_policy_report(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        report = drift_service.get_enterprise_policy_report(db, repo_id)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load enterprise policies report: {str(e)}",
        )


@router.post("/repositories/{repo_id}/architecture/baseline")
def set_architecture_baseline(
    repo_id: str,
    req: BaselineRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    db.query(ArchitectureBaseline).filter(
        ArchitectureBaseline.repo_id == repo_id
    ).delete()
    new_baseline = ArchitectureBaseline(
        repo_id=repo_id, architecture_type=req.architecture_type
    )
    db.add(new_baseline)
    db.commit()
    return {"status": "success", "message": "Baseline set to " + req.architecture_type}


@router.post(
    "/repositories/{repo_id}/architecture/analyze",
    response_model=ArchitectureDriftReportResponse,
)
def trigger_architecture_analysis(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        report = drift_service.detect_drift(db, repo_id)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze repository architecture: {str(e)}",
        )


@router.get("/repositories/{repo_id}/architecture/compliance")
def get_architecture_compliance(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    latest = (
        db.query(ComplianceHistory)
        .filter(ComplianceHistory.repo_id == repo_id)
        .order_by(ComplianceHistory.timestamp.desc())
        .first()
    )
    score = latest.compliance_score if latest else 100.0
    status_val = (
        "Healthy" if score >= 90.0 else ("Warning" if score >= 70.0 else "Critical")
    )
    grade = (
        "A+"
        if score >= 90.0
        else ("B" if score >= 80.0 else ("C" if score >= 70.0 else "F"))
    )

    viols = (
        db.query(ArchitectureViolation)
        .filter(ArchitectureViolation.repo_id == repo_id)
        .all()
    )
    return {
        "compliance_score": score,
        "status": status_val,
        "grade": grade,
        "total_violations": len(viols),
        "critical_violations": sum(1 for v in viols if v.severity == "critical"),
        "warning_violations": sum(1 for v in viols if v.severity == "warning"),
    }


@router.get("/repositories/{repo_id}/architecture/violations")
def get_logged_violations(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    viols = (
        db.query(ArchitectureViolation)
        .filter(ArchitectureViolation.repo_id == repo_id)
        .all()
    )
    return [
        {
            "id": v.id,
            "violation_type": v.violation_type,
            "severity": v.severity,
            "source_entity": v.source_entity,
            "target_entity": v.target_entity,
            "detected_at": v.detected_at.isoformat() if v.detected_at else None,
        }
        for v in viols
    ]


@router.get(
    "/repositories/{repo_id}/architecture/governance",
    response_model=EnterprisePolicyReportResponse,
)
def get_governance_policies_report(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return drift_service.get_enterprise_policy_report(db, repo_id)


@router.post("/repositories/{repo_id}/architecture/policies")
def configure_policies(
    repo_id: str,
    req: PoliciesListRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    db.query(GovernancePolicy).filter(
        GovernancePolicy.organization_id == req.organization_id
    ).delete()
    for p in req.policies:
        pol = GovernancePolicy(
            organization_id=req.organization_id,
            policy_name=p.policy_name,
            rule_definition=p.rule_definition,
            enabled=p.enabled,
        )
        db.add(pol)
    db.commit()
    return {
        "status": "success",
        "message": f"Successfully updated {len(req.policies)} policies",
    }


@router.post(
    "/repositories/{repo_id}/pull-request/review",
    response_model=PRArchitectureReviewResponse,
)
def trigger_pr_review(
    repo_id: str,
    req: PRReviewRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    return drift_service.analyze_pr_architecture(
        db, repo_id, req.base_sha, req.head_sha
    )
