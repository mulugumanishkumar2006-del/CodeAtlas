# tests/test_codeatlas_os_complete.py


import pytest
from app.core.database import Base, get_db
from app.main import app
from app.os_kernel.engineering_memory_os import EngineeringMemoryOS
from app.os_kernel.integration_hub import ToolIntegrationBus
from app.os_kernel.live_timeline_engine import LiveEngineeringTimelineEngine
from app.os_kernel.platform_sdk_engine import PlatformSDKEngine
from app.os_kernel.role_dashboard_engine import RoleDashboardEngine
from app.os_kernel.universal_search_engine import UniversalSearchEngine
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = "sqlite:///./test_os_40_temp.db"
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


def test_universal_search_9_domains():
    db = TestingSessionLocal()
    try:
        engine_instance = UniversalSearchEngine()
        search_res = engine_instance.search_all_domains(db, "Authentication")
        assert search_res["total_matches"] >= 1
        assert "domain_breakdown" in search_res
        assert len(search_res["domain_breakdown"]) == 9
    finally:
        db.close()


def test_engineering_memory_os():
    db = TestingSessionLocal()
    try:
        mem_os = EngineeringMemoryOS()
        rec_res = mem_os.record_memory_item(
            db,
            "Decision",
            "Adopt Event-Driven Architecture",
            "Kafka bus for checkout microservices",
            "Architect",
        )
        assert rec_res["memory_type"] == "Decision"

        records_res = mem_os.get_memory_records(db, "Decision")
        assert len(records_res["memories"]) >= 1
    finally:
        db.close()


def test_live_engineering_timeline():
    db = TestingSessionLocal()
    try:
        timeline_engine = LiveEngineeringTimelineEngine()
        event_res = timeline_engine.record_timeline_event(
            db,
            "Deployment",
            "Release v20.0.0 Deployed",
            "Blue/green staging deploy succeeded",
            "INFO",
            "k8s-cluster",
        )
        assert event_res["event_type"] == "Deployment"

        stream_res = timeline_engine.get_timeline_replay_stream(db)
        assert len(stream_res["timeline"]) >= 1
    finally:
        db.close()


def test_tool_integration_bus_9_tools():
    db = TestingSessionLocal()
    try:
        bus = ToolIntegrationBus()
        status_res = bus.get_integration_status(db)
        assert status_res["total_integrations"] == 9
        assert status_res["all_connected"] is True
    finally:
        db.close()


def test_role_dashboard_engine():
    db = TestingSessionLocal()
    try:
        role_engine = RoleDashboardEngine()
        for role in ["Developer", "Tech Lead", "Architect", "SRE", "QA", "CTO"]:
            dash = role_engine.get_role_dashboard(db, role)
            assert dash["role"] == role
            assert len(dash["widgets"]) == 3
    finally:
        db.close()


def test_platform_sdk_engine():
    db = TestingSessionLocal()
    try:
        sdk_engine = PlatformSDKEngine()
        plugins_res = sdk_engine.get_marketplace_plugins(db)
        assert plugins_res["total_installed"] >= 1

        reg_res = sdk_engine.register_plugin(
            db, "custom-security-linter", "Scans mTLS headers", "1.0.0", "Security Team"
        )
        assert reg_res["status"] == "ENABLED"
    finally:
        db.close()


def test_all_40_features_codeatlas_os_api_endpoints():
    # 1. Status
    res_status = client.get("/api/v1/os/status")
    assert res_status.status_code == 200
    assert res_status.json()["kernel_status"] == "RUNNING"

    # 2. Query
    res_query = client.post(
        "/api/v1/os/query", json={"query_text": "What is our engineering ROI?"}
    )
    assert res_query.status_code == 200
    assert res_query.json()["category"] == "Engineering ROI & Business Value"

    # 3. Search
    res_search = client.get("/api/v1/os/search?q=Auth&domain=APIs")
    assert res_search.status_code == 200

    # 4. Memory
    res_memory = client.get("/api/v1/os/memory?memory_type=Decision")
    assert res_memory.status_code == 200

    # 5. Timeline
    res_timeline = client.get("/api/v1/os/timeline?event_type=Deployment")
    assert res_timeline.status_code == 200

    # 6. Integrations
    res_integ = client.get("/api/v1/os/integrations")
    assert res_integ.status_code == 200
    assert res_integ.json()["total_integrations"] == 9

    # 7. Role Dashboard
    res_role = client.get("/api/v1/os/roles/CTO")
    assert res_role.status_code == 200
    assert res_role.json()["role"] == "CTO"

    # 8. Plugins
    res_plugins = client.get("/api/v1/os/plugins")
    assert res_plugins.status_code == 200

    # 9. Desktop Shell
    res_desktop = client.get("/api/v1/os/desktop")
    assert res_desktop.status_code == 200
    assert res_desktop.json()["all_40_features_active"] is True
