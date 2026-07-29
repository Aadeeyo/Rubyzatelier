import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

const FIELD_LABELS: Record<string, string> = {
  slug: "name",
  sku: "SKU",
  email: "email",
};

/**
 * Turns a caught error from a server action into a message safe to show an
 * admin. Server actions must never let an error escape unhandled — Next.js
 * redacts thrown errors in production into a generic "An error occurred in
 * the Server Components render" message, which is useless for debugging or
 * for the user. Every schema.parse() and prisma call in an action should be
 * wrapped in try/catch and pass the caught error through this function.
 */
export function friendlyActionError(err: unknown, fallback: string): string {
  if (err instanceof z.ZodError) {
    const first = err.issues[0];
    const field = first?.path?.[first.path.length - 1];
    if (field && typeof field === "string") {
      return `Please check the "${field}" field — ${first.message.toLowerCase()}.`;
    }
    return first?.message ?? fallback;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const target = err.meta?.target;
    const field = Array.isArray(target) ? target[0] : undefined;
    const label = (field && FIELD_LABELS[field]) ?? "value";
    return `That ${label} is already in use — please choose a different one.`;
  }

  return err instanceof Error ? err.message : fallback;
}
