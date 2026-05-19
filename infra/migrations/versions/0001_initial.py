"""initial schema placeholder

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-18
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    def timestamp_columns() -> list[sa.Column]:
        return [
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.func.now(),
                nullable=False,
            ),
        ]
    op.create_table(
        "knowledge_sources",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("source_type", sa.String(64), nullable=False),
        sa.Column("uri", sa.String(1024)),
        sa.Column("display_name", sa.String(255), nullable=False),
        sa.Column("checksum", sa.String(128)),
        sa.Column("external_last_modified_at", sa.DateTime(timezone=True)),
        sa.Column("access_status", sa.String(32), nullable=False),
        sa.Column("submitted_by_user_id", sa.String(64)),
        *timestamp_columns(),
    )
    op.create_table(
        "knowledge_items",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("knowledge_type", sa.String(64), nullable=False),
        sa.Column("status", sa.String(64), nullable=False),
        sa.Column("confidentiality_level", sa.String(64), nullable=False),
        sa.Column("owner_user_id", sa.String(64)),
        sa.Column("responsible_user_id", sa.String(64), nullable=False),
        sa.Column("source_id", sa.String(64), nullable=False),
        sa.Column("current_version_id", sa.String(64)),
        sa.Column("applicable_scope", sa.Text(), nullable=False),
        sa.Column("valid_from", sa.Date()),
        sa.Column("valid_until", sa.Date(), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        *timestamp_columns(),
    )
    op.create_table(
        "knowledge_versions",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("version_number", sa.Integer(), nullable=False),
        sa.Column("change_summary", sa.Text()),
        sa.Column("content_object_key", sa.String(255)),
        sa.Column("extracted_text_object_key", sa.String(255)),
        sa.Column("sanitized_text_object_key", sa.String(255)),
        sa.Column("effective_status", sa.String(32), nullable=False),
        sa.Column("created_by_user_id", sa.String(64)),
        sa.Column("effective_from", sa.DateTime(timezone=True)),
        sa.Column("retention_until", sa.Date(), nullable=False),
        *timestamp_columns(),
    )
    op.create_table(
        "intake_requests",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("request_type", sa.String(32), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("submitted_by_user_id", sa.String(64)),
        sa.Column("assigned_reviewer_user_id", sa.String(64)),
        sa.Column("review_group", sa.String(64)),
        sa.Column("reason", sa.Text()),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        *timestamp_columns(),
    )
    op.create_table(
        "review_decisions",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("intake_request_id", sa.String(64), nullable=False),
        sa.Column("reviewer_user_id", sa.String(64), nullable=False),
        sa.Column("decision", sa.String(32), nullable=False),
        sa.Column("comments", sa.Text()),
        sa.Column("reason_code", sa.String(64)),
        sa.Column("retention_until", sa.Date(), nullable=False),
        *timestamp_columns(),
    )
    op.create_table(
        "classification_assignments",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("dimension", sa.String(64), nullable=False),
        sa.Column("value", sa.String(255), nullable=False),
        sa.Column("assigned_by_user_id", sa.String(64)),
        *timestamp_columns(),
    )
    op.create_table(
        "business_action_bindings",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("action_type", sa.String(64), nullable=False),
        sa.Column("source_id", sa.String(64), nullable=False),
        sa.Column("responsible_user_id", sa.String(64), nullable=False),
        sa.Column("business_context", sa.Text(), nullable=False),
        sa.Column("confidentiality_level", sa.String(64), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("applicable_scope", sa.Text(), nullable=False),
        sa.Column("valid_until", sa.Date(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        *timestamp_columns(),
    )
    op.create_table(
        "permission_rules",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("rule_type", sa.String(32), nullable=False),
        sa.Column("subject_type", sa.String(32), nullable=False),
        sa.Column("subject_ref", sa.String(128), nullable=False),
        sa.Column("permission", sa.String(64), nullable=False),
        sa.Column("valid_from", sa.DateTime(timezone=True)),
        sa.Column("valid_until", sa.DateTime(timezone=True)),
        sa.Column("created_by_user_id", sa.String(64)),
        *timestamp_columns(),
    )
    op.create_table(
        "authorization_requests",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("requester_user_id", sa.String(64)),
        sa.Column("application_id", sa.String(64)),
        sa.Column("requested_permission", sa.String(64), nullable=False),
        sa.Column("business_context", sa.Text(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("reviewer_user_id", sa.String(64)),
        sa.Column("review_comment", sa.Text()),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        *timestamp_columns(),
    )
    op.create_table(
        "audit_events",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("actor_user_id", sa.String(64)),
        sa.Column("application_id", sa.String(64)),
        sa.Column("knowledge_item_id", sa.String(64)),
        sa.Column("event_type", sa.String(64), nullable=False),
        sa.Column("operation_context", sa.Text()),
        sa.Column("result", sa.String(32), nullable=False),
        sa.Column("reason", sa.Text()),
        sa.Column("retention_until", sa.Date(), nullable=False),
        *timestamp_columns(),
    )
    op.create_table(
        "citations",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("knowledge_version_id", sa.String(64), nullable=False),
        sa.Column("fragment_ref", sa.String(255)),
        sa.Column("citation_type", sa.String(64), nullable=False),
        sa.Column("generated_output_ref", sa.String(255)),
        sa.Column("retained_until", sa.DateTime(timezone=True)),
        *timestamp_columns(),
    )
    op.create_table(
        "quality_signals",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("knowledge_item_id", sa.String(64), nullable=False),
        sa.Column("signal_type", sa.String(64), nullable=False),
        sa.Column("value", sa.String(128)),
        sa.Column("comment", sa.Text()),
        *timestamp_columns(),
    )
    op.create_table(
        "knowledge_service_requests",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("application_id", sa.String(128), nullable=False),
        sa.Column("requester_user_id", sa.String(128), nullable=False),
        sa.Column("request_type", sa.String(32), nullable=False),
        sa.Column("business_context", sa.Text(), nullable=False),
        sa.Column("project_context", sa.String(255)),
        sa.Column("input", sa.Text(), nullable=False),
        sa.Column("result", sa.String(32), nullable=False),
        sa.Column("audit_event_id", sa.String(64)),
        sa.Column("retained_until", sa.DateTime(timezone=True)),
        *timestamp_columns(),
    )
    op.create_index("ix_permission_rules_subject", "permission_rules", ["subject_ref"])
    op.create_index("ix_authorization_requests_knowledge", "authorization_requests", ["knowledge_item_id"])
    op.create_index("ix_audit_events_type", "audit_events", ["event_type"])


def downgrade() -> None:
    op.drop_index("ix_audit_events_type", table_name="audit_events")
    op.drop_index("ix_authorization_requests_knowledge", table_name="authorization_requests")
    op.drop_index("ix_permission_rules_subject", table_name="permission_rules")
    for table in [
        "knowledge_service_requests",
        "quality_signals",
        "citations",
        "audit_events",
        "authorization_requests",
        "permission_rules",
        "business_action_bindings",
        "classification_assignments",
        "review_decisions",
        "intake_requests",
        "knowledge_versions",
        "knowledge_items",
        "knowledge_sources",
    ]:
        op.drop_table(table)
