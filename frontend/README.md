# DeskFlow Frontend

React support operations dashboard for the DeskFlow ticket triage API.

## Tech stack

- React + Vite
- Tailwind CSS v4
- TanStack Query (React Query)
- Axios
- React Hook Form (used in phase 2)

## Prerequisites

- Node.js 18+
- DeskFlow backend running (default `http://localhost:5000`)

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # or edit .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000` |

## Project structure (phase 1)

```
frontend/src/
├── api/ticketApi.js      # Axios + endpoint functions + query keys
├── lib/queryClient.js    # React Query defaults
├── components/           # board, filters, form, stats, common (phase 2)
├── hooks/                # useTickets (phase 2)
├── pages/Home.jsx
├── utils/                # formatAge, transitions (phase 2)
├── App.jsx
└── main.jsx
```

## API layer

All HTTP calls go through `src/api/ticketApi.js`:

- `fetchTickets(filters)`
- `fetchTicketStats()`
- `createTicket(payload)`
- `updateTicketStatus({ id, status })`
- `deleteTicket(id)`

Cache keys: `ticketKeys.list(filters)`, `ticketKeys.stats()`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- Kanban board (Open → In Progress → Resolved → Closed)
- Move actions respect backend transition rules (`src/utils/transitions.js`)
- Priority + breached filters (combined, refetch via React Query)
- Stats strip from `GET /tickets/stats`
- Create ticket form (React Hook Form)
- Cache invalidation after create / move / delete — no full page reload

## Run with backend

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```
