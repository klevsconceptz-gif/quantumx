// @quantumx/consignment-service
// Backend #2 — Consignment intake & review. Accepts seller submissions,
// stores them as PENDING products, and powers the admin review workflow.
// Port 4002.

import express from "express";
import { db, uuid, mapProduct } from "@quantumx/db";

const app = express();
const PORT = process.env.CONSIGNMENT_PORT || 4002;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Service", "consignment-service");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (_req, res) =>
  res.json({ service: "consignment-service", status: "ok", time: new Date().toISOString() })
);

// Public: a seller submits an item for consignment.
app.post("/submit", (req, res) => {
  try {
    const b = req.body || {};
    const required = ["name", "email", "title", "category", "askingPrice", "description"];
    for (const f of required) {
      if (b[f] == null || String(b[f]).trim() === "") {
        return res.status(400).json({ error: `Missing field: ${f}` });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(b.email))) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const id = uuid();
    db.prepare(
      `INSERT INTO product (id, title, description, category, brand, price, condition, image, status, consignee_name, consignee_email, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?)`
    ).run(
      id,
      String(b.title).trim(),
      String(b.description).trim(),
      String(b.category).trim(),
      (b.brand && String(b.brand).trim()) || "Unbranded",
      Number(b.askingPrice) || 0,
      b.condition || "New",
      b.imageUrl || "/products/p1.jpg",
      String(b.name).trim(),
      String(b.email).trim(),
      b.notes ? String(b.notes).trim() : null
    );

    res.status(201).json({
      ok: true,
      id,
      message:
        "Consignment request received. Our team will review it and list it on the Quantum Space X store within 24–48h.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to submit consignment request" });
  }
});

// Admin: list consignments
app.get("/", (req, res) => {
  try {
    const status = req.query.status || "PENDING";
    const rows =
      status === "ALL"
        ? db.prepare(`SELECT * FROM product ORDER BY created_at DESC`).all()
        : db.prepare(`SELECT * FROM product WHERE status = ? ORDER BY created_at DESC`).all(String(status));
    res.json({ consignments: rows.map(mapProduct) });
  } catch (e) {
    res.status(500).json({ error: "Failed to list consignments" });
  }
});

// Admin: single submission
app.get("/:id", (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ consignment: mapProduct(row) });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch consignment" });
  }
});

// Admin: approve → AVAILABLE (optionally set sale price)
app.patch("/:id/approve", (req, res) => {
  try {
    if (req.body?.price != null) {
      db.prepare(`UPDATE product SET status='AVAILABLE', price=?, updated_at=datetime('now') WHERE id=?`).run(
        Number(req.body.price),
        req.params.id
      );
    } else {
      db.prepare(`UPDATE product SET status='AVAILABLE', updated_at=datetime('now') WHERE id=?`).run(req.params.id);
    }
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(req.params.id);
    res.json({ consignment: mapProduct(row) });
  } catch (e) {
    res.status(500).json({ error: "Failed to approve consignment" });
  }
});

// Admin: reject
app.patch("/:id/reject", (req, res) => {
  try {
    const reason = req.body?.reason ? `Rejected: ${req.body.reason}` : "Rejected by admin";
    db.prepare(`UPDATE product SET status='REJECTED', notes=?, updated_at=datetime('now') WHERE id=?`).run(
      reason,
      req.params.id
    );
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(req.params.id);
    res.json({ consignment: mapProduct(row) });
  } catch (e) {
    res.status(500).json({ error: "Failed to reject consignment" });
  }
});

app.listen(PORT, () => {
  console.log(`🛰️  consignment-service listening on :${PORT}  (Consignment backend)`);
});
