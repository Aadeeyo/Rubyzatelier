"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { formatNaira, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

interface VariantOption {
  id: string;
  size: string;
  color: string;
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
    () => Array.from(new Set(variants.map((v) => v.color))),
    [variants],
  );

  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variant = variants.find((v) => v.size === size && v.color === color);
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
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-3xl text-chrome-light">{formatNaira(price)}</p>

      {sizes.length > 0 && (
        <div>
          <span className="font-sans text-sm uppercase tracking-widest text-sand/60">
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
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-white/15 text-sand/70 hover:border-coral",
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
          <span className="font-sans text-sm uppercase tracking-widest text-sand/60">
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
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-white/15 text-sand/70 hover:border-coral",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-white/15">
          <button
            className="px-4 py-2 text-sand/70 hover:text-coral"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="w-8 text-center font-sans text-lg">{quantity}</span>
          <button
            className="px-4 py-2 text-sand/70 hover:text-coral"
            onClick={() =>
              setQuantity((q) => Math.min(variant?.quantity ?? 1, q + 1))
            }
          >
            +
          </button>
        </div>

        <span className="font-sans text-sm text-sand/50">
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
        className="relative overflow-hidden rounded-full bg-coral px-8 py-4 font-sans text-lg text-sand transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
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
        className="font-sans text-base text-chrome underline underline-offset-4 hover:text-coral"
      >
        View cart
      </button>
    </div>
  );
}
