import os
import sys

import pytest

# Ensure apps/backend is in sys.path
backend_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "apps", "backend")
)
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Ensure DATABASE_URL is set for tests before app modules load
os.environ["DATABASE_URL"] = "sqlite:///./ci_test.db"

from app.core.database import Base, engine  # noqa: E402


@pytest.fixture(autouse=True, scope="session")
def prepare_test_database():
    Base.metadata.create_all(bind=engine)
    yield
