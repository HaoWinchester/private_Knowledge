from __future__ import annotations

from src.models.enums import ReviewGroup


class ReviewerRoutingService:
    def assign(self, review_group: ReviewGroup) -> str:
        return {
            ReviewGroup.KNOWLEDGE_ADMIN: "user-knowledge-admin",
            ReviewGroup.DOMAIN_EXPERT: "user-domain-expert",
            ReviewGroup.SECURITY_ADMIN: "user-security-admin",
        }[review_group]
