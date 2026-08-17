import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice, STATUS_STYLES, statusLabel } from "@/lib/utils";
import { ShieldIcon, TruckIcon, CheckIcon, ArrowRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Awaited<ReturnType<typeof getProduct>>;
  try {
    product = await getProduct(params.id);
  } catch {
    notFound();
  }

  let related: Awaited<ReturnType<typeof listProducts>> = [];
  try {
    related = (await listProducts({ category: product.category }))
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  } catch {
    /* ignore */
  }

  const sold = product.status === "SOLD";

  return (
    <div className="container-qx py-10">
      <nav className="mb-6 text-xs text-stardust/40">
        <Link href="/store" className="hover:text-white">
          Store
        </Link>{" "}
        / <span className="text-stardust/70">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* image */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-space-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className={`aspect-[4/5] w-full object-cover ${sold ? "opacity-50 grayscale" : ""}`}
          />
          <span className="absolute left-4 top-4 rounded-full bg-space-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-stardust/80 backdrop-blur">
            {product.category}
          </span>
        </div>

        {/* details */}
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                STATUS_STYLES[product.status] || "bg-white/5 text-stardust/60"
              }`}
            >
              {statusLabel(product.status)}
            </span>
            <span className="text-xs text-stardust/50">{product.condition}</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            {product.title}
          </h1>
          {product.brand && (
            <p className="mt-1 text-sm text-stardust/50">by {product.brand}</p>
          )}

          <p className="mt-5 font-display text-3xl font-bold text-quantum-300">
            {formatPrice(product.price)}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-stardust/70">
            {product.description}
          </p>

          <div className="mt-7">
            <AddToCartButton
              productId={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              sold={sold}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-space-900/50 p-4">
              <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-white">Authenticated</p>
                <p className="text-xs text-stardust/50">Verified by Quantum Space X</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-space-900/50 p-4">
              <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-nebula-400" />
              <div>
                <p className="text-sm font-semibold text-white">Insured shipping</p>
                <p className="text-xs text-stardust/50">Tracked, worldwide delivery</p>
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-2 text-xs text-stardust/50">
            {["Authenticity guaranteed or full refund", "Ships within 24h of order", "Secure checkout"].map(
              (b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> {b}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white">
              More in {product.category}
            </h2>
            <Link
              href={`/store?category=${encodeURIComponent(product.category)}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-stardust/70 hover:text-white"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
