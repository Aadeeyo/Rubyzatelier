"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { friendlyActionError } from "@/lib/errors";

const schema = z.object({
  name: z.string().min(2),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function createSupplier(input: z.infer<typeof schema>) {
  await requireAdminSession();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid supplier details.") };
  }
  const data = parsed.data;

  try {
    await prisma.supplier.create({
      data: {
        name: data.name,
        contactName: data.contactName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        notes: data.notes || null,
      },
    });

    revalidatePath("/admin/suppliers");
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not create supplier.") };
  }
}
