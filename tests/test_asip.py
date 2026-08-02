import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, engine, get_db
from app.main import app
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)


def mock_get_current_user():
    db = next(get_db())
    try:
        user = db.query(User).filter(User.id == "asip_test_user_id").first()
        if not user:
            user = User(
                id="asip_test_user_id",
                username="asip_tester",
                name="ASIP Tester",
                email="asip@codeatlas.io",
            )
            db.add(user)
            db.commit()
        return user
    finally:
        db.close()


app.dependency_overrides[get_current_user] = mock_get_current_user
client = TestClient(app)


def setup_mock_asip_data():
    db: Session = next(get_db())

    try:
        user_id = "asip_test_user_id"
        repo_id = "test_asip_repo_id"
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            repo = Repository(
                id=repo_id,
                name="test_asip_repo",
                full_name="asip/test_repo",
                clone_url="https://github.com/asip/test_repo.git",
                user_id=user_id,
            )
            db.add(repo)
            db.commit()

        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.repository_id == repo_id)
            .first()
        )
        if not stats:
            stats = RepositoryStatistics(
                id="asip_stats_001",
                repository_id=repo_id,
                total_files=35,
                total_lines=4500,
                average_complexity=6.5,
                documentation_coverage=84.0,
                languages={"python": 0.85, "typescript": 0.15},
            )
            db.add(stats)
            db.commit()

    finally:
        db.close()


