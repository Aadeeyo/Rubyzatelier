import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JournalForm } from "@/components/admin/journal-form";

export default async function EditJournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.journal.findUnique({ where: { id } });
  if (!entry) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-espresso">{entry.title}</h1>
      <div className="mt-8 max-w-4xl">
        <JournalForm
          mode="edit"
          entryId={entry.id}
          initial={{
            title: entry.title,
            slug: entry.slug,
            excerpt: entry.excerpt ?? "",
            content: entry.content,
            featuredImageUrl: entry.featuredImageUrl ?? "",
            tags: entry.tags,
            relatedCollection: entry.relatedCollection,
            status: entry.status,
          }}
        />
      </div>
    </div>
  );
}
