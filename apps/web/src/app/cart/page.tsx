"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, CartIcon, TruckIcon } from "@/components/Icons";

export default function CartPage() {
  const { items, remove, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-qx py-16">
        <div className="card mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto mb-4 w-fit rounded-2xl bg-white/5 p-4">
            <CartIcon className="h-8 w-8 text-stardust/40" />
          </div>
          <h1 className="font-display text-xl font-bold text-white">Your cart is empty</h1>
          <p className="mt-2 text-sm text-stardust/60">
            Discover authenticated, consigned pieces in the store.
          </p>
          <Link href="/store" className="btn-primary mt-6">
            Browse the store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = 0; // insured shipping included
  const grandTotal = total + shipping;

  return (
    <div className="container-qx py-10">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Your cart</h1>
      <p className="mt-2 text-sm text-stardust/60">{items.length} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* items */}
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.productId}
              className="card flex items-center gap-4 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt={it.title}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/store/${it.productId}`}
                  className="font-display text-sm font-semibold text-white hover:text-quantum-300"
                >
                  {it.title}
                </Link>
                <p className="mt-0.5 text-sm text-quantum-300">{formatPrice(it.price)}</p>
              </div>
              <button
                onClick={() => remove(it.productId)}
                className="rounded-lg px-3 py-1.5 text-xs text-stardust/50 hover:bg-white/5 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={clear}
            className="text-xs text-stardust/40 hover:text-rose-300"
          >
            Clear cart
          </button>
        </div>

        {/* summary */}
        <div className="card h-fit p-6">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Order summary
          </h2>
          <div className="mt-4 space-y-3 text-sm">
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
            <div className="flex justify-between border-t border-white/5 pt-3 font-display text-base font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="btn-primary mt-6 w-full"
          >
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-stardust/40">
            Insured shipping · Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}
