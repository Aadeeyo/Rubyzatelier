import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [productCount, allInventory, pendingOrders, pendingDeliveryOrders, paidOrders, openPOs] =
    await Promise.all([
      prisma.product.count(),
      prisma.inventory.findMany({
        include: { variant: { include: { product: true } } },
      }),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.order.count({
        where: { status: { in: ["PAID", "PROCESSING", "DISPATCHED"] } },
      }),
      prisma.order.findMany({ where: { status: { not: "PENDING_PAYMENT" } } }),
      prisma.purchaseOrder.count({
        where: { status: { in: ["DRAFT", "ORDERED", "PARTIALLY_RECEIVED"] } },
      }),
    ]);

  const lowStockVariants = allInventory.filter(
    (inv) => inv.quantity <= inv.reorderAt,
  );
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  return {
    productCount,
    lowStockVariants,
    pendingOrders,
    pendingDeliveryOrders,
    revenue,
    openPOs,
  };
}
