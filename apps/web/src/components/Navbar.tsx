"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { CartIcon, MenuIcon, CloseIcon } from "./Icons";
import { useCart } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";
import { classNames } from "@/lib/utils";

const LINKS = [
  { href: "/store", label: "Store" },
  { href: "/consign", label: "Consign" },
  { href: "/track", label: "Track Order" },
];

export function Navbar() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-space-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={classNames(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                  pathname === l.href
                    ? "text-white"
                    : "text-stardust/70 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/consign"
              className="hidden rounded-full bg-gradient-to-r from-quantum-500 to-quantum-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-quantum-900/40 transition hover:from-quantum-400 hover:to-quantum-500 sm:inline-flex"
            >
              Sell with us
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className="relative rounded-lg p-2 text-stardust/80 transition hover:bg-white/5 hover:text-white"
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-nebula-400 px-1 text-[10px] font-bold text-space-950">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobile((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-stardust/80 transition hover:bg-white/5 hover:text-white md:hidden"
            >
              {mobile ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobile && (
          <div className="border-t border-white/5 bg-space-950/95 px-4 py-3 md:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobile(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-stardust/80 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
