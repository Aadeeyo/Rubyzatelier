import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-data";
import { formatNaira } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="font-display text-3xl text-sand">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={stats.productCount.toString()} />
        <StatCard
          label="Pending payment"
          value={stats.pendingOrders.toString()}
          accent
        />
        <StatCard label="Revenue (paid orders)" value={formatNaira(stats.revenue)} />
        <StatCard label="Open purchase orders" value={stats.openPOs.toString()} />
      </div>

      <div className="mt-10 rounded-xl border border-white/10 bg-ink-soft p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-sand">Low stock alerts</h2>
          <Link href="/admin/inventory" className="font-sans text-sand/60 hover:text-coral">
            View inventory →
          </Link>
        </div>

        {stats.lowStockVariants.length === 0 ? (
          <p className="mt-4 font-sans text-sand/50">
            Everything is well stocked.
          </p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-white/10">
            {stats.lowStockVariants.map((inv) => (
              <div key={inv.id} className="flex justify-between py-3 font-sans">
                <span className="text-sand">
                  {inv.variant.product.name} — {inv.variant.size}/{inv.variant.color}
                </span>
                <span className="text-coral">{inv.quantity} left</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-soft p-6">
      <p className="font-sans text-sm uppercase tracking-widest text-chrome">
        {label}
      </p>
      <p className={`mt-2 font-display text-3xl ${accent ? "text-coral" : "text-sand"}`}>
        {value}
      </p>
    </div>
  );
}
