from __future__ import annotations

from src.models.enums import ConfidentialityLevel, Permission
from src.schemas.user import UserContext
from src.services.authorization_types import AuthorizationDecision


class AuthorizationService:
    def evaluate(
        self,
        *,
        user: UserContext,
        confidentiality: ConfidentialityLevel,
        permission: Permission,
        allowed_departments: set[str] | None = None,
        strict_approved: bool = False,
    ) -> AuthorizationDecision:
        if "knowledge_admin" in user.roles:
            return AuthorizationDecision(allowed=True)
        if confidentiality == ConfidentialityLevel.INTERNAL_PUBLIC:
            return AuthorizationDecision(allowed=True)
        if confidentiality == ConfidentialityLevel.DEPARTMENT_VISIBLE:
            allowed = allowed_departments is None or user.departmentId in allowed_departments
            return AuthorizationDecision(allowed=allowed, reason=None if allowed else "department_denied")
        if confidentiality == ConfidentialityLevel.STRICTLY_CONTROLLED and not strict_approved:
            return AuthorizationDecision(
                allowed=permission == Permission.VIEW_METADATA,
                metadata_only=True,
                reason="strict_access_required",
            )
        if confidentiality == ConfidentialityLevel.SENSITIVE and permission in {
            Permission.USE_IN_QA,
            Permission.USE_IN_AI_SERVICE,
        }:
            return AuthorizationDecision(allowed=True, metadata_only=True)
        return AuthorizationDecision(allowed=True)
