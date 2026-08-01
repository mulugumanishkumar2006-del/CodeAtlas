import os

# Ensure sqlite for tests before loading app modules
os.environ["DATABASE_URL"] = "sqlite:///./test_oip_temp.db"

import app.models  # noqa: F401
import pytest
from app.core.database import Base, get_db
from app.main import app
from app.models.activity import Activity  # noqa: F401
from app.schemas.oip import OrganizationCreate, StrategyEngineRequest, TeamCreate
from app.services.oip_service import OrganizationIntelligenceService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_oip_temp.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
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


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


def test_organization_intelligence_service_initialization(db_session):
    service = OrganizationIntelligenceService(db_session)
    org = service.get_or_create_default_org()

    assert org is not None
    assert org.name == "Acme Global Engineering"
    assert org.total_repositories == 520
    assert org.total_teams == 48

    teams = service.get_teams(org.id)
    assert len(teams) >= 4

    repos = service.get_repository_intelligence(org.id)
    assert len(repos) >= 4

    legacy_repo = next(
        (r for r in repos if r.repository_id == "repo-legacy-billing-v1"), None
    )
    assert legacy_repo is not None
    assert legacy_repo.modernization_urgency == 94.0

    silos = service.get_knowledge_silos(org.id)
    assert len(silos) >= 3

    crits = service.get_business_criticality(org.id)
    assert len(crits) >= 3


def test_organization_creation_and_team_registration(db_session):
    service = OrganizationIntelligenceService(db_session)

    org_data = OrganizationCreate(
        name="Apex Enterprise",
        slug="apex-enterprise",
        description="Global Fintech Org",
        total_repositories=120,
        total_teams=15,
        total_engineers=200,
        strategic_goals=["Microservices Transformation", "Cloud Modernization"],
    )
    org = service.create_organization(org_data)
    assert org.id is not None
    assert org.name == "Apex Enterprise"

    team_data = TeamCreate(
        organization_id=org.id,
        name="Core Risk Engine",
        lead_name="Victor Vance",
        team_type="Risk & Compliance",
        headcount=10,
        owned_services=["risk-evaluator-v1"],
        key_members=["Victor Vance", "Sonia Gupta"],
    )
    team = service.create_team(team_data)
    assert team.id is not None
    assert team.name == "Core Risk Engine"
    assert team.organization_id == org.id


def test_executive_dashboard_and_strategy_engine(db_session):
    service = OrganizationIntelligenceService(db_session)
    org = service.get_or_create_default_org()

    exec_dashboard = service.generate_executive_dashboard(org.id)
    assert exec_dashboard.organization_name == "Acme Global Engineering"
    assert exec_dashboard.total_repos_analyzed == 520
    assert exec_dashboard.overloaded_teams_count >= 1
    assert exec_dashboard.at_risk_projects_count >= 1

    req = StrategyEngineRequest(organization_id=org.id, max_recommendations=3)
    resp = service.run_strategy_engine(req)
    assert resp.organization_id == org.id
    assert resp.total_recommendations >= 1
    assert (
        "projected" in resp.overall_projected_impact.lower()
        or "35%" in resp.overall_projected_impact
    )


