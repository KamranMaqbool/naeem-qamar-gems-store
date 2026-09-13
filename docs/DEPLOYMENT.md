# Virtuoso's Gems — Deployment & Architecture Guide

Complete reference for how the **backend**, **database**, **storefront**, and **admin panel**
are built, wired together, and deployed. Everything below reflects the live production setup.

> Repository: `KamranMaqbool/naeem-qamar-gems-store` (monorepo)

---

## 1. Live URLs

| Component | URL | Hosting |
|---|---|---|
| **Storefront** (public site) | https://naeem-qamar-gems-store.vercel.app | Vercel |
| **Admin panel** | https://naeem-qamar-gems-admin.vercel.app | Vercel |
| **Backend API** | https://backend-production-d5b4b.up.railway.app | Railway |
| **API docs (Swagger)** | https://backend-production-d5b4b.up.railway.app/api/docs/ | Railway |
| **Django admin** | https://backend-production-d5b4b.up.railway.app/admin/ | Railway |
| **PostgreSQL** | internal only — `postgres.railway.internal:5432` | Railway |

**Admin login:** `admin@virtuoso-gems.com` / `admin123` — ⚠️ change this before real use (see §12).

---

## 2. Architecture at a glance

```
                         ┌──────────────────────────────┐
                         │            Browser            │
                         └───────────────┬──────────────┘
                     HTTPS               │              HTTPS
        ┌──────────────────────┐        │        ┌──────────────────────┐
        │  Storefront (Vercel) │        │        │  Admin panel (Vercel)│
        │  React + Vite (SPA)  │        │        │  React + Vite (SPA)  │
        │  naeem-qamar-gems-   │        │        │  naeem-qamar-gems-   │
        │  store.vercel.app    │        │        │  admin.vercel.app    │
        └───────────┬──────────┘        │        └──────────┬───────────┘
                    │  fetch VITE_API_URL = /api/v1         │
                    └──────────────────┬────────────────────┘
                                       │ HTTPS (CORS-restricted)
                         ┌─────────────▼───────────────┐
                         │   Backend API (Railway)      │
                         │   Django + DRF + Gunicorn    │
                         │   backend-production-d5b4b   │
                         │   .up.railway.app  (:8080)   │
                         └─────────────┬───────────────┘
                                       │ DATABASE_URL (private network)
                         ┌─────────────▼───────────────┐
                         │  PostgreSQL 16 (Railway)     │
                         │  postgres.railway.internal   │
                         │  persistent volume           │
                         └──────────────────────────────┘
```

**Data flow:** both React apps read `VITE_API_URL` at build time and call the Django API over
HTTPS. The API authenticates with JWT, reads/writes PostgreSQL, and returns JSON. CORS on the
backend only allows the two Vercel origins.

---

## 3. Repository structure (monorepo)

```
naeem-qamar-gems-store/
├── backend/      → Django REST Framework API      (deployed to Railway)
├── frontend/     → React + Vite storefront         (deployed to Vercel)
├── admin/        → React + Vite admin panel        (deployed to Vercel)
├── docs/         → this documentation
├── docker-compose.yml   → full local stack
└── Makefile      → local dev commands
```

One repository, three deployables. Each hosting platform is pointed at its own subfolder
(the **Root Directory** setting), so a change in `frontend/` never rebuilds the backend, etc.

---

## 4. Tech stack

| Layer | Technology |
|---|---|
| Backend framework | Django 5.1 + Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| API schema/docs | `drf-spectacular` (Swagger UI at `/api/docs/`) |
| Filtering | `django-filter` |
| Static files (prod) | WhiteNoise |
| WSGI server | Gunicorn (3 workers) |
| Database | PostgreSQL 16 |
| Async (configured) | Celery + Redis *(not provisioned in prod — see §11)* |
| Frontend/Admin | React 18 + Vite + Tailwind CSS + React Router |
| Backend hosting | Railway (Docker build) |
| Frontend hosting | Vercel |

---

## 5. Backend (Django) — how it works

### 5.1 Django apps

| App | Responsibility | Key models |
|---|---|---|
| `accounts` | Users, addresses, staff notes, login history | `User`, `Address`, `CustomerNote`, `LoginActivity` |
| `catalog` | Products, categories, gemstone specs, images | `Category`, `Product`, `GemstoneAttributes`, `ProductImage` |
| `inventory` | Stock levels + audit trail | `Inventory`, `StockLog` |
| `orders` | Carts and orders | `Cart`, `CartItem`, `Order`, `OrderItem` |
| `payments` | Payment records | `Payment` |
| `discounts` | Discount codes | `DiscountCode` |
| `bespoke` | Custom-order inquiries | `BespokeInquiry`, `BespokeAttachment` |
| `certificates` | Gemological certificates | `Certificate` |
| `settings_app` | Store-wide settings (singleton) | `StoreSettings` |
| `analytics` | Dashboard KPIs / charts (no models) | — |

