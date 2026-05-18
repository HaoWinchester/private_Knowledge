from __future__ import annotations

from fastapi import FastAPI

from src.api.dependencies.cors import configure_cors
from src.api.dependencies.error_handlers import register_error_handlers
from src.api.dependencies.request_context import CorrelationIdMiddleware
from src.api.routes import health, me
from src.core.logging import configure_logging
from src.core.settings import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging()
    app = FastAPI(
        title="Private Knowledge Flow API",
        version="0.1.0",
        description="Private enterprise knowledge base and governed knowledge service.",
    )
    app.add_middleware(CorrelationIdMiddleware)
    configure_cors(app, settings)
    register_error_handlers(app)
    app.include_router(health.router)
    app.include_router(me.router)
    return app


app = create_app()
