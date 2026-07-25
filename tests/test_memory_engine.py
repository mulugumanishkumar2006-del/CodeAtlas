# tests/test_memory_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.memory_engine import (
    ADRManager,
    AIDecisionComparator,
    AIEngineeringHistorian,
    AIEngineeringLibrarian,
    AIMemoryEngine,
    DeploymentIntelligenceEngine,
    DeveloperOnboardingAI,
    EngineeringEncyclopediaEngine,
    EngineeringMemoryGraph,
    ExecutiveMemoryEngine,
    HistoricalContextRecall,
    IncidentMemoryEngine,
    MeetingIntelligenceEngine,
    PRIntelligenceEngine,
    SystemBiographyEngine,
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
        assert len(adrs) >= 5

        context = HistoricalContextRecall().recall_historical_context(db, "performance")
        assert context["context_preservation_score"] == "98.4%"

        prs = PRIntelligenceEngine().get_pr_intelligence(db)
        assert len(prs) >= 2

        incidents = IncidentMemoryEngine().get_incident_memory(db)
        assert len(incidents) >= 2

        meetings = MeetingIntelligenceEngine().get_meeting_intelligence(db)
        assert len(meetings) >= 2

        hist = AIEngineeringHistorian().explain_subsystem_history(db, "Auth")
        assert len(hist["timeline"]) == 4

        story = AIEngineeringHistorian().generate_system_story(db, "CodeAtlas Core")
        assert len(story["chapters"]) == 4

        onboard = DeveloperOnboardingAI().get_onboarding_guide(db, "Backend Engineer")
        assert len(onboard["essential_context_modules"]) == 3

        comp = AIDecisionComparator().compare_decisions_vs_reality(db)
        assert len(comp) >= 2

        deploy = DeploymentIntelligenceEngine().get_deployment_history(db)
        assert len(deploy) >= 2

        dep_hist = DeploymentIntelligenceEngine().get_dependency_history(db)
        assert len(dep_hist["historical_timeline"]) == 3

        heatmap = AIEngineeringLibrarian().get_knowledge_heatmap(db)
        assert len(heatmap["poorly_documented_modules"]) >= 2

        search = AIEngineeringLibrarian().librarian_search(db, "FastAPI")
        assert len(search["matches"]) >= 2

        encyclopedia = EngineeringEncyclopediaEngine().get_encyclopedia_overview(db)
        assert len(encyclopedia["terms_glossary"]) == 3

        exec_report = ExecutiveMemoryEngine().generate_executive_history_report(db)
        assert "CTO & VP of Engineering" in exec_report["prepared_for"]

        bio = SystemBiographyEngine().get_service_biography(
            db, "Authentication Service"
        )
        assert len(bio["biography"]["life_story_stages"]) == 9
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
    assert client.get("/api/v1/memory/pr-intelligence").status_code == 200
    assert client.get("/api/v1/memory/incident-memory").status_code == 200
    assert client.get("/api/v1/memory/meeting-intelligence").status_code == 200
    assert (
        client.get("/api/v1/memory/engineering-historian?subsystem=Auth").status_code
        == 200
    )
    assert (
        client.get("/api/v1/memory/system-story?system_name=CodeAtlas").status_code
        == 200
    )
    assert (
        client.get(
            "/api/v1/memory/developer-onboarding?role=Backend%20Engineer"
        ).status_code
        == 200
    )
    assert client.get("/api/v1/memory/decision-comparator").status_code == 200
    assert client.get("/api/v1/memory/deployment-intelligence").status_code == 200
    assert client.get("/api/v1/memory/dependency-history").status_code == 200
    assert client.get("/api/v1/memory/knowledge-heatmap").status_code == 200
    assert client.get("/api/v1/memory/librarian-search?q=FastAPI").status_code == 200
    assert (
        client.get(
            "/api/v1/memory/system-biography?service_name=Authentication%20Service"
        ).status_code
        == 200
    )
    assert client.get("/api/v1/memory/encyclopedia").status_code == 200
    assert client.get("/api/v1/memory/executive-history").status_code == 200
