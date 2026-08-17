// @quantumx/orders-service
// Backend #3 — Checkout & Orders. Turns a cart into an order, reserves stock,
// generates a tracking number, and seeds the first tracking event (jointly
// with shipping-service). Port 4004.

import express from "express";
import { db, uuid, mapOrder, mapOrderItem, mapEvent } from "@quantumx/db";

const app = express();
const PORT = process.env.ORDERS_PORT || 4004;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Service", "orders-service");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (_req, res) =>
  res.json({ service: "orders-service", status: "ok", time: new Date().toISOString() })
);

function makeTrackingNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `QSX-${s}`;
}

const insertOrder = db.prepare(`
  INSERT INTO "order" (id, customer_name, customer_email, address, city, state, country, zip, phone, total, tracking_number, shipping_status, estimated_days)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROCESSING', 3)
`);
const insertItem = db.prepare(`INSERT INTO order_item (id, order_id, product_id, title, price) VALUES (?, ?, ?, ?, ?)`);
const insertEvent = db.prepare(`INSERT INTO tracking_event (id, order_id, status, location, description) VALUES (?, ?, 'PROCESSING', 'Quantum HQ — Lagos', 'Order received and confirmed. Preparing for dispatch.')`);

// Place an order.
app.post("/checkout", (req, res) => {
  try {
    const { customer, shipping, items } = req.body || {};
    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ error: "Customer name and email are required" });
    }
    if (!shipping?.address || !shipping?.city || !shipping?.country || !shipping?.zip) {
      return res.status(400).json({ error: "Complete shipping address is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const productIds = items.map((i) => i.productId);
    const placeholders = productIds.map(() => "?").join(",");
    const products = db.prepare(`SELECT * FROM product WHERE id IN (${placeholders})`).all(...productIds);

    for (const it of items) {
      const p = products.find((x) => x.id === it.productId);
      if (!p) return res.status(400).json({ error: `Item not found: ${it.title}` });
      if (p.status !== "AVAILABLE") {
        return res.status(409).json({ error: `"${p.title}" is no longer available` });
      }
    }

    const total = items.reduce((s, it) => s + Number(it.price || 0), 0);
    const orderId = uuid();
    const trackingNumber = makeTrackingNumber();

    try {
      db.exec("BEGIN");
      insertOrder.run(
        orderId,
        customer.name,
        customer.email,
        shipping.address,
        shipping.city,
        shipping.state || null,
        shipping.country,
        shipping.zip,
        customer.phone || null,
        total,
        trackingNumber
      );
      for (const it of items) {
        insertItem.run(uuid(), orderId, it.productId, it.title, Number(it.price));
      }
      insertEvent.run(uuid(), orderId);
      db.prepare(`UPDATE product SET status='SOLD', updated_at=datetime('now') WHERE id IN (${placeholders})`).run(
        ...productIds
      );
      db.exec("COMMIT");
    } catch (inner) {
      db.exec("ROLLBACK");
      throw inner;
    }

    const orderRow = db.prepare(`SELECT * FROM "order" WHERE id = ?`).get(orderId);
    const itemRows = db.prepare(`SELECT * FROM order_item WHERE order_id = ?`).all(orderId).map(mapOrderItem);
    const eventRows = db.prepare(`SELECT * FROM tracking_event WHERE order_id = ? ORDER BY timestamp ASC`).all(orderId).map(mapEvent);

    res.status(201).json({ order: { ...mapOrder(orderRow), items: itemRows, events: eventRows } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Admin: list orders
app.get("/orders", (_req, res) => {
  try {
    const rows = db.prepare(`SELECT * FROM "order" ORDER BY created_at DESC`).all();
    res.json({ orders: rows.map(mapOrder) });
  } catch (e) {
    res.status(500).json({ error: "Failed to list orders" });
  }
});

// Admin / customer: single order
app.get("/orders/:id", (req, res) => {
  try {
    const orderRow = db.prepare(`SELECT * FROM "order" WHERE id = ?`).get(req.params.id);
    if (!orderRow) return res.status(404).json({ error: "Order not found" });
    const itemRows = db.prepare(`SELECT * FROM order_item WHERE order_id = ?`).all(req.params.id).map(mapOrderItem);
    const eventRows = db.prepare(`SELECT * FROM tracking_event WHERE order_id = ? ORDER BY timestamp ASC`).all(req.params.id).map(mapEvent);
    res.json({ order: { ...mapOrder(orderRow), items: itemRows, events: eventRows } });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.listen(PORT, () => {
  console.log(`🛰️  orders-service listening on :${PORT}  (Checkout & Orders backend)`);
});
