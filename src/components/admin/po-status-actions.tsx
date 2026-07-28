"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    await setPurchaseOrderStatus(id, next);
    setPending(false);
    router.refresh();
  }

  if (status !== "DRAFT") return null;

  return (
    <div className="flex gap-3">
      <button
        onClick={() => update("ORDERED")}
        disabled={pending}
        className="rounded-full bg-coral px-6 py-2 font-sans text-sand hover:scale-105 disabled:opacity-50"
      >
        Mark as ordered
      </button>
      <button
        onClick={() => update("CANCELLED")}
        disabled={pending}
        className="rounded-full border border-white/15 px-6 py-2 font-sans text-sand/70 hover:border-coral hover:text-coral disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
