import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { logoutAdmin } from "../login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/procurement", label: "Procurement" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/orders", label: "Orders" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-white/10 bg-ink-soft px-5 py-6">
        <span className="font-script text-gradient-chrome text-3xl">
          Rubyzatelier
        </span>
        <span className="mt-1 font-sans text-xs uppercase tracking-[0.3em] text-chrome">
          Admin
        </span>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 font-sans text-lg text-sand/70 transition-colors hover:bg-white/5 hover:text-coral"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="font-sans text-sm text-sand/50">{session.name}</p>
          <p className="font-sans text-xs uppercase tracking-widest text-chrome-dark">
            {session.role}
          </p>
          <form action={logoutAdmin}>
            <button className="mt-3 font-sans text-sm text-sand/40 hover:text-coral">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
