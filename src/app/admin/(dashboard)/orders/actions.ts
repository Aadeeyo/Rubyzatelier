"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";
import { sendDispatchEmail, sendPaymentConfirmedEmail } from "@/lib/email";

const statuses = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "PICKED",
  "CANCELLED",
  "REFUNDED",
] as const;

const schema = z.object({
  orderId: z.string(),
  status: z.enum(statuses),
});

export async function updateOrderStatus(input: z.infer<typeof schema>) {
  await requireAdminSession();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid status update.") };
  }
  const data = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  });
  if (!order) return { ok: false as const, error: "Order not found." };

  const isRestockingCancel =
    (data.status === "CANCELLED" || data.status === "REFUNDED") &&
    order.status !== "CANCELLED" &&
    order.status !== "REFUNDED";

  const isNewlyPaid = data.status === "PAID" && order.status !== "PAID";

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: data.status } });

      if (isRestockingCancel) {
        for (const item of order.items) {
          await tx.inventory.update({
            where: { variantId: item.variantId },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }
    });

    let emailResult: { sent: boolean; reason?: string } | undefined;
    if (isNewlyPaid && order.guestEmail) {
      emailResult = await sendPaymentConfirmedEmail({
        to: order.guestEmail,
        customerName: order.address?.fullName ?? "there",
        orderId: order.id,
        items: order.items.map((i) => ({
          name: i.variant.product.name,
          quantity: i.quantity,
        })),
        total: order.total,
      });
    }

    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin");
    if (isRestockingCancel) {
      revalidateStorefront();
    }
    return { ok: true as const, emailSent: emailResult?.sent, emailReason: emailResult?.reason };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not update order status.") };
  }
}

const dispatchSchema = z.object({
  orderId: z.string(),
  deliveryCost: z.number().int().min(0),
  courierName: z.string().optional(),
  trackingInfo: z.string().optional(),
  dispatchNotes: z.string().optional(),
});

export async function dispatchOrder(input: z.infer<typeof dispatchSchema>) {
  await requireAdminSession();
  const parsed = dispatchSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid dispatch details.") };
  }
  const data = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  });
  if (!order) return { ok: false as const, error: "Order not found." };

  try {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "DISPATCHED",
        deliveryCost: data.deliveryCost,
        courierName: data.courierName || null,
        trackingInfo: data.trackingInfo || null,
        dispatchNotes: data.dispatchNotes || null,
        dispatchedAt: new Date(),
      },
    });

    let emailResult: { sent: boolean; reason?: string } = {
      sent: false,
      reason: "No email address on file for this order.",
    };

    if (order.guestEmail) {
      emailResult = await sendDispatchEmail({
        to: order.guestEmail,
        customerName: order.address?.fullName ?? "there",
        orderId: order.id,
        items: order.items.map((i) => ({
          name: i.variant.product.name,
          quantity: i.quantity,
        })),
        deliveryCost: data.deliveryCost,
        courierName: data.courierName,
        trackingInfo: data.trackingInfo,
        dispatchNotes: data.dispatchNotes,
      });

      if (emailResult.sent) {
        await prisma.order.update({
          where: { id: order.id },
          data: { dispatchEmailSentAt: new Date() },
        });
      }
    }

    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true as const, emailSent: emailResult.sent, emailReason: emailResult.reason };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not save dispatch details.") };
  }
}
