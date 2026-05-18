from __future__ import annotations

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import session_factory


async def get_session() -> AsyncIterator[AsyncSession]:
    async for session in session_factory():
        yield session
