import pytest
from app.autonomous.wskg_engine import wskg_engine
from app.core.database import Base
from app.schemas.wskg import (
    FrameworkComparisonRequest,
    UniversalRepoSearchRequest,
)
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


def test_seed_world_knowledge_graph(db_session):
    res = wskg_engine.seed_world_knowledge_graph(db=db_session)
    assert res["status"] == "completed"
    assert res["total_nodes"] >= 15
    assert res["total_edges"] >= 5


def test_signature_world_software_atlas_zoom(db_session):
    atlas_res = wskg_engine.get_world_software_atlas(
        zoom_level="earth", parent_id=None, db=db_session
    )
    assert atlas_res.current_zoom_level == "earth"
    assert atlas_res.active_node.name == "Earth"
    assert len(atlas_res.child_nodes) >= 2

    # Zoom into backend domain
    zoom_domain = wskg_engine.get_world_software_atlas(
        zoom_level="domain", parent_id="node-atlas-backend", db=db_session
    )
    assert zoom_domain.current_zoom_level == "domain"
    assert len(zoom_domain.child_nodes) >= 2


def test_engineering_internet_dashboard(db_session):
    dash = wskg_engine.get_engineering_internet_dashboard(db=db_session)
    assert "ONLINE" in dash.live_pulse_status
    assert dash.active_global_entities >= 1000000
    assert "FastAPI" in dash.framework_adoption_rates


def test_semantic_engineering_search(db_session):
    res = wskg_engine.semantic_engineering_search(
        prompt="FastAPI Clean Architecture", limit=5, db=db_session
    )
    assert res.query == "FastAPI Clean Architecture"
    assert len(res.results) >= 1
    assert res.results[0].relevance_score > 0.9


def test_architecture_encyclopedia(db_session):
    enc = wskg_engine.get_architecture_encyclopedia(db=db_session)
    assert enc.total_articles >= 2
    assert "Distributed Systems" in enc.categories


def test_universal_repository_search(db_session):
    req = UniversalRepoSearchRequest(architecture="Microservices", language="Python")
    res = wskg_engine.universal_repository_search(request=req, db=db_session)
    assert res.total_matched >= 1


def test_technology_migration_path(db_session):
    res = wskg_engine.get_technology_migration_path(
        from_tech="Django", to_tech="FastAPI", db=db_session
    )
    assert res.from_technology == "Django"
    assert len(res.migration_steps) >= 3


def test_framework_comparison_matrix(db_session):
    req = FrameworkComparisonRequest(frameworks=["FastAPI", "Next.js", "Django"])
    res = wskg_engine.compare_frameworks(request=req, db=db_session)
    assert len(res.matrix) >= 3


def test_ecosystem_report(db_session):
    rep = wskg_engine.generate_ecosystem_report(db=db_session)
    assert rep.ecosystem_health_index > 90.0
