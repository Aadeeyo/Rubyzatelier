"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dispatchOrder } from "@/app/admin/(dashboard)/orders/actions";

export function DispatchForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [deliveryCost, setDeliveryCost] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingInfo, setTrackingInfo] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await dispatchOrder({
      orderId,
      deliveryCost: Math.round(parseFloat(deliveryCost || "0") * 100),
      courierName: courierName || undefined,
      trackingInfo: trackingInfo || undefined,
      dispatchNotes: dispatchNotes || undefined,
    });

    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      setError(result.error);
      return;
    }

    if (result.emailSent) {
      toast.success("Order dispatched — customer notified by email");
    } else {
      toast.error(`Order dispatched, but the email was not sent: ${result.emailReason}`);
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Delivery cost (₦)
        <input
          required
          type="number"
          step="0.01"
          value={deliveryCost}
          onChange={(e) => setDeliveryCost(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Courier / rider name
        <input
          value={courierName}
          onChange={(e) => setCourierName(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Tracking info (optional)
        <input
          value={trackingInfo}
          onChange={(e) => setTrackingInfo(e.target.value)}
          placeholder="Tracking number or link"
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
      </label>
      <label className="flex flex-col gap-1 font-sans text-sand/70">
        Note to customer (optional)
        <textarea
          rows={2}
          value={dispatchNotes}
          onChange={(e) => setDispatchNotes(e.target.value)}
          className="rounded-lg border border-white/15 bg-ink-elevated px-3 py-2 text-sand outline-none focus:border-coral"
        />
      </label>

      {error && <p className="font-sans text-sm text-coral">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-1 w-fit rounded-full bg-coral px-6 py-2 font-sans text-sand hover:scale-105 disabled:opacity-50"
      >
        {saving ? "Dispatching…" : "Dispatch & notify customer"}
      </button>
    </form>
  );
}
