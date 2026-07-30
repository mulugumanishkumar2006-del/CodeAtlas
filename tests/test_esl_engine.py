import uuid

import pytest
from app.core.database import Base
from app.models.esl import (
    DigitalEngineeringLabSession,
)
from app.models.repository import Repository
from app.models.user import User
from app.services.esl_service import ESLService
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

    user = User(id=user_id, username="esl_tester", email="esl@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="ESLTestRepo",
        full_name="user/ESLTestRepo",
        clone_url="https://github.com/user/ESLTestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()

    return user, repo


def test_signature_digital_engineering_laboratory(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ESLService(db=db_session)

    lab = service.run_digital_engineering_lab(
        repository_id=repo.id,
        scenario_name="Scale to 50 Million Users",
        platform="AWS",
        database="CockroachDB",
        cache="Redis Cluster",
        messaging="Kafka",
        deployment="Kubernetes",
    )

    assert lab["architecture_score"] == 91.0
    assert lab["estimated_monthly_cost_usd"] == 87000.0
    assert lab["expected_latency_ms"] == 72.0
    assert lab["risk_level"] == "Medium"
    assert lab["confidence_pct"] == 89.0
    assert len(lab["recommended_changes"]) >= 5

    sessions_in_db = (
        db_session.query(DigitalEngineeringLabSession)
        .filter(DigitalEngineeringLabSession.repository_id == repo.id)
        .all()
    )
    assert len(sessions_in_db) == 1


def test_ai_architecture_debate_and_monte_carlo(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ESLService(db=db_session)

    debate = service.run_ai_architecture_debate(repository_id=repo.id)
    assert len(debate["debate_rounds"]) >= 2
    assert debate["consensus_architecture"] is not None

    mc = service.run_monte_carlo_risk(repository_id=repo.id, iterations=10000)
    assert mc["iterations_run"] == 10000
    assert mc["p95_latency_ms"] > 0
    assert "89.0% Confidence" in mc["confidence_interval"]


def test_architecture_and_db_migration(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ESLService(db=db_session)

    arch_res = service.simulate_architecture(
        repository_id=repo.id,
        target_service="UserManagerService",
        action_type="split_service",
    )
    assert arch_res["coupling_reduction_pct"] > 40.0

    db_res = service.simulate_database_migration(
        repository_id=repo.id, source_db="PostgreSQL", target_db="CockroachDB"
    )
    assert db_res["schema_compatibility_pct"] > 90.0


def test_infrastructure_and_black_friday(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = ESLService(db=db_session)

    infra = service.simulate_infrastructure(
        repository_id=repo.id,
        technology_stack="Kubernetes",
        target_concurrent_users=100000000,
    )
    assert infra["target_concurrent_users"] == 100000000

    bf = service.simulate_black_friday(repository_id=repo.id, traffic_multiplier=10.0)
    assert bf["system_status"] == "SURVIVED"