def test_asip_operations_center_suite():
    setup_mock_asip_data()
    repo_id = "test_asip_repo_id"

    # 1. Test GET /repositories/{repo_id}/asip/monday-briefing
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/monday-briefing")
    assert res.status_code == 200
    briefing = res.json()
    assert briefing["repository_id"] == repo_id
    assert briefing["repos_needing_attention_count"] == 3
    assert len(briefing["architecture_drift_alerts"]) > 0
    assert len(briefing["service_bottleneck_forecasts"]) > 0
    assert briefing["tech_debt_growth_rate_pct"] == 12.0
    assert len(briefing["deployment_risk_forecast"]) > 0

    # 2. Test POST /repositories/{repo_id}/asip/simulate
    sim_payload = {"scenario_type": "user_scale_100m", "target_users": 100000000}
    res = client.post(f"/api/v1/repositories/{repo_id}/asip/simulate", json=sim_payload)
    assert res.status_code == 200
    sim_res = res.json()
    assert sim_res["repository_id"] == repo_id
    assert sim_res["predicted_reliability_score_pct"] == 99.99
    assert sim_res["verdict"] == "APPROVED_WITH_RECOMMENDATIONS"
    assert len(sim_res["simulation_logs"]) > 0

    # 3. Test GET /repositories/{repo_id}/asip/governance
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/governance")
    assert res.status_code == 200
    gov = res.json()
    assert gov["compliance_score_pct"] == 94.0
    assert len(gov["policies"]) > 0
    assert len(gov["pending_approvals"]) > 0

    # 4. Test POST /repositories/{repo_id}/asip/approve
    appr_payload = {
        "recommendation_id": "REC-101",
        "approved": True,
        "comments": "Approved via automated test pipeline",
    }
    res = client.post(f"/api/v1/repositories/{repo_id}/asip/approve", json=appr_payload)
    assert res.status_code == 200
    appr_res = res.json()
    assert appr_res["decision"] == "APPROVED"
    assert appr_res["recommendation_id"] == "REC-101"

    # 5. Test GET /repositories/{repo_id}/asip/autonomous-intelligence (Features 1-5)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/autonomous-intelligence")
    assert res.status_code == 200
    auto_res = res.json()
    assert "continuous_monitoring" in auto_res
    assert "autonomous_recommendations" in auto_res
    assert "command_center" in auto_res
    assert auto_res["command_center"]["architecture_health_score"] == 88.0

    # 6. Test GET /repositories/{repo_id}/asip/multi-agent-council (Feature 3)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/multi-agent-council")
    assert res.status_code == 200
    council_res = res.json()
    assert council_res["council_agents_count"] == 10
    assert len(council_res["agent_perspectives"]) == 10
    assert council_res["combined_consensus"]["consensus_score_pct"] == 96.0

    # 7. Test GET /repositories/{repo_id}/asip/engineering-digital-twin (Feature 5)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/engineering-digital-twin")
    assert res.status_code == 200
    twin_res = res.json()
    assert twin_res["twin_fidelity_pct"] == 99.4
    assert twin_res["status"] == "LIVE & IN-SYNC"

    # 8. Test GET /repositories/{repo_id}/asip/architecture-intelligence (Features 6-25)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/architecture-intelligence")
    assert res.status_code == 200
    arch_res = res.json()
    assert "codebase_health_index" in arch_res
    assert arch_res["codebase_health_index"]["overall_score"] == 86.5
    assert "architecture_drift_engine" in arch_res
    assert "technical_debt_velocity" in arch_res
    assert "complexity_heatmap" in arch_res
    assert "cloud_cost_arbitrage" in arch_res
    assert arch_res["cloud_cost_arbitrage"]["potential_monthly_savings_usd"] == 695.0

    # 9. Test GET /repositories/{repo_id}/asip/continuous-analysis (Features 6-30)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/continuous-analysis")
    assert res.status_code == 200
    cont_res = res.json()
    assert "incremental_indexing_status" in cont_res
    assert cont_res["incremental_indexing_status"]["last_delta_sync_ms"] == 115
    assert "live_dependency_graph" in cont_res
    assert "service_health_overlays" in cont_res
    assert "release_readiness" in cont_res
    assert cont_res["release_readiness"]["readiness_score"] == 94
    assert len(cont_res["quality_gates"]) == 4

    # 10. Test GET /repositories/{repo_id}/asip/ai-advisors (Features 31-70)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/ai-advisors")
    assert res.status_code == 200
    adv_res = res.json()
    assert adv_res["active_advisors_count"] == 40
    assert len(adv_res["advisors_directory"]) == 40
    assert len(adv_res["top_ranked_recommendations"]) > 0
    assert adv_res["top_ranked_recommendations"][0]["confidence_score_pct"] == 95.8

    # 11. Test GET /repositories/{repo_id}/asip/governance-compliance (Features 71-100)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/governance-compliance")
    assert res.status_code == 200
    gov_res = res.json()
    assert "architecture_governance" in gov_res
    assert gov_res["architecture_governance"]["compliance_score_pct"] == 94.0
    assert "regulatory_mapping" in gov_res
    assert gov_res["regulatory_mapping"]["soc2_type_ii_compliance_pct"] == 96.0
    assert "repository_certification" in gov_res
    assert (
        gov_res["repository_certification"]["certification_badge"]
        == "ENTERPRISE CERTIFIED — GRADE A"
    )
    assert "compliance_evidence_generation" in gov_res
    assert (
        gov_res["compliance_evidence_generation"]["evidence_package_zip"]
        == "soc2_type_ii_evidence_package_2026_q3.zip"
    )

    # 12. Test GET /repositories/{repo_id}/asip/enterprise-intelligence (Features 101-130)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/enterprise-intelligence")
    assert res.status_code == 200
    ent_res = res.json()
    assert "cross_repo_analytics" in ent_res
    assert ent_res["cross_repo_analytics"]["repositories_monitored_count"] == 14
    assert "dora_metrics_benchmarking" in ent_res
    assert ent_res["dora_metrics_benchmarking"]["dora_tier"] == "ELITE PERFORMER"
    assert "business_capability_mapping" in ent_res
    assert len(ent_res["business_capability_mapping"]) == 4
    assert (
        ent_res["executive_command_center"]["command_center_status"]
        == "GLOBAL EXECUTIVE COMMAND ONLINE"
    )

    # 13. Test GET /repositories/{repo_id}/asip/ecosystem-extensibility (Features 131-150)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/ecosystem-extensibility")
    assert res.status_code == 200
    eco_res = res.json()
    assert "plugin_sdk" in eco_res
    assert eco_res["plugin_sdk"]["sdk_version"] == "v2.4.0"
    assert len(eco_res["language_plugins"]) == 6
    assert eco_res["github_app"]["installation_status"] == "Connected & Authorized"
    assert eco_res["cli"]["binary"] == "codeatlas-cli"
    assert eco_res["marketplace"]["total_available_plugins"] == 28

    # 14. Test GET /repositories/{repo_id}/asip/mission-control (Signature Feature: Engineering Mission Control)
    res = client.get(f"/api/v1/repositories/{repo_id}/asip/mission-control")
    assert res.status_code == 200
    mc_res = res.json()
    assert (
        mc_res["mission_control_status"] == "GLOBAL ENGINEERING MISSION CONTROL ONLINE"
    )
    assert mc_res["pipeline_stages_count"] == 11
    assert len(mc_res["cascading_pipeline"]) == 11
    assert mc_res["cascading_pipeline"][0]["stage_id"] == "organization"
    assert mc_res["cascading_pipeline"][10]["stage_id"] == "executive_insights"
