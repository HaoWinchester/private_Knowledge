from __future__ import annotations

from src.schemas.domain import IntakeRequest, KnowledgeSubmissionCreate, ReviewDecision, ReviewDecisionCreate
from src.services.memory_store import store


class IntakeService:
    def submit(self, payload: KnowledgeSubmissionCreate, submitter_user_id: str) -> IntakeRequest:
        return store.create_submission(payload, submitter_user_id=submitter_user_id)

    def review(
        self, request_id: str, payload: ReviewDecisionCreate, reviewer_user_id: str
    ) -> ReviewDecision | None:
        return store.review_request(request_id, payload, reviewer_user_id)
