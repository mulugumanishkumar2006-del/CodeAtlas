"""Integration tests for the Knowledge Loss Detector & Intelligence Engine (Phase 13)."""

import os
import sys

# Override DATABASE_URL to use SQLite for isolated tests before importing anything else
os.environ["DATABASE_URL"] = "sqlite:///./test_temp.db"

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.knowledge import (
    DocumentationAdvisor,
    DocumentationGap,
    DocumentationReport,
    ExpertiseGraph,
    KnowledgeEvolutionSnapshot,
    KnowledgeGapDetail,
    KnowledgeMemory,
    KnowledgeRiskItem,
    KnowledgeSummary,
    KnowledgeTransferPlan,
    ModuleOwnership,
    OwnershipDistribution,
)
from app.models.repository import Repository
from app.models.user import User
from fastapi.testclient import TestClient


def test_knowledge_detection_and_dashboard():
    # Ensure database tables are created cleanly in sqlite
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    repo_id = "test_knowledge_repo_id"
    user_id = "test_knowledge_user_id"

    # Setup database session
    db = SessionLocal()
    try:
        # Create user if not exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(
                id=user_id,
                username="knowledge_tester",
                name="Knowledge Tester",
                email="knowledge_tester@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous records for this repo
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(KnowledgeSummary).filter(
                KnowledgeSummary.repo_id == repo_id
            ).delete()
            db.query(OwnershipDistribution).filter(
                OwnershipDistribution.repo_id == repo_id
            ).delete()
            db.query(KnowledgeRiskItem).filter(
                KnowledgeRiskItem.repo_id == repo_id
            ).delete()
            db.query(DocumentationGap).filter(
                DocumentationGap.repo_id == repo_id
            ).delete()
            db.query(ModuleOwnership).filter(
                ModuleOwnership.repo_id == repo_id
            ).delete()
            db.query(DocumentationReport).filter(
                DocumentationReport.repo_id == repo_id
            ).delete()
            db.query(KnowledgeGapDetail).filter(
                KnowledgeGapDetail.repo_id == repo_id
            ).delete()
            db.query(ExpertiseGraph).filter(ExpertiseGraph.repo_id == repo_id).delete()
            db.query(KnowledgeTransferPlan).filter(
                KnowledgeTransferPlan.repo_id == repo_id
            ).delete()
            db.query(DocumentationAdvisor).filter(
                DocumentationAdvisor.repo_id == repo_id
            ).delete()
            db.delete(repo)
            db.commit()

        # Create repository
        repo = Repository(
            id=repo_id,
            name="knowledge-test-repo",
            full_name="tester/knowledge-test-repo",
            clone_url="https://github.com/tester/knowledge-test-repo.git",
            status="cloned",
            user_id=user_id,
        )
        db.add(repo)
        db.commit()

    finally:
        db.close()

    # Setup TestClient
    client = TestClient(app)

    # Override authentication dependency to return our mock user
    def override_get_current_user():
        test_db = SessionLocal()
        try:
            return test_db.query(User).filter(User.id == user_id).first()
        finally:
            test_db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        # 1. Test POST /repositories/{repo_id}/knowledge/analyze
        resp_pred = client.post(f"/api/v1/repositories/{repo_id}/knowledge/analyze")
        assert resp_pred.status_code == 200
        data_pred = resp_pred.json()
        assert data_pred["repo_id"] == repo_id
        assert "bus_factor" in data_pred
        assert "knowledge_concentration" in data_pred
        assert "documentation_quality" in data_pred
        assert "overall_risk" in data_pred

        # Verify simulated distribution structure (since it's a stub repo)
        assert len(data_pred["ownership_distribution"]) == 3
        for author in data_pred["ownership_distribution"]:
            assert "author_name" in author
            assert "author_email" in author
            assert "files_owned" in author
            assert "ownership_percentage" in author
            assert "risk_score" in author

        # Verify risk items structure
        assert len(data_pred["risk_items"]) > 0
        for item in data_pred["risk_items"]:
            assert "file_path" in item
            assert "risk_level" in item
            assert "reason" in item
            assert "owner_name" in item
            assert "owner_email" in item
            assert "mitigation_action" in item

        # Verify doc gaps structure
        assert len(data_pred["documentation_gaps"]) > 0
        for gap in data_pred["documentation_gaps"]:
            assert "file_path" in gap
            assert "complexity" in gap
            assert "documentation_coverage" in gap
            assert "comment_lines" in gap
            assert "code_lines" in gap
            assert "gap_severity" in gap

        # Verify undocumented architecture structure
        assert len(data_pred["undocumented_architecture"]) > 0
        for node in data_pred["undocumented_architecture"]:
            assert "id" in node
            assert "name" in node
            assert "type" in node
            assert "coupling" in node
            assert "reason" in node
            assert "mitigation" in node

        # Verify module ownerships (heatmap) structure
        assert len(data_pred["module_ownerships"]) == 4
        for m in data_pred["module_ownerships"]:
            assert "file_path" in m
            assert "primary_owner_name" in m
            assert "primary_owner_email" in m
            assert "secondary_owner_name" in m
            assert "secondary_owner_email" in m
            assert "num_contributors" in m
            assert "last_modified_at" in m
            assert "ownership_concentration" in m
            assert "risk_level" in m

        # Verify documentation report structure
        assert "documentation_report" in data_pred
        doc = data_pred["documentation_report"]
        assert doc is not None
        assert "documentation_score" in doc
        assert "readme_score" in doc
        assert "adr_score" in doc
        assert "api_doc_score" in doc
        assert "inline_comments_score" in doc
        assert "missing_docs_count" in doc
        assert "readme_details" in doc
        assert "adr_details" in doc
        assert "api_doc_details" in doc
        assert "inline_comments_details" in doc

        # Verify knowledge gaps structure
        assert "knowledge_gaps" in data_pred
        assert len(data_pred["knowledge_gaps"]) == 2
        for gap in data_pred["knowledge_gaps"]:
            assert "file_path" in gap
            assert "complexity" in gap
            assert "documentation_coverage" in gap
            assert "num_contributors" in gap
            assert "recent_changes_count" in gap
            assert "risk_score" in gap
            assert "risk_level" in gap
            assert "reasons" in gap
            assert "mitigation_action" in gap

        # 2. Test GET /repositories/{repo_id}/knowledge/dashboard
        resp_dash = client.get(f"/api/v1/repositories/{repo_id}/knowledge/dashboard")
        assert resp_dash.status_code == 200
        data_dash = resp_dash.json()
        assert data_dash["repo_id"] == repo_id
        assert data_dash["bus_factor"] == data_pred["bus_factor"]
        assert (
            data_dash["knowledge_concentration"] == data_pred["knowledge_concentration"]
        )
        assert data_dash["documentation_quality"] == data_pred["documentation_quality"]
        assert data_dash["overall_risk"] == data_pred["overall_risk"]
        assert len(data_dash["ownership_distribution"]) == len(
            data_pred["ownership_distribution"]
        )
        assert len(data_dash["risk_items"]) == len(data_pred["risk_items"])
        assert len(data_dash["documentation_gaps"]) == len(
            data_pred["documentation_gaps"]
        )
        assert len(data_dash["module_ownerships"]) == len(
            data_pred["module_ownerships"]
        )
        assert data_dash["module_ownerships"][0]["knowledge_risk_score"] > 0
        assert isinstance(data_dash["module_ownerships"][0]["risk_reasons"], list)
        assert (
            data_dash["documentation_report"]["documentation_score"]
            == data_pred["documentation_report"]["documentation_score"]
        )
        assert len(data_dash["knowledge_gaps"]) == len(data_pred["knowledge_gaps"])
        assert data_dash["expertise_graph"] is not None
        assert "nodes" in data_dash["expertise_graph"]
        assert "edges" in data_dash["expertise_graph"]
        assert data_dash["transfer_plans"] is not None
        assert len(data_dash["transfer_plans"]) > 0
        assert (
            data_dash["transfer_plans"][0]["projected_risk_score"]
            < data_dash["transfer_plans"][0]["current_risk_score"]
        )
        assert data_dash["doc_advisor"] is not None
        assert "missing_adrs" in data_dash["doc_advisor"]
        assert "team_resilience_score" in data_dash
        assert data_dash["team_resilience_score"] > 0

        # 3. Test GET /repositories/{repo_id}/knowledge/memory/search
        resp_search = client.get(
            f"/api/v1/repositories/{repo_id}/knowledge/memory/search?query=Redis"
        )
        assert resp_search.status_code == 200
        search_results = resp_search.json()
        assert len(search_results) > 0
        assert search_results[0]["topic"] == "Redis Cache"

        # 4. Test GET /repositories/{repo_id}/knowledge/evolution
        resp_ev = client.get(f"/api/v1/repositories/{repo_id}/knowledge/evolution")
        assert resp_ev.status_code == 200
        ev_results = resp_ev.json()
        assert len(ev_results) > 0
        assert ev_results[0]["event_type"] == "Single Maintainer Flagged"

        # 5. Test GET /repositories/{repo_id}/knowledge/executive
        resp_exec = client.get(f"/api/v1/repositories/{repo_id}/knowledge/executive")
        assert resp_exec.status_code == 200
        exec_data = resp_exec.json()
        assert exec_data["bus_factor"] > 0
        assert exec_data["team_resilience"] > 0
        assert exec_data["knowledge_risk"] > 0

    finally:
        # Clean up database records after tests run
        db_cleanup = SessionLocal()
        try:
            db_cleanup.query(KnowledgeSummary).filter(
                KnowledgeSummary.repo_id == repo_id
            ).delete()
            db_cleanup.query(OwnershipDistribution).filter(
                OwnershipDistribution.repo_id == repo_id
            ).delete()
            db_cleanup.query(KnowledgeRiskItem).filter(
                KnowledgeRiskItem.repo_id == repo_id
            ).delete()
            db_cleanup.query(DocumentationGap).filter(
                DocumentationGap.repo_id == repo_id
            ).delete()
            db_cleanup.query(ModuleOwnership).filter(
                ModuleOwnership.repo_id == repo_id
            ).delete()
            db_cleanup.query(DocumentationReport).filter(
                DocumentationReport.repo_id == repo_id
            ).delete()
            db_cleanup.query(KnowledgeGapDetail).filter(
                KnowledgeGapDetail.repo_id == repo_id
            ).delete()
            db_cleanup.query(ExpertiseGraph).filter(
                ExpertiseGraph.repo_id == repo_id
            ).delete()
            db_cleanup.query(KnowledgeTransferPlan).filter(
                KnowledgeTransferPlan.repo_id == repo_id
            ).delete()
            db_cleanup.query(DocumentationAdvisor).filter(
                DocumentationAdvisor.repo_id == repo_id
            ).delete()
            db_cleanup.query(KnowledgeMemory).filter(
                KnowledgeMemory.repo_id == repo_id
            ).delete()
            db_cleanup.query(KnowledgeEvolutionSnapshot).filter(
                KnowledgeEvolutionSnapshot.repo_id == repo_id
            ).delete()
            repo_cleanup = (
                db_cleanup.query(Repository).filter(Repository.id == repo_id).first()
            )
            if repo_cleanup:
                db_cleanup.delete(repo_cleanup)
            db_cleanup.commit()
        finally:
            db_cleanup.close()
            # Clean up the temp db file
            try:
                if os.path.exists("./test_temp.db"):
                    os.remove("./test_temp.db")
            except Exception:
                pass
