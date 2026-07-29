import { Prisma } from "@/generated/prisma/client";

const FIELD_LABELS: Record<string, string> = {
  slug: "name",
  sku: "SKU",
  email: "email",
};

export function friendlyPrismaError(err: unknown, fallback: string): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    const target = err.meta?.target;
    const field = Array.isArray(target) ? target[0] : undefined;
    const label = (field && FIELD_LABELS[field]) ?? "value";
    return `That ${label} is already in use — please choose a different one.`;
  }

  return err instanceof Error ? err.message : fallback;
}
