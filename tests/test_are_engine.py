import uuid

import pytest
from app.core.database import Base
from app.models.are import (
    ArchitectureDecisionRecord,
    RefactoringScanReport,
    RefactoringStudioSession,
)
from app.models.repository import Repository
from app.models.user import User
from app.services.are_service import AREService
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

    user = User(id=user_id, username="are_tester", email="are@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="ARETestRepo",
        full_name="user/ARETestRepo",
        clone_url="https://github.com/user/ARETestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()

    return user, repo


def test_repository_refactoring_scanner(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    scan_res = service.scan_repository(repository_id=repo.id)
    assert scan_res["scan_status"] == "completed"
    assert scan_res["total_opportunities_found"] >= 6
    assert scan_res["god_classes_count"] >= 1
    assert scan_res["circular_deps_count"] >= 1
    assert scan_res["repository_cleanup_score"] > 70.0

    reports = (
        db_session.query(RefactoringScanReport)
        .filter(RefactoringScanReport.repository_id == repo.id)
        .all()
    )
    assert len(reports) == 1


def test_ai_refactoring_planner(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    plan = service.generate_plan(repository_id=repo.id, timeframe_weeks=4)
    assert plan["total_stages"] == 4
    assert plan["total_estimated_roi_pct"] > 100.0


def test_naming_intelligence_and_layer_validation(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    naming = service.naming_intelligence(repository_id=repo.id)
    assert len(naming["class_name_recommendations"]) >= 1

    layers = service.validate_layers(repository_id=repo.id)
    assert len(layers["layer_hierarchy"]) == 4
    assert len(layers["layer_violations"]) >= 1


def test_static_smell_explorer_and_adr_generation(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    smells = service.static_smell_explorer(repository_id=repo.id)
    assert len(smells["generic_code_smells"]) >= 1

    adr = service.generate_adr(repository_id=repo.id, title="Decouple Core Monolith")
    assert adr["adr_number"] == 42
    assert adr["status"] == "accepted"

    adrs_in_db = (
        db_session.query(ArchitectureDecisionRecord)
        .filter(ArchitectureDecisionRecord.repository_id == repo.id)
        .all()
    )
    assert len(adrs_in_db) == 1


def test_rollback_planner_and_architecture_migration(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    rb = service.rollback_planner(repository_id=repo.id)
    assert rb["confidence_score"] > 95.0

    mig = service.architecture_migration_planner(
        repository_id=repo.id, architecture_style="Hexagonal Architecture"
    )
    assert mig["architecture_style"] == "Hexagonal Architecture"
    assert len(mig["migration_phases"]) == 3


def test_signature_ai_refactoring_studio(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = AREService(db=db_session)

    studio = service.run_ai_refactoring_studio(repository_id=repo.id)
    assert studio["baseline_health_score"] == 72.0
    assert studio["target_health_score"] == 93.0
    assert studio["tech_debt_delta_pct"] == -41.0
    assert studio["build_time_delta_pct"] == -18.0
    assert studio["deployment_risk_delta_pct"] == -33.0
    assert studio["developer_productivity_delta_pct"] == 29.0
    assert len(studio["sprints_timeline"]) == 4

    sessions_in_db = (
        db_session.query(RefactoringStudioSession)
        .filter(RefactoringStudioSession.repository_id == repo.id)
        .all()
    )
    assert len(sessions_in_db) == 1
