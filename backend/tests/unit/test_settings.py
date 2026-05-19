from __future__ import annotations

from src.core.settings import Settings


def test_cors_origins_accept_comma_separated_env(monkeypatch) -> None:
    monkeypatch.setenv(
        "CORS_ALLOWED_ORIGINS",
        "http://127.0.0.1:3006,http://localhost:3006",
    )

    settings = Settings()

    assert settings.cors_allowed_origins == [
        "http://127.0.0.1:3006",
        "http://localhost:3006",
    ]
