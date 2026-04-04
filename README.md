# PlantAI — Plant Disease Diagnosis

AI-powered plant health scanner using the Anthropic Vision API.

## Project Structure

```
project/
├── frontend/   React + Vite SPA
└── backend/    Express API server
```

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env          # add your ANTHROPIC_API_KEY
npm install
npm run dev                   # starts on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                   # starts on http://localhost:5173
```

Set `VITE_API_URL=http://localhost:4000/api` in `frontend/.env` if the backend runs on a different port.

## Key Design Decisions

- **API key security**: The Anthropic API key lives only in `backend/.env` and is used exclusively in `backend/routes/analyze.js`. The browser never sees it.
- **Service interface parity**: `frontend/src/services/` exports the same method names (`AuthService`, `PlantService`, `HistoryService`) that the original monolith used — screens required zero changes.
- **Storage**: The backend currently uses in-memory stores for demo purposes. Replace with a real database (PostgreSQL recommended) by swapping the in-memory objects in `routes/auth.js` and `routes/history.js` for DB queries.
