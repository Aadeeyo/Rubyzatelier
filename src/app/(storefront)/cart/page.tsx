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
        <h1 className="font-display text-3xl text-sand">Your cart is empty</h1>
        <p className="mt-3 font-sans text-lg text-sand/60">
          Time to find something beautiful.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-coral px-8 py-3 font-sans text-lg text-sand hover:scale-105"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl text-sand">Your Cart</h1>

      <div className="mt-8 flex flex-col divide-y divide-white/10">
        {lines.map((line) => (
          <div key={line.variantId} className="flex gap-4 py-6">
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-ink-elevated">
              {line.image && (
                <img src={line.image} alt={line.productName} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between">
                <div>
                  <p className="font-display text-lg text-sand">{line.productName}</p>
                  <p className="font-sans text-sm text-sand/50">
                    {line.size} · {line.color}
                  </p>
                </div>
                <p className="font-sans text-lg text-chrome-light">
                  {formatNaira(line.unitPrice * line.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-full border border-white/15">
                  <button
                    className="px-3 py-1 text-sand/70 hover:text-coral"
                    onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-sans">{line.quantity}</span>
                  <button
                    className="px-3 py-1 text-sand/70 hover:text-coral"
                    onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeLine(line.variantId)}
                  className="font-sans text-sm text-sand/40 hover:text-coral"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="font-display text-2xl text-sand">Subtotal</span>
        <span className="font-sans text-2xl text-chrome-light">
          {formatNaira(subtotal)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-8 block rounded-full bg-coral px-8 py-4 text-center font-sans text-lg text-sand transition-transform hover:scale-[1.01]"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
