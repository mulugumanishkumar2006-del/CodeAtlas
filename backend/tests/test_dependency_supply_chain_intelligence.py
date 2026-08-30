import pytest
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.dependency_intelligence_service import (
    dependency_intelligence_service,
    DependencyIntelligenceService,
)


# =========================================================================
# UNIT TESTS
# =========================================================================

def test_01_manifest_and_pinning_parsing():
    """
    Test 1: Manifests, version constraints, pinning status, and VCS credential redaction.
    """
    svc = DependencyIntelligenceService()

    # Redaction test
    raw_vcs = "git+https://user123:secretpass@github.com/myorg/privaterepo.git#egg=privaterepo"
    redacted = svc.redact_vcs_url(raw_vcs)
    assert "user123:secretpass" not in redacted
    assert "://****:****@" in redacted

    # Pinning tests
    assert svc.classify_pinning("==2.31.0")[0] == "PINNED"
    assert svc.classify_pinning("2.31.0")[0] == "PINNED"
    assert svc.classify_pinning("^1.2.0")[0] == "CONSTRAINED"
    assert svc.classify_pinning(">=1.0.0,<2.0.0")[0] == "CONSTRAINED"
    assert svc.classify_pinning("*")[0] == "UNCONSTRAINED"
    assert svc.classify_pinning(None)[0] == "UNCONSTRAINED"


def test_02_lockfile_package_json_and_drift():
    """
    Test 2: package.json and package-lock.json parsing.
    """
    svc = DependencyIntelligenceService()
    files_sources = {
        "package.json": '{"dependencies": {"react": "^18.2.0", "axios": ">=1.0.0"}, "devDependencies": {"typescript": "~5.0.0"}}',
        "package-lock.json": '{"packages": {"node_modules/react": {"version": "18.3.1"}, "node_modules/axios": {"version": "1.7.2"}}}',
    }
    deps = svc.parse_manifests(files_sources)
    assert len(deps) == 3

    react_dep = next(d for d in deps if d["name"] == "react")
    assert react_dep["ecosystem"] == "npm"
    assert react_dep["declared_version"] == "^18.2.0"
    assert react_dep["resolved_version"] == "18.3.1"
    assert react_dep["dependency_type"] == "DIRECT"

    ts_dep = next(d for d in deps if d["name"] == "typescript")
    assert ts_dep["dependency_type"] == "DEV"


def test_03_source_import_mapping_and_stdlib_filter():
    """
    Test 3: Maps source code imports to packages while filtering standard libraries and internal files.
    """
    svc = DependencyIntelligenceService()

    files = [
        {"id": "f1", "path": "services/auth.py", "language": "Python"},
        {"id": "f2", "path": "services/payment.py", "language": "Python"},
    ]
    files_sources = {
        "requirements.txt": "fastapi==0.110.0\nrequests>=2.28.0\ncelery==5.3.0\n",
        "services/auth.py": "import os\nimport sys\nimport json\nfrom fastapi import FastAPI, Depends\nimport requests\n",
        "services/payment.py": "import math\nfrom pathlib import Path\nfrom services.auth import authenticate\nimport requests\nimport stripe\n",
    }

    result = svc.analyze_repository_dependencies("test_repo", files, files_sources)
    deps = result["dependencies"]

    # fastapi: used in 1 file
    fastapi_dep = next(d for d in deps if d["name"] == "fastapi")
    assert fastapi_dep["file_count"] == 1
    assert not fastapi_dep["is_potentially_unused"]

    # requests: used in 2 files -> MEDIUM centrality
    req_dep = next(d for d in deps if d["name"] == "requests")
    assert req_dep["file_count"] == 2
    assert req_dep["centrality"] == "MEDIUM"

    # celery: declared but not imported -> potentially unused
    celery_dep = next(d for d in deps if d["name"] == "celery")
    assert celery_dep["file_count"] == 0
    assert celery_dep["is_potentially_unused"] is True

    # stripe: imported in payment.py but not in requirements.txt -> potentially undeclared
    stripe_dep = next((d for d in deps if d["name"] == "stripe"), None)
    assert stripe_dep is not None
    assert stripe_dep["is_potentially_undeclared"] is True

    # Ensure stdlib (os, sys, json, math, pathlib) and internal (services.auth) are NOT external dependencies
    dep_names = [d["name"].lower() for d in deps]
    for std in ["os", "sys", "json", "math", "pathlib", "services"]:
        assert std not in dep_names


# =========================================================================
# INTEGRATION TESTS
# =========================================================================

