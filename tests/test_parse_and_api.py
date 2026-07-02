"""Integration test for repository parsing database storage and API endpoints."""

import os
import sys
import shutil

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from fastapi.testclient import TestClient
from app.main import app
from app.api.v1.auth import get_current_user
from app.core.database import SessionLocal
from app.models import base_models
from app.models.user import User
from app.models.repository import Repository
from app.models.file import File
from app.models.symbol import Symbol
from app.models.relationship import Relationship
from app.models.repository_statistics import RepositoryStatistics
from app.core.config import settings


def main():
    # 1. Setup mock repository files on disk
    repo_id = "test_repo_id"
    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
    shutil.rmtree(cloned_dir, ignore_errors=True)
    os.makedirs(cloned_dir, exist_ok=True)

    # Python test file
    py_content = """\
import os

def hello_world():
    \"\"\"This is a docstring.\"\"\"
    print("Hello, world!")

class Animal:
    def __init__(self, name):
        self.name = name
"""
    with open(os.path.join(cloned_dir, "hello.py"), "w", encoding="utf-8") as f:
        f.write(py_content)

    # JS test file
    js_content = """\
const greeting = "Hello JS";

function greet() {
    console.log(greeting);
}
"""
    with open(os.path.join(cloned_dir, "greet.js"), "w", encoding="utf-8") as f:
        f.write(js_content)

    # 2. Setup mock user and repository in the database
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == "12345").first()
        if not user:
            user = User(
                id="12345",
                username="test_user",
                name="Test User",
                email="test@example.com",
            )
            db.add(user)
            db.commit()

        # Delete any previous repo records
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if repo:
            db.query(RepositoryStatistics).filter(RepositoryStatistics.repository_id == repo_id).delete()
            db.query(Relationship).filter(Relationship.repository_id == repo_id).delete()
            db.query(File).filter(File.repository_id == repo_id).delete()
            db.delete(repo)
            db.commit()

        repo = Repository(
            id=repo_id,
            name="test-repo",
            full_name="test/test-repo",
            clone_url="https://github.com/test/test-repo.git",
            status="cloned",
            user_id="12345",
        )
        db.add(repo)
        db.commit()
    finally:
        db.close()

    # 3. Create client and override authentication dependency
    client = TestClient(app)

    def override_get_current_user():
        db = SessionLocal()
        try:
            return db.query(User).filter(User.id == "12345").first()
        finally:
            db.close()

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Debug db records
    db = SessionLocal()
    try:
        users = db.query(User).all()
        repos = db.query(Repository).all()
        print(f"DEBUG DB: {len(users)} users, {len(repos)} repos")
        for u in users:
            print(f"  User: id={u.id}, username={u.username}")
        for r in repos:
            print(f"  Repo: id={r.id}, name={r.name}, user_id={r.user_id}, status={r.status}")
    finally:
        db.close()

    print("=== Testing POST /repositories/{repo_id}/parse ===")
    response = client.post(f"/api/v1/repositories/{repo_id}/parse")
    print(f"Status code: {response.status_code}")
    if response.status_code != 200:
        print(f"Response body: {response.text}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    stats = response.json()
    print("Statistics returned:")
    print(stats)
    assert stats["total_files"] == 2
    assert "Python" in stats["languages"]
    assert "JavaScript" in stats["languages"]

    print("\n=== Testing GET /repositories/{repo_id}/files ===")
    response = client.get(f"/api/v1/repositories/{repo_id}/files")
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    files = response.json()
    print(f"Files returned ({len(files)}):")
    for f in files:
        print(f"  Path: {f['file_path']}, Lang: {f['language']}, Size: {f['size_bytes']} bytes")
        print(f"  Metrics: {f['metrics']}")
    assert len(files) == 2

    print("\n=== Testing GET /repositories/{repo_id}/symbols ===")
    response = client.get(f"/api/v1/repositories/{repo_id}/symbols")
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    symbols = response.json()
    print(f"Symbols returned ({len(symbols)}):")
    for sym in symbols:
        print(f"  Name: {sym['name']}, Kind: {sym['kind']}, Path: {sym['file_path']}")
    assert len(symbols) >= 3  # hello_world, Animal, greet (plus potentially constructors/methods if parsed)

    print("\n=== Testing GET /repositories/{repo_id}/metrics ===")
    response = client.get(f"/api/v1/repositories/{repo_id}/metrics")
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    metrics = response.json()
    print("Metrics returned:")
    print(metrics)
    assert "statistics" in metrics
    assert "files" in metrics

    print("\n=== Testing GET /repositories/{repo_id}/languages ===")
    response = client.get(f"/api/v1/repositories/{repo_id}/languages")
    print(f"Status code: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    languages = response.json()
    print("Languages returned:")
    print(languages)
    assert "languages" in languages
    assert languages["languages"]["Python"] == 1
    assert languages["languages"]["JavaScript"] == 1

    print("\nAll integration tests passed successfully!")

    # Cleanup test files on disk
    shutil.rmtree(cloned_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
