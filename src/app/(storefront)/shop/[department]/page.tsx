import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { CategoryFilterBar } from "@/components/category-filter-bar";
import type { Department, ProductCategory } from "@/generated/prisma/enums";

const DEPARTMENT_MAP: Record<string, Department> = {
  women: "WOMEN",
  kids: "KIDS",
};

const VALID_CATEGORIES: ProductCategory[] = ["TOP", "DRESS", "JEANS", "TOP_BOTTOM"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ department: string }>;
}): Promise<Metadata> {
  const { department: departmentParam } = await params;
  if (!DEPARTMENT_MAP[departmentParam]) return {};

  const label = departmentParam === "women" ? "Women's" : "Kids'";
  return {
    title: `${label} Clothing`,
    description: `Shop ${label.toLowerCase()} tops, dresses and jeans from Rubyzatelier — based in Ogijo, Ogun State, delivering to Ogijo, Itaoluwo, Lukosi and beyond.`,
    alternates: { canonical: `/shop/${departmentParam}` },
  };
}

export default async function DepartmentShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { department: departmentParam } = await params;
  const { category: categoryParam } = await searchParams;

  const department = DEPARTMENT_MAP[departmentParam];
  if (!department) notFound();

  const category = VALID_CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : undefined;

  const products = await getProducts({ department, category });
  const label = departmentParam === "women" ? "Women" : "Kids";

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-sand sm:text-5xl">{label}</h1>
      <p className="mt-2 font-sans text-lg text-sand/60">
        {products.length} piece{products.length === 1 ? "" : "s"} available
      </p>

      <CategoryFilterBar basePath={`/shop/${departmentParam}`} activeCategory={category} />

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