@pytest.fixture
async def setup_dep_repo_a(tmp_path, db_session: AsyncSession):
    import subprocess
    repo_dir = tmp_path / "dep_repo_a"
    repo_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Test Dev"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=str(repo_dir), check=True, capture_output=True)

    # Manifest
    f_req = repo_dir / "requirements.txt"
    f_req.write_text("fastapi==0.110.0\nrequests>=2.28.0\nredis==5.0.1\npytest\n", encoding="utf-8")

    # Source files
    f_api = repo_dir / "api" / "routes.py"
    f_api.parent.mkdir(parents=True, exist_ok=True)
    f_api.write_text("from fastapi import APIRouter\nimport requests\n", encoding="utf-8")

    f_svc = repo_dir / "services" / "client.py"
    f_svc.parent.mkdir(parents=True, exist_ok=True)
    f_svc.write_text("import requests\n", encoding="utf-8")

    subprocess.run(["git", "add", "."], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "feat: initial python dependencies"], cwd=str(repo_dir), check=True, capture_output=True)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="dep_repo_a",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)
    await db_session.refresh(repo)
    return repo


@pytest.fixture
async def setup_dep_repo_b(tmp_path, db_session: AsyncSession):
    import subprocess
    repo_dir = tmp_path / "dep_repo_b"
    repo_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Test Dev"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=str(repo_dir), check=True, capture_output=True)

    # Manifest
    f_pkg = repo_dir / "package.json"
    f_pkg.write_text('{"dependencies": {"zustand": "^4.5.0", "lodash": "4.17.21"}}', encoding="utf-8")

    f_app = repo_dir / "src" / "store.ts"
    f_app.parent.mkdir(parents=True, exist_ok=True)
    f_app.write_text('import { create } from "zustand";\n', encoding="utf-8")

    subprocess.run(["git", "add", "."], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "feat: initial typescript dependencies"], cwd=str(repo_dir), check=True, capture_output=True)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="dep_repo_b",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)
    await db_session.refresh(repo)
    return repo


@pytest.mark.asyncio
async def test_04_dependencies_summary_endpoint(client: AsyncClient, setup_dep_repo_a):
    """
    Test 4: GET /dependencies/summary returns real metrics.
    """
    repo = setup_dep_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/dependencies/summary")
    assert res.status_code == 200
    data = res.json()

    assert data["repository_id"] == repo.id
    assert data["total_dependencies"] >= 4
    assert data["direct_dependencies"] >= 3
    assert data["potentially_unused_dependencies"] >= 1  # redis
    assert "PyPI" in data["ecosystems_detected"]


@pytest.mark.asyncio
async def test_05_dependencies_list_and_filtering(client: AsyncClient, setup_dep_repo_a):
    """
    Test 5: GET /dependencies with ecosystem and search filtering.
    """
    repo = setup_dep_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/dependencies?search=requests")
    assert res.status_code == 200
    data = res.json()

    assert len(data) == 1
    req = data[0]
    assert req["name"] == "requests"
    assert req["file_count"] == 2
    assert len(req["importing_files"]) == 2


@pytest.mark.asyncio
async def test_06_dependency_detail_and_impact(client: AsyncClient, setup_dep_repo_a):
    """
    Test 6: GET /dependencies/{id} and /dependencies/{id}/impact.
    """
    repo = setup_dep_repo_a
    # Query detail for 'requests'
    res = await client.get(f"/api/v1/repositories/{repo.id}/dependencies/requests")
    assert res.status_code == 200
    dep = res.json()["dependency"]
    assert dep["name"] == "requests"

    # Query impact for 'requests'
    res_imp = await client.get(f"/api/v1/repositories/{repo.id}/dependencies/requests/impact")
    assert res_imp.status_code == 200
    imp = res_imp.json()
    assert imp["dependency_name"] == "requests"
    assert imp["total_affected_files"] == 2
    assert any("routes.py" in f for f in imp["affected_files"])
    assert any("client.py" in f for f in imp["affected_files"])


@pytest.mark.asyncio
async def test_07_repository_isolation_and_switching(
    client: AsyncClient, setup_dep_repo_a, setup_dep_repo_b
):
    """
    Test 7: Repository isolation: Repo A dependencies never leak into Repo B.
    """
    repo_a = setup_dep_repo_a
    repo_b = setup_dep_repo_b

    # Query A
    res_a = await client.get(f"/api/v1/repositories/{repo_a.id}/dependencies/summary")
    assert res_a.status_code == 200
    assert any(d["name"] == "fastapi" for d in res_a.json()["top_central_dependencies"])
    assert not any(d["name"] == "zustand" for d in res_a.json()["top_central_dependencies"])

    # Query B
    res_b = await client.get(f"/api/v1/repositories/{repo_b.id}/dependencies/summary")
    assert res_b.status_code == 200
    assert any(d["name"] == "zustand" for d in res_b.json()["top_central_dependencies"])
    assert not any(d["name"] == "fastapi" for d in res_b.json()["top_central_dependencies"])

    # Query A again
    res_a2 = await client.get(f"/api/v1/repositories/{repo_a.id}/dependencies/summary")
    assert res_a2.status_code == 200
    assert any(d["name"] == "fastapi" for d in res_a2.json()["top_central_dependencies"])


@pytest.mark.asyncio
async def test_08_qa_dependency_query_integration(client: AsyncClient, setup_dep_repo_a):
    """
    Test 8: Asking dependency questions in Q&A returns grounded supply-chain evidence.
    """
    repo = setup_dep_repo_a
    query_payload = {
        "question": "What external dependencies and libraries does this repository use?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
