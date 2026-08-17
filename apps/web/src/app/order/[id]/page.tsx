import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api";
import { ClearCart } from "@/components/ClearCart";
import { formatPrice, formatDate, statusLabel, STATUS_STYLES } from "@/lib/utils";
import { CheckIcon, TruckIcon, ArrowRight, PackageIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { new?: string };
}) {
  let order: Awaited<ReturnType<typeof getOrder>>;
  try {
    order = await getOrder(params.id);
  } catch {
    notFound();
  }

  const isNew = searchParams.new === "1";

  return (
    <div className="container-qx py-12">
      {isNew && <ClearCart />}

      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30">
            <CheckIcon className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Order confirmed
          </h1>
          <p className="mt-3 text-sm text-stardust/60">
            Thanks, {order.customerName.split(" ")[0]}! Your order is being prepared for
            dispatch. A tracking number has been generated below.
          </p>
        </div>

        <div className="card mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-space-800/40 p-5">
            <div>
              <p className="text-xs text-stardust/50">Tracking number</p>
              <p className="font-mono text-lg font-bold text-white">
                {order.trackingNumber}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                STATUS_STYLES[order.shippingStatus] || "bg-white/5 text-stardust/60"
              }`}
            >
              {statusLabel(order.shippingStatus)}
            </span>
          </div>

          <div className="p-5">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stardust/40">
              <PackageIcon className="h-4 w-4" /> Items
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
              <span className="text-sm text-stardust/60">Total paid</span>
              <span className="font-display text-lg font-bold text-quantum-300">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 p-5 text-sm">
            <p className="text-stardust/50">Shipping to</p>
            <p className="mt-1 text-white">
              {order.address}
              <br />
              {order.city}
              {order.state ? `, ${order.state}` : ""}, {order.country} {order.zip}
            </p>
            <p className="mt-3 text-xs text-stardust/40">Ordered {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/track?tn=${order.trackingNumber}`}
            className="btn-primary"
          >
            <TruckIcon className="h-4 w-4" /> Track this shipment
          </Link>
          <Link href="/store" className="btn-ghost">
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
