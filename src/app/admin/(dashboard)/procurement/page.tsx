import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-white/5 text-sand/60",
  ORDERED: "bg-indigo/30 text-sand",
  PARTIALLY_RECEIVED: "bg-rust/30 text-sand",
  RECEIVED: "bg-green-900/30 text-green-400",
  CANCELLED: "bg-white/5 text-sand/30",
};

export default async function ProcurementPage() {
  const orders = await prisma.purchaseOrder.findMany({
    include: { supplier: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-sand">Procurement</h1>
        <Link
          href="/admin/procurement/new"
          className="rounded-full bg-coral px-6 py-2 font-sans text-lg text-sand hover:scale-105"
        >
          + New purchase order
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-ink-soft">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-chrome">
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((po) => (
              <tr key={po.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/procurement/${po.id}`} className="text-sand hover:text-coral">
                    {po.supplier.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sand/70">{po.items.length}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[po.status]}`}>
                    {po.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-sand/50">
                  {po.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 font-sans text-sand/50">No purchase orders yet.</p>
        )}
      </div>
    </div>
  );
}
