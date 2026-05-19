# Frontend Integration Notes

- This directory is the UI inside `HaoWinchester/private_Knowledge.git`.
- API clients live in `src/lib/*-api.ts`; DTOs live in `src/lib/api-types.ts`.
- Set `VITE_API_BASE_URL` to the FastAPI backend, for example `http://127.0.0.1:8002`.
- Run validation with `npm run lint` and `PATH=/Users/menghao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run build` when local Node is older than Vite requires.
- Playwright journeys live in `tests/e2e` and expect frontend plus backend dev servers to be running.
