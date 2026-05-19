#!/usr/bin/env sh
set -eu

SQL_FILE="${1:-}"
if [ -z "$SQL_FILE" ]; then
  echo "usage: infra/docker/restore-dev.sh path/to/knowledge.sql" >&2
  exit 2
fi

CONTAINER="${POSTGRES_CONTAINER:-enterprise-knowledge-postgres-1}"
cat "$SQL_FILE" | docker exec -i "$CONTAINER" psql -U knowledge -d knowledge
