"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/lib/actions";
import { Logo } from "./Logo";
import { PackageIcon, TruckIcon, SparkleIcon } from "./Icons";
import { classNames } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: SparkleIcon, exact: true },
  { href: "/admin/consignments", label: "Consignments", icon: PackageIcon },
  { href: "/admin/orders", label: "Orders & Shipping", icon: TruckIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container-qx py-8">
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="card p-4">
            <div className="px-2 pb-3">
              <Logo />
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={classNames(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-quantum-500/15 text-white ring-1 ring-quantum-500/30"
                        : "text-stardust/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-white/5 pt-3">
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-stardust/50 hover:bg-white/5 hover:text-rose-300"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
