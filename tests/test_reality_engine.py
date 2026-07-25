# tests/test_reality_engine.py

import os

import pytest
from app.core.database import Base, get_db
from app.main import app
from app.reality_engine.api.runtime_api_service import RuntimeAPIService
from app.reality_engine.collectors.deployment_collector import DeploymentCollector
from app.reality_engine.collectors.drift_detector import InfrastructureDriftDetector
from app.reality_engine.collectors.github_collector import GitHubCollector
from app.reality_engine.collectors.kubernetes_collector import KubernetesCollector
from app.reality_engine.collectors.logs_collector import LogsCollector
from app.reality_engine.collectors.metrics_collector import MetricsCollector
from app.reality_engine.connectors.plugin_connectors import PluginConnectorsEngine
from app.reality_engine.digital_twin.architecture_overlay import LiveArchitectureOverlay
from app.reality_engine.digital_twin.environment_comparison import (
    CrossEnvironmentComparison,
)
from app.reality_engine.digital_twin.health import RealityHealthEngine
from app.reality_engine.digital_twin.health_radar import ServiceHealthRadar
from app.reality_engine.digital_twin.reliability_score import ReliabilityScoreEngine
from app.reality_engine.digital_twin.runtime_knowledge_graph import (
    RuntimeKnowledgeGraph,
)
from app.reality_engine.digital_twin.runtime_state import RuntimeStateEngine
from app.reality_engine.digital_twin.slo_sla_dashboard import SLOSLADashboard
from app.reality_engine.digital_twin.synchronization_engine import (
    RealitySynchronizationEngine,
)
from app.reality_engine.digital_twin.topology import RealityTopologyEngine
from app.reality_engine.digital_twin.user_journey import UserJourneyMapper
from app.reality_engine.events.event_stream import EngineeringEventStream
from app.reality_engine.prediction.ai_operational_advisor import AIOperationalAdvisor
from app.reality_engine.prediction.anomaly_detector import AnomalyDetector
from app.reality_engine.prediction.capacity_forecaster import CapacityForecaster
from app.reality_engine.prediction.cost_carbon_estimator import CostCarbonEstimator
from app.reality_engine.prediction.explainable_ai import ExplainableOperationalAI
from app.reality_engine.prediction.outage_predictor import OutagePredictor
from app.reality_engine.prediction.release_impact_analyzer import ReleaseImpactAnalyzer
from app.reality_engine.prediction.root_cause_commander import (
    AIIncidentCommander,
    RootCauseExplorer,
)
from app.reality_engine.reports.engineering_reality_report import (
    EngineeringRealityReportGenerator,
)
from app.reality_engine.reports.executive_operations import ExecutiveOperationsDashboard
from app.reality_engine.simulation.historical_replay import HistoricalReplayEngine
from app.reality_engine.simulation.incident_simulator import IncidentSimulator
from app.reality_engine.simulation.recovery_simulator import RecoverySimulator
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
        assert len(metrics["api_traffic_flows"]) >= 3

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
        assert "status_breakdown" in runtime
        assert runtime["status_breakdown"]["RUNNING"] > 0

        topology = RealityTopologyEngine().get_realtime_topology(db)
        assert len(topology["nodes"]) >= 6
        assert "entity_categories" in topology

        health = RealityHealthEngine().get_reality_health(db)
        assert health["360_reality_health_score"] == 93.5
        assert "infrastructure_monitoring" in health
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
        assert anom["anomalies_detected_count"] >= 1

        outage = OutagePredictor().predict_outage_risk(db)
        assert "at_risk_services" in outage

        cap = CapacityForecaster().forecast_capacity_needs(db)
        assert cap["forecast_horizon_days"] == 90

        cost_carbon = CostCarbonEstimator().estimate_cost_and_carbon(db)
        assert "total_estimated_monthly_cost" in cost_carbon["cost_breakdown"]
        assert "estimated_monthly_co2e_kg" in cost_carbon["carbon_footprint"]

        events = EngineeringEventStream().get_event_stream(db)
        assert len(events["events"]) > 0

        journeys = UserJourneyMapper().map_user_journeys(db)
        assert journeys["mapped_journeys_count"] > 0

        radar = ServiceHealthRadar().get_health_radar(db)
        assert len(radar["service_radars"]) > 0

        drift = InfrastructureDriftDetector().detect_infrastructure_drift(db)
        assert drift["drift_detected_count"] > 0

        rkg = RuntimeKnowledgeGraph().get_runtime_knowledge_graph(db)
        assert rkg["graph_type"] == "LIVE_RUNTIME_KNOWLEDGE_GRAPH"

        arch = LiveArchitectureOverlay().get_architecture_overlay(db)
        assert len(arch["nodes_with_overlay"]) > 0

        rel = ReliabilityScoreEngine().calculate_reliability_scores(db)
        assert rel["overall_system_reliability_score"] > 80.0

        slo = SLOSLADashboard().get_slo_sla_metrics(db)
        assert len(slo["objectives"]) > 0

        rec_sim = RecoverySimulator().simulate_recovery_strategy(db)
        assert "estimated_recovery_seconds" in rec_sim["model_results"]

        rel_imp = ReleaseImpactAnalyzer().analyze_release_impact(db)
        assert "release_impact" in rel_imp

        advisor = AIOperationalAdvisor().get_operational_advice(db)
        assert len(advisor["recommendations"]) > 0

        env_comp = CrossEnvironmentComparison().compare_environments(db)
        assert len(env_comp["comparisons"]) > 0

        replay = HistoricalReplayEngine().replay_incident(db)
        assert len(replay["minute_snapshots"]) > 0

        exec_dash = ExecutiveOperationsDashboard().get_executive_summary(db)
        assert exec_dash["executive_summary_status"] == "OPERATIONAL_EXCELLENCE_STABLE"

        api_specs = RuntimeAPIService().get_api_specifications(db)
        assert len(api_specs["endpoints"]) > 0

        connectors = PluginConnectorsEngine().get_plugin_connectors(db)
        assert connectors["active_connectors_count"] == 9

        exp_ai = ExplainableOperationalAI().get_explainable_recommendations(db)
        assert len(exp_ai["recommendations"]) > 0

        sync_st = RealitySynchronizationEngine().get_synchronization_status(db)
        assert sync_st["engine_status"] == "REALTIME_SYNCHRONIZED"

        rca = RootCauseExplorer().analyze_root_cause(db, "inc-402")
        assert rca["probable_root_cause"]["confidence_score"] > 90.0

        ai_cmd = AIIncidentCommander().command_incident_response(
            db, "Triage payment timeout"
        )
        assert ai_cmd["commander_agent_status"] == "ACTIVE_TRIAGE"

        report = EngineeringRealityReportGenerator().generate_360_reality_report(db)
        assert report["reality_health_score"] == 93.5
    finally:
        db.close()


