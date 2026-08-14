import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SortBar } from "@/components/sort-bar";
import { COLLECTION_SLUGS, COLLECTION_COPY } from "@/lib/collections";

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
    description: `${copy.description} Shop the ${copy.label} from Rubyzatelier — based in Ogijo, Ogun State, delivering to Ogijo, Itaoluwo, Lukosi and beyond.`,
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
      <p className="mt-2 max-w-xl font-sans text-lg text-espresso/60">{copy.description}</p>
      <p className="mt-1 font-sans text-base text-espresso/50">
        {products.length} piece{products.length === 1 ? "" : "s"} available
      </p>

      <SortBar basePath={`/shop/${collectionParam}`} activeSort={sort} />

      {products.length === 0 ? (
        <p className="mt-16 font-sans text-lg text-espresso/50">
          Nothing here yet — check back soon.
        </p>
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
