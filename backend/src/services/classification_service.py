from __future__ import annotations


class ClassificationService:
    def normalize_tags(self, tags: list[str]) -> list[str]:
        return sorted({tag.strip() for tag in tags if tag.strip()})
