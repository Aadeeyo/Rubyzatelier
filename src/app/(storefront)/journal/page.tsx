import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournalEntries } from "@/lib/journal";
import { COLLECTION_COPY } from "@/lib/collections";
import { LogoMark } from "@/components/logo-mark";
import { EmptyState } from "@/components/empty-state";
import type { Collection } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Journal",
  description: "Style inspiration, wardrobe guides, and elegant fashion for every moment.",
  alternates: { canonical: "/journal" },
};

function CardMedia({ imageUrl, alt, small }: { imageUrl: string | null; alt: string; small?: boolean }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-sand/40">
      <LogoMark className={small ? "h-10 w-auto" : "h-16 w-auto"} />
    </div>
  );
}

function CategoryTag({ collection }: { collection: Collection | null }) {
  if (!collection) return null;
  return (
    <span className="font-sans text-xs uppercase tracking-widest text-cocoa">
      {COLLECTION_COPY[collection].label}
    </span>
  );
}

export default async function JournalIndexPage() {
  const entries = await getPublishedJournalEntries();
  const [featured, ...rest] = entries;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">
        The Rubyzatelier Journal.
      </h1>
      <p className="mt-3 max-w-xl font-sans text-lg text-espresso/60">
        Style inspiration, wardrobe guides, and elegant fashion for every
        moment.
      </p>

      {!featured ? (
        <EmptyState title="We are writing our first stories." />
      ) : (
        <div className="mt-12">
          <Link
            href={`/journal/${featured.slug}`}
            className="group grid grid-cols-1 overflow-hidden rounded-xl bg-cream md:grid-cols-2"
          >
            <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
              <CardMedia imageUrl={featured.featuredImageUrl} alt={featured.title} />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <CategoryTag collection={featured.relatedCollection} />
              <h2 className="mt-2 font-display text-2xl text-espresso group-hover:text-terracotta sm:text-3xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-3 line-clamp-3 font-sans text-base text-espresso/60">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-5 font-sans text-sm font-semibold text-terracotta">
                Read the article →
              </span>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-cream"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <CardMedia imageUrl={entry.featuredImageUrl} alt={entry.title} small />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <CategoryTag collection={entry.relatedCollection} />
                    <h3 className="mt-1 font-display text-lg text-espresso group-hover:text-terracotta">
                      {entry.title}
                    </h3>
                    {entry.excerpt && (
                      <p className="mt-2 line-clamp-2 flex-1 font-sans text-sm text-espresso/60">
                        {entry.excerpt}
                      </p>
                    )}
                    <span className="mt-3 font-sans text-sm font-semibold text-terracotta">
                      Read article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
