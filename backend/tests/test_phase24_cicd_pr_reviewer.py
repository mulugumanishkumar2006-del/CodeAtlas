import pytest
import pytest_asyncio
from typing import Dict, Any
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.pull_request_review import PullRequestReview
from backend.app.services.pull_request_reviewer_service import pr_reviewer_service
from backend.app.services.ci_provider_service import get_ci_provider, GitHubProvider, GitLabProvider, LocalProvider


SAMPLE_UNIFIED_DIFF = """diff --git a/backend/app/api/payments.py b/backend/app/api/payments.py
index 1234567..89abcdef 100644
--- a/backend/app/api/payments.py
+++ b/backend/app/api/payments.py
@@ -10,6 +10,7 @@ import logging
+from backend.app.models.payment import PaymentModel
 
-def process_payment(amount: float, currency: str = "USD") -> bool:
+def process_payment(amount: float, currency: str = "USD", idempotency_key: str = None) -> bool:
     pass
diff --git a/backend/app/services/legacy_auth.py b/backend/app/services/legacy_auth.py
deleted file mode 100644
index 2345678..0000000
--- a/backend/app/services/legacy_auth.py
+++ /dev/null
@@ -1,15 +0,0 @@
-def verify_legacy_token(token: str) -> bool:
-    return True
diff --git a/packages/billing/index.ts b/packages/billing/index.ts
new file mode 100644
index 0000000..3456789
--- /dev/null
+++ b/packages/billing/index.ts
@@ -0,0 +1,10 @@
+export function calculateInvoice(total: number) {
+  return total * 1.2;
+}
diff --git a/requirements.txt b/requirements.txt
index 456789a..56789ab 100644
--- a/requirements.txt
+++ b/requirements.txt
@@ -3,2 +3,2 @@
-stripe==5.4.0
+stripe==7.1.0
-deprecated-lib==1.0.0
"""


import uuid
from backend.app.models.workspace import Workspace

async def create_test_workspace(db_session: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db_session.add(ws)
    await db_session.flush()
    return ws


@pytest_asyncio.fixture
async def sample_repo(db_session: AsyncSession) -> Repository:
    ws = await create_test_workspace(db_session)
    repo = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="test-org/codeatlas-pr-repo",
        url="https://github.com/test-org/codeatlas-pr-repo.git",
        default_branch="main",
        connection_status="connected",
        acquisition_status="READY",
        analysis_status="completed",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)
    return repo


@pytest_asyncio.fixture
async def sample_repo_b(db_session: AsyncSession) -> Repository:
    ws = await create_test_workspace(db_session)
    repo = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="test-org/isolated-repo-b",
        url="https://github.com/test-org/isolated-repo-b.git",
        default_branch="main",
        connection_status="connected",
        acquisition_status="READY",
        analysis_status="completed",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)
    return repo


