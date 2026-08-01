"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";

const STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "PICKED",
  "CANCELLED",
  "REFUNDED",
] as const;

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    const previous = status;
    setStatus(next);
    setSaving(true);
    const result = await updateOrderStatus({ orderId, status: next as (typeof STATUSES)[number] });
    setSaving(false);

    if (!result.ok) {
      setStatus(previous);
      toast.error(result.error);
      return;
    }

    if (result.emailSent === true) {
      toast.success("Order marked paid — customer notified by email");
    } else if (result.emailSent === false) {
      toast.error(`Order marked paid, but the email was not sent: ${result.emailReason}`);
    } else {
      toast.success(`Order marked ${next.replaceAll("_", " ").toLowerCase()}`);
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-2 text-sand outline-none focus:border-coral"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      {saving && <span className="font-sans text-sm text-sand/50">Saving…</span>}
    </div>
  );
}
