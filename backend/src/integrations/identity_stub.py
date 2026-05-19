from __future__ import annotations

import json
from pathlib import Path

from src.schemas.user import UserContext

DEFAULT_USER = UserContext(
    userId="user-knowledge-admin",
    displayName="Li Xiaonan",
    departmentId="dept-presales",
    departmentName="Presales Consulting",
    roles=["knowledge_admin", "domain_expert"],
)


class IdentityStubClient:
    def __init__(self, seed_path: Path | None = None):
        self.seed_path = seed_path or Path(__file__).parents[3] / "infra" / "seed" / "users.json"

    def resolve_user(self, token: str | None = None) -> UserContext:
        users = self._load_users()
        if not users:
            return DEFAULT_USER
        if token:
            for user in users:
                if token in {user.userId, user.displayName}:
                    return user
        return users[0]

    def _load_users(self) -> list[UserContext]:
        if not self.seed_path.exists():
            return [DEFAULT_USER]
        raw_users = json.loads(self.seed_path.read_text(encoding="utf-8"))
        return [UserContext(**item) for item in raw_users]
