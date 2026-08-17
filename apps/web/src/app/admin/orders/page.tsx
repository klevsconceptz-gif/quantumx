import Link from "next/link";
import { listOrders } from "@/lib/api";
import { adminAdvance } from "@/lib/actions";
import { formatPrice, formatDate, statusLabel, STATUS_STYLES, classNames } from "@/lib/utils";
import { TruckIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

const STAGES = ["PROCESSING", "SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  try {
    orders = await listOrders();
  } catch {
    /* ignore */
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Orders & Shipping</h1>
        <p className="text-sm text-stardust/50">
          Fulfil orders and update shipment status across the delivery lifecycle.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <TruckIcon className="mb-3 h-10 w-10 text-stardust/30" />
          <p className="text-sm text-stardust/60">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const idx = Math.max(0, STAGES.indexOf(o.shippingStatus));
            const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
            const delivered = o.shippingStatus === "DELIVERED";
            return (
              <div key={o.id} className="card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {o.trackingNumber}
                      </span>
                      <span
                        className={classNames(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          STATUS_STYLES[o.shippingStatus] || "bg-white/5 text-stardust/60"
                        )}
                      >
                        {statusLabel(o.shippingStatus)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stardust/60">
                      {o.customerName} · {o.city}, {o.country}
                    </p>
                    <p className="text-xs text-stardust/40">
                      {formatDate(o.createdAt)} · {formatPrice(o.total)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <form action={adminAdvance} className="flex items-end gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <div>
                        <label className="label" htmlFor={`to-${o.id}`}>
                          Set status
                        </label>
                        <select
                          id={`to-${o.id}`}
                          name="to"
                          defaultValue={next}
                          className="input min-w-[150px]"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s} className="bg-space-800">
                              {statusLabel(s)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        className="input min-w-[120px]"
                      />
                      <button
                        type="submit"
                        disabled={delivered}
                        className="shrink-0 rounded-full bg-quantum-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-quantum-400 disabled:opacity-40"
                      >
                        Update
                      </button>
                    </form>
                    <Link
                      href={`/track?tn=${o.trackingNumber}`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-stardust/70 hover:text-white"
                    >
                      View tracking
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
