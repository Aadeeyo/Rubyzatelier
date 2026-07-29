"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { friendlyPrismaError } from "@/lib/errors";

const createSchema = z.object({
  supplierId: z.string(),
  expectedAt: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantityOrdered: z.number().int().positive(),
        unitCost: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function createPurchaseOrder(input: z.infer<typeof createSchema>) {
  const session = await requireAdminSession();
  const data = createSchema.parse(input);

  try {
    const po = await prisma.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        createdById: session.sub,
        expectedAt: data.expectedAt ? new Date(data.expectedAt) : null,
        notes: data.notes || null,
        status: "DRAFT",
        items: {
          create: data.items.map((i) => ({
            variantId: i.variantId,
            quantityOrdered: i.quantityOrdered,
            unitCost: i.unitCost,
          })),
        },
      },
    });

    revalidatePath("/admin/procurement");
    return { ok: true as const, id: po.id };
  } catch (err) {
    return {
      ok: false as const,
      error: friendlyPrismaError(err, "Could not create purchase order."),
    };
  }
}

export async function setPurchaseOrderStatus(
  id: string,
  status: "DRAFT" | "ORDERED" | "CANCELLED",
) {
  await requireAdminSession();
  try {
    await prisma.purchaseOrder.update({ where: { id }, data: { status } });
    revalidatePath(`/admin/procurement/${id}`);
    revalidatePath("/admin/procurement");
    return { ok: true as const };
  } catch (err) {
    return {
      ok: false as const,
      error: friendlyPrismaError(err, "Could not update purchase order status."),
    };
  }
}

const receiveSchema = z.object({
  purchaseOrderItemId: z.string(),
  quantity: z.number().int().positive(),
});

export async function receiveStock(input: z.infer<typeof receiveSchema>) {
  await requireAdminSession();
  const data = receiveSchema.parse(input);

  const item = await prisma.purchaseOrderItem.findUnique({
    where: { id: data.purchaseOrderItemId },
    include: { purchaseOrder: { include: { items: true } } },
  });
  if (!item) return { ok: false as const, error: "Purchase order item not found." };

  const newReceived = Math.min(
    item.quantityReceived + data.quantity,
    item.quantityOrdered,
  );

  try {
    await prisma.$transaction([
      prisma.purchaseOrderItem.update({
        where: { id: item.id },
        data: { quantityReceived: newReceived },
      }),
      prisma.inventory.upsert({
        where: { variantId: item.variantId },
        update: { quantity: { increment: data.quantity } },
        create: { variantId: item.variantId, quantity: data.quantity },
      }),
    ]);

    const siblings = item.purchaseOrder.items.map((i) =>
      i.id === item.id ? { ...i, quantityReceived: newReceived } : i,
    );
    const allReceived = siblings.every((i) => i.quantityReceived >= i.quantityOrdered);
    const anyReceived = siblings.some((i) => i.quantityReceived > 0);

    await prisma.purchaseOrder.update({
      where: { id: item.purchaseOrderId },
      data: {
        status: allReceived ? "RECEIVED" : anyReceived ? "PARTIALLY_RECEIVED" : undefined,
        receivedAt: allReceived ? new Date() : undefined,
      },
    });

    revalidatePath(`/admin/procurement/${item.purchaseOrderId}`);
    revalidatePath("/admin/procurement");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyPrismaError(err, "Could not receive stock.") };
  }
}
