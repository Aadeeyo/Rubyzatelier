import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { Hero } from "@/components/hero";
import { CategoryTiles } from "@/components/category-tiles";

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      <Hero />
      <CategoryTiles />

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-sand sm:text-4xl">
            Fresh off the dye vat
          </h2>
          <Link
            href="/shop"
            className="font-sans text-lg text-chrome hover:text-coral"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="font-sans text-lg text-sand/60">
            No pieces published yet — add products from the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
