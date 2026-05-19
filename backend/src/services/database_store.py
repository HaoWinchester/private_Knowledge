from __future__ import annotations

import json
import hashlib
import hmac
import secrets
import sqlite3
import threading
from datetime import date, timedelta
from pathlib import Path
from uuid import uuid4

from src.core.settings import get_settings
from src.models.enums import (
    AuthorizationStatus,
    ConfidentialityLevel,
    IntakeStatus,
    KnowledgeStatus,
    OperationResult,
    ReviewDecisionValue,
    ReviewGroup,
)
from src.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from src.schemas.domain import (
    ApplicationKeyRotationResponse,
    ApplicationPolicyState,
    ApplicationPolicyUpdate,
    ApplicationSummary,
    AuditEvent,
    AuthorizationRequest,
    AuthorizationRequestCreate,
    AuthorizationReview,
    BusinessActionBinding,
    BusinessActionBindingCreate,
    Citation,
    IntakeRequest,
    KnowledgeCard,
    KnowledgeItemDetail,
    KnowledgeItemUpdate,
    KnowledgeServiceRequest,
    KnowledgeServiceResponse,
    KnowledgeSubmissionCreate,
    KnowledgeVersion,
    KnowledgeVersionCreate,
    OperationsSummary,
    QARequest,
    QAResponse,
    QualitySignal,
    QualitySignalCreate,
    ReviewDecision,
    ReviewDecisionCreate,
    SearchRequest,
    SearchResponse,
    now_utc,
)
from src.schemas.user import UserContext


def _id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:8]}"


def _retention() -> date:
    return date.today() + timedelta(days=365 * 3)


QUICK_LOGIN_EMAIL = "admin@puhua.local"
QUICK_LOGIN_PASSWORD = "Puhua@2026"


def _sqlite_path(database_url: str) -> Path | str:
    prefixes = ("sqlite+aiosqlite:///", "sqlite:///")
    raw = None
    for prefix in prefixes:
        if database_url.startswith(prefix):
            raw = database_url.removeprefix(prefix)
            break
    if raw is None:
        raise ValueError("Only sqlite database_url values are supported for the local store")
    if raw == ":memory:":
        return raw
    path = Path(raw)
    return path if path.is_absolute() else Path.cwd() / path


