from __future__ import annotations

from src.core.settings import get_settings
from src.integrations.model_gateway import ModelGateway, ModelGatewayError
from src.schemas.domain import Citation, KnowledgeServiceResponse, QARequest, QAResponse
from src.services.database_store import store


def _context_from_citations(citations: list[Citation]) -> str:
    parts: list[str] = []
    for citation in citations:
        item = store.items.get(citation.knowledgeItemId)
        if item is None:
            continue
        parts.append(
            "\n".join(
                [
                    f"标题：{item.title}",
                    f"知识ID：{item.id}",
                    f"版本：{item.currentVersionId}",
                    f"密级：{item.confidentialityLevel.value}",
                    f"摘要：{item.contentPreview}",
                ]
            )
        )
    return "\n\n".join(parts)


def _should_skip_model(citations: list[Citation]) -> bool:
    return not citations or all(citation.fragmentRef == "metadata" for citation in citations)


async def enhance_qa_answer(payload: QARequest, response: QAResponse) -> QAResponse:
    if _should_skip_model(response.citations):
        return response

    gateway = ModelGateway(get_settings())
    if not gateway.live_enabled:
        return response

    context = _context_from_citations(response.citations)
    if not context:
        return response

    try:
        answer = await gateway.answer(payload.question, context)
    except ModelGatewayError:
        review_cue = response.reviewCue or ""
        suffix = "模型网关暂不可用，已返回本地规则答案。"
        return response.model_copy(update={"reviewCue": f"{review_cue} {suffix}".strip()})
    return response.model_copy(update={"answer": answer})


async def enhance_knowledge_service_answer(
    payload_input: str,
    response: KnowledgeServiceResponse,
) -> KnowledgeServiceResponse:
    if response.output is None or _should_skip_model(response.citations):
        return response

    gateway = ModelGateway(get_settings())
    if not gateway.live_enabled:
        return response

    context = _context_from_citations(response.citations)
    if not context:
        return response

    try:
        output = await gateway.answer(payload_input, context)
    except ModelGatewayError:
        return response
    return response.model_copy(update={"output": output})
