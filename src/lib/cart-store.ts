"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  variantId: string;
  productSlug: string;
  productName: string;
  size: string;
  color: string | null;
  unitPrice: number;
  image: string | null;
  quantity: number;
  maxQuantity: number;
}

interface CartState {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line, quantity = 1) => {
        const existing = get().lines.find((l) => l.variantId === line.variantId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.variantId === line.variantId
                ? {
                    ...l,
                    quantity: Math.min(l.quantity + quantity, l.maxQuantity),
                  }
                : l,
            ),
          });
        } else {
          set({
            lines: [
              ...get().lines,
              { ...line, quantity: Math.min(quantity, line.maxQuantity) },
            ],
          });
        }
      },
      removeLine: (variantId) =>
        set({ lines: get().lines.filter((l) => l.variantId !== variantId) }),
      setQuantity: (variantId, quantity) =>
        set({
          lines: get()
            .lines.map((l) =>
              l.variantId === variantId
                ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxQuantity)) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        }),
      clear: () => set({ lines: [] }),
    }),
    { name: "rubyzatelier-cart" },
  ),
);

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
