import os

from neo4j import Driver, GraphDatabase


class Neo4jClient:
    def __init__(self):
        # Fallback to localhost for tests running outside Docker, or docker service name inside Docker
        self.url = os.getenv("NEO4J_URL", "bolt://localhost:7687")
        self.user = os.getenv("NEO4J_USER", "neo4j")
        self.password = os.getenv("NEO4J_PASSWORD", "codeatlaspass")
        self.driver: Driver = None

    def connect(self):
        try:
            self.driver = GraphDatabase.driver(
                self.url, auth=(self.user, self.password)
            )
            # Test connectivity
            self.driver.verify_connectivity()
            print(f"Connected to Neo4j database at {self.url} successfully!")
        except Exception as e:
            print(f"Failed to connect to Neo4j database at {self.url}: {e}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()
            self.driver = None
            print("Neo4j database connection closed.")

    def get_session(self):
        if not self.driver:
            self.connect()
        return self.driver.session() if self.driver else None


neo4j_client = Neo4jClient()
