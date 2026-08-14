import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SortBar } from "@/components/sort-bar";

export const metadata: Metadata = {
  title: "Shop All Pieces",
  description:
    "Browse every piece from Rubyzatelier — elegant, affordable fashion for women, based in Ogijo, Ogun State, delivering to Ogijo, Itaoluwo, Lukosi and beyond.",
  alternates: { canonical: "/shop" },
};

export default async function ShopAllPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort: sortParam } = await searchParams;
  const sort = sortParam === "price" ? "price" : "newest";
  const products = await getProducts({ sort });

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">All Pieces</h1>
      <p className="mt-2 font-sans text-lg text-espresso/60">
        {products.length} piece{products.length === 1 ? "" : "s"} available
      </p>

      <SortBar basePath="/shop" activeSort={sort} />

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
