import { cookies } from "next/headers";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminShell } from "@/components/AdminShell";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = cookies().get("qx_admin")?.value === "1";

  if (!authed) {
    // Any /admin/* route shows the login gate until authenticated.
    return <AdminLoginForm />;
  }

  return <AdminShell>{children}</AdminShell>;
}
