# tests/test_intelligence_network.py

import os

import pytest
from app.core.database import Base, get_db
from app.intelligence_network import (
    ArchitectureKnowledgeGraph,
    GlobalPatternRecommendationEngine,
    PatternExtractionEngine,
    RepositoryIntelligenceEngine,
)
from app.main import app
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_net_temp.db")
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_intelligence_network_engines():
    db = TestingSessionLocal()
    try:
        overview = RepositoryIntelligenceEngine().get_network_overview(db)
        assert overview["indexed_repositories_count"] == 12450

        patterns = PatternExtractionEngine().extract_patterns(db)
        assert len(patterns) == 3

        graph = ArchitectureKnowledgeGraph().get_network_graph(db)
        assert graph["total_pattern_nodes"] == 12450

        rec = GlobalPatternRecommendationEngine().generate_global_recommendation(
            db, "DB lock contention on checkout"
        )
        assert "12,450" in rec["global_insight"]
        assert rec["confidence_score"] == 98.6
    finally:
        db.close()


def test_intelligence_network_api():
    assert client.get("/api/v1/network/overview").status_code == 200
    assert client.get("/api/v1/network/patterns").status_code == 200
    assert client.get("/api/v1/network/graph").status_code == 200
    assert (
        client.get(
            "/api/v1/network/global-recommendation?local_issue=DB%20lock"
        ).status_code
        == 200
    )
