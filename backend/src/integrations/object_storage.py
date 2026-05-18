from __future__ import annotations

from dataclasses import dataclass

from src.core.settings import get_settings


@dataclass(frozen=True)
class ObjectStorageClient:
    endpoint: str
    bucket: str

    @classmethod
    def from_settings(cls) -> "ObjectStorageClient":
        settings = get_settings()
        return cls(endpoint=settings.object_storage_endpoint, bucket=settings.object_storage_bucket)

    def object_url(self, key: str) -> str:
        return f"{self.endpoint.rstrip('/')}/{self.bucket}/{key.lstrip('/')}"
