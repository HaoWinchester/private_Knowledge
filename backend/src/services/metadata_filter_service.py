from __future__ import annotations


class MetadataFilterService:
    def build(self, filters: dict[str, str] | None) -> dict[str, str]:
        return {key: value for key, value in (filters or {}).items() if value}
