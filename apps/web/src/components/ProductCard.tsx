"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CheckIcon, CartIcon } from "./Icons";
import { formatPrice, classNames } from "@/lib/utils";
import type { Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  const { add, has, justAdded } = useCart();
  const sold = product.status === "SOLD";
  const inCart = has(product.id);
  const added = justAdded === product.id;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-space-900/60 transition hover:border-quantum-500/40 hover:shadow-xl hover:shadow-quantum-900/20">
      <Link
        href={`/store/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-space-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className={classNames(
            "h-full w-full object-cover transition duration-500 group-hover:scale-105",
            sold && "opacity-40 grayscale"
          )}
        />
        <span className="absolute left-3 top-3 rounded-full bg-space-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stardust/80 backdrop-blur">
          {product.category}
        </span>
        {sold && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Sold
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-semibold leading-tight text-white">
            <Link href={`/store/${product.id}`} className="hover:text-quantum-300">
              {product.title}
            </Link>
          </h3>
          <span className="shrink-0 text-sm font-bold text-quantum-300">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1 text-xs text-stardust/50">{product.condition}</p>

        <button
          disabled={sold || inCart}
          onClick={() =>
            add({
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
            })
          }
          className={classNames(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
            sold && "cursor-not-allowed bg-white/5 text-stardust/30",
            !sold && inCart && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
            !sold && !inCart &&
              "bg-gradient-to-r from-quantum-500 to-quantum-600 text-white hover:from-quantum-400 hover:to-quantum-500"
          )}
        >
          {sold ? (
            "Unavailable"
          ) : added ? (
            <>
              <CheckIcon className="h-4 w-4" /> Added
            </>
          ) : inCart ? (
            <>
              <CheckIcon className="h-4 w-4" /> In cart
            </>
          ) : (
            <>
              <CartIcon className="h-4 w-4" /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
