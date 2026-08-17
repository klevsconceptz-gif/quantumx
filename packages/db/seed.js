// Seeds the Quantum Space X datastore with demo data.
// Run: npm run db:seed  (from repo root)

import { db, uuid, mapProduct, mapOrder, mapOrderItem, mapEvent } from "./index.js";

const products = [
  {
    title: "Quantum Aero Runner",
    description:
      "Featherweight knit-upper runner with reactive foam midsole. A flagship Quantum Space X silhouette engineered for orbital comfort.",
    category: "Footwear",
    brand: "Quantum Space X",
    price: 180,
    condition: "New",
    image: "/products/p1.jpg",
  },
  {
    title: "Nebula Bomber Jacket",
    description:
      "Iridescent ripstop bomber with magnetic storm placket and concealed tech pockets. Consigned, gently worn.",
    category: "Outerwear",
    brand: "Quantum Space X",
    price: 240,
    condition: "Like New",
    image: "/products/p2.jpg",
  },
  {
    title: "Cosmic Chrono Watch",
    description:
      "Automatic chronograph with void-black dial and luminescent orbit indices. Sapphire crystal, exhibition caseback.",
    category: "Watches",
    brand: "Quantum Space X",
    price: 420,
    condition: "New",
    image: "/products/p3.jpg",
  },
  {
    title: "Stellar Heavyweight Hoodie",
    description:
      "500gsm brushed-fleece hoodie with reflective constellation print. Boxed fit, double-layer hood.",
    category: "Apparel",
    brand: "Quantum Space X",
    price: 130,
    condition: "New",
    image: "/products/p4.jpg",
  },
  {
    title: "Orbit Wireless Headphones",
    description:
      "Adaptive ANC over-ears with spatial audio and 40-hour battery. Includes magnetic charging cradle.",
    category: "Electronics",
    brand: "Quantum Space X",
    price: 260,
    condition: "Like New",
    image: "/products/p5.jpg",
  },
  {
    title: "Vortex Techwear Cargo Pants",
    description:
      "Modular 6-pocket cargo with taped seams and articulated knees. Water-repellent nylon shell.",
    category: "Apparel",
    brand: "Quantum Space X",
    price: 110,
    condition: "New",
    image: "/products/p6.jpg",
  },
  {
    title: "Lunar Crossbody Bag",
    description:
      "Compact hard-shell crossbody with magnetic flap and woven ladder strap. Perfect for daily carry.",
    category: "Accessories",
    brand: "Quantum Space X",
    price: 95,
    condition: "New",
    image: "/products/p7.jpg",
  },
  {
    title: "Solar Flare Sunglasses",
    description:
      "Wrap-around shield shades with polarized flare lenses and matte bio-acetate frame.",
    category: "Accessories",
    brand: "Quantum Space X",
    price: 70,
    condition: "New",
    image: "/products/p8.jpg",
  },
];

const insertProduct = db.prepare(`
  INSERT INTO product (id, title, description, category, brand, price, condition, image, status, consignee_name, consignee_email, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOrder = db.prepare(`
  INSERT INTO "order" (id, customer_name, customer_email, address, city, state, country, zip, phone, total, tracking_number, shipping_status, estimated_days)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertItem = db.prepare(`
  INSERT INTO order_item (id, order_id, product_id, title, price) VALUES (?, ?, ?, ?, ?)
`);

const insertEvent = db.prepare(`
  INSERT INTO tracking_event (id, order_id, status, location, description, timestamp) VALUES (?, ?, ?, ?, ?, ?)
`);

const markSold = db.prepare(`UPDATE product SET status='SOLD', updated_at=datetime('now') WHERE id=?`);

function main() {
  console.log("🌱 Seeding Quantum Space X database…");

  db.exec(`DELETE FROM tracking_event; DELETE FROM order_item; DELETE FROM "order"; DELETE FROM product;`);

  const created = {};
  for (const p of products) {
    const id = uuid();
    insertProduct.run(id, p.title, p.description, p.category, p.brand, p.price, p.condition, p.image, "AVAILABLE", null, null, null);
    created[p.title] = id;
  }

  // A pending consignment awaiting admin review
  const pendingId = uuid();
  insertProduct.run(
    pendingId,
    "Galaxy Cap — limited drop (pending review)",
    "Submitted by a consignor for review. Embroidered 6-panel cap from the Galaxy capsule.",
    "Accessories",
    "Quantum Space X",
    60,
    "New",
    "/products/p4.jpg",
    "PENDING",
    "Adaeze O.",
    "consignor@example.com",
    "Brand new with tags. Hoping for a quick listing."
  );

  // A sample shipped order with a tracking timeline
  const runnerId = created["Quantum Aero Runner"];
  const orderId = uuid();
  const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();

  insertOrder.run(
    orderId,
    "Tunde B.",
    "tunde@example.com",
    "12 Trans-Amadi Layout",
    "Port Harcourt",
    "Rivers",
    "Nigeria",
    "500001",
    "+234 800 000 0000",
    180,
    "QSX-7H3K2N9Q",
    "IN_TRANSIT",
    3
  );
  insertItem.run(uuid(), orderId, runnerId, "Quantum Aero Runner", 180);
  insertEvent.run(uuid(), orderId, "PROCESSING", "Quantum HQ — Lagos", "Order received and prepared for dispatch.", hoursAgo(26));
  insertEvent.run(uuid(), orderId, "SHIPPED", "Quantum Fulfilment — Lagos", "Package handed to Quantum Space Logistics.", hoursAgo(20));
  insertEvent.run(uuid(), orderId, "IN_TRANSIT", "Regional Hub — Abuja", "In transit to destination city.", hoursAgo(6));
  markSold.run(runnerId);

  const count = db.prepare(`SELECT COUNT(*) c FROM product WHERE status='AVAILABLE'`).get().c;
  console.log(`✅ Seeded ${products.length} products (${count} available), 1 pending consignment, 1 sample order (QSX-7H3K2N9Q).`);
}

try {
  main();
} catch (e) {
  console.error("Seed failed:", e);
  process.exit(1);
}
