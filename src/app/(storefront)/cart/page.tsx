"use client";

import Link from "next/link";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = cartSubtotal(lines);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso">Your cart is empty</h1>
        <p className="mt-3 font-sans text-lg text-espresso/60">
          Time to find something beautiful.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-terracotta px-8 py-3 font-sans text-lg text-ivory hover:scale-105"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-espresso">Your Cart ({lines.length})</h1>

      <div className="mt-8 flex flex-col divide-y divide-cocoa/15">
        {lines.map((line) => (
          <div key={line.variantId} className="flex gap-4 py-6">
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cream">
              {line.image && (
                <img src={line.image} alt={line.productName} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="font-display text-lg text-espresso">{line.productName}</p>
                  <p className="font-sans text-sm text-espresso/50">
                    {line.size}
                    {line.color ? ` · ${line.color}` : ""}
                  </p>
                </div>
                <p className="font-sans text-lg text-espresso">
                  {formatNaira(line.unitPrice * line.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-cocoa/25">
                  <button
                    className="px-3 py-1 text-espresso/70 hover:text-terracotta"
                    onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-sans">{line.quantity}</span>
                  <button
                    className="px-3 py-1 text-espresso/70 hover:text-terracotta"
                    onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeLine(line.variantId)}
                  className="font-sans text-sm text-espresso/40 hover:text-terracotta"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-cocoa/15 pt-6">
        <span className="font-display text-2xl text-espresso">Subtotal</span>
        <span className="font-sans text-2xl text-espresso">
          {formatNaira(subtotal)}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="flex-1 rounded-full border border-cocoa/25 px-8 py-4 text-center font-sans text-lg text-espresso transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Continue Shopping
        </Link>
        <Link
          href="/checkout"
          className="flex-1 rounded-full bg-terracotta px-8 py-4 text-center font-sans text-lg text-ivory transition-transform hover:scale-[1.01]"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
