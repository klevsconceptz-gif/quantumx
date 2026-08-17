import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="container-qx py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-white sm:text-4xl">Checkout</h1>
      <CheckoutForm error={searchParams.error} />
    </div>
  );
}
