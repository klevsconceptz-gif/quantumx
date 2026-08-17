"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CloseIcon, CartIcon } from "./Icons";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, open, setOpen, remove, total, count } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-space-900 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5 text-quantum-300" />
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Your Cart ({count})
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="rounded-lg p-1.5 text-stardust/70 hover:bg-white/5 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 rounded-2xl bg-white/5 p-4">
                <CartIcon className="h-8 w-8 text-stardust/40" />
              </div>
              <p className="text-sm text-stardust/60">Your cart is empty.</p>
              <Link
                href="/store"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-quantum-500 px-5 py-2 text-sm font-semibold text-white hover:bg-quantum-400"
              >
                Browse the store
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.productId}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-space-800/50 p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-space-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.image}
                      alt={it.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{it.title}</p>
                    <p className="text-sm text-quantum-300">{formatPrice(it.price)}</p>
                  </div>
                  <button
                    onClick={() => remove(it.productId)}
                    className="rounded-md p-1 text-xs text-stardust/50 hover:bg-white/5 hover:text-rose-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/5 px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-stardust/70">Subtotal</span>
              <span className="font-display text-lg font-bold text-white">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-gradient-to-r from-quantum-500 to-nebula-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-quantum-900/40 hover:from-quantum-400 hover:to-nebula-400"
            >
              Checkout · {formatPrice(total)}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center text-xs text-stardust/50 hover:text-white"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
