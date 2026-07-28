import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-rust/30 text-sand",
  PAID: "bg-indigo/30 text-sand",
  PROCESSING: "bg-indigo/30 text-sand",
  SHIPPED: "bg-chrome/20 text-sand",
  DELIVERED: "bg-green-900/30 text-green-400",
  CANCELLED: "bg-white/5 text-sand/30",
  REFUNDED: "bg-white/5 text-sand/30",
};

const tabs: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status = tabs.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;

  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { address: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-sand">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-4 py-1 font-sans text-sm ${
            !status ? "border-coral text-coral" : "border-white/15 text-sand/60"
          }`}
        >
          All
        </Link>
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/admin/orders?status=${t}`}
            className={`rounded-full border px-4 py-1 font-sans text-sm ${
              status === t ? "border-coral text-coral" : "border-white/15 text-sand/60"
            }`}
          >
            {t.replaceAll("_", " ")}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-ink-soft">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-chrome">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-sand hover:text-coral">
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sand/70">
                  {o.address?.fullName ?? o.guestEmail}
                </td>
                <td className="px-5 py-3 text-sand/70">{o.items.length}</td>
                <td className="px-5 py-3 text-sand/70">{formatNaira(o.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[o.status]}`}>
                    {o.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-sand/50">{o.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 font-sans text-sand/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
