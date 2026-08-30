import os
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool, NullPool
from sqlalchemy import text

from backend.app.main import create_app
from backend.app.models.base import Base
from backend.app.db.session import get_db, set_session_factory, async_session_factory

TEST_DB_URL = os.getenv("TEST_DATABASE_URL", "sqlite+aiosqlite:///:memory:")
is_sqlite = "sqlite" in TEST_DB_URL

if is_sqlite:
    test_engine = create_async_engine(
        TEST_DB_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False,
    )
else:
    test_engine = create_async_engine(
        TEST_DB_URL,
        poolclass=NullPool,
        echo=False,
    )

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

TABLES_IN_ORDER = [
    "conversations",
    "simulations",
    "investigations",
    "findings",
    "metrics",
    "graph_relationships",
    "graph_nodes",
    "dependencies",
    "symbols",
    "files",
    "commits",
    "analyses",
    "repositories",
    "workspaces",
    "users",
]


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_session_db():
    set_session_factory(TestingSessionLocal)
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    if is_sqlite:
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    set_session_factory(async_session_factory)
    await test_engine.dispose()



@pytest_asyncio.fixture(autouse=True)
async def clean_database_per_test():
    yield
    async with test_engine.begin() as conn:
        if is_sqlite:
            for tbl in TABLES_IN_ORDER:
                await conn.execute(text(f"DELETE FROM {tbl};"))
        else:
            tables_csv = ", ".join(TABLES_IN_ORDER)
            await conn.execute(text(f"TRUNCATE TABLE {tables_csv} CASCADE;"))


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    app = create_app()

    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac


@pytest.fixture
def repo_a_python_origin(tmp_path):
    """
    Creates a real Git repository for Repository A: Python project
    """
    import subprocess
    origin_dir = tmp_path / "repo_a_python.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas Tester A"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester_a@codeatlas.dev"], cwd=origin_dir, check=True)

    # 1. src/core/config.py
    core_dir = origin_dir / "src" / "core"
    core_dir.mkdir(parents=True, exist_ok=True)
    (core_dir / "config.py").write_text(
        '"""App configuration module."""\n\n'
        'class Config:\n'
        '    """Core app config."""\n'
        '    app_name: str = "CodeAtlas"\n'
        '    debug: bool = True\n\n'
        'def get_config() -> Config:\n'
        '    """Retrieve singleton config."""\n'
        '    return Config()\n'
    )

    # 2. src/services/auth_service.py
    services_dir = origin_dir / "src" / "services"
    services_dir.mkdir(parents=True, exist_ok=True)
    (services_dir / "auth_service.py").write_text(
        '"""Authentication Service."""\n\n'
        'class AuthService:\n'
        '    def login(self, username: str, password_hash: str) -> bool:\n'
        '        """Verify login credentials."""\n'
        '        return username == "admin"\n\n'
        '    async def verify_token(self, token: str) -> bool:\n'
        '        """Async token validator."""\n'
        '        return len(token) > 10\n'
    )

    # 3. src/api/main.py
    api_dir = origin_dir / "src" / "api"
    api_dir.mkdir(parents=True, exist_ok=True)
    (api_dir / "main.py").write_text(
        '"""API Entrypoint."""\n\n'
        'def login_route(payload: dict):\n'
        '    return {"status": "ok"}\n\n'
        'def main():\n'
        '    print("Starting Python API server...")\n'
    )

    subprocess.run(["git", "add", "."], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit for Repository A"], cwd=origin_dir, check=True)
    return origin_dir


@pytest.fixture
def repo_b_typescript_origin(tmp_path):
    """
    Creates a real Git repository for Repository B: TypeScript project
    """
    import subprocess
    origin_dir = tmp_path / "repo_b_typescript.git"
    origin_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(["git", "init", "-b", "main", str(origin_dir)], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "CodeAtlas Tester B"], cwd=origin_dir, check=True)
    subprocess.run(["git", "config", "user.email", "tester_b@codeatlas.dev"], cwd=origin_dir, check=True)

    # 1. src/lib/config.ts
    lib_dir = origin_dir / "src" / "lib"
    lib_dir.mkdir(parents=True, exist_ok=True)
    (lib_dir / "config.ts").write_text(
        'export interface AppConfig {\n'
        '  apiUrl: string;\n'
        '  environment: string;\n'
        '}\n\n'
        'export const config: AppConfig = {\n'
        '  apiUrl: "http://localhost:8000",\n'
        '  environment: "production",\n'
        '};\n'
    )

    # 2. src/lib/auth.ts
    (lib_dir / "auth.ts").write_text(
        'export interface UserSession {\n'
        '  token: string;\n'
        '}\n\n'
        'export async function login(credentials: { user: string }): Promise<UserSession> {\n'
        '  return { token: "token-abc-123" };\n'
        '}\n\n'
        'export function logout(): void {\n'
        '  console.log("Logged out");\n'
        '}\n'
    )

    # 3. src/components/LoginCard.tsx
    comp_dir = origin_dir / "src" / "components"
    comp_dir.mkdir(parents=True, exist_ok=True)
    (comp_dir / "LoginCard.tsx").write_text(
        'export interface LoginCardProps {\n'
        '  title: string;\n'
        '}\n\n'
        'export const LoginCard: React.FC<LoginCardProps> = ({ title }) => {\n'
        '  return <div>{title}</div>;\n'
        '};\n'
    )

    subprocess.run(["git", "add", "."], cwd=origin_dir, check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit for Repository B"], cwd=origin_dir, check=True)
    return origin_dir

