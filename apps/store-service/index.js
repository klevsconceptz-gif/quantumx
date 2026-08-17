// @quantumx/store-service
// Backend #1 — Store & Catalog (products). Owns the brand-store product catalog
// and admin edits to listings. Port 4001.

import express from "express";
import { db, uuid, mapProduct } from "@quantumx/db";

const app = express();
const PORT = process.env.STORE_PORT || 4001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("X-Service", "store-service");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (_req, res) =>
  res.json({ service: "store-service", status: "ok", time: new Date().toISOString() })
);

// List products (optionally filter by category + status). Defaults to AVAILABLE.
app.get("/products", (req, res) => {
  try {
    const { category, status, q } = req.query;
    const where = ["status = ?"];
    const params = [String(status || "AVAILABLE")];
    if (category && category !== "All") {
      where.push("category = ?");
      params.push(String(category));
    }
    if (q) {
      where.push("title LIKE ?");
      params.push(`%${String(q)}%`);
    }
    const rows = db
      .prepare(`SELECT * FROM product WHERE ${where.join(" AND ")} ORDER BY created_at DESC`)
      .all(...params);
    res.json({ products: rows.map(mapProduct) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to list products" });
  }
});

// Distinct categories for filters
app.get("/categories", (_req, res) => {
  try {
    const rows = db
      .prepare(`SELECT DISTINCT category FROM product WHERE status='AVAILABLE' ORDER BY category ASC`)
      .all();
    res.json({ categories: rows.map((r) => r.category) });
  } catch (e) {
    res.status(500).json({ error: "Failed to list categories" });
  }
});

// Single product
app.get("/products/:id", (req, res) => {
  try {
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: "Product not found" });
    res.json({ product: mapProduct(row) });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Admin: edit a listing
app.patch("/products/:id", (req, res) => {
  try {
    const allowed = ["title", "description", "category", "brand", "price", "condition", "status"];
    const sets = [];
    const params = [];
    for (const k of allowed) {
      if (k in (req.body || {})) {
        sets.push(`${k} = ?`);
        params.push(req.body[k]);
      }
    }
    if (sets.length === 0) return res.json({ product: null });
    sets.push("updated_at = datetime('now')");
    params.push(req.params.id);
    db.prepare(`UPDATE product SET ${sets.join(", ")} WHERE id = ?`).run(...params);
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(req.params.id);
    res.json({ product: mapProduct(row) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Admin: create a listing
app.post("/products", (req, res) => {
  try {
    const { title, description, category, brand, price, condition, image } = req.body || {};
    if (!title || !description || !category || price == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const id = uuid();
    db.prepare(
      `INSERT INTO product (id, title, description, category, brand, price, condition, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`
    ).run(id, title, description, category, brand || "Quantum Space X", Number(price), condition || "New", image || "/products/p1.jpg");
    const row = db.prepare(`SELECT * FROM product WHERE id = ?`).get(id);
    res.status(201).json({ product: mapProduct(row) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.listen(PORT, () => {
  console.log(`🛰️  store-service listening on :${PORT}  (Store & Catalog backend)`);
});
