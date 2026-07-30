import uuid

import pytest
from app.core.database import Base
from app.models.arc import (
    ReleaseValidationSession,
)
from app.models.repository import Repository
from app.models.user import User
from app.services.arc_service import ARCService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_user_and_repo(db_session):
    user_id = str(uuid.uuid4())
    repo_id = str(uuid.uuid4())

    user = User(id=user_id, username="arc_tester", email="arc@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="ARCTestRepo",
        full_name="user/ARCTestRepo",
        clone_url="https://github.com/user/ARCTestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()

    return user, repo


def test_release_validation_and_readiness_score(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ARCService(db=db_session)

    res = service.validate_release(repository_id=repo.id, release_version="v3.2.0")
    assert res["overall_readiness_score"] == 94.0
    assert res["deployment_risk_level"] == "LOW"

    sessions = (
        db_session.query(ReleaseValidationSession)
        .filter(ReleaseValidationSession.repository_id == repo.id)
        .all()
    )
    assert len(sessions) == 1


def test_multi_team_approvals_and_global_control_center(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ARCService(db=db_session)

    approvals = service.get_multi_team_approvals(
        repository_id=repo.id, release_version="v3.2.0"
    )
    assert approvals["devops_approved"] is True
    assert approvals["security_approved"] is True
    assert len(approvals["approvals_json"]) == 4

    gcc = service.get_global_control_center(
        repository_id=repo.id, release_version="v3.2.0"
    )
    assert gcc["release_conflicts_detected"] == 0
    assert gcc["blue_green_deployment_recommended"] is True
    assert gcc["global_status"] == "CLEARED_FOR_GLOBAL_ROLLOUT"


def test_executive_summary_and_dr_readiness(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ARCService(db=db_session)

    exec_summary = service.generate_executive_deployment_summary(
        repository_id=repo.id, release_version="v3.2.0"
    )
    assert exec_summary["engineering_confidence_score"] == 96.0

    dr = service.validate_disaster_recovery_and_multi_region(
        repository_id=repo.id, release_version="v3.2.0"
    )
    assert dr["multi_region_active_active"] is True


def test_api_breaking_changes_and_db_migration(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ARCService(db=db_session)

    breaking = service.detect_breaking_changes(
        repository_id=repo.id, release_version="v3.2.0"
    )
    assert breaking["breaking_changes_found"] >= 1


def test_signature_ai_deployment_control_tower(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ARCService(db=db_session)

    ct = service.get_control_tower_data(repository_id=repo.id, release_version="v3.2.0")
    assert ct["overall_readiness"] == 94.0
    assert ct["confidence"] == 96.0
