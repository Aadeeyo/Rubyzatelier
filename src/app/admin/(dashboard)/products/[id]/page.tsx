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
      <h1 className="font-display text-3xl text-espresso">{product.name}</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            collection: product.collection,
            basePrice: product.basePrice,
            imageUrl: product.images[0]?.url ?? "/products/placeholder-1.svg",
            status: product.status,
            isFeatured: product.isFeatured,
            details: product.details.join("\n"),
            fabric: product.fabric ?? "",
            careInstructions: product.careInstructions ?? "",
            howToWear: product.howToWear ?? "",
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
