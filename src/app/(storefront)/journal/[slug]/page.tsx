import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getJournalEntryBySlug } from "@/lib/journal";
import { COLLECTION_COPY } from "@/lib/collections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry || entry.status !== "PUBLISHED") return {};

  return {
    title: entry.title,
    description: entry.excerpt ?? undefined,
    alternates: { canonical: `/journal/${entry.slug}` },
    openGraph: {
      title: entry.title,
      description: entry.excerpt ?? undefined,
      images: entry.featuredImageUrl ? [{ url: entry.featuredImageUrl }] : undefined,
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry || entry.status !== "PUBLISHED") notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      {entry.relatedCollection && (
        <p className="font-sans text-sm uppercase tracking-[0.3em] text-cocoa">
          {COLLECTION_COPY[entry.relatedCollection].label}
        </p>
      )}
      <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl">
        {entry.title}
      </h1>
      {entry.publishedAt && (
        <p className="mt-3 font-sans text-sm text-espresso/50">
          {entry.publishedAt.toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {entry.featuredImageUrl && (
        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-cream">
          <img
            src={entry.featuredImageUrl}
            alt={entry.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg mt-10 max-w-none text-espresso prose-headings:font-display prose-headings:text-espresso prose-a:text-terracotta">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.content}</ReactMarkdown>
      </div>
    </article>
  );
}
