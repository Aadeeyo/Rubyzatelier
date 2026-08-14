import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminJournalPage() {
  const entries = await prisma.journal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-espresso">Journal</h1>
        <Link
          href="/admin/journal/new"
          className="rounded-full bg-terracotta px-6 py-2 font-sans text-lg text-ivory hover:scale-105"
        >
          + New article
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Collection</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/journal/${entry.id}`}
                    className="text-espresso hover:text-terracotta"
                  >
                    {entry.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-espresso/70">
                  {entry.relatedCollection ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={
                      entry.status === "PUBLISHED"
                        ? "rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                        : "rounded-full bg-cocoa/10 px-3 py-1 text-xs text-espresso/60"
                    }
                  >
                    {entry.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-espresso/70">
                  {entry.publishedAt
                    ? entry.publishedAt.toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className="p-6 font-sans text-espresso/50">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
