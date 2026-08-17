"use client";

import { useState } from "react";
import { classNames } from "@/lib/utils";

/**
 * Quantum Space X brand logo.
 *
 * AUTO-SWAP: this component automatically renders your real logo from
 * `/logo.png` (apps/web/public/logo.png) if it exists, and falls back to the
 * vector mark below if it doesn't. So to use your brand logo, simply drop the
 * file at  apps/web/public/logo.png  — no code change required.
 */

// Vector fallback mark (shown until /logo.png is present)
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={classNames("h-9 w-9", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qx-g" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8f63ff" />
          <stop offset="0.55" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="6.2" fill="url(#qx-g)" />
      <ellipse
        cx="24"
        cy="24"
        rx="20"
        ry="9"
        stroke="url(#qx-g)"
        strokeWidth="1.6"
        transform="rotate(-28 24 24)"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="20"
        ry="9"
        stroke="url(#qx-g)"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        transform="rotate(28 24 24)"
      />
      <circle cx="42.5" cy="13.5" r="1.7" fill="#22d3ee" />
      <circle cx="6" cy="33" r="1.3" fill="#8f63ff" />
    </svg>
  );
}

// Tries /logo.png; falls back to the vector mark on error.
function AutoMark({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <LogoMark className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Quantum Space X logo"
      onError={() => setFailed(true)}
      className={classNames("h-9 w-auto object-contain", className)}
    />
  );
}

export function Logo({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={classNames("inline-flex items-center gap-2.5", className)}>
      <AutoMark />
      <span className="flex flex-col leading-none">
        <span
          className={classNames(
            "font-display text-[15px] font-extrabold tracking-tight",
            light ? "text-white" : "text-space-900"
          )}
        >
          QUANTUM
        </span>
        <span className="bg-gradient-to-r from-quantum-300 via-quantum-400 to-nebula-400 bg-clip-text text-[10px] font-bold uppercase tracking-[0.32em] text-transparent">
          Space&nbsp;X
        </span>
      </span>
    </span>
  );
}
