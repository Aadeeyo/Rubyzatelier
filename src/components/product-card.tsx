"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatNaira } from "@/lib/utils";
import { productTotalStock } from "@/lib/stock";
import type { Product, ProductImage, ProductVariant, Inventory } from "@/generated/prisma/client";

type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: (ProductVariant & { inventory: Inventory | null })[];
};

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.images[0];
  const stock = productTotalStock(product);
  const price = Math.min(
    product.basePrice,
    ...product.variants.map((v) => v.priceOverride ?? product.basePrice),
  );

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-cocoa">
              No image
            </div>
          )}
          {stock === 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-espresso/85 px-3 py-1 text-xs uppercase tracking-wider text-ivory">
              Sold out
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="font-display text-lg text-espresso group-hover:text-terracotta">
            {product.name}
          </h3>
          <span className="font-sans text-base text-cocoa">
            {formatNaira(price)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
