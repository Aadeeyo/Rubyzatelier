import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournalEntries } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Style inspiration, wardrobe guides, and elegant fashion for every moment.",
  alternates: { canonical: "/journal" },
};

export default async function JournalIndexPage() {
  const entries = await getPublishedJournalEntries();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">
        The Rubyzatelier Journal.
      </h1>
      <p className="mt-3 max-w-xl font-sans text-lg text-espresso/60">
        Style inspiration, wardrobe guides, and elegant fashion for every
        moment.
      </p>

      {entries.length === 0 ? (
        <p className="mt-16 font-sans text-lg text-espresso/50">
          Nothing published yet — check back soon.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/journal/${entry.slug}`}
              className="group block overflow-hidden rounded-xl bg-cream"
            >
              {entry.featuredImageUrl && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={entry.featuredImageUrl}
                    alt={entry.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-display text-lg text-espresso group-hover:text-terracotta">
                  {entry.title}
                </h2>
                {entry.excerpt && (
                  <p className="mt-2 font-sans text-sm text-espresso/60">{entry.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
