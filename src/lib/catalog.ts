import { prisma } from "@/lib/prisma";
import type { Department, ProductCategory } from "@/generated/prisma/enums";

export { variantAvailableQuantity, productTotalStock } from "@/lib/stock";

const productWithRelations = {
  images: { orderBy: { position: "asc" as const } },
  variants: { include: { inventory: true } },
};

// A product is only visible to customers once it's published AND at least
// one variant has stock. It disappears the moment every variant hits 0 and
// reappears automatically as soon as any variant is restocked - no manual
// re-publish needed.
const inStock = {
  variants: { some: { inventory: { quantity: { gt: 0 } } } },
};

export async function getFeaturedProducts(take = 6) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true, ...inStock },
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getProducts(filters: {
  department?: Department;
  category?: ProductCategory;
} = {}) {
  return prisma.product.findMany({
    where: {
      isPublished: true,
      ...inStock,
      ...(filters.department ? { department: filters.department } : {}),
      ...(filters.category ? { category: filters.category } : {}),
    },
    include: productWithRelations,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productWithRelations,
  });
}
