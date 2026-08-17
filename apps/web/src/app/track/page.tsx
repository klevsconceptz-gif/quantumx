import { TrackClient } from "./TrackClient";

export const metadata = { title: "Track your shipment" };

export default function TrackPage({
  searchParams,
}: {
  searchParams: { tn?: string };
}) {
  return (
    <div className="container-qx py-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-nebula-400">
          Quantum Space Logistics
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
          Track your shipment
        </h1>
        <p className="mt-4 text-sm text-stardust/60">
          Enter the tracking number from your order confirmation to follow your package
          from processing to delivery.
        </p>
        <p className="mt-3 text-xs text-stardust/40">
          Try the demo number:{" "}
          <span className="font-mono text-quantum-300">QSX-7H3K2N9Q</span>
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <TrackClient initialTn={searchParams.tn} />
      </div>
    </div>
  );
}
