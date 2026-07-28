import { prisma } from "@/lib/prisma";
import { PurchaseOrderForm } from "@/components/admin/purchase-order-form";

export default async function NewPurchaseOrderPage() {
  const [suppliers, variants] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
    prisma.productVariant.findMany({ include: { product: true }, orderBy: { sku: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-sand">New Purchase Order</h1>
      <div className="mt-8">
        <PurchaseOrderForm
          suppliers={suppliers}
          variants={variants.map((v) => ({
            id: v.id,
            label: `${v.product.name} — ${v.size}/${v.color} (${v.sku})`,
          }))}
        />
      </div>
    </div>
  );
}
