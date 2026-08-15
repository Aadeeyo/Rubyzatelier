import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  let updated = false;

  if (email) {
    const now = new Date();
    const [customer, subscriber] = await Promise.all([
      prisma.customer.updateMany({ where: { email }, data: { unsubscribedAt: now } }),
      prisma.newsletterSubscriber.updateMany({ where: { email }, data: { unsubscribedAt: now } }),
    ]);
    updated = customer.count > 0 || subscriber.count > 0;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <h1 className="font-display text-3xl text-espresso">
        {email ? "You've been unsubscribed." : "Unsubscribe"}
      </h1>
      <p className="mt-4 font-sans text-lg text-espresso/60">
        {email
          ? updated
            ? "You won't receive newsletter or lifecycle emails from Rubyzatelier at this address again. Order confirmations for any active orders will still be sent, since those aren't marketing."
            : "We couldn't find that email address on our list."
          : "This link needs an email address to work — please use the unsubscribe link from one of our emails."}
      </p>
    </div>
  );
}
