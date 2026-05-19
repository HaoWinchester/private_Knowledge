from __future__ import annotations

from src.services.desensitization_service import DesensitizationService


def test_desensitization_redacts_phone_email_and_quote() -> None:
    redacted = DesensitizationService().redact("电话13812345678 邮箱a@example.com 报价100万")

    assert "13812345678" not in redacted
    assert "a@example.com" not in redacted
    assert "报价[已脱敏]" in redacted
