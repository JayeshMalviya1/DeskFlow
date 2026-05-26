# DeskFlow

MERN support ticket triage board — status rules, SLA tracking, kanban UI.

## Repository layout

```
DeskFlow/
├── backend/     # Express + MongoDB API
├── frontend/    # React (Vite) dashboard
└── render.yaml  # Render deploy config for API
```

## Local development

**Backend** (port 5000):

```bash
cd backend
cp .env.example .env   # set MONGODB_URI
npm install
npm run dev
```

**Frontend** (port 5173):

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

## Deploy backend on Render

### Option A — Root directory `backend` (recommended)

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Option B — Repo root (uses root `package.json`)

Leave **Root Directory** empty:

| Setting | Value |
|---------|--------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

**Start Command must be `npm start`** — not `npm run dev` with the old config (that only ran install and exited).

| Wrong start | Symptom |
|-------------|---------|
| `npm run dev` (old root script) | `Application exited early` after build |
| **Correct** | `npm start` |

After pulling latest `package.json`, `npm run dev` at repo root also starts the API — but prefer **`npm start`** on Render.

### If you still see `ENOENT ... /src/package.json`

Your service is building from the repo root without `backend/`. Either set **Root Directory** to `backend`, or push the latest commit (includes root `package.json`) and use Option B.

**Environment variables** (Render → **Environment** — required):

| Key | Example |
|-----|---------|
| `MONGODB_URI` | `mongodb+srv://USER:PASS@cluster.mongodb.net/deskflow?retryWrites=true&w=majority` |
| `NODE_ENV` | `production` |

`PORT` is set automatically by Render.

### `Exited with status 1` after `node src/server.js`

The start command is correct; the **database connection failed**.

1. **Render → Environment** → add `MONGODB_URI` (copy from Atlas, not from committed `.env`).
2. **MongoDB Atlas → Network Access** → allow `0.0.0.0/0` (or Render’s IPs).
3. **Atlas → Database Access** → user password matches the URI (URL-encode special characters in password).
4. Redeploy and check **Logs** for `MongoDB connected` or the exact error line.

Health check URL: `https://YOUR-SERVICE.onrender.com/health`

Or deploy with **Blueprint** using `render.yaml` in the repo root.

## Deploy frontend (Vercel / Netlify)

### Vercel — required settings

If you see `{"success":false,"message":"Route not found"}` at your Vercel URL, you deployed the **API** (or wrong folder), not the **React app**.

Create a **new Vercel project** (or fix settings):

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment variable** (Vercel → Settings → Environment Variables):

```
VITE_API_URL=https://deskflow-6.onrender.com
```

No trailing slash. **Redeploy** after adding it.

Your Vercel URL should show the **DeskFlow board UI**, not JSON.

### Netlify

Same as above: publish directory `frontend/dist`, build `npm run build`, env `VITE_API_URL`.

## Submission checklist

- [ ] Backend live on Render (or Railway / Fly.io)
- [ ] Frontend live on Vercel / Netlify / Render Static
- [ ] `VITE_API_URL` points to deployed API (not localhost)
- [ ] MongoDB Atlas allows network access (0.0.0.0/0 or Render IPs)
- [ ] GitHub repo URL + live frontend URL submitted
