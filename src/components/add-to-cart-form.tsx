"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatNaira, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface VariantOption {
  id: string;
  size: string;
  color: string | null;
  priceOverride: number | null;
  quantity: number;
}

export function AddToCartForm({
  productSlug,
  productName,
  basePrice,
  image,
  variants,
}: {
  productSlug: string;
  productName: string;
  basePrice: number;
  image: string | null;
  variants: VariantOption[];
}) {
  const router = useRouter();
  const addLine = useCartStore((s) => s.addLine);

  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size))),
    [variants],
  );
  const colors = useMemo(
    () =>
      Array.from(
        new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c))),
      ),
    [variants],
  );

  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = variants.find(
    (v) => v.size === size && (colors.length === 0 || v.color === color),
  );
  const price = variant?.priceOverride ?? basePrice;
  const inStock = (variant?.quantity ?? 0) > 0;

  function handleAdd() {
    if (!variant || !inStock) return;
    addLine(
      {
        variantId: variant.id,
        productSlug,
        productName,
        size: variant.size,
        color: variant.color,
        unitPrice: price,
        image,
        maxQuantity: variant.quantity,
      },
      quantity,
    );
    setJustAdded(true);
    setTimeout(() => {
      router.back();
    }, 600);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-3xl text-espresso">{formatNaira(price)}</p>

      {sizes.length > 0 && (
        <div>
          <span className="font-sans text-sm uppercase tracking-widest text-espresso/60">
            Size
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-base transition-colors",
                  size === s
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-cocoa/25 text-espresso/70 hover:border-terracotta",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <span className="font-sans text-sm uppercase tracking-widest text-espresso/60">
            Color
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-base transition-colors",
                  color === c
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-cocoa/25 text-espresso/70 hover:border-terracotta",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-cocoa/25">
          <button
            className="px-4 py-2 text-espresso/70 hover:text-terracotta"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center font-sans text-lg">{quantity}</span>
          <button
            className="px-4 py-2 text-espresso/70 hover:text-terracotta"
            onClick={() =>
              setQuantity((q) => Math.min(variant?.quantity ?? 1, q + 1))
            }
          >
            +
          </button>
        </div>

        <span className="font-sans text-sm text-espresso/50">
          {variant
            ? inStock
              ? `${variant.quantity} in stock`
              : "Out of stock"
            : "Select options"}
        </span>
      </div>

      <button
        onClick={handleAdd}
        disabled={!variant || !inStock}
        className="relative overflow-hidden rounded-full bg-terracotta px-8 py-4 font-sans text-lg text-ivory transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={justAdded ? "added" : "add"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            {justAdded ? "Added to cart ✓" : "Add to Cart"}
          </motion.span>
        </AnimatePresence>
      </button>

      <button
        onClick={() => router.push("/cart")}
        className="font-sans text-base text-cocoa underline underline-offset-4 hover:text-terracotta"
      >
        View cart
      </button>
    </div>
  );
}
