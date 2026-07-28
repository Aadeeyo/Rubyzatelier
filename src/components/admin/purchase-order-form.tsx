"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPurchaseOrder } from "@/app/admin/(dashboard)/procurement/actions";

interface VariantOption {
  id: string;
  label: string;
}

interface ItemRow {
  variantId: string;
  quantityOrdered: string;
  unitCost: string;
}

export function PurchaseOrderForm({
  suppliers,
  variants,
}: {
  suppliers: { id: string; name: string }[];
  variants: VariantOption[];
}) {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [expectedAt, setExpectedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ItemRow[]>([
    { variantId: variants[0]?.id ?? "", quantityOrdered: "1", unitCost: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateItem(i: number, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await createPurchaseOrder({
        supplierId,
        expectedAt: expectedAt || undefined,
        notes: notes || undefined,
        items: items
          .filter((r) => r.variantId)
          .map((r) => ({
            variantId: r.variantId,
            quantityOrdered: parseInt(r.quantityOrdered || "0", 10),
            unitCost: Math.round(parseFloat(r.unitCost || "0") * 100),
          })),
      });
      if (!result.ok) throw new Error("Could not create purchase order");
      router.push(`/admin/procurement/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (suppliers.length === 0) {
    return (
      <p className="font-sans text-sand/60">
        Add a supplier first before creating a purchase order.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Supplier
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
        >
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Expected date (optional)
        <input
          type="date"
          value={expectedAt}
          onChange={(e) => setExpectedAt(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <span className="font-sans text-sand/70">Items</span>
          <button
            type="button"
            onClick={() =>
              setItems((rows) => [
                ...rows,
                { variantId: variants[0]?.id ?? "", quantityOrdered: "1", unitCost: "" },
              ])
            }
            className="font-sans text-sm text-chrome hover:text-coral"
          >
            + Add item
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {items.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <select
                value={row.variantId}
                onChange={(e) => updateItem(i, { variantId: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              >
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={row.quantityOrdered}
                onChange={(e) => updateItem(i, { quantityOrdered: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Unit cost (₦)"
                value={row.unitCost}
                onChange={(e) => updateItem(i, { unitCost: e.target.value })}
                className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Notes
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
        />
      </label>

      {error && <p className="font-sans text-coral">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-coral px-8 py-3 font-sans text-lg text-sand hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Creating…" : "Create purchase order"}
      </button>
    </form>
  );
}
