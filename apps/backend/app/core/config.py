from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeAtlas API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "local"
    LOG_LEVEL: str = "INFO"

    # JWT Settings
    JWT_SECRET: str = "supersecretcodeatlaskeychangeinproduction"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # GitHub OAuth Settings
    GITHUB_CLIENT_ID: str = "stub_client_id"
    GITHUB_CLIENT_SECRET: str = "stub_client_secret"
    GITHUB_REDIRECT_URI: str = "http://localhost:3000/login/callback"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True
    )


settings = Settings()
