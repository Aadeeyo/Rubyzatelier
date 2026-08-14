import { prisma } from "@/lib/prisma";

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
