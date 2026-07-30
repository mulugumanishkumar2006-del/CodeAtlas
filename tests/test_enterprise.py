# tests/test_enterprise.py

import uuid

import pytest
from app.core.database import Base, get_db
from app.enterprise.ai_portfolio_advisor import AIPortfolioAdvisorEngine
from app.enterprise.cross_repo_impact_analyzer import CrossRepoImpactAnalyzer
from app.enterprise.cross_repo_search import CrossRepoSearchEngine
from app.enterprise.enterprise_graph import EnterpriseKnowledgeGraph
from app.enterprise.enterprise_release_engine import EnterpriseReleaseEngine
from app.enterprise.enterprise_security_radar import EnterpriseSecurityRadar
from app.enterprise.performance_cost_engine import PerformanceCostEngine
from app.enterprise.portfolio_health_engine import PortfolioHealthEngine
from app.enterprise.team_intelligence_engine import TeamIntelligenceEngine
from app.enterprise.tech_stack_auditor import EnterpriseTechStackAuditor
from app.main import app
from app.models.organization import (
    CrossRepoDependency,
    EnterpriseMetricSnapshot,
    Organization,
)
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = "sqlite:///./test_enterprise_35_temp.db"
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


def setup_mock_org_data():
    db = TestingSessionLocal()
    try:
        user = User(
            id="user-demo-id",
            username="admin",
            name="Admin User",
            email="admin@acme.com",
        )
        db.add(user)
        db.commit()

        org = Organization(
            id=str(uuid.uuid4()),
            name="Acme Enterprise",
            slug="acme-enterprise-slug",
            domain="acme.com",
            health_score=93.0,
        )
        db.add(org)
        db.commit()

        repo1 = Repository(
            id=str(uuid.uuid4()),
            organization_id=org.id,
            name="auth-service-v1",
            full_name="acme/auth-service-v1",
            clone_url="https://github.com/acme/auth-service-v1.git",
            user_id="user-demo-id",
            language="Python",
        )
        repo2 = Repository(
            id=str(uuid.uuid4()),
            organization_id=org.id,
            name="web-frontend-client",
            full_name="acme/web-frontend-client",
            clone_url="https://github.com/acme/web-frontend-client.git",
            user_id="user-demo-id",
            language="TypeScript",
        )
        db.add_all([repo1, repo2])
        db.commit()

        dep = CrossRepoDependency(
            organization_id=org.id,
            source_repo_id=repo1.id,
            target_repo_id=repo2.id,
            dependency_type="HTTP_API",
            source_symbol="POST /api/v1/auth/login",
            target_symbol="useAuth() hook",
        )
        db.add(dep)
        db.commit()

        snapshot = EnterpriseMetricSnapshot(
            organization_id=org.id,
            month_label="2026-01",
            health_score=93.0,
            tech_debt_score=12.4,
            security_score=88.0,
            performance_score=91.5,
            monthly_cost_usd=181700.0,
        )
        db.add(snapshot)
        db.commit()

        return org.id, repo1.id, repo2.id
    finally:
        db.close()


def test_enterprise_knowledge_graph():
    org_id, repo1_id, repo2_id = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        graph_engine = EnterpriseKnowledgeGraph()
        result = graph_engine.build_organization_graph(db, org_id)

        assert result["organization_id"] == org_id
        assert result["total_nodes"] >= 3
        assert result["total_edges"] >= 1

        reg_res = graph_engine.register_cross_dependency(
            db, org_id, repo1_id, repo2_id, "GRPC", "AuthStub", "AuthClient"
        )
        assert reg_res["status"] == "REGISTERED"
    finally:
        db.close()


def test_cross_repo_impact_analyzer():
    org_id, repo1_id, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        analyzer = CrossRepoImpactAnalyzer()
        res = analyzer.analyze_impact(db, org_id, repo1_id, "POST /api/v1/auth/login")

        assert res["target_repository_id"] == repo1_id
        assert res["total_affected_repositories"] >= 1
    finally:
        db.close()


