import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReceiveStockRow } from "@/components/admin/receive-stock-row";
import { PurchaseOrderStatusActions } from "@/components/admin/po-status-actions";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-cocoa/10 text-espresso/60",
  ORDERED: "bg-cocoa/15 text-espresso",
  PARTIALLY_RECEIVED: "bg-terracotta/15 text-terracotta",
  RECEIVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-cocoa/10 text-espresso/40",
};

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const po = await prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      createdBy: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });
  if (!po) notFound();

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-espresso">
            Purchase Order — {po.supplier.name}
          </h1>
          <p className="mt-1 font-sans text-espresso/50">
            Created by {po.createdBy.name} on {po.createdAt.toLocaleDateString()}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs ${STATUS_COLORS[po.status]}`}>
          {po.status.replaceAll("_", " ")}
        </span>
      </div>

      <div className="mt-6">
        <PurchaseOrderStatusActions id={po.id} status={po.status} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Unit cost (₦)</th>
              <th className="px-5 py-3">Ordered</th>
              <th className="px-5 py-3">Received</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {po.items.map((item) => (
              <ReceiveStockRow
                key={item.id}
                itemId={item.id}
                productLabel={`${item.variant.product.name} — ${item.variant.size}${item.variant.color ? `/${item.variant.color}` : ""}`}
                quantityOrdered={item.quantityOrdered}
                quantityReceived={item.quantityReceived}
                unitCost={item.unitCost}
              />
            ))}
          </tbody>
        </table>
      </div>

      {po.notes && (
        <p className="mt-6 font-sans text-espresso/60">
          <span className="text-cocoa">Notes: </span>
          {po.notes}
        </p>
      )}
    </div>
  );
}
