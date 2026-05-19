from __future__ import annotations

from src.models.enums import ConfidentialityLevel
from src.services.confidentiality_policy import ConfidentialityPolicy


def test_strict_control_requires_approval() -> None:
    policy = ConfidentialityPolicy()

    assert policy.requires_approval(ConfidentialityLevel.STRICTLY_CONTROLLED) is True
    assert policy.metadata_only_until_approved(ConfidentialityLevel.STRICTLY_CONTROLLED) is True
