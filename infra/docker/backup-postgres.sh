#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
CONTAINER="${POSTGRES_CONTAINER:-enterprise-knowledge-postgres-1}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"
docker exec "$CONTAINER" pg_dump -U knowledge -d knowledge > "$BACKUP_DIR/knowledge-$STAMP.sql"
echo "$BACKUP_DIR/knowledge-$STAMP.sql"
