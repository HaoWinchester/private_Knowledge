# Operations Runbook

## Local Start

1. Start dependencies with `docker compose -f infra/docker/docker-compose.dev.yml up -d`.
2. Start backend with `uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload`.
3. Start frontend in `frontend/` with `npm run dev -- --host 0.0.0.0 --port 3004`.

## Backups

- PostgreSQL: `infra/docker/backup-postgres.sh`
- MinIO: `infra/docker/backup-minio.sh`
- Restore PostgreSQL dev dump: `infra/docker/restore-dev.sh ./backups/postgres/file.sql`

## Incident Checks

- Confirm `/health` returns `{"status":"ok"}`.
- Review `/audit-events` for denied access, service-call spikes, and lifecycle changes.
- Temporarily disable application policies only through `/application-policies` and record the reason.
