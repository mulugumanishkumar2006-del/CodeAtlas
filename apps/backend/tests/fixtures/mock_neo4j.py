"""
Mock Neo4j Test Fixture for CodeAtlas Integration Testing (v1.1)
"""
import pytest
from typing import Dict, Any, List

class MockNeo4jSession:
    """Mock session simulating Cypher query execution for tests."""
    def __init__(self):
        self.queries_executed: List[str] = []

    def run(self, query: str, parameters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        self.queries_executed.append(query)
        # Mock Graph Record return for architecture nodes
        return [
            {"node": {"id": "service-api", "name": "API Gateway", "type": "SERVICE"}},
            {"node": {"id": "db-main", "name": "PostgreSQL DB", "type": "DATABASE"}}
        ]

    def close(self):
        pass

class MockNeo4jDriver:
    """Mock driver for Neo4j database connections."""
    def __init__(self, uri: str = "bolt://localhost:7687", auth: tuple = ("neo4j", "password")):
        self.uri = uri
        self.auth = auth

    def session(self) -> MockNeo4jSession:
        return MockNeo4jSession()

    def close(self):
        pass

@pytest.fixture
def mock_neo4j_driver():
    """Pytest fixture yielding a mock Neo4j driver."""
    return MockNeo4jDriver()
