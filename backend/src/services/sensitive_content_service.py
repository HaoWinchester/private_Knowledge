from __future__ import annotations

from src.models.enums import ConfidentialityLevel


class SensitiveContentService:
    def classify(self, text: str) -> ConfidentialityLevel:
        keywords = ("合同", "报价", "薪酬", "客户机密", "严格受控")
        if any(keyword in text for keyword in keywords):
            return ConfidentialityLevel.SENSITIVE
        return ConfidentialityLevel.DEPARTMENT_VISIBLE
