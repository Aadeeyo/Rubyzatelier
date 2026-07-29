import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { CategoryFilterBar } from "@/components/category-filter-bar";
import type { ProductCategory } from "@/generated/prisma/enums";

const VALID_CATEGORIES: ProductCategory[] = ["TOP", "DRESS", "JEANS", "TOP_BOTTOM"];

export default async function ShopAllPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const category = VALID_CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : undefined;

  const products = await getProducts({ category });

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-sand sm:text-5xl">All Pieces</h1>
      <p className="mt-2 font-sans text-lg text-sand/60">
        {products.length} piece{products.length === 1 ? "" : "s"} available
      </p>

      <CategoryFilterBar basePath="/shop" activeCategory={category} />

      {products.length === 0 ? (
        <p className="mt-16 font-sans text-lg text-sand/50">
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
