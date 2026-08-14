"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markReadyForPickup } from "@/app/admin/(dashboard)/orders/actions";

export function MarkReadyForPickupForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    setSaving(true);
    const result = await markReadyForPickup(orderId);
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    if (result.emailSent) {
      toast.success("Order marked ready for pickup — customer notified by email");
    } else {
      toast.error(`Order marked ready, but the email was not sent: ${result.emailReason}`);
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className="w-fit rounded-full bg-terracotta px-6 py-2 font-sans text-ivory hover:scale-105 disabled:opacity-50"
    >
      {saving ? "Updating…" : "Mark ready & notify customer"}
    </button>
  );
}
