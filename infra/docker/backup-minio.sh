#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-./backups/minio}"
CONTAINER="${MINIO_CONTAINER:-enterprise-knowledge-minio-1}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"
docker cp "$CONTAINER:/data" "$BACKUP_DIR/minio-$STAMP"
echo "$BACKUP_DIR/minio-$STAMP"
