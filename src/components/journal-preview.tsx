import Link from "next/link";
import { getPublishedJournalEntries } from "@/lib/journal";

export async function JournalPreview() {
  const entries = await getPublishedJournalEntries(3);

  if (entries.length === 0) return null;

  return (
    <section className="bg-sand/30 py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl text-espresso sm:text-4xl">
            The Rubyzatelier Journal.
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-lg text-espresso/70">
            Style inspiration, wardrobe guides, and elegant fashion for every
            moment.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                <h3 className="font-display text-lg text-espresso group-hover:text-terracotta">
                  {entry.title}
                </h3>
                {entry.excerpt && (
                  <p className="mt-2 font-sans text-sm text-espresso/60">{entry.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/journal"
            className="font-sans text-lg font-semibold text-terracotta hover:underline"
          >
            Read the Journal
          </Link>
        </div>
      </div>
    </section>
  );
}
