# Quantum Space X — Consignment & Shipping Platform

A fullstack consignment marketplace and global shipping network for the
**Quantum Space X** brand store. Built as a **single public domain
(`quantumx.win`) fronted by multiple, independent backend services**.

> One domain. Different backends. One orbit.

---

## ✨ What it does

Quantum Space X authenticates, lists, sells and ships premium goods:

- **🛍️ Brand store** — browse authenticated, consigned products with category
  filters and search. Each item is a unique, one-of-one listing.
- **🤝 Consignment intake** — sellers submit items for review; the admin team
  authenticates, prices and lists them. *(the primary feature)*
- **🛒 Cart & checkout** — cart + checkout create an order, reserve stock, and
  generate a **tracking number** instantly.
- **🚚 Shipping & tracking** — every order ships insured with a real-time,
  multi-stage tracking timeline (Processing → Shipped → In transit → Out for
  delivery → Delivered).
- **🔐 Admin portal** — dashboard with stats, a consignment review queue
  (approve / set price / reject), and an orders/fulfilment console.

---

## 🏛️ Architecture — one domain, multiple backends

The storefront is a thin **gateway** (`quantumx.win`). Behind it, **four
separate backend services** each own a distinct concern. In this workspace the
gateway proxies `/api/<service>/*` to each service (see
`apps/web/next.config.mjs`); in production an edge/nginx layer does the same
routing so everything appears under **one domain**.

```
                 ┌───────────────────────────────┐
   quantumx.win  │  apps/web  (Next.js gateway)   │  :3000  (public domain)
   (one domain) ─▶│  storefront UI + /api/* proxy  │
                 └───────────────┬───────────────┘
            ┌─────────────┬──────┴───────┬─────────────┐
            ▼             ▼              ▼             ▼
     store-service  consignment-    shipping-     orders-service
      (products)     service        service       (checkout)
        :4001        :4002           :4003          :4004
            │             │              │             │
            └─────────────┴──────┬───────┴─────────────┘
                                 ▼
                    packages/db  (shared SQLite via node:sqlite)
```

| Service | Port | Owns | Key routes |
|---|---|---|---|
| **store-service** | 4001 | Product catalog + admin listing edits | `GET /products`, `GET /products/:id`, `GET /categories`, `PATCH /products/:id` |
| **consignment-service** | 4002 | Seller intake + review workflow | `POST /submit`, `GET /?status=`, `PATCH /:id/approve`, `PATCH /:id/reject` |
| **shipping-service** | 4003 | Tracking + fulfilment lifecycle | `GET /track/:tn`, `POST /orders/:id/advance` |
| **orders-service** | 4004 | Checkout & order management | `POST /checkout`, `GET /orders`, `GET /orders/:id` |

The web app **never touches the database directly** — every request goes
through one of the four backends, keeping the “different backends” contract
honest. The browser-visible example of this is the **Track** page, which
fetches `/api/shipping/track/:tn` (proxied to backend #4).

### Data layer
`packages/db` uses **Node's built-in `node:sqlite`** (Node 22+) — no native
binaries or external downloads required. All four services share one SQLite
file in WAL mode (safe concurrent reads + serialized writes across processes).

---

## 🚀 Run locally

Requirements: **Node.js 22+**.

```bash
npm install          # installs all workspaces
npm run db:seed      # seed demo products + 1 pending consignment + 1 sample order
npm run dev          # web + all 4 backends (via concurrently)
```

Then open **http://localhost:3000**.

- Start only the backends: `npm run dev:backends`
- Start only the web app: `npm run dev:web`
- Reset the database: `npm run db:reset`

### Demo credentials / data
- **Admin portal:** `/admin` → password `quantumx-admin` (set via `ADMIN_PASSWORD`)
- **Demo tracking number:** `QSX-7H3K2N9Q`
- Admin → **Consignments** to approve/reject submissions
- Admin → **Orders & Shipping** to advance shipments through delivery stages

---

## 🌐 Production domain routing (`quantumx.win`)

In production the four backends are deployed as separate services and the edge
routes them under one domain. Example nginx:

```nginx
server {
  server_name quantumx.win;

  location /                { proxy_pass http://web:3000; }        # storefront
  location /api/store/      { proxy_pass http://store-service:4001/; }
  location /api/consignments/ { proxy_pass http://consignment-service:4002/; }
  location /api/shipping/   { proxy_pass http://shipping-service:4003/; }
  location /api/orders/     { proxy_pass http://orders-service:4004/; }
}
```

Each backend is independently scalable and deployable — same domain, different
backends.

---

## 🎨 Brand logo

The site ships with a clean vector **placeholder logo**
(`apps/web/src/components/Logo.tsx`). To use your real logo, drop it at:

```
apps/web/public/logo.png
```

…and swap the `<LogoMark />` SVG for `<img src="/logo.png" />`. The favicon
lives at `apps/web/public/favicon.svg`.

---

## 🗂️ Project structure

```
quantumx/
├── apps/
│   ├── web/                  # Next.js storefront + API gateway (quantumx.win)
│   ├── store-service/        # Backend #1 — products/catalog       (:4001)
│   ├── consignment-service/  # Backend #2 — intake & review        (:4002)
│   ├── shipping-service/     # Backend #3 — tracking & fulfilment  (:4003)
│   └── orders-service/       # Backend #4 — checkout & orders      (:4004)
├── packages/
│   └── db/                   # shared SQLite (node:sqlite) + schema + seed
├── .env                      # shared config (ports, admin password, DB)
└── package.json              # workspace root + orchestration scripts
```

---

© Quantum Space X. Consignment & shipping, in one orbit.
