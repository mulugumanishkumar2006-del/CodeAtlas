# tests/test_codeatlas_os.py


import pytest
from app.core.database import Base, get_db
from app.main import app
from app.os_kernel.integration_bus import ToolIntegrationBus
from app.os_kernel.os_kernel_orchestrator import CodeAtlasOSKernel
from app.os_kernel.universal_query_engine import UniversalEngineeringQueryEngine
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = "sqlite:///./test_os_temp.db"
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


def test_universal_query_engine_core_questions():
    db = TestingSessionLocal()
    try:
        kernel = CodeAtlasOSKernel()
        session = kernel.get_or_create_kernel_session(db, "Test-OS-Session")
        query_engine = UniversalEngineeringQueryEngine()

        # 1. Scalability Risk
        q1 = query_engine.process_universal_query(
            db, session.id, "Which service is our biggest scalability risk?"
        )
        assert q1["category"] == "Scalability Risk"
        assert "analytics-ingestion-worker" in q1["headline"]

        # 2. Latency Root Cause
        q2 = query_engine.process_universal_query(
            db, session.id, "Why did latency increase after Release 3.2?"
        )
        assert q2["category"] == "Performance Incident Root Cause"
        assert "synchronous third-party HTTP" in q2["headline"]

        # 3. Modernization Priority
        q3 = query_engine.process_universal_query(
            db, session.id, "Which repository should be modernized first?"
        )
        assert q3["category"] == "Modernization Priority"
        assert "legacy-payment-gateway" in q3["headline"]

        # 4. Engineering ROI
        q4 = query_engine.process_universal_query(
            db, session.id, "What is our engineering ROI?"
        )
        assert q4["category"] == "Engineering ROI & Business Value"
        assert "$1.45M cost avoidance" in q4["headline"]

        # 5. 100 Million Users Capacity
        q5 = query_engine.process_universal_query(
            db, session.id, "Can our architecture support 100 million users?"
        )
        assert q5["category"] == "Capacity Planning & Architect Capacity"

        # 6. Checkout Workflow Ownership
        q6 = query_engine.process_universal_query(
            db, session.id, "Which team owns the checkout workflow?"
        )
        assert q6["category"] == "Ownership & Team Intelligence"
        assert "Payments & Billing" in q6["headline"]

        # 7. Release Blockers
        q7 = query_engine.process_universal_query(
            db, session.id, "What is blocking our release?"
        )
        assert q7["category"] == "Release Risk & Blockers"
        assert "v2026.04-RC2" in q7["headline"]
    finally:
        db.close()


def test_tool_integration_bus():
    db = TestingSessionLocal()
    try:
        bus = ToolIntegrationBus()
        status_res = bus.get_integration_status(db)

        assert status_res["total_integrations"] == 7
        assert status_res["all_connected"] is True

        reg_res = bus.register_tool_adapter(
            db, "Snyk", "Security Scanning", "https://snyk.corp.internal"
        )
        assert reg_res["status"] == "CONNECTED"
    finally:
        db.close()


def test_os_kernel_orchestrator():
    db = TestingSessionLocal()
    try:
        kernel = CodeAtlasOSKernel()
        status_res = kernel.get_kernel_status(db)

        assert status_res["kernel_status"] == "RUNNING"
        assert status_res["active_subsystems_count"] == 5
        assert len(status_res["subsystems"]) == 5
    finally:
        db.close()


def test_codeatlas_os_api_endpoints():
    # 1. OS Status API
    status_res = client.get("/api/v1/os/status")
    assert status_res.status_code == 200
    assert status_res.json()["kernel_status"] == "RUNNING"

    # 2. Query API
    query_res = client.post(
        "/api/v1/os/query",
        json={"query_text": "Which service is our biggest scalability risk?"},
    )
    assert query_res.status_code == 200
    assert query_res.json()["category"] == "Scalability Risk"

    # 3. Integrations API
    integ_res = client.get("/api/v1/os/integrations")
    assert integ_res.status_code == 200
    assert integ_res.json()["total_integrations"] == 9

    # 4. Desktop API
    desktop_res = client.get("/api/v1/os/desktop")
    assert desktop_res.status_code == 200
    assert len(desktop_res.json()["window_dock"]) == 6
