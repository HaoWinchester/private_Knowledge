from __future__ import annotations

from src.models.enums import ConfidentialityLevel


class ConfidentialityPolicy:
    def requires_approval(self, level: ConfidentialityLevel) -> bool:
        return level in {
            ConfidentialityLevel.SENSITIVE,
            ConfidentialityLevel.STRICTLY_CONTROLLED,
        }

    def metadata_only_until_approved(self, level: ConfidentialityLevel) -> bool:
        return level == ConfidentialityLevel.STRICTLY_CONTROLLED
