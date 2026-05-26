# DeskFlow Backend

Support ticket triage API with strict status transitions and SLA tracking.

## Tech stack

- Node.js (ES modules)
- Express.js
- MongoDB Atlas + Mongoose
- Joi validation

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB for development)

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Copy or edit `.env` and set your connection string:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://...
   ```

3. Run the server:

   ```bash
   npm run dev
   ```

4. Verify:

   ```bash
   curl http://localhost:5000/health
   ```

## Project structure (phase 1)

```
backend/
├── src/
│   ├── config/db.js       # MongoDB connection
│   ├── controllers/     # HTTP handlers (phase 2+)
│   ├── middleware/      # Validation & errors (phase 2+)
│   ├── models/          # Mongoose schemas (phase 2+)
│   ├── routes/          # Route definitions (phase 2+)
│   ├── services/        # Business logic (phase 2+)
│   ├── utils/             # SLA, transitions, enrichment (phase 2+)
│   ├── validations/     # Joi schemas (phase 2+)
│   ├── app.js           # Express application
│   └── server.js        # Entry point
├── .env
├── package.json
└── README.md
```

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm start`   | Run server (production)              |
| `npm run dev` | Run with `--watch` for development   |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/tickets` | Create ticket (Joi-validated body) |
| `GET` | `/tickets` | List tickets (`?status`, `?priority`, `?breached=true`) |
| `GET` | `/tickets/stats` | Aggregated counts + breached unresolved |
| `PATCH` | `/tickets/:id` | Status change only (transition rules enforced) |
| `DELETE` | `/tickets/:id` | Delete ticket |

### Example: create ticket

```bash
curl -X POST http://localhost:5000/tickets \
  -H "Content-Type: application/json" \
  -d "{\"subject\":\"Login issue\",\"description\":\"Cannot reset password\",\"customerEmail\":\"user@example.com\",\"priority\":\"high\"}"
```

### Example: invalid transition

```bash
curl -X PATCH http://localhost:5000/tickets/<id> \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"resolved\"}"
```

When the ticket is still `open`, the API returns `400` with `"Invalid status transition"`.

### Response shape

Every ticket in `data` includes derived fields (not stored in MongoDB):

- `ageMinutes` — frozen at resolution for resolved/closed tickets
- `slaBreached` — computed from priority SLA limits in `src/utils/sla.js`

## Architecture

```
Request → Routes → Validation middleware → Controller → Service → Model
                                                              ↓
Response ← enrichTicket (ageMinutes, slaBreached) ←──────────┘
```

Business rules live in `ticket.service.js`, `transitions.js`, and `enrichTicket.js` — not in controllers.
