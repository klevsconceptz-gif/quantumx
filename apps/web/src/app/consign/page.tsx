import { ConsignForm } from "@/components/ConsignForm";
import { ShieldIcon, TruckIcon, SparkleIcon, CheckIcon } from "@/components/Icons";

export const metadata = { title: "Consign with us" };

const PERKS = [
  { icon: ShieldIcon, title: "Free authentication", body: "We verify every item at no cost to you." },
  { icon: SparkleIcon, title: "Pro pricing", body: "Data-driven prices that actually sell." },
  { icon: TruckIcon, title: "We handle shipping", body: "Insured fulfilment to buyers worldwide." },
  { icon: CheckIcon, title: "Fast payout", body: "Paid within 48h of successful delivery." },
];

export default function ConsignPage() {
  return (
    <div className="container-qx py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-nebula-400">
          Consign with Quantum Space X
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
          Sell your pieces on the brand store.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stardust/60 sm:text-base">
          Submit your item below. Our team authenticates and prices it, lists it on the
          store, and ships it to the buyer when it sells — you get paid fast.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        {/* perks */}
        <div className="space-y-4">
          {PERKS.map((p) => (
            <div key={p.title} className="card flex items-start gap-4 p-5">
              <div className="rounded-xl bg-quantum-500/10 p-3 text-quantum-300 ring-1 ring-quantum-500/20">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-stardust/60">{p.body}</p>
              </div>
            </div>
          ))}

          <div className="card overflow-hidden p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-quantum-300">
              How payouts work
            </p>
            <div className="mt-4 space-y-3 text-sm text-stardust/70">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span>Sale price</span>
                <span className="text-white">$180.00</span>
              </div>
              <div className="flex items-center justify-between text-rose-300/80">
                <span>Platform fee (15%)</span>
                <span>−$27.00</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-3 font-display text-base font-bold text-emerald-300">
                <span>You receive</span>
                <span>$153.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* form */}
        <div id="form">
          <ConsignForm />
        </div>
      </div>
    </div>
  );
}
