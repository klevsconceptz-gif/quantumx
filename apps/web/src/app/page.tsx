import Link from "next/link";
import { listProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { LogoMark } from "@/components/Logo";
import {
  ArrowRight,
  TruckIcon,
  PackageIcon,
  ShieldIcon,
  SparkleIcon,
  CheckIcon,
} from "@/components/Icons";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    featured = (await listProducts()).slice(0, 4);
  } catch {
    featured = [];
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
        {/* orbiting ring decoration */}
        <div className="pointer-events-none absolute left-1/2 top-24 -z-0 hidden -translate-x-1/2 opacity-40 lg:block">
          <div className="relative h-[560px] w-[560px]">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-quantum-500/20" />
            <div className="absolute inset-10 animate-spin-slow rounded-full border border-nebula-400/15 [animation-direction:reverse]" />
            <div className="absolute inset-24 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-nebula-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]" />
            <div className="absolute bottom-6 right-10 h-2 w-2 rounded-full bg-quantum-400 shadow-[0_0_16px_3px_rgba(143,99,255,0.7)]" />
          </div>
        </div>

        <div className="container-qx relative py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-stardust/70 backdrop-blur animate-fade-up">
              <SparkleIcon className="h-3.5 w-3.5 text-quantum-300" />
              Consignment marketplace · Global fulfilment
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-up [animation-delay:60ms]">
              The brand store,{" "}
              <span className="bg-gradient-to-r from-quantum-300 via-quantum-400 to-nebula-400 bg-clip-text text-transparent">
                consigned & shipped
              </span>{" "}
              worldwide.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stardust/70 sm:text-lg animate-fade-up [animation-delay:140ms]">
              Quantum Space X authenticates, lists and ships premium goods for the
              brand store — all under one orbit. Sell what you own, shop what you love,
              and track every package in real time.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up [animation-delay:220ms]">
              <Link href="/store" className="btn-primary">
                Shop the store <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/consign" className="btn-ghost">
                Consign an item
              </Link>
            </div>

            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4 animate-fade-up [animation-delay:300ms]">
              {[
                { k: "4", v: "Backend services" },
                { k: "24–48h", v: "Listing review" },
                { k: "Global", v: "Insured shipping" },
              ].map((s) => (
                <div key={s.v} className="text-center">
                  <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {s.k}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-stardust/50">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* category marquee */}
        <div className="relative border-y border-white/5 bg-space-900/40 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
              {[...marqueeItems, ...marqueeItems].map((m, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-stardust/40"
                >
                  <LogoMark className="h-4 w-4" /> {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Value props ─────────────────────────────────────── */}
      <section className="container-qx py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldIcon,
              title: "Authenticated",
              body: "Every consigned item is inspected and verified before it hits the store.",
            },
            {
              icon: TruckIcon,
              title: "Shipped & tracked",
              body: "Insured global shipping with real-time tracking on every order.",
            },
            {
              icon: PackageIcon,
              title: "One orbit",
              body: "List, sell and fulfil from a single platform built for the brand.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <div className="mb-4 inline-flex rounded-xl bg-quantum-500/10 p-3 text-quantum-300 ring-1 ring-quantum-500/20">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stardust/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────── */}
      <section className="container-qx py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-quantum-300">
              From the store
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              Featured drops
            </h2>
          </div>
          <Link
            href="/store"
            className="hidden items-center gap-1 text-sm font-semibold text-stardust/70 hover:text-white sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <PackageIcon className="mb-3 h-10 w-10 text-stardust/30" />
            <p className="text-sm text-stardust/60">
              The store backend is warming up. Refresh in a moment.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/store" className="btn-ghost">
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── How consignment works ───────────────────────────── */}
      <section className="container-qx py-16">
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-nebula-400">
                Consign with us
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                Turn your pieces into payouts.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-stardust/60">
                Submit your item in minutes. Our team authenticates and prices it,
                lists it on the brand store, and ships it to the buyer — you get paid
                once it sells.
              </p>
              <ol className="mt-8 space-y-5">
                {[
                  "Submit your item with photos & details",
                  "We authenticate, price & list it",
                  "It sells — we ship & you get paid",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-quantum-500 to-nebula-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm text-stardust/80">{step}</span>
                  </li>
                ))}
              </ol>
              <Link href="/consign" className="btn-primary mt-8">
                Start consigning <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/5 bg-space-800/50 p-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-300 ring-1 ring-emerald-500/30">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Authenticated listing</p>
                  <p className="text-xs text-stardust/50">Verified by Quantum Space X</p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-stardust/70">
                {[
                  "Free authentication & photography",
                  "Competitive, data-driven pricing",
                  "Insured while listed & in transit",
                  "Payout within 48h of delivery",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Shipping CTA band ───────────────────────────────── */}
      <section className="container-qx py-12">
        <div className="relative overflow-hidden rounded-3xl border border-quantum-500/20 bg-gradient-to-br from-space-800 via-space-900 to-space-950 p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-quantum-500/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-nebula-400/10 px-3 py-1 text-xs font-semibold text-nebula-300 ring-1 ring-nebula-400/20">
                <TruckIcon className="h-3.5 w-3.5" /> Quantum Space Logistics
              </div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                Tracking an order? Follow it across the galaxy.
              </h2>
              <p className="mt-3 text-sm text-stardust/60">
                Every shipment gets a tracking number the moment it&apos;s placed.
                Check status from processing to delivery.
              </p>
            </div>
            <Link href="/track" className="btn-primary shrink-0">
              Track a shipment <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const marqueeItems = [
  "Footwear",
  "Outerwear",
  "Watches",
  "Apparel",
  "Electronics",
  "Accessories",
  "Authenticated",
  "Insured shipping",
];
