import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InventoryRow } from "@/components/admin/inventory-row";

export default async function AdminInventoryPage() {
  const inventory = await prisma.inventory.findMany({
    include: { variant: { include: { product: true } } },
    orderBy: { variant: { product: { name: "asc" } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">Inventory</h1>
      <p className="mt-2 font-sans text-espresso/60">
        Adjust stock levels directly, or receive stock through a{" "}
        <Link href="/admin/procurement" className="text-cocoa hover:text-terracotta">
          purchase order
        </Link>
        .
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Variant</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Quantity</th>
              <th className="px-5 py-3">Reorder at</th>
              <th className="px-5 py-3"></th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((inv) => (
              <InventoryRow
                key={inv.id}
                variantId={inv.variantId}
                productName={inv.variant.product.name}
                size={inv.variant.size}
                color={inv.variant.color}
                sku={inv.variant.sku}
                initialQuantity={inv.quantity}
                initialReorderAt={inv.reorderAt}
              />
            ))}
          </tbody>
        </table>
        {inventory.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No inventory yet.</p>
        )}
      </div>
    </div>
  );
}