### 5.2 Custom user model

- `AUTH_USER_MODEL = 'accounts.User'`
- **Email is the login field** (`USERNAME_FIELD = 'email'`).
- Roles: `CUSTOMER`, `STAFF`, `SUPER_ADMIN`.
- Extra fields: `is_vip`, `total_lifetime_spend`.

### 5.3 Authentication (JWT)

| Setting | Value |
|---|---|
| Access token lifetime | 60 minutes |
| Refresh token lifetime | 7 days |
| Rotate refresh tokens | yes |
| Blacklist after rotation | yes |

**Login flow (used by the admin panel):**
1. `POST /api/v1/auth/token/` with `{ "email", "password" }` → `{ "access", "refresh" }`
2. Send `Authorization: Bearer <access>` on subsequent requests.
3. When the access token expires, `POST /api/v1/auth/token/refresh/` with `{ "refresh" }`.

### 5.4 API endpoints (all under `/api/v1/`)

| Prefix | Purpose |
|---|---|
| `POST /auth/token/`, `/auth/token/refresh/` | JWT login / refresh |
| `/users/` | Current-user / profile endpoints |
| `/products/` | **Public** product catalog (list/detail, filters) |
| `/discounts/` | Public discount validation |
| `/bespoke/` | Public custom-order inquiries |
| `/certificates/` | Certificate lookup |
| `/settings/` | Public store settings |
| `/cart/`, `/orders/` | Cart + order operations |
| `/admin/products/`, `/admin/categories/` | Admin product/category CRUD |
| `/admin/inventory/` | Admin stock management |
| `/admin/orders/` | Admin order management |
| `/admin/customers/` | Admin customer management |
| `/admin/discounts/` | Admin discount CRUD |
| `/admin/bespoke/` | Admin inquiry management |
| `/admin/analytics/` | Dashboard KPIs, revenue chart, sales-by-gemstone |
| `/payments/` | Payment records |

Interactive reference: **`/api/docs/`** (Swagger UI, generated by drf-spectacular).

Responses are paginated (`PAGE_SIZE = 20`) as `{ count, next, previous, results }`.
Errors use a custom handler shape.

### 5.5 Production request handling

- **WSGI:** `config.wsgi:application` served by Gunicorn, 3 sync workers.
- **Static files:** WhiteNoise serves `collectstatic` output (Django admin CSS, DRF pages)
  using `CompressedStaticFilesStorage`.
- **Port:** the container listens on Railway's injected `$PORT` (currently **8080**).
- **Migrations:** run automatically on every boot (see the Dockerfile `CMD`).

### 5.6 Dockerfile (what Railway builds)

`backend/Dockerfile`:
1. `python:3.12-slim` base, installs `gcc` + `libpq-dev`.
2. `pip install -r requirements.txt`.
3. `collectstatic` at build time.
4. On boot: `python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`.

`backend/.dockerignore` keeps the local `venv/`, `db.sqlite3`, `media/`, `staticfiles/`, and
dev `.env` **out** of the image.

---

## 6. Database (PostgreSQL) — how it works

### 6.1 Production (Railway)

- **Service:** `Postgres` (PostgreSQL 16) in the `naeem-qamar-gems-store` Railway project.
- **Storage:** persistent Railway volume (survives redeploys).
- **Network:** private only — reachable inside Railway at `postgres.railway.internal:5432`.
  There is **no public endpoint** (good for security).
- **Database name:** `railway`, user `postgres`.

### 6.2 How the backend connects

- `settings.py` uses `dj_database_url.config()` reading the `DATABASE_URL` env var.
- On the backend service, `DATABASE_URL` is a **Railway reference variable**:
  `DATABASE_URL = ${{Postgres.DATABASE_URL}}` — Railway resolves it to the private connection
  string at deploy time, so credentials are never hard-coded.
- Connection pooling: `conn_max_age = 600`.
- If `DATABASE_URL` is absent (local without Postgres), it falls back to SQLite.

### 6.3 Migrations & seeding

- **Migrations** run on every container boot (Dockerfile `CMD`), so schema changes ship
  automatically with a deploy.
- **Seeding** (demo catalog, inventory, customers, orders, discount, admin user) is a one-off:
  ```
  python manage.py seed_data     # full demo dataset
  python manage.py seed_admin    # just the admin user
  ```
  Because the DB is private, these run **inside** Railway (via SSH — see §10).

### 6.4 Schema note (why URLField was widened)

Django's `URLField` defaults to `max_length=200`. SQLite ignores that limit but **PostgreSQL
enforces it**, and some seed image URLs are ~300 chars. All `URLField`s were widened to
`max_length=500` (catalog/accounts/settings/bespoke/certificates) with migrations.

