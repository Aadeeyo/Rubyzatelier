import Link from "next/link";
import { prisma } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-cocoa/10 text-espresso/60",
  ORDERED: "bg-cocoa/15 text-espresso",
  PARTIALLY_RECEIVED: "bg-terracotta/15 text-terracotta",
  RECEIVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-cocoa/10 text-espresso/40",
};

export default async function ProcurementPage() {
  const orders = await prisma.purchaseOrder.findMany({
    include: { supplier: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-espresso">Procurement</h1>
        <Link
          href="/admin/procurement/new"
          className="rounded-full bg-terracotta px-6 py-2 font-sans text-lg text-ivory hover:scale-105"
        >
          + New purchase order
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((po) => (
              <tr key={po.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/procurement/${po.id}`} className="text-espresso hover:text-terracotta">
                    {po.supplier.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-espresso/70">{po.items.length}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[po.status]}`}>
                    {po.status.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-espresso/50">
                  {po.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No purchase orders yet.</p>
        )}
      </div>
    </div>
  );
}
