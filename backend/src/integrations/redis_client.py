from __future__ import annotations

from dataclasses import dataclass

from redis.asyncio import Redis

from src.core.settings import get_settings


@dataclass(frozen=True)
class RedisClientFactory:
    url: str

    @classmethod
    def from_settings(cls) -> "RedisClientFactory":
        return cls(url=get_settings().redis_url)

    def create(self) -> Redis:
        return Redis.from_url(self.url, decode_responses=True)
