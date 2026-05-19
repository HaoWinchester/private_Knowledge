from __future__ import annotations

import json

import httpx
import pytest
from pydantic import SecretStr

from src.core.settings import Settings
from src.integrations.model_gateway import ModelGateway, ModelGatewayError


@pytest.mark.asyncio
async def test_zhipu_gateway_posts_chat_completion_payload() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        payload = json.loads(request.content)
        assert str(request.url) == "https://example.test/api/paas/v4/chat/completions"
        assert request.headers["Authorization"] == "Bearer test-key"
        assert payload["model"] == "glm-test"
        assert payload["messages"][1]["content"].startswith("问题：怎么做知识复用")
        return httpx.Response(200, json={"choices": [{"message": {"content": "真实模型回答"}}]})

    settings = Settings(
        model_provider="zhipu",
        zhipu_api_key=SecretStr("test-key"),
        zhipu_base_url="https://example.test/api/paas/v4",
        zhipu_model="glm-test",
    )
    gateway = ModelGateway(settings, transport=httpx.MockTransport(handler))

    answer = await gateway.answer("怎么做知识复用", "标题：售前方案\n摘要：复用方案模板")

    assert answer == "真实模型回答"


@pytest.mark.asyncio
async def test_gateway_uses_stub_when_live_model_is_disabled() -> None:
    gateway = ModelGateway(Settings(model_provider="stub"))

    answer = await gateway.answer("售前调研关注什么", "上下文片段")

    assert "售前调研关注什么" in answer
    assert "上下文片段" in answer


@pytest.mark.asyncio
async def test_gateway_rejects_invalid_live_response() -> None:
    settings = Settings(model_provider="zhipu", zhipu_api_key=SecretStr("test-key"))
    gateway = ModelGateway(
        settings,
        transport=httpx.MockTransport(lambda request: httpx.Response(200, json={"choices": []})),
    )

    with pytest.raises(ModelGatewayError):
        await gateway.answer("问题", "上下文")
