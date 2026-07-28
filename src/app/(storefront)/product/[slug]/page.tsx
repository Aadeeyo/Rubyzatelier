import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { AddToCartForm } from "@/components/add-to-cart-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isPublished) notFound();

  const mainImage = product.images[0]?.url ?? null;

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 py-14 sm:px-8 md:grid-cols-2">
      <div className="grid gap-4">
        <div className="aspect-[4/5] overflow-hidden rounded-xl bg-ink-elevated">
          {mainImage && (
            <img
              src={mainImage}
              alt={product.images[0]?.altText ?? product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(1).map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-ink-elevated">
                <img
                  src={img.url}
                  alt={img.altText ?? product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-sans text-sm uppercase tracking-[0.3em] text-chrome">
          {product.department === "WOMEN" ? "Women" : "Kids"} · {product.category.toLowerCase()}
        </p>
        <h1 className="mt-2 font-display text-4xl text-sand sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 font-sans text-lg leading-relaxed text-sand/70">
          {product.description}
        </p>

        <div className="mt-8">
          <AddToCartForm
            productSlug={product.slug}
            productName={product.name}
            basePrice={product.basePrice}
            image={mainImage}
            variants={product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              color: v.color,
              priceOverride: v.priceOverride,
              quantity: v.inventory?.quantity ?? 0,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
