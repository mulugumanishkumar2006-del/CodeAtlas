import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_repository_empty_state_and_crud_lifecycle(client: AsyncClient, repo_a_python_origin):
    # 1. Verify initial empty list - no fake data
    response = await client.get("/api/v1/repositories")
    assert response.status_code == 200
    assert response.json() == []

    # 2. Add real repository
    payload = {
        "name": "codeatlas/test-repo",
        "url": str(repo_a_python_origin.as_uri()),
        "default_branch": "main",
        "description": "Hermetic local repository for CRUD lifecycle testing",
    }
    create_res = await client.post("/api/v1/repositories", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == payload["name"]
    assert created_data["url"] == payload["url"]
    assert created_data["connection_status"] == "connected"
    assert created_data["analysis_status"] == "pending"
    repo_id = created_data["id"]

    # 3. Prevent duplicate creation
    dup_res = await client.post("/api/v1/repositories", json=payload)
    assert dup_res.status_code == 409

    # 4. Fetch repository by ID
    get_res = await client.get(f"/api/v1/repositories/{repo_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == repo_id

    # 5. List repositories and verify it contains 1 item
    list_res = await client.get("/api/v1/repositories")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1
    assert list_res.json()[0]["id"] == repo_id

    # 6. Delete repository
    del_res = await client.delete(f"/api/v1/repositories/{repo_id}")
    assert del_res.status_code == 204

    # 7. Verify empty again
    final_res = await client.get("/api/v1/repositories")
    assert final_res.status_code == 200
    assert final_res.json() == []
