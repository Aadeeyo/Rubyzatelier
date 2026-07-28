import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: { include: { inventory: true } } },
  });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-sand">{product.name}</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            department: product.department,
            category: product.category,
            basePrice: product.basePrice,
            imageUrl: product.images[0]?.url ?? "/products/placeholder-1.svg",
            isPublished: product.isPublished,
            isFeatured: product.isFeatured,
          }}
          existingVariants={product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            quantity: v.inventory?.quantity ?? 0,
          }))}
        />
      </div>
    </div>
  );
}
