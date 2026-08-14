"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";
import { nextStatusAfterStockChange } from "@/lib/product-status";

const schema = z.object({
  variantId: z.string(),
  quantity: z.number().int().min(0),
  reorderAt: z.number().int().min(0),
});

export async function adjustInventory(input: z.infer<typeof schema>) {
  await requireAdminSession();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid inventory update.") };
  }
  const data = parsed.data;

  try {
    await prisma.inventory.update({
      where: { variantId: data.variantId },
      data: { quantity: data.quantity, reorderAt: data.reorderAt },
    });

    const variant = await prisma.productVariant.findUniqueOrThrow({
      where: { id: data.variantId },
      select: { productId: true },
    });
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: variant.productId },
      include: { variants: { include: { inventory: true } } },
    });
    const totalStock = product.variants.reduce(
      (sum, v) => sum + (v.inventory?.quantity ?? 0),
      0,
    );
    const nextStatus = nextStatusAfterStockChange(product.status, totalStock);
    if (nextStatus) {
      await prisma.product.update({ where: { id: variant.productId }, data: { status: nextStatus } });
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not update inventory.") };
  }
}
