from __future__ import annotations

import httpx
import pytest

from src.core.settings import get_settings
from src.services import model_answer_service


@pytest.mark.asyncio
async def test_qa_route_uses_configured_live_model(
    client: httpx.AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FakeGateway:
        live_enabled = True

        def __init__(self, settings: object) -> None:
            self.settings = settings

        async def answer(self, question: str, context: str) -> str:
            assert "央企售前调研" in question
            assert "标题：" in context
            return "智谱模型生成的受控知识回答"

    monkeypatch.setenv("MODEL_PROVIDER", "zhipu")
    monkeypatch.setenv("ZHIPU_API_KEY", "test-key")
    get_settings.cache_clear()
    monkeypatch.setattr(model_answer_service, "ModelGateway", FakeGateway)

    response = await client.post(
        "/qa",
        json={"question": "央企售前调研", "businessContext": "contract"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["answer"] == "智谱模型生成的受控知识回答"
    assert payload["citations"]

    get_settings.cache_clear()


@pytest.mark.asyncio
async def test_knowledge_service_qa_route_uses_configured_live_model(
    client: httpx.AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FakeGateway:
        live_enabled = True

        def __init__(self, settings: object) -> None:
            self.settings = settings

        async def answer(self, question: str, context: str) -> str:
            assert "售前调研关注什么" in question
            assert "摘要：" in context
            return "上层应用可复用的模型回答"

    monkeypatch.setenv("MODEL_PROVIDER", "zhipu")
    monkeypatch.setenv("ZHIPU_API_KEY", "test-key")
    get_settings.cache_clear()
    monkeypatch.setattr(model_answer_service, "ModelGateway", FakeGateway)

    response = await client.post(
        "/api/v1/knowledge/query",
        json={
            "applicationId": "pilot-agent",
            "requesterUserId": "user-agent",
            "requestType": "qa",
            "businessContext": "方案生成",
            "input": "售前调研关注什么",
        },
    )

    assert response.status_code == 200
    assert response.json()["output"] == "上层应用可复用的模型回答"

    get_settings.cache_clear()
