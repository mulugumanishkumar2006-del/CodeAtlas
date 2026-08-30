import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "CodeAtlas API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    API_V1_STR: str = "/api/v1"

    # Server
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Database Configuration
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "codeatlas"
    DATABASE_URL: str | None = None

    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # Repository Storage (Phase 4: Git Acquisition)
    CODEATLAS_REPOSITORY_ROOT: str = Field(default="data/repositories")

    # LLM & RAG Configuration (Phase 9)
    LLM_PROVIDER: str = Field(default="gemini")  # gemini, openai, groq, ollama, deterministic
    LLM_MODEL: str = Field(default="gemini-2.5-flash")
    LLM_API_KEY: str | None = Field(default=None)
    LLM_BASE_URL: str | None = Field(default=None)

    @property
    def repository_storage_root(self) -> str:
        if os.path.isabs(self.CODEATLAS_REPOSITORY_ROOT):
            return os.path.abspath(self.CODEATLAS_REPOSITORY_ROOT)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        return os.path.abspath(os.path.join(project_root, self.CODEATLAS_REPOSITORY_ROOT))

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def sync_database_url(self) -> str:
        url = self.async_database_url
        if "+asyncpg" in url:
            url = url.replace("+asyncpg", "")
        return url

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
