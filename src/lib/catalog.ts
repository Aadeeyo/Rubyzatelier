import { prisma } from "@/lib/prisma";
import type { Department, ProductCategory } from "@/generated/prisma/enums";

export { variantAvailableQuantity, productTotalStock } from "@/lib/stock";

const productWithRelations = {
  images: { orderBy: { position: "asc" as const } },
  variants: { include: { inventory: true } },
};

export async function getFeaturedProducts(take = 6) {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
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