---

## 7. Storefront frontend — how it works

- **Stack:** React + Vite SPA, Tailwind, React Router.
- **API base:** `src/lib/api.js` → `const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'`.
  Endpoints are appended (e.g. `${API_BASE}/products/`), so `VITE_API_URL` must include
  `/api/v1` and have **no trailing slash**.
- **Graceful fallback:** pages (Home, Shop, ProductDetail) fetch from the API and fall back to
  bundled static data if the API is unreachable, so the site never shows a blank screen.
- **Build:** `npm run build` → `dist/` (static assets served by Vercel's CDN).
- **Env var (Vercel, Production):**
  `VITE_API_URL = https://backend-production-d5b4b.up.railway.app/api/v1`
- **Important:** Vite bakes `VITE_`-prefixed vars in at **build time** — changing the value
  requires a **redeploy**, not just a save.

---

## 8. Admin panel frontend — how it works

- **Stack:** React + Vite SPA, Tailwind, React Router (same shell as the storefront).
- **API base:** identical pattern — `VITE_API_URL || '/api/v1'`.
- **Auth:** real **login screen**. `src/lib/api.js`:
  - `login()` → `POST /auth/token/`, stores `access`/`refresh` in `localStorage`.
  - `authFetch()` attaches `Authorization: Bearer <access>`; on a 401 it auto-refreshes via
    `/auth/token/refresh/` and retries once.
- **Pages wired to the API:** Dashboard (KPIs), Products, Orders, Inventory (inline stock
  editing), Customers, Discounts, Settings — each falls back to static data on error.
- **SPA routing on Vercel:** `admin/vercel.json` rewrites every path to `/index.html` so deep
  links (e.g. `/products`) don't 404.
- **Env var (Vercel, Production):**
  `VITE_API_URL = https://backend-production-d5b4b.up.railway.app/api/v1`

---

## 9. Deployment — how each piece got shipped

### 9.1 Backend → Railway

1. `railway init` created project **naeem-qamar-gems-store**.
2. `railway add --database postgres` provisioned the **Postgres** service.
3. `railway add --service backend` created the **backend** service.
4. Env vars set on `backend` (see §11).
5. `railway domain` generated `backend-production-d5b4b.up.railway.app`; its **target port was
   set to 8080** to match Gunicorn.
6. `railway up` built the Dockerfile and deployed.
7. Seed run once over SSH.

> **Gotchas we hit & fixed** (documented so they don't bite again):
> - *"Application not found" (`x-railway-fallback: true`)* — the first domain was created before
>   a healthy deploy existed. Fix: recreate the domain against the running deploy with the port
>   set, then redeploy.
> - *`DisallowedHost` 400* — the container had a stale `RAILWAY_PUBLIC_DOMAIN`. Fix: redeploy so
>   settings pick up the current domain (settings auto-append it to `ALLOWED_HOSTS`).

### 9.2 Storefront → Vercel

- Vercel project **naeem-qamar-gems-store**, **Root Directory = `frontend`**, framework **Vite**.
- Originally imported from GitHub (auto-deploys on push).
- `VITE_API_URL` set for Production, then redeployed so the value is baked in.

### 9.3 Admin panel → Vercel

- Vercel project **naeem-qamar-gems-admin**, deployed via CLI (`vercel --prod`).
- `admin/vercel.json` adds the SPA rewrite.
- `VITE_API_URL` set for Production.
- Its origin was added to the backend's `CORS_ALLOWED_ORIGINS`, then the backend was redeployed.

---

## 10. Environment variables — full reference

### 10.1 Railway → `backend` service

| Variable | Value / source | Purpose |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference) | DB connection (private) |
| `SECRET_KEY` | generated random string | Django crypto |
| `DEBUG` | `False` | production mode |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | + Railway domain auto-appended |
| `CORS_ALLOWED_ORIGINS` | `https://naeem-qamar-gems-store.vercel.app,https://naeem-qamar-gems-admin.vercel.app` | allowed browser origins |
| `RAILWAY_PUBLIC_DOMAIN` | injected by Railway | auto-added to `ALLOWED_HOSTS` + `CSRF_TRUSTED_ORIGINS` |
| `PORT` | injected by Railway (8080) | Gunicorn bind port |

### 10.2 Vercel → both projects (Production)

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://backend-production-d5b4b.up.railway.app/api/v1` |

---

## 11. Auto-deployment (CI/CD) setup

**Principle:** connect each hosting project to the GitHub repo → `git push` to `main` →
automatic build & deploy of the changed folder.

> Prerequisite (already satisfied): all code is committed and pushed to `main`, so Git builds
> produce the correct output.

### 11.1 Backend → Railway (dashboard)
Railway → project **naeem-qamar-gems-store** → **backend** → **Settings**:
1. **Source → Connect Repo** → authorize GitHub app → `KamranMaqbool/naeem-qamar-gems-store` → branch `main`.
2. **Root Directory:** `backend`.
3. **Build → Watch Paths:** `backend/**` (only redeploy on backend changes).
4. Env vars, the Postgres DB, and the domain all persist. Migrations run on boot.

### 11.2 Admin panel → Vercel (dashboard)
Vercel → **naeem-qamar-gems-admin** → **Settings**:
1. **Build and Deployment:** Framework Preset **Vite**, **Root Directory `admin`**.
2. **Git → Connect Git Repository** → the repo → Production Branch `main`.
3. `VITE_API_URL` already set. Enable "skip deployments when no changes in Root Directory".
4. Redeploy once to confirm the Git build works.

### 11.3 Storefront → Vercel (verify only)
Vercel → **naeem-qamar-gems-store** → **Settings → Git** — confirm repo connected and
Production Branch `main`. Root Directory `frontend` and `VITE_API_URL` are already set.

### 11.4 Redis / Celery (optional, not yet provisioned)
Celery + Redis are configured in code but **no Redis service or Celery worker runs in
production** — the web service handles requests synchronously. To enable async tasks later:
add a Railway **Redis** service, set `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND` to it, and
add a second Railway service running `celery -A config worker -l info`.

---

## 12. Security notes & follow-ups

- ⚠️ **Change the `admin123` password.** It's seeded demo data and the admin panel is public.
  Reset it in Django admin (`/admin/`) or with `manage.py changepassword` over SSH.
- `DEBUG=False` in production (correct). `SECRET_KEY` is a generated value stored only in
  Railway env (not in Git).
- CORS is **scoped** to exactly the two Vercel origins — no wildcards.
- The DB has **no public endpoint**.
- `CSRF_TRUSTED_ORIGINS` includes the Railway HTTPS domain (needed for Django admin login).

---

## 13. Local development

The application uses the same source code in local Docker and production deployments. Local
Vite servers proxy `/api` and `/media` to the Docker `backend` service through
`VITE_API_PROXY_TARGET`; Vercel builds use `VITE_API_URL` and call Railway directly. No source
code edits are required when moving between environments. Vite environment variables are the
only deployment-specific values and are injected by Docker Compose or Vercel at build time.

Product uploads are saved under Django's media storage. API responses convert relative media
paths into absolute backend URLs in production, while local development continues to serve
media through the Vite proxy.

Full stack via Docker (see `Makefile` + `docker-compose.yml`):

```bash
make up        # start backend, Postgres, Redis, storefront, admin
make migrate   # apply migrations
make seed      # load demo data
make logs      # tail all services
make down      # stop everything
```

**Local ports:** storefront `5173`, admin `5174`, backend `8000`, Postgres host `5433`
(→ container 5432), Redis host `6380` (→ container 6379). The host DB/Redis ports are remapped
to avoid clashing with local system PostgreSQL/Redis.

Backend without Docker:
```bash
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate && python manage.py seed_data
python manage.py runserver 8000
```

---

## 14. Common operations (production)

Run management commands inside the Railway container over SSH (an ed25519 key must be
registered with `railway ssh keys add`):

```bash
# from backend/ with the Railway project linked
railway ssh --service backend "python manage.py seed_data"       # (re)seed demo data
railway ssh --service backend "python manage.py createsuperuser" # new admin (interactive)
railway ssh --service backend "python manage.py migrate"         # manual migrate
railway logs --service backend                                   # runtime logs
railway variables --service backend                              # inspect env
railway deployment list --service backend --json                 # deploy status
```

Redeploy after a variable change: Railway redeploys automatically; otherwise
`railway redeploy --service backend -y`.

---

## 15. Troubleshooting quick reference

| Symptom | Cause | Fix |
|---|---|---|
| `Application not found`, header `x-railway-fallback: true` | domain not bound to a healthy deploy / wrong target port | set domain target port to `8080`; redeploy |
| Django `Bad Request (400)` on the Railway URL | hostname not in `ALLOWED_HOSTS` | redeploy so `RAILWAY_PUBLIC_DOMAIN` is picked up |
| Admin/storefront can't call API (CORS error) | origin missing from `CORS_ALLOWED_ORIGINS` | add the exact `https://…vercel.app` origin, redeploy backend |
| Frontend still hits `/api/v1` relative path | `VITE_API_URL` not set, or set but not rebuilt | set env var + **redeploy** (Vite bakes at build) |
| `value too long for type character varying(200)` | `URLField` length on Postgres | widen to `max_length=500` + migrate |
| Static/CSS missing on Django admin | WhiteNoise/collectstatic | ensure WhiteNoise middleware + `collectstatic` at build |

---

*Last updated for the initial production launch. Keep this file in sync when URLs, env vars,
or the deploy pipeline change.*
