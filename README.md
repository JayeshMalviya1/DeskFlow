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

Do **not** use `npm run dev` as the build or start command on Render.

### If you still see `ENOENT ... /src/package.json`

Your service is building from the repo root without `backend/`. Either set **Root Directory** to `backend`, or push the latest commit (includes root `package.json`) and use Option B.

**Environment variables** (Render → Environment):

| Key | Example |
|-----|---------|
| `MONGODB_URI` | Your Atlas connection string |
| `NODE_ENV` | `production` |

`PORT` is set automatically by Render.

Health check URL: `https://YOUR-SERVICE.onrender.com/health`

Or deploy with **Blueprint** using `render.yaml` in the repo root.

## Deploy frontend (Vercel / Netlify)

1. Import repo, set **root directory** to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable:

   ```
   VITE_API_URL=https://YOUR-RENDER-API.onrender.com
   ```

   No trailing slash. Rebuild after changing this variable.

## Submission checklist

- [ ] Backend live on Render (or Railway / Fly.io)
- [ ] Frontend live on Vercel / Netlify / Render Static
- [ ] `VITE_API_URL` points to deployed API (not localhost)
- [ ] MongoDB Atlas allows network access (0.0.0.0/0 or Render IPs)
- [ ] GitHub repo URL + live frontend URL submitted
