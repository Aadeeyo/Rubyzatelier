"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  sku: z.string().min(1),
  priceOverride: z.number().int().positive().nullable().optional(),
  quantity: z.number().int().min(0),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1),
  department: z.enum(["WOMEN", "KIDS"]),
  category: z.enum(["TOP", "DRESS", "JEANS"]),
  basePrice: z.number().int().positive(),
  imageUrl: z.string().min(1),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;

export async function createProduct(input: ProductInput) {
  await requireAdminSession();
  const data = productSchema.parse(input);
  const slug = slugify(data.slug || data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      department: data.department,
      category: data.category,
      basePrice: data.basePrice,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      images: { create: [{ url: data.imageUrl, position: 0 }] },
      variants: {
        create: data.variants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku,
          priceOverride: v.priceOverride ?? null,
          inventory: { create: { quantity: v.quantity } },
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true, id: product.id };
}

const coreUpdateSchema = productSchema.omit({ variants: true });

export async function updateProductCore(
  id: string,
  input: z.infer<typeof coreUpdateSchema>,
) {
  await requireAdminSession();
  const data = coreUpdateSchema.parse(input);
  const slug = slugify(data.slug || data.name);

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      description: data.description,
      department: data.department,
      category: data.category,
      basePrice: data.basePrice,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      images: {
        deleteMany: {},
        create: [{ url: data.imageUrl, position: 0 }],
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true };
}

export async function addVariant(productId: string, input: z.infer<typeof variantSchema>) {
  await requireAdminSession();
  const data = variantSchema.parse(input);

  await prisma.productVariant.create({
    data: {
      productId,
      size: data.size,
      color: data.color,
      sku: data.sku,
      priceOverride: data.priceOverride ?? null,
      inventory: { create: { quantity: data.quantity } },
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath("/");
  return { ok: true };
}

export async function updateVariantDetails(
  variantId: string,
  input: { size: string; color: string; sku: string; priceOverride: number | null },
) {
  await requireAdminSession();
  await prisma.productVariant.update({
    where: { id: variantId },
    data: input,
  });
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  return { ok: true };
}
