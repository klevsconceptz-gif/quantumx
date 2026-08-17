// @quantumx/db — shared SQLite datastore for the Quantum Space X backends.
// Uses Node's built-in `node:sqlite` (Node 22+), so there are no native
// binaries to download. Every backend service imports this same module and
// gets its own connection to the single database file.

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { dirname, join, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

function resolveDbPath() {
  const raw = (process.env.DATABASE_URL || "file:./dev.db").replace(/^file:/, "");
  const cleaned = raw.replace(/^\.\//, "");
  return isAbsolute(cleaned) ? cleaned : join(repoRoot, cleaned);
}

const dbFile = resolveDbPath();
export const DB_FILE = dbFile;

const db = new DatabaseSync(dbFile);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA busy_timeout = 5000;");
db.exec("PRAGMA foreign_keys = ON;");

// Apply schema (idempotent).
const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
db.exec(schema);

export { db };

export function uuid() {
  return randomUUID();
}

// ── Row → camelCase mappers (keeps API contracts stable) ────────────────────
export function mapProduct(r) {
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    brand: r.brand,
    price: r.price,
    condition: r.condition,
    image: r.image,
    status: r.status,
    consigneeName: r.consignee_name,
    consigneeEmail: r.consignee_email,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapOrder(r) {
  if (!r) return null;
  return {
    id: r.id,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    address: r.address,
    city: r.city,
    state: r.state,
    country: r.country,
    zip: r.zip,
    phone: r.phone,
    total: r.total,
    trackingNumber: r.tracking_number,
    shippingStatus: r.shipping_status,
    carrier: r.carrier,
    estimatedDays: r.estimated_days,
    createdAt: r.created_at,
  };
}

export function mapOrderItem(r) {
  if (!r) return null;
  return { id: r.id, productId: r.product_id, title: r.title, price: r.price };
}

export function mapEvent(r) {
  if (!r) return null;
  return {
    id: r.id,
    status: r.status,
    location: r.location,
    description: r.description,
    timestamp: r.timestamp,
  };
}
