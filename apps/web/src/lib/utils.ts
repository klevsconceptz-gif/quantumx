export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function categorySlug(c: string) {
  return c.toLowerCase().replace(/\s+/g, "-");
}

export const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  SOLD: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",
  REJECTED: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/30",
  PROCESSING: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  SHIPPED: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  IN_TRANSIT: "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/30",
  OUT_FOR_DELIVERY: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/30",
  DELIVERED: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
};

export function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
