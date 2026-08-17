/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ── "Same domain, different backends" ────────────────────────────────
  // The storefront lives on ONE domain (quantumx.win). Behind it, four
  // independent backend services handle distinct concerns. Next.js acts as
  // the gateway: requests to /api/<service>/* are proxied to that service.
  // In production an edge/nginx layer performs the same routing.
  async rewrites() {
    return [
      { source: "/api/store/:path*", destination: "http://localhost:4001/:path*" },
      { source: "/api/consignments/:path*", destination: "http://localhost:4002/:path*" },
      { source: "/api/shipping/:path*", destination: "http://localhost:4003/:path*" },
      { source: "/api/orders/:path*", destination: "http://localhost:4004/:path*" },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
