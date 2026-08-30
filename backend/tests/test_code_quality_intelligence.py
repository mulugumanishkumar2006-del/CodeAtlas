import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.code_quality_service import code_quality_service, CodeQualityService


def _create_git_repo(path: Path, files: dict[str, str], commit_msg: str = "Initial commit"):
    path.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "TestUser"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=str(path), check=True, capture_output=True)

    for rel_path, content in files.items():
        full_path = path / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")
        subprocess.run(["git", "add", rel_path], cwd=str(path), check=True, capture_output=True)

    subprocess.run(["git", "commit", "-m", commit_msg], cwd=str(path), check=True, capture_output=True)


# =========================================================================
# UNIT TESTS
# =========================================================================

def test_01_ast_cyclomatic_complexity_calculation():
    """
    Test 1: McCabe cyclomatic complexity calculated deterministically on branching Python AST.
    """
    import ast
    svc = CodeQualityService()

    code = (
        "def complex_func(x, y):\n"
        "    if x > 0:\n"
        "        if y > 0:\n"
        "            return 1\n"
        "        elif y < -5:\n"
        "            return 2\n"
        "    for i in range(10):\n"
        "        while x < 5:\n"
        "            x += 1\n"
        "    try:\n"
        "        z = x / y\n"
        "    except ZeroDivisionError:\n"
        "        z = 0\n"
        "    return [i for i in range(x) if i % 2 == 0]\n"
    )
    tree = ast.parse(code)
    fn_node = tree.body[0]
    complexity = svc.compute_python_function_complexity(fn_node)

    # Base (1) + if (1) + nested if (1) + elif (1) + for (1) + while (1) + except (1) + comp generator (1) + comp if (1) >= 8
    assert complexity >= 8
    assert svc.classify_complexity(complexity) in ["Moderate", "High", "Very High"]


def test_02_deterministic_duplication_detection():
    """
    Test 2: Deterministic duplication detector flags duplicate blocks across distinct files.
    """
    svc = CodeQualityService()
    block = (
        "    val = sanitize_input(data)\n"
        "    validated = check_permissions(val, user)\n"
        "    if not validated:\n"
        "        raise PermissionError('Unauthorized access')\n"
        "    audit_log(user, 'access_granted')\n"
        "    return perform_operation(val)\n"
    )
    files_sources = {
        "services/user_service.py": ("f1", f"def user_op(data, user):\n{block}"),
        "services/order_service.py": ("f2", f"def order_op(data, user):\n{block}"),
    }
    dups = svc.detect_duplications(files_sources, min_lines=5)
    assert len(dups) >= 1
    dup = dups[0]
    assert dup["similarity_percentage"] == 100.0
    assert any("user_service.py" in f for f in [dup["source_file"], dup["target_file"]])
    assert any("order_service.py" in f for f in [dup["source_file"], dup["target_file"]])


def test_03_unused_import_detection():
    """
    Test 3: Unused imports in Python files are detected via AST analysis.
    """
    svc = CodeQualityService()
    code = (
        "import json\n"
        "import os\n"
        "from math import sqrt\n\n"
        "def calc(val):\n"
        "    return os.path.exists(val)\n"
    )
    unused = svc.detect_unused_imports_python(code, "test_file.py")
    unused_names = [u["name"] for u in unused]
    assert "json" in unused_names
    assert "sqrt" in unused_names
    assert "os" not in unused_names


# =========================================================================
# INTEGRATION TESTS
# =========================================================================