@pytest.mark.asyncio
async def test_diff_parsing_and_hunks():
    """Verify unified diff is parsed into structured files, hunks, and line additions/deletions."""
    file_diffs = pr_reviewer_service.get_or_parse_diff(
        clone_path=None,
        base_sha="base123",
        head_sha="head456",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    assert len(file_diffs) == 4

    paths = [fd.get("new_path") or fd.get("old_path") for fd in file_diffs]
    assert "backend/app/api/payments.py" in paths
    assert "backend/app/services/legacy_auth.py" in paths
    assert "packages/billing/index.ts" in paths
    assert "requirements.txt" in paths

    # Check change types
    del_diff = next(fd for fd in file_diffs if "legacy_auth.py" in (fd.get("old_path") or ""))
    assert del_diff["change_type"] == "DELETED"

    add_diff = next(fd for fd in file_diffs if "packages/billing/index.ts" in (fd.get("new_path") or ""))
    assert add_diff["change_type"] == "ADDED"
    assert add_diff["additions"] > 0


@pytest.mark.asyncio
async def test_symbol_changes_and_signature_detection():
    """Verify changed symbols and signature changes are identified."""
    file_diffs = pr_reviewer_service.get_or_parse_diff(
        clone_path=None,
        base_sha="base123",
        head_sha="head456",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    # Simulate AST symbol change mapping
    symbol_changes = [
        {
            "symbol_name": "process_payment",
            "symbol_type": "function",
            "file_path": "backend/app/api/payments.py",
            "change_type": "SIGNATURE_CHANGED",
            "is_signature_changed": True,
            "evidence": "process_payment modified in payments.py",
        },
        {
            "symbol_name": "verify_legacy_token",
            "symbol_type": "function",
            "file_path": "backend/app/services/legacy_auth.py",
            "change_type": "DELETED",
            "evidence": "verify_legacy_token deleted with legacy_auth.py",
        },
    ]

    breaking = pr_reviewer_service.detect_breaking_changes(
        file_diffs=file_diffs,
        symbol_changes=symbol_changes,
        base_files=[],
    )

    assert breaking["total_breaking_count"] >= 2
    detected = breaking["detected"]
    entities = [d["entity"] for d in detected]
    assert "verify_legacy_token" in entities
    assert "process_payment" in entities


@pytest.mark.asyncio
async def test_architecture_review_and_layer_violations():
    """Verify architecture review flags illegal boundary crossings (e.g. Presentation importing Persistence)."""
    file_diffs = pr_reviewer_service.get_or_parse_diff(
        clone_path=None,
        base_sha="base123",
        head_sha="head456",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    arch_review = pr_reviewer_service.review_architecture(
        file_diffs=file_diffs,
        symbol_changes=[],
    )

    assert "boundary_violations" in arch_review
    violations = arch_review["boundary_violations"]
    # In SAMPLE_UNIFIED_DIFF, backend/app/api/payments.py imports backend.app.models.payment (Presentation -> Model/Persistence bypass)
    assert len(violations) >= 1
    assert violations[0]["violation_type"] == "LAYER_BYPASS"
    assert "payments.py" in violations[0]["source_file"]


@pytest.mark.asyncio
async def test_test_impact_and_gap_detection():
    """Verify test gap detection when high-impact production code changes without tests."""
    file_diffs = pr_reviewer_service.get_or_parse_diff(
        clone_path=None,
        base_sha="base123",
        head_sha="head456",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    symbol_changes = [
        {
            "symbol_name": "process_payment",
            "symbol_type": "function",
            "file_path": "backend/app/api/payments.py",
            "change_type": "SIGNATURE_CHANGED",
        }
    ]

    impact = pr_reviewer_service.analyze_test_impact(file_diffs, symbol_changes)

    assert impact["changed_test_files_count"] == 0
    assert impact["test_gaps_count"] > 0
    gap_types = [g["gap_type"] for g in impact["test_gaps"]]
    assert "NO_TEST_MODIFIED" in gap_types or "UNTESTED_CRITICAL_CHANGE" in gap_types


@pytest.mark.asyncio
async def test_monorepo_package_isolation():
    """Verify monorepo packages/workspaces are identified independently."""
    file_diffs = pr_reviewer_service.get_or_parse_diff(
        clone_path=None,
        base_sha="base123",
        head_sha="head456",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    packages = pr_reviewer_service.detect_monorepo_affected_packages(file_diffs, clone_path=None)
    pkg_names = [p["package"] for p in packages]

    assert "packages/billing" in pkg_names
    assert "root" in pkg_names


@pytest.mark.asyncio
async def test_ci_provider_abstractions():
    """Verify GitHub, GitLab, and Local provider formatting and webhook parsing."""
    gh = get_ci_provider("github")
    assert isinstance(gh, GitHubProvider)
    assert gh.name == "github"

    gl = get_ci_provider("gitlab")
    assert isinstance(gl, GitLabProvider)
    assert gl.name == "gitlab"

    local = get_ci_provider("local")
    assert isinstance(local, LocalProvider)

    # Test webhook parsing
    gh_webhook = {
        "action": "opened",
        "pull_request": {
            "number": 42,
            "title": "feat: Add billing gateway",
            "user": {"login": "octocat"},
            "base": {"sha": "0123456789abcdef0123456789abcdef01234567", "ref": "main"},
            "head": {"sha": "fedcba9876543210fedcba9876543210fedcba98", "ref": "feat/billing"},
        }
    }
    parsed = gh.parse_webhook_payload(gh_webhook)
    assert parsed["pr_number"] == "42"
    assert parsed["author"] == "octocat"
    assert parsed["base_commit_sha"] == "0123456789abcdef0123456789abcdef01234567"

    # Test Markdown formatting
    review_mock = {
        "review_gate_status": "BLOCKED",
        "base_commit_sha": "0123456789abcdef",
        "head_commit_sha": "fedcba9876543210",
        "summary": "Sample summary",
        "changed_files_count": 4,
        "changed_symbols_count": 2,
        "insertions": 15,
        "deletions": 8,
        "risk_delta": 18.5,
        "breaking_changes_count": 1,
        "architecture_violations_count": 1,
        "security_findings_count": 0,
        "reliability_findings_count": 0,
        "test_gaps_count": 1,
        "review_gates": {
            "breaking_changes": {"status": "BLOCKED", "message": "Breaking change detected"},
            "architecture": {"status": "PASSED", "message": "All clean"},
        },
        "review_comments": [
            {
                "file_path": "backend/app/api/payments.py",
                "line": 10,
                "finding": "Signature altered",
                "severity": "BLOCKING",
                "category": "BREAKING_CHANGE",
                "evidence": "Added parameter",
                "potential_impact": "Clients will break",
                "suggested_action": "Add default value",
            }
        ],
    }

    comment = gh.format_review_comment(review_mock)
    assert "BLOCKED" in comment
    assert "payments.py" in comment
    assert "Review Gates Evaluation" in comment


@pytest.mark.asyncio
async def test_pull_request_reviewer_service_end_to_end(db_session: AsyncSession, sample_repo: Repository):
    """Verify end-to-end PR review pipeline execution and database persistence."""
    review = await pr_reviewer_service.analyze_pull_request(
        db=db_session,
        repository_id=sample_repo.id,
        base_commit_sha="a" * 40,
        head_commit_sha="b" * 40,
        title="feat: New payment flow",
        pr_number="105",
        provider="github",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    assert review.id is not None
    assert review.repository_id == sample_repo.id
    assert review.pr_number == "105"
    assert review.changed_files_count == 4
    assert review.insertions > 0
    assert review.review_gate_status in ("PASSED", "WARNING", "BLOCKED")
    assert review.diff_summary_json is not None
    assert review.breaking_changes_json is not None
    assert review.architecture_review_json is not None

    # Verify review can be retrieved from DB
    persisted = await db_session.get(PullRequestReview, review.id)
    assert persisted is not None
    assert persisted.title == "feat: New payment flow"


@pytest.mark.asyncio
async def test_strict_repository_isolation(db_session: AsyncSession, sample_repo: Repository, sample_repo_b: Repository):
    """Verify that reviews for Repo A are completely isolated from Repo B."""
    # Create review in Repo A
    review_a = await pr_reviewer_service.analyze_pull_request(
        db=db_session,
        repository_id=sample_repo.id,
        base_commit_sha="1" * 40,
        head_commit_sha="2" * 40,
        title="Repo A Private Review",
        custom_diff=SAMPLE_UNIFIED_DIFF,
    )

    # Query for reviews in Repo B
    stmt_b = select(PullRequestReview).where(PullRequestReview.repository_id == sample_repo_b.id)
    res_b = await db_session.execute(stmt_b)
    reviews_b = res_b.scalars().all()

    # Repo B must have 0 reviews
    assert len(reviews_b) == 0

    # Ensure Repo A review cannot be accessed under Repo B id
    stmt_cross = select(PullRequestReview).where(
        PullRequestReview.id == review_a.id,
        PullRequestReview.repository_id == sample_repo_b.id,
    )
    res_cross = await db_session.execute(stmt_cross)
    assert res_cross.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_api_reviews_crud_and_status(client: AsyncClient, sample_repo: Repository):
    """Verify REST API endpoints for PR review creation, listing, details, diff, findings, and status."""
    # 1. POST create review
    create_payload = {
        "base_commit_sha": "c" * 40,
        "head_commit_sha": "d" * 40,
        "title": "API Review Test",
        "pr_number": "202",
        "provider": "github",
        "source_branch": "feature/checkout",
        "target_branch": "main",
        "author": "jane-doe",
        "custom_diff": SAMPLE_UNIFIED_DIFF,
    }

    res_post = await client.post(f"/api/v1/repositories/{sample_repo.id}/reviews", json=create_payload)
    assert res_post.status_code == 201
    data_post = res_post.json()
    assert data_post["title"] == "API Review Test"
    assert data_post["pr_number"] == "202"
    assert data_post["changed_files_count"] == 4
    review_id = data_post["id"]

    # 2. GET list reviews
    res_list = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews")
    assert res_list.status_code == 200
    data_list = res_list.json()
    assert data_list["total_reviews"] >= 1
    assert any(r["id"] == review_id for r in data_list["reviews"])

    # 3. GET review detail
    res_get = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews/{review_id}")
    assert res_get.status_code == 200
    data_get = res_get.json()
    assert data_get["id"] == review_id
    assert "review_gates" in data_get
    assert "diff_summary" in data_get

    # 4. GET review diff
    res_diff = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews/{review_id}/diff")
    assert res_diff.status_code == 200
    data_diff = res_diff.json()
    assert data_diff["review_id"] == review_id
    assert len(data_diff["files"]) == 4

    # 5. GET review findings
    res_findings = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews/{review_id}/findings")
    assert res_findings.status_code == 200
    data_findings = res_findings.json()
    assert "review_gate_status" in data_findings
    assert "findings" in data_findings

    # 6. GET review status
    res_status = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews/{review_id}/status")
    assert res_status.status_code == 200
    data_status = res_status.json()
    assert data_status["status"] == "completed"
    assert data_status["progress_percent"] == 100

    # 7. GET review config
    res_config = await client.get(f"/api/v1/repositories/{sample_repo.id}/reviews/config")
    assert res_config.status_code == 200
    assert "config" in res_config.json()


@pytest.mark.asyncio
async def test_api_webhook_receiver(client: AsyncClient, sample_repo: Repository):
    """Verify CI/CD webhook endpoint parses GitHub event and executes review."""
    gh_payload = {
        "action": "synchronize",
        "pull_request": {
            "number": 77,
            "title": "PR from Webhook",
            "user": {"login": "ci-bot"},
            "base": {"sha": "1234567890123456789012345678901234567890", "ref": "main"},
            "head": {"sha": "0987654321098765432109876543210987654321", "ref": "fix/bug"},
        }
    }

    res = await client.post(
        f"/api/v1/repositories/{sample_repo.id}/reviews/webhook/github",
        json=gh_payload,
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "review_id" in data
    assert "formatted_comment" in data


@pytest.mark.asyncio
async def test_large_pr_handling_and_truncation(db_session: AsyncSession, sample_repo: Repository):
    """Verify large PRs with hundreds of files are handled safely and respect configured limits."""
    # Generate massive diff with 250 files
    massive_diff_chunks = []
    for i in range(250):
        massive_diff_chunks.append(f"""diff --git a/src/module_{i}.py b/src/module_{i}.py
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/module_{i}.py
@@ -0,0 +1,5 @@
+def func_{i}():
+    return {i}
+""")
    massive_diff = "\n".join(massive_diff_chunks)

    review = await pr_reviewer_service.analyze_pull_request(
        db=db_session,
        repository_id=sample_repo.id,
        base_commit_sha="0" * 40,
        head_commit_sha="1" * 40,
        title="Massive PR Test",
        custom_diff=massive_diff,
        config_override={"limits": {"max_files": 50}},
    )

    # File count should be capped at 50
    assert review.changed_files_count == 50
    assert review.status == "completed"


@pytest.mark.asyncio
async def test_empty_or_no_diff_repository(db_session: AsyncSession, sample_repo: Repository):
    """Verify clean empty diff produces a PASSED gate with 0 findings."""
    review = await pr_reviewer_service.analyze_pull_request(
        db=db_session,
        repository_id=sample_repo.id,
        base_commit_sha="e" * 40,
        head_commit_sha="f" * 40,
        title="Empty PR Test",
        custom_diff="",
    )

    assert review.changed_files_count == 0
    assert review.insertions == 0
    assert review.deletions == 0
    assert review.review_gate_status == "PASSED"
    assert review.breaking_changes_count == 0


@pytest.mark.asyncio
async def test_config_override_custom_gates(db_session: AsyncSession, sample_repo: Repository):
    """Verify custom review gate thresholds are respected."""
    # Custom config disabling breaking changes gate
    custom_cfg = {
        "gates": {
            "breaking_changes": {"enabled": False},
            "risk_delta": {"enabled": True, "max_risk_delta": 99.0},
        }
    }

    review = await pr_reviewer_service.analyze_pull_request(
        db=db_session,
        repository_id=sample_repo.id,
        base_commit_sha="3" * 40,
        head_commit_sha="4" * 40,
        title="Custom Gates PR Test",
        custom_diff=SAMPLE_UNIFIED_DIFF,
        config_override=custom_cfg,
    )

    gates = review.review_gates_json or {}
    # breaking_changes should not be in gates or should be absent because it's disabled
    assert "breaking_changes" not in gates
    assert review.status == "completed"


@pytest.mark.asyncio
async def test_cli_runner_direct(sample_repo: Repository):
    """Verify local CLI runner executes directly and produces exit code 0 or 1."""
    from backend.app.cli import run_review

    exit_code = await run_review(
        repository_identifier=sample_repo.id,
        base_commit="5" * 40,
        head_commit="6" * 40,
        provider_name="local",
        output_format="json",
    )
    # Exit code is 0 (pass/warning) or 1 (blocked)
    assert exit_code in (0, 1)
