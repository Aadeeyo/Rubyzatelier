import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { Hero } from "@/components/hero";
import { CollectionTiles } from "@/components/collection-tiles";
import { OurStoryExcerpt } from "@/components/our-story-excerpt";
import { Testimonials } from "@/components/testimonials";
import { BrandValues } from "@/components/brand-values";
import { JournalPreview } from "@/components/journal-preview";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col">
      <Hero />
      <OurStoryExcerpt />
      <CollectionTiles />

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-espresso sm:text-4xl">
            New In
          </h2>
          <Link
            href="/shop"
            className="font-sans text-lg text-cocoa hover:text-terracotta"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Testimonials />
      <BrandValues />
      <JournalPreview />
      <NewsletterSignup />
    </div>
  );
}
