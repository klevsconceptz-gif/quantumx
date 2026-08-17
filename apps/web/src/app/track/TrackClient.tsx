"use client";

import { useState } from "react";
import { TruckIcon, PackageIcon, CheckIcon, SearchIcon } from "@/components/Icons";
import { formatPrice, formatDate, statusLabel, classNames } from "@/lib/utils";

type Stage = { stage: string; label: string; reached: boolean };
type Tracked = {
  order: {
    id: string;
    trackingNumber: string;
    shippingStatus: string;
    carrier: string;
    estimatedDays: number;
    total: number;
    createdAt: string;
    customerName: string;
    city: string;
    country: string;
    items: Array<{ id: string; title: string; price: number }>;
    events: Array<{
      id: string;
      status: string;
      location: string | null;
      description: string;
      timestamp: string;
    }>;
  };
  progress: Stage[];
};

export function TrackClient({ initialTn }: { initialTn?: string }) {
  const [tn, setTn] = useState(initialTn || "");
  const [data, setData] = useState<Tracked | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(value?: string) {
    const code = (value ?? tn).trim().toUpperCase();
    if (!code) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // Same-domain request, proxied by the gateway to the SHIPPING backend
      // (one domain, different backends) — see next.config.mjs rewrites.
      const res = await fetch(`/api/shipping/track/${encodeURIComponent(code)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Not found");
      }
      setData(await res.json());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup();
        }}
        className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stardust/40" />
          <input
            value={tn}
            onChange={(e) => setTn(e.target.value)}
            placeholder="Enter tracking number e.g. QSX-7H3K2N9Q"
            className="input pl-11 font-mono uppercase"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? "Tracking…" : "Track shipment"}
        </button>
      </form>

      {error && (
        <div className="card border-rose-500/30 bg-rose-500/5 p-6 text-center">
          <p className="font-display text-base font-semibold text-rose-300">
            No shipment found
          </p>
          <p className="mt-1 text-sm text-stardust/60">
            Double-check your tracking number and try again.
          </p>
        </div>
      )}

      {data && <ShipmentResult data={data} />}
    </div>
  );
}

function ShipmentResult({ data }: { data: Tracked }) {
  const { order, progress } = data;
  const current = progress.find((p) => p.stage === order.shippingStatus);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      {/* timeline */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-quantum-500/10 p-2.5 text-quantum-300 ring-1 ring-quantum-500/20">
              <TruckIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-stardust/50">Tracking number</p>
              <p className="font-mono text-sm font-bold text-white">{order.trackingNumber}</p>
            </div>
          </div>
          <span className="rounded-full bg-quantum-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-quantum-200 ring-1 ring-quantum-500/30">
            {statusLabel(order.shippingStatus)}
          </span>
        </div>

        {/* progress bar */}
        <div className="mt-6">
          <div className="flex items-center">
            {progress.map((s, i) => (
              <div key={s.stage} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={classNames(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition",
                      s.reached
                        ? "bg-gradient-to-br from-quantum-500 to-nebula-500 text-white"
                        : "bg-white/5 text-stardust/40 ring-1 ring-white/10"
                    )}
                  >
                    {s.reached ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={classNames(
                      "mt-2 hidden text-[10px] font-semibold uppercase tracking-wider sm:block",
                      s.reached ? "text-white" : "text-stardust/40"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < progress.length - 1 && (
                  <div
                    className={classNames(
                      "mx-1 h-0.5 flex-1 rounded-full transition",
                      progress[i + 1].reached ? "bg-quantum-500" : "bg-white/10"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* events */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stardust/40">
            Shipment history
          </p>
          <ol className="relative space-y-5 border-l border-white/10 pl-5">
            {order.events
              .slice()
              .reverse()
              .map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-quantum-400 ring-4 ring-space-900" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {statusLabel(ev.status)}
                    </span>
                    {ev.location && (
                      <span className="text-xs text-stardust/50">· {ev.location}</span>
                    )}
                  </div>
                  <p className="text-sm text-stardust/60">{ev.description}</p>
                  <p className="mt-0.5 text-xs text-stardust/40">{formatDate(ev.timestamp)}</p>
                </li>
              ))}
          </ol>
        </div>
      </div>

      {/* summary */}
      <div className="space-y-6">
        <div className="card p-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stardust/40">
            <PackageIcon className="h-4 w-4" /> Order summary
          </p>
          <dl className="space-y-2.5 text-sm">
            <Row label="Recipient" value={order.customerName} />
            <Row label="Destination" value={`${order.city}, ${order.country}`} />
            <Row label="Carrier" value={order.carrier} />
            <Row label="Est. delivery" value={`${order.estimatedDays} business days`} />
            <Row label="Ordered" value={formatDate(order.createdAt)} />
          </dl>
        </div>

        <div className="card p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stardust/40">
            Items in shipment
          </p>
          <ul className="space-y-3">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-center justify-between text-sm">
                <span className="text-stardust/80">{it.title}</span>
                <span className="font-semibold text-white">{formatPrice(it.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-sm text-stardust/60">Total</span>
            <span className="font-display text-lg font-bold text-quantum-300">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-stardust/50">{label}</dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}
