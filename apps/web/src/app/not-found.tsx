import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="container-qx flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="h-14 w-14 animate-float" />
      <p className="mt-6 font-display text-6xl font-extrabold text-white">404</p>
      <h1 className="mt-2 font-display text-xl font-semibold text-white">
        Lost in space
      </h1>
      <p className="mt-2 max-w-sm text-sm text-stardust/60">
        The page you&apos;re looking for has drifted out of orbit.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
