"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { syncContactToBrevo } from "@/lib/brevo";
import { friendlyActionError } from "@/lib/errors";
import { sendWelcomeEmail } from "@/lib/email";

const subscribeSchema = z.object({
  email: z.string().email(),
});

export interface SubscribeResult {
  ok: boolean;
  error?: string;
}

export async function subscribeToNewsletter(
  input: { email: string },
): Promise<SubscribeResult> {
  try {
    const { email } = subscribeSchema.parse(input);

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Best-effort - never blocks the signup if Brevo or Resend is unavailable.
    await syncContactToBrevo(email);
    if (!existing) {
      await sendWelcomeEmail({ to: email });
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendlyActionError(err, "Could not subscribe.") };
  }
}
