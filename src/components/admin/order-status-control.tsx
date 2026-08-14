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

// Display labels matching the blueprint's order status flow: Pending Payment
// → Payment Confirmed → Preparing Order → Ready for Pickup / Shipped → Delivered.
const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Payment Confirmed",
  PROCESSING: "Preparing Order",
  PICKED: "Ready for Pickup",
  DISPATCHED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

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
      toast.success(`Order marked ${STATUS_LABELS[next as (typeof STATUSES)[number]].toLowerCase()}`);
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="rounded-lg border border-cocoa/25 bg-ivory px-4 py-2 text-espresso outline-none focus:border-terracotta"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {saving && <span className="font-sans text-sm text-espresso/50">Saving…</span>}
    </div>
  );
}