def test_oip_api_endpoints(db_session):
    client = TestClient(app)

    # 1. Overview API
    resp = client.get("/api/v1/oip/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["name"] == "Acme Global Engineering"
    org_id = data["id"]

    # 2. Teams API
    resp = client.get(f"/api/v1/oip/teams?org_id={org_id}")
    assert resp.status_code == 200
    teams_data = resp.json()
    assert len(teams_data) >= 4

    # 3. Repositories API
    resp = client.get(f"/api/v1/oip/repositories?org_id={org_id}")
    assert resp.status_code == 200
    repos_data = resp.json()
    assert len(repos_data) >= 4

    # 4. Knowledge Silos API
    resp = client.get(f"/api/v1/oip/knowledge-silos?org_id={org_id}")
    assert resp.status_code == 200
    silos_data = resp.json()
    assert len(silos_data) >= 3

    # 5. Business Criticality API
    resp = client.get(f"/api/v1/oip/business-criticality?org_id={org_id}")
    assert resp.status_code == 200
    crits_data = resp.json()
    assert len(crits_data) >= 3

    # 6. Executive Dashboard API
    resp = client.get(f"/api/v1/oip/executive-dashboard?org_id={org_id}")
    assert resp.status_code == 200
    exec_data = resp.json()
    assert exec_data["total_repos_analyzed"] == 520

    # 7. Strategy Engine API
    resp = client.post(
        "/api/v1/oip/strategy-engine",
        json={"organization_id": org_id, "max_recommendations": 3},
    )
    assert resp.status_code == 200
    strat_data = resp.json()
    assert strat_data["organization_id"] == org_id
    assert len(strat_data["strategic_roadmap"]) >= 1

    # 8. Trigger Analysis API
    resp = client.post(f"/api/v1/oip/analyze?org_id={org_id}")
    assert resp.status_code == 200
    analysis_data = resp.json()
    assert analysis_data["status"] == "ANALYSIS_COMPLETE"

    # 9. Maturity Score API (Feature 5)
    resp = client.get(f"/api/v1/oip/maturity-score?org_id={org_id}")
    assert resp.status_code == 200
    mat_data = resp.json()
    assert mat_data["overall_score"] > 70.0
    assert mat_data["architecture_score"] >= 80.0

    # 10. 8-Tier Organization Graph API (Feature 4)
    resp = client.get(f"/api/v1/oip/org-graph?org_id={org_id}")
    assert resp.status_code == 200
    graph_data = resp.json()
    assert graph_data["total_nodes"] > 10
    assert graph_data["tier_counts"]["ORGANIZATION"] == 1
    assert graph_data["tier_counts"]["DEPARTMENT"] >= 3

    # 11. Team Deep Analytics API (Features 6-20)
    resp = client.get(f"/api/v1/oip/team-deep-analytics?org_id={org_id}")
    assert resp.status_code == 200
    deep_data = resp.json()
    assert len(deep_data) >= 2
    assert deep_data[0]["collaboration_index"] > 70.0

    # 12. Portfolio Deep Analytics API (Features 21-40)
    resp = client.get(f"/api/v1/oip/portfolio-deep-analytics?org_id={org_id}")
    assert resp.status_code == 200
    port_data = resp.json()
    assert len(port_data) >= 3
    assert port_data[0]["build_reliability_pct"] > 70.0

    # 13. Knowledge Deep Analytics API (Features 41-60)
    resp = client.get(f"/api/v1/oip/knowledge-deep-analytics?org_id={org_id}")
    assert resp.status_code == 200
    k_data = resp.json()
    assert k_data["org_knowledge_graph_size"] == 1450
    assert k_data["organization_learning_score"] == 84.0
    assert len(k_data["knowledge_transfer_recommendations"]) >= 2
    assert "EDR" in k_data["engineering_glossary"]

    # 14. Executive Deep Analytics API (Features 61-80)
    resp = client.get(f"/api/v1/oip/executive-deep-analytics?org_id={org_id}")
    assert resp.status_code == 200
    e_data = resp.json()
    assert e_data["dora_tier"] == "ELITE"
    assert e_data["deployment_frequency_per_day"] == 14.2
    assert e_data["cost_of_tech_debt_usd"] == 4200000.0
    assert e_data["engineering_roi_pct"] == 280.0
    assert "Q3 Executive Briefing" in e_data["executive_ai_briefing"]

    # 15. AI Org Intelligence API (Features 81-99)
    resp = client.get(f"/api/v1/oip/ai-org-intelligence?org_id={org_id}")
    assert resp.status_code == 200
    ai_data = resp.json()
    assert ai_data["ai_advisor_confidence_pct"] == 96.5
    assert len(ai_data["ai_hiring_recommendations"]) >= 2
    assert len(ai_data["ai_executive_chat_history"]) >= 2

    # 16. Engineering Earth Signature Feature API (Feature 100)
    resp = client.get(f"/api/v1/oip/engineering-earth?org_id={org_id}")
    assert resp.status_code == 200
    earth_nodes = resp.json()
    assert len(earth_nodes) >= 9
    assert any(
        n["team_name"] == "Payments & Billing" and n["health_status"] == "WARNING"
        for n in earth_nodes
    )
    assert any(
        n["team_name"] == "Platform Infrastructure" and n["health_status"] == "OPTIMAL"
        for n in earth_nodes
    )
