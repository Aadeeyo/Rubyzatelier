import type { Config } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { sendCheckInEmail } from "@/lib/email";
import { PURCHASE_STATUSES } from "@/lib/customer-lifecycle";

/**
 * Runs daily. Finds customers whose most recent purchase was 30+ days ago
 * with no purchase since, and no check-in email sent for that dormancy
 * period yet, then sends one. Safe to re-run - the dedup check means a
 * customer only ever gets one check-in email per dormancy period, and a
 * fresh purchase resets eligibility for a future one.
 */
export default async function handler() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const customers = await prisma.customer.findMany({
    where: { unsubscribedAt: null },
    include: {
      orders: {
        where: { status: { in: [...PURCHASE_STATUSES] } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  let sent = 0;
  for (const customer of customers) {
    const lastOrder = customer.orders[0];
    if (!lastOrder) continue;
    if (lastOrder.createdAt > thirtyDaysAgo) continue;
    if (customer.lastCheckInEmailSentAt && customer.lastCheckInEmailSentAt >= lastOrder.createdAt) continue;

    const result = await sendCheckInEmail({ to: customer.email, customerName: customer.name });
    if (result.sent) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { lastCheckInEmailSentAt: new Date() },
      });
      sent++;
    }
  }

  console.log(`[check-in-emails] sent ${sent} check-in email(s)`);
  return new Response(JSON.stringify({ sent }), { status: 200 });
}

export const config: Config = {
  schedule: "@daily",
};
