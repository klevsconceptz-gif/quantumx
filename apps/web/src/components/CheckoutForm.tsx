"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useCart } from "./CartProvider";
import { placeOrder } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, ShieldIcon, TruckIcon, CheckIcon } from "@/components/Icons";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-quantum-500 to-nebula-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-quantum-900/40 transition hover:from-quantum-400 hover:to-nebula-400 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Placing order…
        </>
      ) : (
        <>
          Place order <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function CheckoutForm({ error }: { error?: string }) {
  const { items, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <h1 className="font-display text-xl font-bold text-white">Your cart is empty</h1>
        <p className="mt-2 text-sm text-stardust/60">
          Add something from the store before checking out.
        </p>
        <Link href="/store" className="btn-primary mt-6">
          Browse the store
        </Link>
      </div>
    );
  }

  const cartJson = JSON.stringify(
    items.map((i) => ({ productId: i.productId, title: i.title, price: i.price }))
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form action={placeOrder} className="card p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {decodeURIComponent(error)}
          </div>
        )}

        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" className="input" required placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" required placeholder="jane@email.com" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" className="input" placeholder="+234 …" />
          </div>
        </div>

        <h2 className="mt-7 font-display text-sm font-bold uppercase tracking-wider text-white">
          Shipping address
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="address">Street address</label>
            <input id="address" name="address" className="input" required placeholder="12 Trans-Amadi Layout" />
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <input id="city" name="city" className="input" required placeholder="Port Harcourt" />
          </div>
          <div>
            <label className="label" htmlFor="state">State / Region</label>
            <input id="state" name="state" className="input" placeholder="Rivers" />
          </div>
          <div>
            <label className="label" htmlFor="country">Country</label>
            <input id="country" name="country" className="input" required placeholder="Nigeria" />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP / Postal code</label>
            <input id="zip" name="zip" className="input" required placeholder="500001" />
          </div>
        </div>

        <input type="hidden" name="cart" value={cartJson} />

        <div className="mt-7">
          <SubmitButton />
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stardust/40">
          <ShieldIcon className="h-3.5 w-3.5" /> Secure checkout · Insured shipment
        </p>
      </form>

      {/* summary */}
      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((it) => (
              <li key={it.productId} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.title} className="h-12 w-12 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm text-stardust/80">
                  {it.title}
                </span>
                <span className="text-sm font-semibold text-white">
                  {formatPrice(it.price)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-white/5 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-stardust/60">Subtotal</span>
              <span className="text-white">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-stardust/60">
                <TruckIcon className="h-4 w-4" /> Shipping
              </span>
              <span className="text-emerald-300">Included</span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2 font-display text-base font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <ul className="space-y-2 text-xs text-stardust/60">
            {[
              "Insured, tracked shipping included",
              "Tracking number emailed instantly",
              "Authenticity guaranteed",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
