"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createZentaVirtualAccountCharge } from "@/lib/payments/zenta";
import { revalidateStorefront } from "@/lib/revalidate";

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  lines: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().positive(),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface CheckoutResult {
  ok: boolean;
  orderId?: string;
  error?: string;
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid checkout details." };
  }
  const data = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const line of data.lines) {
        const inventory = await tx.inventory.findUnique({
          where: { variantId: line.variantId },
        });
        if (!inventory || inventory.quantity < line.quantity) {
          throw new Error(
            `Not enough stock for one of the items in your cart. Please review your cart.`,
          );
        }
      }

      const subtotal = data.lines.reduce(
        (sum, l) => sum + l.unitPrice * l.quantity,
        0,
      );
      const shippingFee = subtotal > 0 ? 2000 : 0;
      const total = subtotal + shippingFee;

      const address = await tx.address.create({
        data: {
          fullName: data.fullName,
          phone: data.phone,
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          state: data.state,
          customer: {
            connectOrCreate: {
              where: { email: data.email },
              create: { email: data.email, name: data.fullName, phone: data.phone },
            },
          },
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          guestEmail: data.email,
          addressId: address.id,
          customerId: address.customerId,
          subtotal,
          shippingFee,
          total,
          status: "PENDING_PAYMENT",
          items: {
            create: data.lines.map((l) => ({
              variantId: l.variantId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
        },
      });

      for (const line of data.lines) {
        await tx.inventory.update({
          where: { variantId: line.variantId },
          data: { quantity: { decrement: line.quantity } },
        });
      }

      return createdOrder;
    });

    const charge = await createZentaVirtualAccountCharge({
      orderId: order.id,
      amount: order.total,
      customerEmail: data.email,
      customerName: data.fullName,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: charge.reference,
        virtualAccountNumber: charge.virtualAccountNumber,
        virtualAccountBank: charge.bankName,
      },
    });

    revalidateStorefront();
    return { ok: true, orderId: order.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not place order.",
    };
  }
}
