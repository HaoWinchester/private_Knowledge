from __future__ import annotations

from fastapi import FastAPI

from src.api.dependencies.cors import configure_cors
from src.api.dependencies.error_handlers import register_error_handlers
from src.api.dependencies.request_context import CorrelationIdMiddleware
from src.api.routes import (
    application_policies,
    applications,
    auth,
    audit_events,
    authorization_requests,
    business_action_bindings,
    health,
    intake_requests,
    knowledge_items,
    knowledge_service,
    knowledge_versions,
    me,
    operations,
    qa,
    quality_signals,
    search,
)
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
    app.include_router(auth.router)
    app.include_router(me.router)
    app.include_router(knowledge_items.router)
    app.include_router(knowledge_versions.router)
    app.include_router(business_action_bindings.router)
    app.include_router(intake_requests.router)
    app.include_router(search.router)
    app.include_router(qa.router)
    app.include_router(authorization_requests.router)
    app.include_router(audit_events.router)
    app.include_router(quality_signals.router)
    app.include_router(operations.router)
    app.include_router(applications.router)
    app.include_router(application_policies.router)
    app.include_router(knowledge_service.router)
    return app


app = create_app()
