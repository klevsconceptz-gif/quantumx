import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://quantumx.win";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Quantum Space X — Consignment & Shipping",
    template: "%s · Quantum Space X",
  },
  description:
    "Quantum Space X is the consignment marketplace and global shipping network for the brand store. Authenticate, list, sell and ship premium goods under one orbit.",
  keywords: [
    "Quantum Space X",
    "consignment",
    "shipping",
    "brand store",
    "streetwear",
    "marketplace",
  ],
  openGraph: {
    title: "Quantum Space X — Consignment & Shipping",
    description:
      "Consignment marketplace and global shipping network for the Quantum Space X brand store.",
    url: SITE_URL,
    siteName: "Quantum Space X",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <CartProvider>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
