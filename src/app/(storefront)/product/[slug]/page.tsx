import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getRelatedJournalEntry } from "@/lib/journal";
import { productTotalStock } from "@/lib/stock";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductCard } from "@/components/product-card";
import { SITE_URL, SITE_NAME, SERVICE_AREAS } from "@/lib/site";
import { COLLECTION_COPY } from "@/lib/collections";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "AVAILABLE" || productTotalStock(product) === 0) {
    return {};
  }

  const image = product.images[0]?.url;

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "AVAILABLE" || productTotalStock(product) === 0) {
    notFound();
  }

  const mainImage = product.images[0]?.url ?? null;
  const price = Math.min(
    product.basePrice,
    ...product.variants.map((v) => v.priceOverride ?? product.basePrice),
  );
  const collectionCopy = COLLECTION_COPY[product.collection];
  const relatedProducts = await getRelatedProducts(product.collection, product.id);
  const relatedJournalEntry = await getRelatedJournalEntry(product.collection);
  const availableSizes = [
    ...new Set(
      product.variants
        .filter((v) => (v.inventory?.quantity ?? 0) > 0)
        .map((v) => v.size),
    ),
  ];
  const altTextFallback = `${product.name} from Rubyzatelier's ${collectionCopy.label}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: mainImage ? [`${SITE_URL}${mainImage}`] : undefined,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "NGN",
      price: (price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      areaServed: SERVICE_AREAS,
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="grid gap-4">
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-cream">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.images[0]?.altText ?? altTextFallback}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div key={img.id} className="aspect-square overflow-hidden rounded-lg bg-cream">
                  <img
                    src={img.url}
                    alt={img.altText ?? altTextFallback}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            href={`/shop/${collectionCopy.slug}`}
            className="font-sans text-sm uppercase tracking-[0.3em] text-cocoa hover:text-terracotta"
          >
            {collectionCopy.label}
          </Link>
          <h1 className="mt-2 font-display text-4xl text-espresso sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 font-sans text-lg leading-relaxed text-espresso/70">
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

          <div className="mt-10 rounded-xl bg-cream p-6">
            <h2 className="font-display text-lg text-espresso">Delivery &amp; Returns</h2>
            <div className="mt-3 space-y-2 font-sans text-sm text-espresso/70">
              <p>
                <span className="font-semibold text-espresso">Pickup</span> —
                available in Oriokuta, Ogijo, immediately after payment
                confirmation.
              </p>
              <p>
                <span className="font-semibold text-espresso">Home delivery</span>{" "}
                — 1–3 business days within Ogun and Lagos State, 3–7 business
                days to other locations.
              </p>
              <p>
                <span className="font-semibold text-espresso">Returns</span> —
                eligible items may be returned within 24 hours if unworn,
                unwashed, and in original condition. See our{" "}
                <Link href="/support" className="underline hover:text-terracotta">
                  returns policy
                </Link>{" "}
                for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {(product.details.length > 0 ||
        availableSizes.length > 0 ||
        product.fabric ||
        product.careInstructions) && (
        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-2xl text-espresso sm:text-3xl">The Details</h2>
          <ul className="mt-6 space-y-2 font-sans text-espresso/70">
            {availableSizes.length > 0 && (
              <li>
                <span className="font-semibold text-espresso">Available in</span>{" "}
                {availableSizes.join(", ")}
              </li>
            )}
            {product.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
            {product.fabric && (
              <li>
                <span className="font-semibold text-espresso">Fabric</span> — {product.fabric}
              </li>
            )}
            {product.careInstructions && (
              <li>
                <span className="font-semibold text-espresso">Care</span> —{" "}
                {product.careInstructions}
              </li>
            )}
          </ul>
        </div>
      )}

      {product.howToWear && (
        <div className="mt-16 max-w-2xl">
          <h2 className="font-display text-2xl text-espresso sm:text-3xl">How to Wear It</h2>
          <p className="mt-6 font-sans leading-relaxed text-espresso/70">{product.howToWear}</p>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl text-espresso sm:text-3xl">
            You Might Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 rounded-xl bg-sand/30 px-8 py-10 text-center">
        <p className="font-display text-2xl text-espresso">
          Explore the {collectionCopy.label}
        </p>
        <p className="mt-2 font-sans text-espresso/70">{collectionCopy.description}</p>
        <Link
          href={`/shop/${collectionCopy.slug}`}
          className="mt-6 inline-block rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory transition-transform hover:scale-105"
        >
          Shop the collection
        </Link>
      </div>

      {relatedJournalEntry && (
        <div className="mt-16 border-t border-cocoa/15 pt-10 text-center">
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-cocoa">
            Need styling inspiration?
          </p>
          <Link
            href={`/journal/${relatedJournalEntry.slug}`}
            className="mt-3 inline-block font-display text-2xl text-espresso hover:text-terracotta"
          >
            {relatedJournalEntry.title}
          </Link>
        </div>
      )}
    </div>
  );
}
