"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  postConsignment,
  postCheckout,
  approveConsignment,
  rejectConsignment,
  advanceOrder,
} from "./api";

export type FormState = { ok: boolean; message: string; error?: string } | null;

// ── Public: consignment submission ──────────────────────────────────────────
export async function submitConsignment(_prev: FormState, formData: FormData): Promise<FormState> {
  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || ""),
    brand: String(formData.get("brand") || ""),
    condition: String(formData.get("condition") || "New"),
    askingPrice: Number(formData.get("askingPrice") || 0),
    description: String(formData.get("description") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    notes: String(formData.get("notes") || ""),
  };

  try {
    const res = await postConsignment(payload);
    return { ok: true, message: res.message };
  } catch (e) {
    return { ok: false, message: "Submission failed", error: (e as Error).message };
  }
}

// ── Public: checkout ────────────────────────────────────────────────────────
export async function placeOrder(formData: FormData): Promise<void> {
  const cartRaw = String(formData.get("cart") || "[]");
  let cart: Array<{ productId: string; title: string; price: number }> = [];
  try {
    cart = JSON.parse(cartRaw);
  } catch {
    redirect("/cart?error=invalid-cart");
  }
  if (!Array.isArray(cart) || cart.length === 0) redirect("/cart?error=empty");

  const body = {
    customer: {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
    },
    shipping: {
      address: String(formData.get("address") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      country: String(formData.get("country") || ""),
      zip: String(formData.get("zip") || ""),
    },
    items: cart,
  };

  try {
    const { order } = await postCheckout(body);
    redirect(`/order/${order.id}?new=1`);
  } catch (e) {
    redirect(`/checkout?error=${encodeURIComponent((e as Error).message)}`);
  }
}

// ── Admin auth ──────────────────────────────────────────────────────────────
export async function adminLogin(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD || "quantumx-admin";
  if (password === expected) {
    cookies().set("qx_admin", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    redirect("/admin");
  }
  return { ok: false, message: "Invalid password" };
}

export async function adminLogout() {
  cookies().delete("qx_admin");
  redirect("/admin");
}

// ── Admin: consignment review ───────────────────────────────────────────────
export async function adminApprove(formData: FormData) {
  const id = String(formData.get("id") || "");
  const price = formData.get("price") ? Number(formData.get("price")) : undefined;
  await approveConsignment(id, price);
  redirect("/admin/consignments");
}

export async function adminReject(formData: FormData) {
  const id = String(formData.get("id") || "");
  const reason = String(formData.get("reason") || "");
  await rejectConsignment(id, reason);
  redirect("/admin/consignments");
}

// ── Admin: fulfilment ───────────────────────────────────────────────────────
export async function adminAdvance(formData: FormData) {
  const id = String(formData.get("id") || "");
  const to = String(formData.get("to") || "");
  const location = String(formData.get("location") || "");
  const description = String(formData.get("description") || "");
  await advanceOrder(id, { to: to || undefined, location: location || undefined, description: description || undefined });
  redirect("/admin/orders");
}
