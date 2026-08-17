import Link from "next/link";
import { listProducts, listConsignments, listOrders } from "@/lib/api";
import { formatPrice, formatDate, statusLabel } from "@/lib/utils";
import { ArrowRight, PackageIcon, TruckIcon, SparkleIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let available = 0;
  let pending = 0;
  let orders = 0;
  let inTransit = 0;
  let revenue = 0;
  let recentOrders: Awaited<ReturnType<typeof listOrders>> = [];

  try {
    const [products, consignments, allOrders] = await Promise.all([
      listProducts(),
      listConsignments("PENDING"),
      listOrders(),
    ]);
    available = products.length;
    pending = consignments.length;
    orders = allOrders.length;
    inTransit = allOrders.filter(
      (o) => !["PROCESSING", "DELIVERED"].includes(o.shippingStatus)
    ).length;
    revenue = allOrders.reduce((s, o) => s + o.total, 0);
    recentOrders = allOrders.slice(0, 5);
  } catch {
    /* services starting */
  }

  const cards = [
    { label: "Listed products", value: available, icon: PackageIcon, accent: "text-quantum-300" },
    { label: "Pending consignments", value: pending, icon: SparkleIcon, accent: "text-amber-300", href: "/admin/consignments" },
    { label: "Orders", value: orders, icon: TruckIcon, accent: "text-nebula-300", href: "/admin/orders" },
    { label: "In transit", value: inTransit, icon: TruckIcon, accent: "text-indigo-300" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-stardust/50">Operations overview · quantumx.win</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <div className="card p-5 transition hover:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-stardust/50">
                  {c.label}
                </span>
                <c.icon className={`h-4 w-4 ${c.accent}`} />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-white">{c.value}</p>
            </div>
          );
          return c.href ? (
            <Link key={c.label} href={c.href}>
              {inner}
            </Link>
          ) : (
            <div key={c.label}>{inner}</div>
          );
        })}
      </div>

      <div className="mt-4 card p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-stardust/50">
            Lifetime revenue
          </span>
          <span className="font-display text-2xl font-bold text-emerald-300">
            {formatPrice(revenue)}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-stardust/60 hover:text-white"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="card p-8 text-center text-sm text-stardust/50">
            No orders yet.
          </div>
        ) : (
          <div className="card divide-y divide-white/5">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-white">
                    {o.trackingNumber}
                  </p>
                  <p className="text-xs text-stardust/50">
                    {o.customerName} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{formatPrice(o.total)}</span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stardust/70">
                    {statusLabel(o.shippingStatus)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
