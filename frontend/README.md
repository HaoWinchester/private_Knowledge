# Puhua Knowledge UI

Existing TanStack Start frontend for the private knowledge base pilot.

## Local backend

Create `.env.local` from `.env.example` and point `VITE_API_BASE_URL` at the FastAPI backend:

```bash
cp .env.example .env.local
VITE_API_BASE_URL=http://localhost:8001
```

The backend lives in the same repository under `backend/` and starts on port `8001` by default.

Install dependencies with:

```bash
npm install --legacy-peer-deps --package-lock=false
```
