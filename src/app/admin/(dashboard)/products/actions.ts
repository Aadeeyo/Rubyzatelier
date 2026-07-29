"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { isSupportedImageType, uploadProductImage } from "@/lib/storage";
import { friendlyActionError } from "@/lib/errors";
import { revalidateStorefront } from "@/lib/revalidate";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided." };
  }
  if (!isSupportedImageType(file.type)) {
    return { ok: false as const, error: "Please upload a JPG, PNG, WEBP, GIF or SVG image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false as const, error: "Image must be under 5MB." };
  }

  try {
    const buffer = await file.arrayBuffer();
    const url = await uploadProductImage(buffer, file.type);
    return { ok: true as const, url };
  } catch (err) {
    console.error("Image upload failed:", err);
    return { ok: false as const, error: "Could not upload image. Please try again." };
  }
}

const variantSchema = z.object({
  size: z.string().min(1, "size is required"),
  color: z.string().min(1, "color is required"),
  sku: z.string().min(1, "SKU is required"),
  priceOverride: z.number().int().positive().nullable().optional(),
  quantity: z.number().int().min(0),
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(1),
  department: z.enum(["WOMEN", "KIDS"]),
  category: z.enum(["TOP", "DRESS", "JEANS", "TOP_BOTTOM"]),
  basePrice: z.number().int().positive(),
  imageUrl: z.string().min(1),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1, "at least one variant is required"),
});

export type ProductInput = z.infer<typeof productSchema>;

export async function createProduct(input: ProductInput) {
  await requireAdminSession();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid product details.") };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return {
      ok: false as const,
      error: `A product named "${data.name}" already exists.`,
    };
  }

  try {
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
    revalidateStorefront();
    return { ok: true as const, id: product.id };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not create product.") };
  }
}

const coreUpdateSchema = productSchema.omit({ variants: true });

export async function updateProductCore(
  id: string,
  input: z.infer<typeof coreUpdateSchema>,
) {
  await requireAdminSession();
  const parsed = coreUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid product details.") };
  }
  const data = parsed.data;
  const slug = slugify(data.slug || data.name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== id) {
    return {
      ok: false as const,
      error: `A product named "${data.name}" already exists.`,
    };
  }

  try {
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
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not save changes.") };
  }
}

export async function addVariant(productId: string, input: z.infer<typeof variantSchema>) {
  await requireAdminSession();
  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: friendlyActionError(parsed.error, "Invalid variant details.") };
  }
  const data = parsed.data;

  try {
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
    revalidateStorefront();
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not add variant.") };
  }
}

export async function updateVariantDetails(
  variantId: string,
  input: { size: string; color: string; sku: string; priceOverride: number | null },
) {
  await requireAdminSession();
  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: input,
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: friendlyActionError(err, "Could not update variant.") };
  }
}
