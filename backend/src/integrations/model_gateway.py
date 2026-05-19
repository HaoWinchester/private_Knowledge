from __future__ import annotations

from typing import Any

import httpx

from src.core.settings import Settings, get_settings


class ModelGatewayError(RuntimeError):
    """Raised when the live model gateway cannot produce an answer."""


class ModelGateway:
    def __init__(
        self,
        settings: Settings | None = None,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        self.settings = settings or get_settings()
        self.transport = transport

    @property
    def live_enabled(self) -> bool:
        return (
            self.settings.model_provider.lower() == "zhipu"
            and self.settings.zhipu_api_key is not None
        )

    async def answer(self, question: str, context: str) -> str:
        if not self.live_enabled:
            return self._stub_answer(question, context)

        api_key = self.settings.zhipu_api_key
        if api_key is None:
            return self._stub_answer(question, context)

        payload = {
            "model": self.settings.zhipu_model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "你是企业内部私有知识库助手。只能基于提供的受控知识上下文回答，"
                        "不得编造，不得输出未授权内容。回答要简洁、可执行，并提示需要复核引用版本。"
                    ),
                },
                {
                    "role": "user",
                    "content": f"问题：{question}\n\n受控知识上下文：\n{context}",
                },
            ],
            "do_sample": False,
            "max_tokens": 800,
        }
        url = f"{self.settings.zhipu_base_url.rstrip('/')}/chat/completions"
        headers = {"Authorization": f"Bearer {api_key.get_secret_value()}"}

        try:
            async with httpx.AsyncClient(
                transport=self.transport,
                timeout=self.settings.model_gateway_timeout_seconds,
            ) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
        except httpx.HTTPError as exc:
            raise ModelGatewayError("live model gateway request failed") from exc

        return self._extract_answer(response.json())

    @staticmethod
    def _stub_answer(question: str, context: str) -> str:
        return f"基于受控知识上下文回答：{question}\n\n{context[:500]}"

    @staticmethod
    def _extract_answer(data: dict[str, Any]) -> str:
        try:
            content = data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise ModelGatewayError("live model gateway returned an invalid response") from exc

        if isinstance(content, str):
            answer = content.strip()
        elif isinstance(content, list):
            answer = "".join(
                part.get("text", "")
                for part in content
                if isinstance(part, dict) and part.get("type") in {None, "text"}
            ).strip()
        else:
            answer = ""

        if not answer:
            raise ModelGatewayError("live model gateway returned an empty answer")
        return answer
