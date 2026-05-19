from __future__ import annotations

import re


class DesensitizationService:
    def redact(self, text: str) -> str:
        text = re.sub(r"1[3-9]\d{9}", "[手机号已脱敏]", text)
        text = re.sub(r"[\w.+-]+@[\w.-]+", "[邮箱已脱敏]", text)
        return text.replace("报价", "报价[已脱敏]")
