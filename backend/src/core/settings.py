from __future__ import annotations

from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        protected_namespaces=("settings_",),
    )

    app_name: str = "Private Knowledge Flow"
    app_env: str = "local"
    api_host: str = "0.0.0.0"
    api_port: int = 8001
    database_url: str = "sqlite+aiosqlite:///./knowledge_dev.db"
    redis_url: str = "redis://localhost:6379/0"
    object_storage_endpoint: str = "http://localhost:9000"
    object_storage_bucket: str = "knowledge"
    object_storage_access_key: str | None = None
    object_storage_secret_key: str | None = None
    opensearch_url: str = "http://localhost:9200"
    qdrant_url: str = "http://localhost:6333"
    identity_mode: str = "stub"
    model_gateway_url: str = "http://localhost:8088"
    cors_allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3004", "http://localhost:5173"]
    )

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
