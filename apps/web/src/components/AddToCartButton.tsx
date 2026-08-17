"use client";

import { useCart } from "./CartProvider";
import { CartIcon, CheckIcon } from "./Icons";
import { classNames } from "@/lib/utils";

export function AddToCartButton({
  productId,
  title,
  price,
  image,
  sold,
}: {
  productId: string;
  title: string;
  price: number;
  image: string;
  sold: boolean;
}) {
  const { add, has, justAdded } = useCart();
  const inCart = has(productId);
  const added = justAdded === productId;

  return (
    <button
      disabled={sold || inCart}
      onClick={() => add({ productId, title, price, image })}
      className={classNames(
        "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition",
        sold && "cursor-not-allowed bg-white/5 text-stardust/30",
        !sold && inCart && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
        !sold &&
          !inCart &&
          "bg-gradient-to-r from-quantum-500 to-quantum-600 text-white shadow-lg shadow-quantum-900/40 hover:from-quantum-400 hover:to-quantum-500"
      )}
    >
      {sold ? (
        "Sold out"
      ) : added ? (
        <>
          <CheckIcon className="h-4 w-4" /> Added to cart
        </>
      ) : inCart ? (
        <>
          <CheckIcon className="h-4 w-4" /> In your cart
        </>
      ) : (
        <>
          <CartIcon className="h-4 w-4" /> Add to cart
        </>
      )}
    </button>
  );
}
