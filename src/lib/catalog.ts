import { prisma } from "@/lib/prisma";
import type { Collection } from "@/generated/prisma/enums";

export { variantAvailableQuantity, productTotalStock } from "@/lib/stock";

const productWithRelations = {
  images: { orderBy: { position: "asc" as const } },
  variants: { include: { inventory: true } },
};

// A product is only visible to customers once it's marked available AND at
// least one variant has stock. It disappears the moment every variant hits 0
// (auto-archived, see src/lib/product-status.ts) and reappears automatically
// as soon as any variant is restocked - no manual re-publish needed.
const inStock = {
  variants: { some: { inventory: { quantity: { gt: 0 } } } },
};

export async function getFeaturedProducts(take = 6) {
  return prisma.product.findMany({
    where: { status: "AVAILABLE", isFeatured: true, ...inStock },
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getProducts(filters: {
  collection?: Collection;
  sort?: "newest" | "price";
} = {}) {
  return prisma.product.findMany({
    where: {
      status: "AVAILABLE",
      ...inStock,
      ...(filters.collection ? { collection: filters.collection } : {}),
    },
    include: productWithRelations,
    orderBy:
      filters.sort === "price" ? { basePrice: "asc" } : { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productWithRelations,
  });
}

export async function getRelatedProducts(
  collection: Collection,
  excludeId: string,
  take = 4,
) {
  return prisma.product.findMany({
    where: {
      collection,
      status: "AVAILABLE",
      ...inStock,
      id: { not: excludeId },
    },
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function searchProducts(query: string, take = 24) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return prisma.product.findMany({
    where: {
      status: "AVAILABLE",
      ...inStock,
      name: { contains: trimmed, mode: "insensitive" },
    },
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
    take,
  });
}
