# tests/test_reality_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.reality_engine.collectors.deployment_collector import DeploymentCollector
from app.reality_engine.collectors.github_collector import GitHubCollector
from app.reality_engine.collectors.kubernetes_collector import KubernetesCollector
from app.reality_engine.collectors.logs_collector import LogsCollector
from app.reality_engine.collectors.metrics_collector import MetricsCollector
from app.reality_engine.digital_twin.health import RealityHealthEngine
from app.reality_engine.digital_twin.runtime_state import RuntimeStateEngine
from app.reality_engine.digital_twin.topology import RealityTopologyEngine
from app.reality_engine.prediction.anomaly_detector import AnomalyDetector
from app.reality_engine.prediction.outage_predictor import OutagePredictor
from app.reality_engine.reports.engineering_reality_report import (
    EngineeringRealityReportGenerator,
)
from app.reality_engine.simulation.incident_simulator import IncidentSimulator
from app.reality_engine.simulation.traffic_simulator import TrafficSimulator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test_reality_temp.db")
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


def test_collectors():
    db = TestingSessionLocal()
    try:
        gh = GitHubCollector().collect_github_reality(db)
        assert gh["active_prs"] == 14

        k8s = KubernetesCollector().collect_k8s_reality(db)
        assert k8s["running_pods"] == 84

        metrics = MetricsCollector().collect_metrics_reality(db)
        assert metrics["global_p95_latency_ms"] == 42.0

        logs = LogsCollector().collect_logs_reality(db)
        assert logs["total_logs_processed_24h"] > 0

        deploy = DeploymentCollector().collect_deployments_reality(db)
        assert len(deploy["active_deployments"]) == 1
    finally:
        db.close()


def test_digital_twin_engines():
    db = TestingSessionLocal()
    try:
        runtime = RuntimeStateEngine().get_runtime_state(db)
        assert runtime["digital_twin_version"] == "2.0-REALITY"

        topology = RealityTopologyEngine().get_realtime_topology(db)
        assert len(topology["nodes"]) == 6

        health = RealityHealthEngine().get_reality_health(db)
        assert health["360_reality_health_score"] == 93.5
    finally:
        db.close()


def test_simulators():
    db = TestingSessionLocal()
    try:
        inc = IncidentSimulator().simulate_incident(db, "auth-service-v1")
        assert inc["estimated_recovery_time_mins"] == 12

        traffic = TrafficSimulator().simulate_traffic_spike(db, 10)
        assert traffic["simulated_rpm"] == 185000.0
    finally:
        db.close()


def test_predictions_and_reports():
    db = TestingSessionLocal()
    try:
        anom = AnomalyDetector().detect_anomalies(db)
        assert anom["anomalies_detected_count"] == 1

        outage = OutagePredictor().predict_outage_risk(db)
        assert outage["outage_probability_pct"] == "2.4%"

        report = EngineeringRealityReportGenerator().generate_360_reality_report(db)
        assert report["reality_health_score"] == 93.5
    finally:
        db.close()


def test_reality_api_endpoints():
    assert client.get("/api/v1/reality/status").status_code == 200
    assert client.get("/api/v1/reality/topology").status_code == 200
    assert client.get("/api/v1/reality/runtime-state").status_code == 200
    assert client.get("/api/v1/reality/telemetry").status_code == 200
    assert client.get("/api/v1/reality/kubernetes").status_code == 200
    assert client.get("/api/v1/reality/github").status_code == 200
    assert client.get("/api/v1/reality/logs").status_code == 200
    assert client.get("/api/v1/reality/deployments").status_code == 200
    assert (
        client.post(
            "/api/v1/reality/simulate-incident", json={"target_service": "auth-service"}
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/api/v1/reality/simulate-traffic", json={"multiplier": 10}
        ).status_code
        == 200
    )
    assert client.get("/api/v1/reality/predictions").status_code == 200
    assert client.get("/api/v1/reality/report").status_code == 200
