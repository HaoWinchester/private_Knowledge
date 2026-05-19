from __future__ import annotations

from src.schemas.domain import AuthorizationRequest, AuthorizationReview
from src.services.database_store import store


class AuthorizationReviewService:
    def review(self, request_id: str, payload: AuthorizationReview) -> AuthorizationRequest | None:
        return store.review_authorization(request_id, payload)
