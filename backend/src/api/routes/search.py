from __future__ import annotations

from fastapi import APIRouter

from src.schemas.domain import SearchRequest, SearchResponse
from src.services.memory_store import store

router = APIRouter(tags=["search"])


@router.post("/search", operation_id="searchKnowledge")
async def search_knowledge(payload: SearchRequest) -> SearchResponse:
    return store.search(payload)
