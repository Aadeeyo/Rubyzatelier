"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidateStorefront } from "@/lib/revalidate";
import { nextStatusAfterStockChange } from "@/lib/product-status";

const checkoutSchema = z
  .object({
    deliveryMethod: z.enum(["HOME_DELIVERY", "PICKUP"]),
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7),
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    lines: z
      .array(
        z.object({
          variantId: z.string(),
          quantity: z.number().int().positive(),
          unitPrice: z.number().int().positive(),
        }),
      )
      .min(1),
  })
  .refine(
    (data) =>
      data.deliveryMethod !== "HOME_DELIVERY" ||
      (data.line1 && data.line1.length >= 3 && data.city && data.city.length >= 2 && data.state),
    { message: "Please enter a delivery address.", path: ["line1"] },
  );

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
      const inventories = await Promise.all(
        data.lines.map((line) =>
          tx.inventory.findUnique({
            where: { variantId: line.variantId },
            include: { variant: { select: { productId: true } } },
          }),
        ),
      );

      for (const [i, inventory] of inventories.entries()) {
        if (!inventory || inventory.quantity < data.lines[i].quantity) {
          throw new Error(
            `Not enough stock for one of the items in your cart. Please review your cart.`,
          );
        }
      }

      const subtotal = data.lines.reduce(
        (sum, l) => sum + l.unitPrice * l.quantity,
        0,
      );
      // Delivery cost (home delivery only) is arranged and priced by admin
      // after payment, then paid directly to the delivery partner on
      // arrival - it's not part of the amount collected up front via bank
      // transfer. Pickup orders never carry a delivery cost.
      const total = subtotal;

      let addressId: string | null = null;
      let customerId: string;

      if (data.deliveryMethod === "HOME_DELIVERY") {
        const address = await tx.address.create({
          data: {
            fullName: data.fullName,
            phone: data.phone,
            line1: data.line1!,
            line2: data.line2,
            city: data.city!,
            state: data.state!,
            customer: {
              connectOrCreate: {
                where: { email: data.email },
                create: { email: data.email, name: data.fullName, phone: data.phone },
              },
            },
          },
        });
        addressId = address.id;
        customerId = address.customerId;
      } else {
        const customer = await tx.customer.upsert({
          where: { email: data.email },
          update: { name: data.fullName, phone: data.phone },
          create: { email: data.email, name: data.fullName, phone: data.phone },
        });
        customerId = customer.id;
      }

      const createdOrder = await tx.order.create({
        data: {
          guestEmail: data.email,
          addressId,
          customerId,
          deliveryMethod: data.deliveryMethod,
          subtotal,
          total,
          status: "PENDING_PAYMENT",
          paymentMethod: "bank_transfer",
          items: {
            create: data.lines.map((l) => ({
              variantId: l.variantId,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
            })),
          },
        },
      });

      const affectedProductIds = new Set(inventories.map((i) => i!.variant.productId));

      for (const line of data.lines) {
        await tx.inventory.update({
          where: { variantId: line.variantId },
          data: { quantity: { decrement: line.quantity } },
        });
      }

      for (const productId of affectedProductIds) {
        const product = await tx.product.findUniqueOrThrow({
          where: { id: productId },
          include: { variants: { include: { inventory: true } } },
        });
        const totalStock = product.variants.reduce(
          (sum, v) => sum + (v.inventory?.quantity ?? 0),
          0,
        );
        const nextStatus = nextStatusAfterStockChange(product.status, totalStock);
        if (nextStatus) {
          await tx.product.update({ where: { id: productId }, data: { status: nextStatus } });
        }
      }

      return createdOrder;
    });

    // Customers reference this in their bank transfer narration so admin can
    // match incoming payments to orders when confirming manually.
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: `RZ-${order.id.slice(-8).toUpperCase()}` },
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
