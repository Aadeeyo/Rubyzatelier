"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";

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

    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not update inventory.") };
  }
}
