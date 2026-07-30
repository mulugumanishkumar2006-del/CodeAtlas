import uuid

import pytest
from app.autonomous.ase_engine import ase_engine
from app.core.database import Base
from app.models.ase import EvolutionPlanItem
from app.models.repository import Repository
from app.models.user import User
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

    user = User(id=user_id, username="ase_test_user", email="ase_test@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="TestRepo",
        full_name="user/TestRepo",
        clone_url="https://github.com/user/TestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()

    return user, repo


def test_continuous_evolution_engine_cycle(db_session, test_user_and_repo):
    user, repo = test_user_and_repo

    res = ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)
    assert res["status"] == "completed"
    assert res["items_generated"] > 0
    assert res["roadmap_updated"] is True

    items = (
        db_session.query(EvolutionPlanItem)
        .filter(EvolutionPlanItem.repository_id == repo.id)
        .all()
    )
    assert len(items) >= 9
    categories = {it.category for it in items}
    assert "architecture" in categories
    assert "cost" in categories
    assert "reliability" in categories
    assert "database" in categories


def test_signature_engineering_evolution_timeline(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)

    timeline = ase_engine.get_engineering_evolution_timeline(
        repository_id=repo.id, db=db_session
    )
    assert timeline.repository_id == repo.id
    assert timeline.current_baseline_score == 75.0
    assert timeline.target_ideal_score == 99.5
    assert len(timeline.horizons) == 5

    keys = [h.horizon_key for h in timeline.horizons]
    assert keys == ["today", "next_sprint", "next_quarter", "next_year", "ideal"]


def test_engineering_investment_optimizer(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)

    res = ase_engine.optimize_engineering_investment(
        repository_id=repo.id, timeframe_weeks=2, db=db_session
    )
    assert res.repository_id == repo.id
    assert res.allocated_weeks == 2
    assert res.total_hours_available == 80.0
    assert len(res.recommended_items) >= 1
    assert "estimated_cost_savings_usd" in res.expected_roi


def test_improvement_dependency_graph(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)

    graph = ase_engine.get_improvement_dependency_graph(
        repository_id=repo.id, db=db_session
    )
    assert graph.repository_id == repo.id
    assert graph.total_nodes >= 9
    assert len(graph.root_nodes) >= 1


def test_ai_review_board_metadata(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)

    items = (
        db_session.query(EvolutionPlanItem)
        .filter(EvolutionPlanItem.repository_id == repo.id)
        .all()
    )
    first_item = items[0]
    assert first_item.why_statement is not None
    assert first_item.expected_benefit is not None
    assert first_item.confidence_score > 0.0


def test_validation_and_approval_gateway(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    ase_engine.run_continuous_evolution(repository_id=repo.id, db=db_session)

    items = (
        db_session.query(EvolutionPlanItem)
        .filter(EvolutionPlanItem.repository_id == repo.id)
        .all()
    )
    target_item = items[0]

    val_res = ase_engine.validate_item(item_id=target_item.id, db=db_session)
    assert val_res.validation_status == "passed"

    app_item = ase_engine.approve_item(
        item_id=target_item.id, approver="Lead Architect", db=db_session
    )
    assert app_item.status == "approved"

    rej_item = ase_engine.reject_item(
        item_id=items[1].id, approver="Lead Architect", db=db_session
    )
    assert rej_item.status == "rejected"
