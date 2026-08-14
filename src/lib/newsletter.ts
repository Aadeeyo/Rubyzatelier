"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { syncContactToBrevo } from "@/lib/brevo";
import { friendlyActionError } from "@/lib/errors";

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

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Best-effort - never blocks the signup if Brevo is unavailable.
    await syncContactToBrevo(email);

    return { ok: true };
  } catch (err) {
    return { ok: false, error: friendlyActionError(err, "Could not subscribe.") };
  }
}
