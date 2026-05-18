from __future__ import annotations

from celery import Celery

from src.core.settings import get_settings

settings = get_settings()
celery_app = Celery(
    "private_knowledge",
    broker=settings.redis_url,
    backend=settings.redis_url,
)
celery_app.conf.update(task_track_started=True, timezone="Asia/Shanghai")
