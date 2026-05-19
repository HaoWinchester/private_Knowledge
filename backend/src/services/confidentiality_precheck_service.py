from __future__ import annotations

from src.models.enums import ConfidentialityLevel, ReviewGroup


class ConfidentialityPrecheckService:
    def review_group_for(self, level: ConfidentialityLevel) -> ReviewGroup:
        if level in {ConfidentialityLevel.SENSITIVE, ConfidentialityLevel.STRICTLY_CONTROLLED}:
            return ReviewGroup.SECURITY_ADMIN
        return ReviewGroup.KNOWLEDGE_ADMIN
