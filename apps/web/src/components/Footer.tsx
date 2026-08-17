import Link from "next/link";
import { Logo } from "./Logo";
import { GlobeIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-space-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stardust/60">
              Quantum Space X is a consignment marketplace and fulfilment network for
              the brand store. We authenticate, list, sell and ship premium goods
              under one orbit.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-stardust/50">
              <GlobeIcon className="h-4 w-4" /> quantumx.win
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stardust/40">
              Shop
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/store" className="text-stardust/70 hover:text-white">
                  All products
                </Link>
              </li>
              <li>
                <Link href="/store?category=Footwear" className="text-stardust/70 hover:text-white">
                  Footwear
                </Link>
              </li>
              <li>
                <Link href="/store?category=Apparel" className="text-stardust/70 hover:text-white">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/store?category=Accessories" className="text-stardust/70 hover:text-white">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stardust/40">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/consign" className="text-stardust/70 hover:text-white">
                  Consign with us
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-stardust/70 hover:text-white">
                  Track shipment
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stardust/70 hover:text-white">
                  Admin portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-stardust/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Quantum Space X. All rights reserved.</p>
          <p>Authenticated · Insured · Globally shipped</p>
        </div>
      </div>
    </footer>
  );
}
