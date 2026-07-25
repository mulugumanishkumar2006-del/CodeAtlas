# tests/test_memory_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.memory_engine import (
    ADRManager,
    AIMemoryEngine,
    EngineeringMemoryGraph,
    HistoricalContextRecall,
)
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_mem_temp.db")
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


def test_memory_engines():
    db = TestingSessionLocal()
    try:
        graph = EngineeringMemoryGraph().get_memory_graph_topology(db)
        assert graph["graph_version"] == "1.0-ENGINEERING-BRAIN"
        assert graph["nodes_count"] == 1420

        kafka_ans = AIMemoryEngine().query_engineering_memory(
            db, "Why did we choose Kafka over RabbitMQ?"
        )
        assert "ADR 004" in kafka_ans["answer"]
        assert kafka_ans["confidence"] == 98.2

        orders_ans = AIMemoryEngine().query_engineering_memory(
            db, "Why was Orders split into two services?"
        )
        assert "PR #182" in orders_ans["answer"]

        latency_ans = AIMemoryEngine().query_engineering_memory(
            db, "Why did latency improve six months ago?"
        )
        assert "Redis L2" in latency_ans["answer"]

        adrs = ADRManager().list_architecture_decisions(db)
        assert len(adrs) >= 3

        context = HistoricalContextRecall().recall_historical_context(db, "performance")
        assert context["context_preservation_score"] == "98.4%"
    finally:
        db.close()


def test_memory_api_endpoints():
    assert client.get("/api/v1/memory/graph-snapshot").status_code == 200
    assert (
        client.get(
            "/api/v1/memory/query?q=Why%20did%20we%20choose%20Kafka%20over%20RabbitMQ%3F"
        ).status_code
        == 200
    )
    assert client.get("/api/v1/memory/adrs").status_code == 200
    assert (
        client.get("/api/v1/memory/historical-recall?topic=performance").status_code
        == 200
    )
