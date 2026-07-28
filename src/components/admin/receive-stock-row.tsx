"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { receiveStock } from "@/app/admin/(dashboard)/procurement/actions";

export function ReceiveStockRow({
  itemId,
  productLabel,
  quantityOrdered,
  quantityReceived,
  unitCost,
}: {
  itemId: string;
  productLabel: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
}) {
  const router = useRouter();
  const remaining = quantityOrdered - quantityReceived;
  const [amount, setAmount] = useState(remaining > 0 ? remaining.toString() : "0");
  const [saving, setSaving] = useState(false);

  async function handleReceive() {
    const qty = parseInt(amount || "0", 10);
    if (qty <= 0) return;
    setSaving(true);
    await receiveStock({ purchaseOrderItemId: itemId, quantity: qty });
    setSaving(false);
    router.refresh();
  }

  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-5 py-3 text-sand">{productLabel}</td>
      <td className="px-5 py-3 text-sand/70">{(unitCost / 100).toLocaleString()}</td>
      <td className="px-5 py-3 text-sand/70">{quantityOrdered}</td>
      <td className="px-5 py-3 text-sand/70">{quantityReceived}</td>
      <td className="px-5 py-3">
        {remaining > 0 ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-20 rounded-lg border border-white/15 bg-ink-elevated px-2 py-1 text-sand outline-none focus:border-coral"
            />
            <button
              onClick={handleReceive}
              disabled={saving}
              className="rounded-full border border-white/15 px-4 py-1 font-sans text-sm text-sand/70 hover:border-coral hover:text-coral disabled:opacity-30"
            >
              {saving ? "…" : "Receive"}
            </button>
          </div>
        ) : (
          <span className="text-green-400">Complete</span>
        )}
      </td>
    </tr>
  );
}
