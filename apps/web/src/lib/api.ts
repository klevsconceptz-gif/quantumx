// Server-side gateway client. The web app NEVER talks to the database directly —
// every request is routed to one of the four backend services. This keeps
// "same domain, different backends" honest: the storefront is a thin gateway.

export const SERVICE_URLS = {
  store: process.env.STORE_SERVICE_URL || "http://localhost:4001",
  consignments: process.env.CONSIGNMENT_SERVICE_URL || "http://localhost:4002",
  shipping: process.env.SHIPPING_SERVICE_URL || "http://localhost:4003",
  orders: process.env.ORDERS_SERVICE_URL || "http://localhost:4004",
} as const;

async function http<T>(
  url: string,
  init?: RequestInit & { expect?: "json" | "empty" }
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = `Upstream ${res.status}`;
    try {
      msg = JSON.parse(text)?.error || msg;
    } catch {
      /* keep default */
    }
    throw new Error(msg);
  }
  if (!text) return undefined as unknown as T;
  return JSON.parse(text) as T;
}

// ── Types ──────────────────────────────────────────────────────────────────
export type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string | null;
  price: number;
  condition: string;
  image: string;
  status: string;
  consigneeName: string | null;
  consigneeEmail: string | null;
  notes: string | null;
  createdAt: string;
};

export type OrderItem = { id: string; productId: string; title: string; price: number };

export type TrackingEvent = {
  id: string;
  status: string;
  location: string | null;
  description: string;
  timestamp: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  zip: string;
  phone: string | null;
  total: number;
  trackingNumber: string;
  shippingStatus: string;
  carrier: string;
  estimatedDays: number;
  createdAt: string;
};

export type TrackedOrder = Order & { items: OrderItem[]; events: TrackingEvent[] };

// ── Store service ───────────────────────────────────────────────────────────
export async function listProducts(opts: { category?: string; q?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.q) params.set("q", opts.q);
  const qs = params.toString();
  const { products } = await http<{ products: Product[] }>(
    `${SERVICE_URLS.store}/products${qs ? `?${qs}` : ""}`
  );
  return products;
}

export async function getCategories() {
  const { categories } = await http<{ categories: string[] }>(
    `${SERVICE_URLS.store}/categories`
  );
  return categories;
}

export async function getProduct(id: string) {
  const { product } = await http<{ product: Product }>(`${SERVICE_URLS.store}/products/${id}`);
  return product;
}

// ── Consignment service ─────────────────────────────────────────────────────
export async function listConsignments(status = "PENDING") {
  const { consignments } = await http<{ consignments: Product[] }>(
    `${SERVICE_URLS.consignments}/?status=${status}`
  );
  return consignments;
}

export async function getConsignment(id: string) {
  const { consignment } = await http<{ consignment: Product }>(
    `${SERVICE_URLS.consignments}/${id}`
  );
  return consignment;
}

// ── Shipping service ────────────────────────────────────────────────────────
export type TrackingResult = { order: TrackedOrder; progress: TrackingStage[] };
export type TrackingStage = { stage: string; label: string; reached: boolean };

export async function trackOrder(trackingNumber: string) {
  return http<TrackingResult>(
    `${SERVICE_URLS.shipping}/track/${encodeURIComponent(trackingNumber)}`
  );
}

// ── Orders service ──────────────────────────────────────────────────────────
export async function listOrders() {
  const { orders } = await http<{ orders: Order[] }>(`${SERVICE_URLS.orders}/orders`);
  return orders;
}

export async function getOrder(id: string) {
  const { order } = await http<{ order: TrackedOrder }>(`${SERVICE_URLS.orders}/orders/${id}`);
  return order;
}

// ── Mutations (used by server actions) ──────────────────────────────────────
export async function postConsignment(body: unknown) {
  return http<{ ok: boolean; id: string; message: string }>(
    `${SERVICE_URLS.consignments}/submit`,
    { method: "POST", body: JSON.stringify(body) }
  );
}

export async function postCheckout(body: unknown) {
  return http<{ order: TrackedOrder }>(`${SERVICE_URLS.orders}/checkout`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function approveConsignment(id: string, price?: number) {
  return http<{ consignment: Product }>(`${SERVICE_URLS.consignments}/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(price != null ? { price } : {}),
  });
}

export async function rejectConsignment(id: string, reason: string) {
  return http<{ consignment: Product }>(`${SERVICE_URLS.consignments}/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export async function advanceOrder(
  id: string,
  body: { to?: string; location?: string; description?: string }
) {
  return http<{ order: TrackedOrder }>(
    `${SERVICE_URLS.shipping}/orders/${id}/advance`,
    { method: "POST", body: JSON.stringify(body) }
  );
}
