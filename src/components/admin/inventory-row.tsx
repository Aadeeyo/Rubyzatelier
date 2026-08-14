"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adjustInventory } from "@/app/admin/(dashboard)/inventory/actions";

export function InventoryRow({
  variantId,
  productName,
  size,
  color,
  sku,
  initialQuantity,
  initialReorderAt,
}: {
  variantId: string;
  productName: string;
  size: string;
  color: string | null;
  sku: string;
  initialQuantity: number;
  initialReorderAt: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [reorderAt, setReorderAt] = useState(initialReorderAt);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const lowStock = quantity <= reorderAt;

  async function save() {
    setSaving(true);
    const result = await adjustInventory({ variantId, quantity, reorderAt });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${productName} stock updated`);
    setDirty(false);
  }

  return (
    <tr className="border-b border-cocoa/10 last:border-0">
      <td className="px-5 py-3 text-espresso">{productName}</td>
      <td className="px-5 py-3 text-espresso/70">
        {size}
        {color ? ` / ${color}` : ""}
      </td>
      <td className="px-5 py-3 text-espresso/50">{sku}</td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value || "0", 10));
            setDirty(true);
          }}
          className="w-20 rounded-lg border border-cocoa/25 bg-ivory px-2 py-1 text-espresso outline-none focus:border-terracotta"
        />
      </td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={reorderAt}
          onChange={(e) => {
            setReorderAt(parseInt(e.target.value || "0", 10));
            setDirty(true);
          }}
          className="w-20 rounded-lg border border-cocoa/25 bg-ivory px-2 py-1 text-espresso outline-none focus:border-terracotta"
        />
      </td>
      <td className="px-5 py-3">
        {lowStock && (
          <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs text-terracotta">
            Low stock
          </span>
        )}
      </td>
      <td className="px-5 py-3">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-full border border-cocoa/25 px-4 py-1 font-sans text-sm text-espresso/70 hover:border-terracotta hover:text-terracotta disabled:opacity-30"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
}
