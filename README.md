# Restaurant Order Management

A mobile-first ordering system for a café or restaurant: customers order from
their phone, the kitchen sees orders arrive live, and the owner manages the menu
and reads the day's numbers. Built for a real café, "Badshah's Kitchen".

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Realtime)

## What it does

| For | Features |
|---|---|
| **Customers** | Browse the menu by category, build a cart, place an order, follow its status live, see the bill and leave a rating |
| **Kitchen** (`/kitchen`) | Live order board over WebSockets, one-tap status changes (Placed, Accepted, Preparing, Ready, Completed), filter by status |
| **Admin** (`/admin`) | Menu create/edit/delete, availability toggle, custom categories, daily stats (orders, revenue, average order, popular items), customer feedback |

## Architecture

```
Browser (Next.js app) ── supabase-js ──▶ Supabase Postgres
        │                                   ▲  Realtime (orders, menu_items)
        └── POST /api/login ─▶ checks ADMIN_PASSWORD / KITCHEN_PASSWORD on the server
```

Tables: `menu_items`, `orders`, `order_items`, `feedback`. Order lines keep the
price at the time of ordering and are decoupled from the menu, so changing a
price never rewrites past bills. Schema notes are in [docs/database-schema.md](docs/database-schema.md).
Load tests (k6) for the menu and order endpoints are in [k6-tests](k6-tests).

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in Supabase URL, anon key and the two staff passwords
npm run dev                  # http://localhost:3000
```

Database setup and deployment: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Known limitations

Be aware of these before using it for anything beyond a small, trusted setup:

- **Staff login is a shared password gate, not user accounts.** The password is
  now checked on the server (`/api/login`) and no longer ships in the browser
  bundle, but the "logged in" flag still lives in the browser, and data access
  uses the public Supabase key. Real protection needs Supabase Auth with
  row-level security. See [docs/ROADMAP.md](docs/ROADMAP.md).
- No automated tests yet beyond the k6 load scripts.

## Changes in this version

- Staff passwords moved from `NEXT_PUBLIC_*` variables to server-only
  `ADMIN_PASSWORD` and `KITCHEN_PASSWORD`; the hard-coded fallback passwords were removed.
  The old variable names are still read so existing deployments keep working.
- Removed outdated generated documents; merged ideas from the earlier Vite version into the roadmap.