def test_reality_api_endpoints():
    assert client.get("/api/v1/reality/status").status_code == 200
    assert client.get("/api/v1/reality/topology").status_code == 200
    assert client.get("/api/v1/reality/runtime-state").status_code == 200
    assert client.get("/api/v1/reality/telemetry").status_code == 200
    assert client.get("/api/v1/reality/database-activity").status_code == 200
    assert client.get("/api/v1/reality/kubernetes").status_code == 200
    assert client.get("/api/v1/reality/github").status_code == 200
    assert client.get("/api/v1/reality/logs").status_code == 200
    assert client.get("/api/v1/reality/deployments").status_code == 200
    assert client.get("/api/v1/reality/deployment-timeline").status_code == 200
    assert client.get("/api/v1/reality/incident-timeline").status_code == 200
    assert client.get("/api/v1/reality/capacity-forecast").status_code == 200
    assert client.get("/api/v1/reality/cost-analytics").status_code == 200
    assert client.get("/api/v1/reality/carbon-footprint").status_code == 200
    assert client.get("/api/v1/reality/event-stream").status_code == 200
    assert client.get("/api/v1/reality/user-journey").status_code == 200
    assert client.get("/api/v1/reality/health-radar").status_code == 200
    assert client.get("/api/v1/reality/infrastructure-drift").status_code == 200
    assert client.get("/api/v1/reality/runtime-knowledge-graph").status_code == 200
    assert client.get("/api/v1/reality/architecture-overlay").status_code == 200
    assert client.get("/api/v1/reality/reliability-scores").status_code == 200
    assert client.get("/api/v1/reality/slo-sla").status_code == 200
    assert client.post("/api/v1/reality/simulate-recovery").status_code == 200
    assert client.get("/api/v1/reality/release-impact").status_code == 200
    assert client.get("/api/v1/reality/ai-operational-advice").status_code == 200
    assert client.get("/api/v1/reality/environment-comparison").status_code == 200
    assert client.get("/api/v1/reality/historical-replay").status_code == 200
    assert client.get("/api/v1/reality/executive-dashboard").status_code == 200
    assert client.get("/api/v1/reality/runtime-api-specs").status_code == 200
    assert client.get("/api/v1/reality/plugin-connectors").status_code == 200
    assert client.get("/api/v1/reality/explainable-ai").status_code == 200
    assert client.get("/api/v1/reality/synchronization-status").status_code == 200

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
    assert client.get("/api/v1/reality/root-cause-analysis").status_code == 200
    assert (
        client.post(
            "/api/v1/reality/ai-incident-command", json={"user_query": "triage"}
        ).status_code
        == 200
    )
    assert client.get("/api/v1/reality/predictions").status_code == 200
    assert client.get("/api/v1/reality/report").status_code == 200
