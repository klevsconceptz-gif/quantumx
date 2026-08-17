import Link from "next/link";
import { listConsignments } from "@/lib/api";
import { adminApprove, adminReject } from "@/lib/actions";
import { formatPrice, formatDate, classNames, STATUS_STYLES, statusLabel } from "@/lib/utils";
import { PackageIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

const TABS = ["PENDING", "AVAILABLE", "REJECTED", "ALL"] as const;

export default async function AdminConsignmentsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = (searchParams.status as (typeof TABS)[number]) || "PENDING";

  let items: Awaited<ReturnType<typeof listConsignments>> = [];
  try {
    items = await listConsignments(status);
  } catch {
    /* ignore */
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Consignments</h1>
        <p className="text-sm text-stardust/50">Review submissions from consignors.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/admin/consignments${t === "PENDING" ? "" : `?status=${t}`}`}
            className={classNames(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
              t === status
                ? "border-quantum-500/50 bg-quantum-500/15 text-white"
                : "border-white/10 bg-white/5 text-stardust/60 hover:text-white"
            )}
          >
            {statusLabel(t)}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <PackageIcon className="mb-3 h-10 w-10 text-stardust/30" />
          <p className="text-sm text-stardust/60">Nothing to review here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="card p-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.image}
                  alt={it.title}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-white">
                      {it.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        STATUS_STYLES[it.status] || "bg-white/5 text-stardust/60"
                      }`}
                    >
                      {statusLabel(it.status)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-stardust/60">
                    {it.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stardust/50">
                    <span>Category: {it.category}</span>
                    <span>Condition: {it.condition}</span>
                    <span>Asking: {formatPrice(it.price)}</span>
                    <span>Submitted: {formatDate(it.createdAt)}</span>
                  </div>
                  {it.consigneeName && (
                    <p className="mt-1 text-xs text-stardust/50">
                      By {it.consigneeName} · {it.consigneeEmail}
                    </p>
                  )}
                  {it.notes && (
                    <p className="mt-1 text-xs italic text-stardust/40">“{it.notes}”</p>
                  )}
                </div>
              </div>

              {it.status === "PENDING" && (
                <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-2">
                  <form action={adminApprove} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={it.id} />
                    <div className="flex-1">
                      <label className="label" htmlFor={`price-${it.id}`}>
                        Sale price (USD)
                      </label>
                      <input
                        id={`price-${it.id}`}
                        name="price"
                        type="number"
                        min="1"
                        defaultValue={it.price}
                        className="input"
                      />
                    </div>
                    <button
                      type="submit"
                      className="shrink-0 rounded-full bg-emerald-500/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400"
                    >
                      Approve & list
                    </button>
                  </form>

                  <form action={adminReject} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={it.id} />
                    <div className="flex-1">
                      <label className="label" htmlFor={`reason-${it.id}`}>
                        Reason (optional)
                      </label>
                      <input
                        id={`reason-${it.id}`}
                        name="reason"
                        className="input"
                        placeholder="Not a fit"
                      />
                    </div>
                    <button
                      type="submit"
                      className="shrink-0 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
