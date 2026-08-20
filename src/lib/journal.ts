import { prisma } from "@/lib/prisma";
import type { Collection } from "@/generated/prisma/enums";

export async function getPublishedJournalEntries(take?: number) {
  return prisma.journal.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getJournalEntryBySlug(slug: string) {
  return prisma.journal.findUnique({ where: { slug } });
}

export async function getRelatedJournalEntry(collection: Collection) {
  return prisma.journal.findFirst({
    where: { status: "PUBLISHED", relatedCollection: collection },
    orderBy: { publishedAt: "desc" },
  });
}