def test_tech_stack_auditor():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        auditor = EnterpriseTechStackAuditor()
        res = auditor.audit_organization(db, org_id)

        assert res["organization_id"] == org_id
        assert "framework_drift" in res
        assert "shared_library_candidates" in res
    finally:
        db.close()


def test_enterprise_security_radar():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        radar = EnterpriseSecurityRadar()
        res = radar.scan_organization_security(db, org_id)

        assert res["organization_id"] == org_id
        assert res["org_security_score"] > 0
    finally:
        db.close()


def test_portfolio_health_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        health_engine = PortfolioHealthEngine()
        res = health_engine.get_portfolio_health(db, org_id)

        assert res["organization_id"] == org_id
        assert res["organization_health_score"] >= 80.0
    finally:
        db.close()


def test_cross_repo_search_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        search_engine = CrossRepoSearchEngine()
        res = search_engine.search_organization(db, org_id, "Authentication")

        assert res["organization_id"] == org_id
        assert res["total_matches"] >= 1
    finally:
        db.close()


def test_team_intelligence_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        team_engine = TeamIntelligenceEngine()
        res = team_engine.analyze_team_intelligence(db, org_id)

        assert res["organization_id"] == org_id
        assert "bus_factor_hotspots" in res
        assert "ai_org_planner" in res
    finally:
        db.close()


def test_performance_cost_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        cost_engine = PerformanceCostEngine()
        res = cost_engine.analyze_performance_and_costs(db, org_id)

        assert res["organization_id"] == org_id
        assert "cloud_portfolio" in res
        assert "ai_budget_advisor" in res
    finally:
        db.close()


def test_ai_portfolio_advisor_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        advisor = AIPortfolioAdvisorEngine()
        res = advisor.advise_portfolio(db, org_id)

        assert res["organization_id"] == org_id
        assert len(res["modernization_priority_list"]) >= 1
        assert "executive_report" in res
    finally:
        db.close()


def test_enterprise_release_engine():
    org_id, _, _ = setup_mock_org_data()
    db = TestingSessionLocal()
    try:
        release_engine = EnterpriseReleaseEngine()
        res = release_engine.get_command_center_data(db, org_id)

        assert res["organization_id"] == org_id
        assert res["command_center_summary"]["org_health_score"] == 93.0
    finally:
        db.close()


def test_all_35_features_api_endpoints():
    org_id, repo1_id, _ = setup_mock_org_data()

    # 1. Create Organization API
    create_res = client.post(
        "/api/v1/enterprise/organizations",
        json={
            "name": "35 Feature Test Org",
            "slug": "test-org-35-slug",
            "domain": "test35.com",
        },
    )
    assert create_res.status_code == 201
    new_org_id = create_res.json()["id"]

    # 2. Health API
    health_res = client.get(f"/api/v1/enterprise/organizations/{new_org_id}/health")
    assert health_res.status_code == 200

    # 3. Graph API
    graph_res = client.get(f"/api/v1/enterprise/organizations/{org_id}/graph")
    assert graph_res.status_code == 200

    # 4. Search API
    search_res = client.get(
        f"/api/v1/enterprise/organizations/{org_id}/search?query=Authentication"
    )
    assert search_res.status_code == 200

    # 5. Team Intelligence API
    team_res = client.get(
        f"/api/v1/enterprise/organizations/{org_id}/team-intelligence"
    )
    assert team_res.status_code == 200

    # 6. Performance & Costs API
    cost_res = client.get(
        f"/api/v1/enterprise/organizations/{org_id}/performance-costs"
    )
    assert cost_res.status_code == 200

    # 7. AI Portfolio Advisor API
    adv_res = client.get(
        f"/api/v1/enterprise/organizations/{org_id}/ai-portfolio-advisor"
    )
    assert adv_res.status_code == 200

    # 8. Command Center API
    cc_res = client.get(f"/api/v1/enterprise/organizations/{org_id}/command-center")
    assert cc_res.status_code == 200
    assert cc_res.json()["command_center_summary"]["org_health_score"] == 93.0
