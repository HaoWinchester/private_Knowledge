<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->

## Implementation Notes

- Backend business endpoints currently use `backend/src/services/memory_store.py` as the local pilot store.
- API DTOs live in `backend/src/schemas/domain.py`; route modules re-export narrow schema files for Speckit task traceability.
- Keep `/knowledge-service/query` and `/api/v1/knowledge/query` behavior aligned because the frontend and pilot application can use either path.
- Run backend validation with `cd backend && python3 -m pytest`.
- The frontend now lives in this same repository under `frontend/`; update API clients there when backend contracts change.
