import "server-only";
import { prisma } from "@/lib/prisma";
import { sendRepeatCustomerEmail, sendMilestoneThankYouEmail } from "@/lib/email";

// An order only counts as a "purchase" once payment is confirmed - excludes
// PENDING_PAYMENT (never paid), CANCELLED, and REFUNDED.
export const PURCHASE_STATUSES = ["PAID", "PROCESSING", "DISPATCHED", "DELIVERED", "PICKED"] as const;

const MILESTONES = [5, 10, 20] as const;
const MILESTONE_FIELD: Record<(typeof MILESTONES)[number], "milestone5EmailSentAt" | "milestone10EmailSentAt" | "milestone20EmailSentAt"> = {
  5: "milestone5EmailSentAt",
  10: "milestone10EmailSentAt",
  20: "milestone20EmailSentAt",
};

/**
 * Called right after an order is newly marked PAID. Checks whether this
 * customer just crossed the "2 purchases in 30 days" or a lifetime
 * 5/10/20-order milestone, and sends the matching one-time email if so.
 * Never throws - a failure here must not affect the order status update
 * that triggered it.
 */
export async function handleNewPurchase(customerId: string): Promise<void> {
  try {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer || customer.unsubscribedAt) return;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [recentCount, totalCount] = await Promise.all([
      prisma.order.count({
        where: {
          customerId,
          status: { in: [...PURCHASE_STATUSES] },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.order.count({
        where: { customerId, status: { in: [...PURCHASE_STATUSES] } },
      }),
    ]);

    if (recentCount === 2 && !customer.repeatCustomerEmailSentAt) {
      const result = await sendRepeatCustomerEmail({ to: customer.email, customerName: customer.name });
      if (result.sent) {
        await prisma.customer.update({
          where: { id: customerId },
          data: { repeatCustomerEmailSentAt: new Date() },
        });
      }
    }

    for (const milestone of MILESTONES) {
      const field = MILESTONE_FIELD[milestone];
      if (totalCount === milestone && !customer[field]) {
        const result = await sendMilestoneThankYouEmail({
          to: customer.email,
          customerName: customer.name,
          milestone,
        });
        if (result.sent) {
          await prisma.customer.update({
            where: { id: customerId },
            data: { [field]: new Date() },
          });
        }
      }
    }
  } catch (err) {
    console.error("[customer-lifecycle] handleNewPurchase failed:", err);
  }
}
