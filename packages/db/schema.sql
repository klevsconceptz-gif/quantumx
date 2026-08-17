-- Quantum Space X — shared datastore schema (SQLite)
-- Used by all four backend services via @quantumx/db.

CREATE TABLE IF NOT EXISTS product (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL,
  brand           TEXT,
  price           REAL NOT NULL,
  condition       TEXT NOT NULL DEFAULT 'New',
  image           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE | PENDING | SOLD | REJECTED
  consignee_name  TEXT,
  consignee_email TEXT,
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "order" (
  id              TEXT PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT,
  country         TEXT NOT NULL,
  zip             TEXT NOT NULL,
  phone           TEXT,
  total           REAL NOT NULL,
  tracking_number TEXT NOT NULL UNIQUE,
  shipping_status TEXT NOT NULL DEFAULT 'PROCESSING',  -- PROCESSING | SHIPPED | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED
  carrier         TEXT NOT NULL DEFAULT 'Quantum Space Logistics',
  estimated_days  INTEGER NOT NULL DEFAULT 3,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_item (
  id         TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES product(id),
  title      TEXT NOT NULL,
  price      REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS tracking_event (
  id          TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  location    TEXT,
  description TEXT NOT NULL,
  timestamp   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_product_status   ON product(status);
CREATE INDEX IF NOT EXISTS idx_product_category ON product(category);
CREATE INDEX IF NOT EXISTS idx_order_tracking   ON "order"(tracking_number);
CREATE INDEX IF NOT EXISTS idx_event_order      ON tracking_event(order_id);
CREATE INDEX IF NOT EXISTS idx_item_order       ON order_item(order_id);
