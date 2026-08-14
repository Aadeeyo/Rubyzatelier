import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso sm:text-5xl">
        {query ? `Results for “${query}”` : "Search"}
      </h1>

      {query && (
        <p className="mt-2 font-sans text-lg text-espresso/60">
          {products.length} piece{products.length === 1 ? "" : "s"} found
        </p>
      )}

      {query && products.length === 0 ? (
        <p className="mt-16 font-sans text-lg text-espresso/50">
          Nothing matched that search — try a different word, or{" "}
          <Link href="/shop" className="text-terracotta hover:underline">
            browse the full shop
          </Link>
          .
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