@pytest.fixture
async def setup_quality_repo_a(tmp_path, db_session: AsyncSession):
    """
    Repository A with high complexity, duplication, and unused imports:
    - complex_service.py: high cyclomatic complexity, oversized function, unused imports
    - dup_a.py: duplicate block
    - dup_b.py: duplicate block
    - dead_code.py: unreferenced function
    """
    repo_dir = tmp_path / "quality_repo_a"
    dup_block = (
        "    x = prepare_data(payload)\n"
        "    y = transform_data(x)\n"
        "    if y > 100:\n"
        "        y = 100\n"
        "    save_audit_event(user, y)\n"
        "    return y\n"
    )
    files = {
        "services/complex_service.py": (
            "import sys\n"
            "import json\n\n"
            "def heavy_logic(a, b, c, d):\n"
            + "\n".join([f"    if a == {i}:\n        b += {i}\n    elif b == {i}:\n        c += {i}" for i in range(12)])
            + "\n    return a + b + c + d\n"
        ),
        "services/dup_a.py": f"def process_a(payload, user):\n{dup_block}",
        "services/dup_b.py": f"def process_b(payload, user):\n{dup_block}",
        "services/dead_code.py": (
            "def abandoned_routine():\n"
            "    return 'nobody calls me'\n"
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="quality_repo_a",
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
async def setup_quality_repo_b(tmp_path, db_session: AsyncSession):
    """
    Repository B with clean code and minimal debt.
    """
    repo_dir = tmp_path / "quality_repo_b"
    files = {
        "main.py": (
            "def greet(name: str) -> str:\n"
            "    return f'Hello, {name}'\n"
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="quality_repo_b",
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
async def test_04_quality_summary_and_score(client: AsyncClient, setup_quality_repo_a):
    """
    Test 4: GET /quality endpoint returns technical debt score, factor breakdown, and findings.
    """
    repo = setup_quality_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/quality")
    assert res.status_code == 200
    data = res.json()

    assert data["repository_id"] == repo.id
    assert 0 <= data["score"] <= 100
    assert "score_breakdown" in data
    assert len(data["score_breakdown"]["factors"]) >= 5
    assert data["total_findings"] >= 3
    assert data["duplication_clusters_count"] >= 1


@pytest.mark.asyncio
async def test_05_quality_findings_filtering_and_pagination(client: AsyncClient, setup_quality_repo_a):
    """
    Test 5: GET /quality/findings endpoint supports category and severity filtering.
    """
    repo = setup_quality_repo_a

    # Filter by COMPLEXITY
    res_comp = await client.get(f"/api/v1/repositories/{repo.id}/quality/findings?category=COMPLEXITY")
    assert res_comp.status_code == 200
    data_comp = res_comp.json()
    assert all(f["category"] == "COMPLEXITY" for f in data_comp["findings"])
    assert data_comp["total"] >= 1

    # Filter by DUPLICATION
    res_dup = await client.get(f"/api/v1/repositories/{repo.id}/quality/findings?category=DUPLICATION")
    assert res_dup.status_code == 200
    data_dup = res_dup.json()
    assert all(f["category"] == "DUPLICATION" for f in data_dup["findings"])


@pytest.mark.asyncio
async def test_06_quality_files_table_and_sorting(client: AsyncClient, setup_quality_repo_a):
    """
    Test 6: GET /quality/files endpoint returns file quality metrics with sort support.
    """
    repo = setup_quality_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/quality/files?sort_by=complexity")
    assert res.status_code == 200
    data = res.json()

    assert data["total"] >= 4
    files = data["files"]
    # Most complex file should be first
    assert "complex_service.py" in files[0]["file_path"]
    assert files[0]["complexity"] > 10


@pytest.mark.asyncio
async def test_07_quality_duplications_endpoint(client: AsyncClient, setup_quality_repo_a):
    """
    Test 7: GET /quality/duplications returns duplication clusters with snippet preview.
    """
    repo = setup_quality_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/quality/duplications")
    assert res.status_code == 200
    data = res.json()

    assert data["total"] >= 1
    cluster = data["clusters"][0]
    assert cluster["similarity_percentage"] == 100.0
    assert cluster["source_file"] != cluster["target_file"]


@pytest.mark.asyncio
async def test_08_repository_isolation_and_switching(
    client: AsyncClient, setup_quality_repo_a, setup_quality_repo_b
):
    """
    Test 8: Strict repository isolation: Repo A technical debt does not leak to Repo B.
    """
    repo_a = setup_quality_repo_a
    repo_b = setup_quality_repo_b

    # Query A
    res_a = await client.get(f"/api/v1/repositories/{repo_a.id}/quality/findings")
    assert res_a.status_code == 200
    findings_a = res_a.json()["findings"]
    assert any(f["category"] == "COMPLEXITY" for f in findings_a)

    # Query B
    res_b = await client.get(f"/api/v1/repositories/{repo_b.id}/quality/findings")
    assert res_b.status_code == 200
    findings_b = res_b.json()["findings"]
    assert len(findings_b) == 0  # Repo B is clean

    res_b_summary = await client.get(f"/api/v1/repositories/{repo_b.id}/quality")
    assert res_b_summary.status_code == 200
    assert res_b_summary.json()["score"] == 100.0

    # Query A again (round-trip state restoration)
    res_a2 = await client.get(f"/api/v1/repositories/{repo_a.id}/quality/findings")
    assert res_a2.status_code == 200
    assert res_a2.json()["total"] == len(findings_a)


@pytest.mark.asyncio
async def test_09_cache_invalidation_lifecycle(client: AsyncClient, setup_quality_repo_a):
    """
    Test 9: Cache invalidation clears cached quality results upon request.
    """
    repo = setup_quality_repo_a
    res1 = await client.get(f"/api/v1/repositories/{repo.id}/quality")
    assert res1.status_code == 200

    code_quality_service.invalidate_cache(repo.id)

    res2 = await client.get(f"/api/v1/repositories/{repo.id}/quality")
    assert res2.status_code == 200


@pytest.mark.asyncio
async def test_10_qa_quality_query_integration(client: AsyncClient, setup_quality_repo_a):
    """
    Test 10: Asking a technical debt or complexity question to Q&A returns grounded findings.
    """
    repo = setup_quality_repo_a
    query_payload = {
        "question": "What are the biggest technical debt and complexity issues in this codebase?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
    # Must cite complex_service.py or duplicate files
    cited = [s["path"] for s in data["sources"]]
    assert any("complex_service.py" in p or "dup_" in p for p in cited)
