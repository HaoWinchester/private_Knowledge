from __future__ import annotations


class ModelGateway:
    async def answer(self, question: str, context: str) -> str:
        return f"基于受控知识上下文回答：{question}\n\n{context[:500]}"