class DatabaseStore:
    """SQLite-backed store used by the pilot API.

    The public methods intentionally mirror the previous in-memory store so the
    API route surface can move to database persistence without a broad rewrite.
    """

    def __init__(self) -> None:
        self._db_path = _sqlite_path(get_settings().database_url)
        self._lock = threading.RLock()
        self._ensure_schema()
        self._seed_if_empty()
        self._ensure_quick_login_user()

    @property
    def database_path(self) -> str:
        return str(self._db_path)

    def _connect(self) -> sqlite3.Connection:
        if self._db_path != ":memory:":
            Path(self._db_path).parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self._db_path, timeout=30, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _ensure_schema(self) -> None:
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS records (
                    collection TEXT NOT NULL,
                    record_id TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (collection, record_id)
                )
                """
            )
            conn.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_records_collection
                ON records(collection)
                """
            )
            conn.commit()

    def reset(self) -> None:
        with self._lock, self._connect() as conn:
            conn.execute("DELETE FROM records")
            conn.commit()
        self._seed_if_empty()
        self._ensure_quick_login_user()

    def _seed_if_empty(self) -> None:
        if self._count("knowledge_items") > 0:
            return
        self._put(
            "applications",
            "pilot-agent",
            ApplicationSummary(
                applicationId="pilot-agent",
                name="Agent 平台试点",
                status="connected",
                monthlyCalls=1284,
                deniedCalls=37,
                pilot=True,
            ),
        )
        self._put("application_policies", "singleton", ApplicationPolicyState())
        self._seed_knowledge_items()
        self.create_submission(
            KnowledgeSubmissionCreate(
                title="AI 产品经理岗位面试评估框架",
                knowledgeType="form",
                source={"sourceType": "form", "displayName": "招聘评估表"},
                responsibleUserId="user-knowledge-admin",
                roleDirection="HR",
                businessTheme="面试评估",
                confidentialityLevel=ConfidentialityLevel.DEPARTMENT_VISIBLE,
                summary="AI 产品经理候选人评估维度、追问清单和典型反例。",
                suggestedTags=["招聘", "AI产品", "面试"],
                applicableScope="HR、面试官",
                validUntil=date(2027, 5, 18),
            ),
            submitter_user_id="user-delivery",
        )

    def _seed_knowledge_items(self) -> None:
        samples = [
            (
                "K-2026-0142",
                "央企集团客户售前调研框架 v3.2",
                "面向央国企客户的售前调研模板，涵盖客户背景、IT 现状、采购流程、关键决策人和合规要求。",
                ConfidentialityLevel.PROJECT_VISIBLE,
                ["售前", "央企", "调研模板", "合规"],
                "售前、客户经理、方案架构师",
                "售前归档系统 / SAL-2026-0033",
            ),
            (
                "K-2026-0138",
                "数据中台微服务部署最佳实践",
                "K8s + Istio 微服务架构在央企内网环境的部署清单、网络策略和灾备方案。",
                ConfidentialityLevel.DEPARTMENT_VISIBLE,
                ["K8s", "微服务", "部署", "最佳实践"],
                "全体研发、运维",
                "GitLab / infra-handbook",
            ),
            (
                "K-2026-0119",
                "金融客户私有化部署交付复盘",
                "某股份制银行私有化部署项目的实施节奏、踩坑清单与改进建议。",
                ConfidentialityLevel.SENSITIVE,
                ["交付", "复盘", "私有化", "金融"],
                "交付、售前、研发",
                "项目目录 / DEL-2026-009",
            ),
            (
                "K-2026-0156",
                "国网招标项目合同条款定稿",
                "严格受控合同条款，仅展示元数据并引导授权审批。",
                ConfidentialityLevel.STRICTLY_CONTROLLED,
                ["合同", "招标", "严格受控", "国网"],
                "项目负责人、法务、CFO",
                "合同归档 / LEG-2026-0156",
            ),
        ]
        for item_id, title, summary, level, tags, scope, source in samples:
            version = KnowledgeVersion(
                id=f"{item_id}-v1",
                versionNumber=1,
                changeSummary="初始发布",
                effectiveStatus="effective",
                createdAt=now_utc(),
                retentionUntil=_retention(),
            )
            self._put_version(item_id, version)
            self._put(
                "knowledge_items",
                item_id,
                KnowledgeItemDetail(
                    id=item_id,
                    title=title,
                    summary=summary,
                    status=KnowledgeStatus.PUBLISHED,
                    confidentialityLevel=level,
                    currentVersionId=version.id,
                    sourceDisplayName=source,
                    applicableScope=scope,
                    tags=tags,
                    metadataOnly=level == ConfidentialityLevel.STRICTLY_CONTROLLED,
                    authorizationRequestAvailable=level == ConfidentialityLevel.STRICTLY_CONTROLLED,
                    contentPreview=None
                    if level == ConfidentialityLevel.STRICTLY_CONTROLLED
                    else f"{title}\n\n{summary}\n\n适用范围：{scope}",
                    versions=[version],
                    permissions=["view_metadata"]
                    if level == ConfidentialityLevel.STRICTLY_CONTROLLED
                    else ["view_metadata", "view_content", "cite"],
                ),
            )

    def _count(self, collection: str) -> int:
        with self._lock, self._connect() as conn:
            row = conn.execute(
                "SELECT COUNT(*) AS count FROM records WHERE collection = ?",
                (collection,),
            ).fetchone()
            return int(row["count"])

    def _put(self, collection: str, record_id: str, payload: object) -> None:
        if hasattr(payload, "model_dump"):
            data = payload.model_dump(mode="json")
        else:
            data = payload
        encoded = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                INSERT INTO records(collection, record_id, payload)
                VALUES (?, ?, ?)
                ON CONFLICT(collection, record_id)
                DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP
                """,
                (collection, record_id, encoded),
            )
            conn.commit()

    def _get(self, collection: str, record_id: str, model_cls):
        with self._lock, self._connect() as conn:
            row = conn.execute(
                "SELECT payload FROM records WHERE collection = ? AND record_id = ?",
                (collection, record_id),
            ).fetchone()
        if row is None:
            return None
        return model_cls.model_validate_json(row["payload"])

    def _all(self, collection: str, model_cls) -> dict[str, object]:
        with self._lock, self._connect() as conn:
            rows = conn.execute(
                "SELECT record_id, payload FROM records WHERE collection = ? ORDER BY rowid",
                (collection,),
            ).fetchall()
        return {row["record_id"]: model_cls.model_validate_json(row["payload"]) for row in rows}

    def _all_raw(self, collection: str) -> dict[str, dict[str, object]]:
        with self._lock, self._connect() as conn:
            rows = conn.execute(
                "SELECT record_id, payload FROM records WHERE collection = ? ORDER BY rowid",
                (collection,),
            ).fetchall()
        return {row["record_id"]: json.loads(row["payload"]) for row in rows}

    def _delete(self, collection: str, record_id: str) -> None:
        with self._lock, self._connect() as conn:
            conn.execute(
                "DELETE FROM records WHERE collection = ? AND record_id = ?",
                (collection, record_id),
            )
            conn.commit()

    @property
    def items(self) -> dict[str, KnowledgeItemDetail]:
        return self._all("knowledge_items", KnowledgeItemDetail)

    @property
    def versions(self) -> dict[str, list[KnowledgeVersion]]:
        grouped: dict[str, list[KnowledgeVersion]] = {}
        with self._lock, self._connect() as conn:
            rows = conn.execute(
                """
                SELECT record_id, payload
                FROM records
                WHERE collection = 'knowledge_versions'
                ORDER BY rowid
                """
            ).fetchall()
        for row in rows:
            item_id = row["record_id"].split("|", 1)[0]
            grouped.setdefault(item_id, []).append(
                KnowledgeVersion.model_validate_json(row["payload"])
            )
        for item_versions in grouped.values():
            item_versions.sort(key=lambda version: version.versionNumber)
        return grouped

    @property
    def intake_requests(self) -> dict[str, IntakeRequest]:
        return self._all("intake_requests", IntakeRequest)

    @property
    def authorization_requests(self) -> dict[str, AuthorizationRequest]:
        return self._all("authorization_requests", AuthorizationRequest)

    @property
    def audit_events(self) -> dict[str, AuditEvent]:
        return self._all("audit_events", AuditEvent)

    @property
    def quality_signals(self) -> dict[str, QualitySignal]:
        return self._all("quality_signals", QualitySignal)

    @property
    def business_bindings(self) -> dict[str, BusinessActionBinding]:
        return self._all("business_bindings", BusinessActionBinding)

    @property
    def applications(self) -> dict[str, ApplicationSummary]:
        return self._all("applications", ApplicationSummary)

    @property
    def application_policies(self) -> ApplicationPolicyState:
        return self._get("application_policies", "singleton", ApplicationPolicyState) or ApplicationPolicyState()

    @staticmethod
    def _normalize_email(email: str) -> str:
        return email.strip().lower()

    @staticmethod
    def _password_hash(password: str, salt: str) -> str:
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            120_000,
        )
        return digest.hex()

    def _find_auth_user_by_email(self, email: str) -> dict[str, object] | None:
        normalized = self._normalize_email(email)
        for record_id, user in self._all_raw("auth_users").items():
            if user.get("email") == normalized:
                return {**user, "__recordId": record_id}
        return None

    def _put_auth_user(
        self,
        *,
        user: UserContext,
        email: str,
        password: str,
        record_id: str | None = None,
    ) -> None:
        salt = secrets.token_hex(16)
        self._put(
            "auth_users",
            record_id or user.userId,
            {
                "email": self._normalize_email(email),
                "salt": salt,
                "passwordHash": self._password_hash(password, salt),
                "user": user.model_dump(mode="json"),
            },
        )

    def _ensure_quick_login_user(self) -> None:
        existing = self._find_auth_user_by_email(QUICK_LOGIN_EMAIL)
        user = UserContext(
            userId=str(existing.get("__recordId")) if existing else "user-quick-admin",
            displayName="李晓楠",
            departmentId="dept-presales",
            departmentName="售前咨询部",
            roles=["knowledge_admin", "domain_expert"],
        )
        self._put_auth_user(
            user=user,
            email=QUICK_LOGIN_EMAIL,
            password=QUICK_LOGIN_PASSWORD,
            record_id=user.userId,
        )

    def _create_session(self, user_id: str) -> str:
        token = f"pk_{secrets.token_urlsafe(32)}"
        self._put(
            "auth_sessions",
            token,
            {
                "token": token,
                "userId": user_id,
                "createdAt": now_utc().isoformat(),
            },
        )
        return token

    def register_user(self, payload: RegisterRequest) -> AuthResponse:
        email = self._normalize_email(payload.email)
        if not email or "@" not in email:
            raise ValueError("请输入有效邮箱")
        if len(payload.password) < 8:
            raise ValueError("密码至少需要 8 位")
        if self._find_auth_user_by_email(email):
            raise ValueError("该邮箱已经注册")

        user = UserContext(
            userId=_id("user"),
            displayName=payload.displayName.strip(),
            departmentId=f"dept-{payload.departmentName.strip() or 'knowledge'}",
            departmentName=payload.departmentName.strip() or "知识中台",
            roles=[payload.role],
        )
        self._put_auth_user(
            user=user,
            email=email,
            password=payload.password,
        )
        return AuthResponse(token=self._create_session(user.userId), user=user)

    def login_user(self, payload: LoginRequest) -> AuthResponse | None:
        user_record = self._find_auth_user_by_email(payload.email)
        if not user_record:
            return None
        salt = str(user_record["salt"])
        expected = str(user_record["passwordHash"])
        actual = self._password_hash(payload.password, salt)
        if not hmac.compare_digest(actual, expected):
            return None
        user = UserContext.model_validate(user_record["user"])
        return AuthResponse(token=self._create_session(user.userId), user=user)

    def resolve_user_by_token(self, token: str | None) -> UserContext | None:
        if not token:
            return None
        session = self._all_raw("auth_sessions").get(token)
        if not session:
            return None
        user_record = self._all_raw("auth_users").get(str(session["userId"]))
        if not user_record:
            return None
        return UserContext.model_validate(user_record["user"])

    def _put_version(self, item_id: str, version: KnowledgeVersion) -> None:
        self._put("knowledge_versions", f"{item_id}|{version.id}", version)

    def _get_versions(self, item_id: str) -> list[KnowledgeVersion]:
        versions = self.versions.get(item_id, [])
        versions.sort(key=lambda version: version.versionNumber)
        return versions

    def _put_item(self, item: KnowledgeItemDetail) -> None:
        item.versions = self._get_versions(item.id)
        self._put("knowledge_items", item.id, item)

    def audit(
        self,
        event_type: str,
        *,
        result: OperationResult = OperationResult.SUCCESS,
        actor_user_id: str | None = None,
        application_id: str | None = None,
        knowledge_item_id: str | None = None,
        context: str | None = None,
        reason: str | None = None,
    ) -> AuditEvent:
        event = AuditEvent(
            id=_id("AUD"),
            actorUserId=actor_user_id,
            applicationId=application_id,
            knowledgeItemId=knowledge_item_id,
            eventType=event_type,
            operationContext=context,
            result=result,
            reason=reason,
            createdAt=now_utc(),
            retentionUntil=_retention(),
        )
        self._put("audit_events", event.id, event)
        return event

    def list_items(
        self,
        query: str | None = None,
        *,
        status: KnowledgeStatus | None = None,
        confidentiality_level: ConfidentialityLevel | None = None,
        published_only: bool = False,
    ) -> list[KnowledgeCard]:
        items = list(self.items.values())
        if published_only:
            items = [item for item in items if item.status == KnowledgeStatus.PUBLISHED]
        if status:
            items = [item for item in items if item.status == status]
        if confidentiality_level:
            items = [item for item in items if item.confidentialityLevel == confidentiality_level]
        if query:
            lowered = query.lower()
            items = [
                item
                for item in items
                if lowered in item.title.lower()
                or lowered in item.summary.lower()
                or any(lowered in tag.lower() for tag in item.tags)
            ]
        return [KnowledgeCard(**item.model_dump()) for item in items]

    def get_item(self, item_id: str) -> KnowledgeItemDetail | None:
        item = self._get("knowledge_items", item_id, KnowledgeItemDetail)
        if item:
            item.versions = self._get_versions(item_id)
        return item

    def create_submission(
        self, payload: KnowledgeSubmissionCreate, *, submitter_user_id: str
    ) -> IntakeRequest:
        item_id = _id("K")
        version = KnowledgeVersion(
            id=f"{item_id}-v1",
            versionNumber=1,
            changeSummary="初始提交",
            effectiveStatus="draft",
            createdAt=now_utc(),
            retentionUntil=_retention(),
        )
        self._put_version(item_id, version)
        item = KnowledgeItemDetail(
            id=item_id,
            title=payload.title,
            summary=payload.summary,
            status=KnowledgeStatus.PENDING_REVIEW,
            confidentialityLevel=payload.confidentialityLevel,
            currentVersionId=version.id,
            sourceDisplayName=payload.source.displayName,
            applicableScope=payload.applicableScope,
            tags=payload.suggestedTags,
            metadataOnly=False,
            authorizationRequestAvailable=False,
            contentPreview=payload.summary,
            versions=[version],
            permissions=["view_metadata"],
        )
        self._put("knowledge_items", item_id, item)
        review_group = (
            ReviewGroup.SECURITY_ADMIN
            if payload.confidentialityLevel
            in {ConfidentialityLevel.SENSITIVE, ConfidentialityLevel.STRICTLY_CONTROLLED}
            else ReviewGroup.KNOWLEDGE_ADMIN
        )
        request = IntakeRequest(
            id=_id("REV"),
            knowledgeItemId=item_id,
            requestType="create",
            status=IntakeStatus.SUBMITTED,
            reviewGroup=review_group,
            createdAt=now_utc(),
        )
        self._put("intake_requests", request.id, request)
        self.audit("submit", actor_user_id=submitter_user_id, knowledge_item_id=item_id)
        return request

    def update_item(self, item_id: str, payload: KnowledgeItemUpdate) -> IntakeRequest | None:
        item = self.get_item(item_id)
        if not item:
            return None
        update = payload.model_dump(exclude_none=True)
        if "summary" in update:
            item.summary = update["summary"]
        if "applicableScope" in update:
            item.applicableScope = update["applicableScope"]
        if "confidentialityLevel" in update:
            item.confidentialityLevel = update["confidentialityLevel"]
        item.status = KnowledgeStatus.PENDING_REVIEW
        self._put_item(item)
        request = IntakeRequest(
            id=_id("REV"),
            knowledgeItemId=item_id,
            requestType="update",
            status=IntakeStatus.SUBMITTED,
            reviewGroup=ReviewGroup.KNOWLEDGE_ADMIN,
            createdAt=now_utc(),
        )
        self._put("intake_requests", request.id, request)
        return request

    def create_version(self, item_id: str, payload: KnowledgeVersionCreate) -> IntakeRequest | None:
        item = self.get_item(item_id)
        if not item:
            return None
        next_number = len(self._get_versions(item_id)) + 1
        version = KnowledgeVersion(
            id=f"{item_id}-v{next_number}",
            versionNumber=next_number,
            changeSummary=payload.changeSummary,
            effectiveStatus="draft",
            createdAt=now_utc(),
            retentionUntil=_retention(),
        )
        self._put_version(item_id, version)
        item.currentVersionId = version.id
        item.status = KnowledgeStatus.PENDING_REVIEW
        self._put_item(item)
        request = IntakeRequest(
            id=_id("REV"),
            knowledgeItemId=item_id,
            requestType="update",
            status=IntakeStatus.SUBMITTED,
            reviewGroup=ReviewGroup.KNOWLEDGE_ADMIN,
            createdAt=now_utc(),
        )
        self._put("intake_requests", request.id, request)
        self.audit("version_change", knowledge_item_id=item_id)
        return request

    def review_request(
        self, request_id: str, payload: ReviewDecisionCreate, reviewer_user_id: str
    ) -> ReviewDecision | None:
        request = self._get("intake_requests", request_id, IntakeRequest)
        if not request:
            return None
        item = self.get_item(request.knowledgeItemId)
        if not item:
            return None
        if payload.decision == ReviewDecisionValue.APPROVE:
            request.status = IntakeStatus.APPROVED
            item.status = KnowledgeStatus.PUBLISHED
            versions = self._get_versions(item.id)
            for version in versions:
                version.effectiveStatus = "superseded"
                self._put_version(item.id, version)
            if versions:
                versions[-1].effectiveStatus = "effective"
                self._put_version(item.id, versions[-1])
            event_type = "publish"
        elif payload.decision == ReviewDecisionValue.REQUEST_RECTIFICATION:
            request.status = IntakeStatus.RECTIFICATION_REQUIRED
            item.status = KnowledgeStatus.RECTIFICATION_REQUIRED
            event_type = "review"
        else:
            request.status = IntakeStatus.REJECTED
            item.status = KnowledgeStatus.REJECTED
            event_type = "review"
        decision = ReviewDecision(
            id=_id("DEC"),
            reviewerUserId=reviewer_user_id,
            decision=payload.decision,
            comments=payload.comments,
            reasonCode=payload.reasonCode,
            createdAt=now_utc(),
        )
        self._put("review_decisions", decision.id, decision)
        self._put("intake_requests", request.id, request)
        self._put_item(item)
        self.audit(event_type, actor_user_id=reviewer_user_id, knowledge_item_id=item.id)
        return decision

    def search(self, payload: SearchRequest) -> SearchResponse:
        event = self.audit("search", context=payload.query)
        confidentiality_level = None
        if payload.filters.get("confidentialityLevel"):
            confidentiality_level = ConfidentialityLevel(payload.filters["confidentialityLevel"])
        return SearchResponse(
            items=self.list_items(
                payload.query,
                confidentiality_level=confidentiality_level,
                published_only=True,
            ),
            auditEventId=event.id,
        )

    def answer(self, payload: QARequest) -> QAResponse:
        strict_match = next(
            (
                item
                for item in self.items.values()
                if item.confidentialityLevel == ConfidentialityLevel.STRICTLY_CONTROLLED
                and (
                    payload.question in item.title
                    or "合同" in payload.question
                    or "严格受控" in payload.question
                )
            ),
            None,
        )
        if strict_match:
            event = self.audit(
                "access_denied",
                result=OperationResult.DENIED,
                knowledge_item_id=strict_match.id,
                context=payload.question,
                reason="strict_control_requires_approval",
            )
            return QAResponse(
                answer="你查询的内容涉及严格受控知识。当前仅可展示元数据，请先提交访问授权申请。",
                citations=[
                    Citation(
                        knowledgeItemId=strict_match.id,
                        knowledgeVersionId=strict_match.currentVersionId,
                        fragmentRef="metadata",
                        citationType="qa_source",
                    )
                ],
                reviewCue="严格受控知识需显式审批后才可返回脱敏片段或正文引用。",
                auditEventId=event.id,
            )
        matches = self.list_items(payload.question, published_only=True)[:2] or self.list_items(
            published_only=True
        )[:2]
        citations = [
            Citation(
                knowledgeItemId=item.id,
                knowledgeVersionId=item.currentVersionId,
                fragmentRef="preview",
                citationType="qa_source",
            )
            for item in matches
        ]
        event = self.audit("qa_call", context=payload.question)
        titles = "、".join(item.title for item in matches)
        return QAResponse(
            answer=f"根据已授权知识，建议优先参考：{titles}。当前回答已附带引用并记录审计。",
            citations=citations,
            reviewCue="请在正式复用前确认引用版本和适用范围。",
            auditEventId=event.id,
        )

    def create_authorization(
        self, payload: AuthorizationRequestCreate
    ) -> AuthorizationRequest:
        request = AuthorizationRequest(
            id=_id("AUTH"),
            knowledgeItemId=payload.knowledgeItemId,
            requestedPermission=payload.requestedPermission,
            status=AuthorizationStatus.SUBMITTED,
            createdAt=now_utc(),
            expiresAt=None,
        )
        self._put("authorization_requests", request.id, request)
        return request

    def review_authorization(
        self, request_id: str, payload: AuthorizationReview
    ) -> AuthorizationRequest | None:
        request = self._get("authorization_requests", request_id, AuthorizationRequest)
        if not request:
            return None
        request.status = (
            AuthorizationStatus.APPROVED
            if payload.decision == "approve"
            else AuthorizationStatus.REJECTED
        )
        request.expiresAt = payload.expiresAt
        self._put("authorization_requests", request.id, request)
        return request

    def create_quality_signal(self, payload: QualitySignalCreate) -> QualitySignal:
        signal = QualitySignal(id=_id("QS"), createdAt=now_utc(), **payload.model_dump())
        self._put("quality_signals", signal.id, signal)
        return signal

    def operations_summary(self) -> OperationsSummary:
        expiring = [
            item
            for item in self.items.values()
            if item.status == KnowledgeStatus.PUBLISHED
        ][:3]
        return OperationsSummary(
            newKnowledgeCount=len(self.items),
            reuseCount=max(12, len(self.quality_signals) * 3),
            expiringCount=len(expiring),
            activeExpertCount=4,
            qualityDistribution=[
                {"label": "高质量", "count": 8},
                {"label": "待复核", "count": 3},
                {"label": "整改中", "count": 1},
            ],
            weakAreas=[
                {"businessTheme": "项目复盘", "issueCount": 2, "suggestedAction": "补齐交付复盘"},
                {"businessTheme": "招聘评估", "issueCount": 1, "suggestedAction": "更新评估框架"},
            ],
            expiringItems=[
                {
                    "knowledgeItemId": item.id,
                    "title": item.title,
                    "validUntil": str(date.today() + timedelta(days=30)),
                }
                for item in expiring
            ],
        )

    def rotate_key(self, application_id: str) -> ApplicationKeyRotationResponse | None:
        if application_id not in self.applications:
            return None
        response = ApplicationKeyRotationResponse(
            applicationId=application_id,
            maskedKey=f"sk-{uuid4().hex[:4]}...{uuid4().hex[-4:]}",
            rotatedAt=now_utc(),
        )
        self.audit("application_key_rotate", application_id=application_id)
        return response

    def update_policies(self, payload: ApplicationPolicyUpdate) -> ApplicationPolicyState:
        data = self.application_policies.model_dump()
        data.update(payload.model_dump(exclude_none=True))
        policies = ApplicationPolicyState(**data)
        self._put("application_policies", "singleton", policies)
        return policies

    def knowledge_service(self, payload: KnowledgeServiceRequest) -> KnowledgeServiceResponse:
        qa = self.answer(QARequest(question=payload.input, businessContext=payload.businessContext))
        event = self.audit(
            "service_call",
            actor_user_id=payload.requesterUserId,
            application_id=payload.applicationId,
            context=payload.businessContext,
        )
        return KnowledgeServiceResponse(
            status=OperationResult.SUCCESS,
            output=qa.answer,
            citations=[
                Citation(
                    knowledgeItemId=c.knowledgeItemId,
                    knowledgeVersionId=c.knowledgeVersionId,
                    fragmentRef=c.fragmentRef,
                    citationType="generated_output_source",
                )
                for c in qa.citations
            ],
            auditEventId=event.id,
        )

    def create_business_binding(
        self, payload: BusinessActionBindingCreate
    ) -> BusinessActionBinding:
        binding = BusinessActionBinding(id=_id("BIND"), createdAt=now_utc(), **payload.model_dump())
        self._put("business_bindings", binding.id, binding)
        return binding


store = DatabaseStore()
