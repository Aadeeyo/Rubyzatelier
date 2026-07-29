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
  color: string;
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
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-5 py-3 text-sand">{productName}</td>
      <td className="px-5 py-3 text-sand/70">
        {size} / {color}
      </td>
      <td className="px-5 py-3 text-sand/50">{sku}</td>
      <td className="px-5 py-3">
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value || "0", 10));
            setDirty(true);
          }}
          className="w-20 rounded-lg border border-white/15 bg-ink-elevated px-2 py-1 text-sand outline-none focus:border-coral"
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
          className="w-20 rounded-lg border border-white/15 bg-ink-elevated px-2 py-1 text-sand outline-none focus:border-coral"
        />
      </td>
      <td className="px-5 py-3">
        {lowStock && (
          <span className="rounded-full bg-coral/10 px-3 py-1 text-xs text-coral">
            Low stock
          </span>
        )}
      </td>
      <td className="px-5 py-3">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="rounded-full border border-white/15 px-4 py-1 font-sans text-sm text-sand/70 hover:border-coral hover:text-coral disabled:opacity-30"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
}
