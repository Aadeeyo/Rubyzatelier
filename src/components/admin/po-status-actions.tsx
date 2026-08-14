"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setPurchaseOrderStatus } from "@/app/admin/(dashboard)/procurement/actions";

export function PurchaseOrderStatusActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function update(next: "ORDERED" | "CANCELLED") {
    setPending(true);
    const result = await setPurchaseOrderStatus(id, next);
    setPending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(next === "ORDERED" ? "Purchase order marked as ordered" : "Purchase order cancelled");
    router.refresh();
  }

  if (status !== "DRAFT") return null;

  return (
    <div className="flex gap-3">
      <button
        onClick={() => update("ORDERED")}
        disabled={pending}
        className="rounded-full bg-terracotta px-6 py-2 font-sans text-ivory hover:scale-105 disabled:opacity-50"
      >
        Mark as ordered
      </button>
      <button
        onClick={() => update("CANCELLED")}
        disabled={pending}
        className="rounded-full border border-cocoa/25 px-6 py-2 font-sans text-espresso/70 hover:border-terracotta hover:text-terracotta disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
