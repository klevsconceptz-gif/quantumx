import Link from "next/link";
import { listProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { SearchIcon, PackageIcon } from "@/components/Icons";
import { classNames } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StorePage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const category = searchParams.category || "All";
  const q = searchParams.q || "";

  let products: Awaited<ReturnType<typeof listProducts>> = [];
  let categories: string[] = [];
  try {
    [products, categories] = await Promise.all([
      listProducts({ category, q }),
      getCategories(),
    ]);
  } catch {
    /* backends starting up */
  }

  const buildHref = (c: string) => {
    const params = new URLSearchParams();
    if (c !== "All") params.set("category", c);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/store${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container-qx py-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-quantum-300">
          Brand store
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          Shop the collection
        </h1>
        <p className="mt-2 max-w-xl text-sm text-stardust/60">
          Authenticated, consigned goods — each piece is unique and ships worldwide.
        </p>
      </div>

      {/* search + filters */}
      <div className="mb-8 flex flex-col gap-4">
        <form method="get" action="/store" className="relative max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            className="input pl-11"
          />
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stardust/40" />
          {category !== "All" && (
            <input type="hidden" name="category" value={category} />
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <Link
              key={c}
              href={buildHref(c)}
              className={classNames(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition",
                c === category
                  ? "border-quantum-500/50 bg-quantum-500/15 text-white"
                  : "border-white/10 bg-white/5 text-stardust/60 hover:border-white/20 hover:text-white"
              )}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {/* grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <PackageIcon className="mb-3 h-12 w-12 text-stardust/30" />
          <h3 className="font-display text-lg font-semibold text-white">
            No products found
          </h3>
          <p className="mt-1 text-sm text-stardust/60">
            Try a different category or search term.
          </p>
          <Link href="/store" className="btn-ghost mt-5">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
