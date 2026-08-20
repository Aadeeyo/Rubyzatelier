import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SortBar } from "@/components/sort-bar";
import { COLLECTION_SLUGS, COLLECTION_COPY } from "@/lib/collections";
import { EmptyState } from "@/components/empty-state";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: collectionParam } = await params;
  const collection = COLLECTION_SLUGS[collectionParam];
  if (!collection) return {};

  const copy = COLLECTION_COPY[collection];
  return {
    title: copy.label,
    description: copy.metaDescription,
    alternates: { canonical: `/shop/${collectionParam}` },
  };
}

export default async function CollectionShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { collection: collectionParam } = await params;
  const { sort: sortParam } = await searchParams;

  const collection = COLLECTION_SLUGS[collectionParam];
  if (!collection) notFound();

  const sort = sortParam === "price" ? "price" : "newest";
  const products = await getProducts({ collection, sort });
  const copy = COLLECTION_COPY[collection];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">{copy.label}</h1>
      <p className="mt-4 max-w-2xl font-sans text-lg leading-relaxed text-espresso/70">
        {copy.introParagraph}
      </p>
      <p className="mt-3 font-sans text-base text-espresso/50">
        {products.length} piece{products.length === 1 ? "" : "s"} available
      </p>

      <SortBar basePath={`/shop/${collectionParam}`} activeSort={sort} />

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
