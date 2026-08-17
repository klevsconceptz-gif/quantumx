// @quantumx/shipping-service
// Backend #4 — Shipping, tracking & fulfilment. Powers public tracking lookups
// and the admin fulfilment workflow that advances an order through the
// delivery lifecycle. Port 4003.

import express from "express";
import { db, uuid, mapOrder, mapOrderItem, mapEvent } from "@quantumx/db";

const app = express();
const PORT = process.env.SHIPPING_PORT || 4003;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Service", "shipping-service");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (_req, res) =>
  res.json({ service: "shipping-service", status: "ok", time: new Date().toISOString() })
);

const LIFECYCLE = ["PROCESSING", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];
const STAGE_LABELS = {
  PROCESSING: "Order processing",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

// Public: track a shipment by tracking number
app.get("/track/:trackingNumber", (req, res) => {
  try {
    const tn = String(req.params.trackingNumber).trim().toUpperCase();
    const orderRow = db.prepare(`SELECT * FROM "order" WHERE tracking_number = ?`).get(tn);
    if (!orderRow) return res.status(404).json({ error: "No shipment found for that tracking number." });

    const itemRows = db.prepare(`SELECT * FROM order_item WHERE order_id = ?`).all(orderRow.id).map(mapOrderItem);
    const eventRows = db.prepare(`SELECT * FROM tracking_event WHERE order_id = ? ORDER BY timestamp ASC`).all(orderRow.id).map(mapEvent);

    const currentIndex = Math.max(0, LIFECYCLE.indexOf(orderRow.shipping_status));
    const progress = LIFECYCLE.map((stage, i) => ({
      stage,
      label: STAGE_LABELS[stage],
      reached: i <= currentIndex,
    }));

    res.json({ order: { ...mapOrder(orderRow), items: itemRows, events: eventRows }, progress });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Tracking lookup failed" });
  }
});

// Admin: advance an order to the next stage (or to a specific { to } stage).
app.post("/orders/:id/advance", (req, res) => {
  try {
    const orderRow = db.prepare(`SELECT * FROM "order" WHERE id = ?`).get(req.params.id);
    if (!orderRow) return res.status(404).json({ error: "Order not found" });

    let target;
    if (req.body?.to && LIFECYCLE.includes(req.body.to)) {
      target = req.body.to;
    } else {
      const idx = LIFECYCLE.indexOf(orderRow.shipping_status);
      target = LIFECYCLE[Math.min(idx + 1, LIFECYCLE.length - 1)];
    }

    db.prepare(`UPDATE "order" SET shipping_status = ? WHERE id = ?`).run(target, orderRow.id);
    db.prepare(
      `INSERT INTO tracking_event (id, order_id, status, location, description) VALUES (?, ?, ?, ?, ?)`
    ).run(
      uuid(),
      orderRow.id,
      target,
      req.body?.location || null,
      req.body?.description || `${STAGE_LABELS[target] || target}: shipment updated by fulfilment team.`
    );

    const updated = db.prepare(`SELECT * FROM "order" WHERE id = ?`).get(req.params.id);
    const eventRows = db.prepare(`SELECT * FROM tracking_event WHERE order_id = ? ORDER BY timestamp ASC`).all(req.params.id).map(mapEvent);
    res.json({ order: { ...mapOrder(updated), events: eventRows } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to advance shipment" });
  }
});

app.listen(PORT, () => {
  console.log(`🛰️  shipping-service listening on :${PORT}  (Shipping & Tracking backend)`);
});
