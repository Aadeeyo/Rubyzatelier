import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-terracotta/15 text-terracotta",
  PAID: "bg-cocoa/15 text-espresso",
  PROCESSING: "bg-cocoa/15 text-espresso",
  DISPATCHED: "bg-sand text-espresso",
  DELIVERED: "bg-green-100 text-green-800",
  PICKED: "bg-green-100 text-green-800",
  CANCELLED: "bg-cocoa/10 text-espresso/40",
  REFUNDED: "bg-cocoa/10 text-espresso/40",
};

const tabs: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "PICKED",
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
      <h1 className="font-display text-3xl text-espresso">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-4 py-1 font-sans text-sm ${
            !status ? "border-terracotta text-terracotta" : "border-cocoa/25 text-espresso/60"
          }`}
        >
          All
        </Link>
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/admin/orders?status=${t}`}
            className={`rounded-full border px-4 py-1 font-sans text-sm ${
              status === t ? "border-terracotta text-terracotta" : "border-cocoa/25 text-espresso/60"
            }`}
          >
            {t.replaceAll("_", " ")}
          </Link>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
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
              <tr key={o.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-espresso hover:text-terracotta">
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-5 py-3 text-espresso/70">
                  {o.address?.fullName ?? o.guestEmail}
                </td>
                <td className="px-5 py-3 text-espresso/70">{o.items.length}</td>
                <td className="px-5 py-3 text-espresso/70">{formatNaira(o.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[o.status]}`}>
                    {o.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-espresso/50">{o.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
