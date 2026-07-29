"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/utils";
import { placeOrder } from "./actions";

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Oyo",
  "Ogun",
  "Rivers",
  "Kano",
  "Kaduna",
  "Enugu",
  "Delta",
  "Edo",
];

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(lines);
  const total = subtotal;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: NIGERIAN_STATES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-sand">Nothing to check out</h1>
        <p className="mt-3 font-sans text-lg text-sand/60">
          Add something to your cart first.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await placeOrder({
      ...form,
      lines: lines.map((l) => ({
        variantId: l.variantId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    });

    if (result.ok && result.orderId) {
      clear();
      router.push(`/order/${result.orderId}`);
    } else {
      setError(result.error ?? "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 py-14 sm:px-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="font-display text-3xl text-sand">Delivery details</h1>

        <input
          required
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
        />
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
        />
        <input
          required
          placeholder="Address line 1"
          value={form.line1}
          onChange={(e) => setForm({ ...form, line1: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={form.line2}
          onChange={(e) => setForm({ ...form, line2: e.target.value })}
          className="rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
        />
        <div className="flex gap-4">
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="flex-1 rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
          />
          <select
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="flex-1 rounded-lg border border-white/15 bg-ink-elevated px-4 py-3 font-sans text-lg text-sand outline-none focus:border-coral"
          >
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="font-sans text-base text-coral">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-full bg-coral px-8 py-4 font-sans text-lg text-sand transition-transform hover:scale-[1.01] disabled:opacity-50"
        >
          {submitting ? "Placing order…" : `Pay ${formatNaira(total)} via Zenta`}
        </button>
        <p className="text-center font-sans text-sm text-sand/40">
          You&apos;ll receive a Zenta virtual account number to complete
          payment. Delivery is arranged after payment — we&apos;ll email you
          the delivery cost and courier details, payable directly to the
          delivery partner on arrival.
        </p>
      </form>

      <div className="rounded-xl border border-white/10 bg-ink-soft p-6">
        <h2 className="font-display text-2xl text-sand">Order Summary</h2>
        <div className="mt-4 flex flex-col divide-y divide-white/10">
          {lines.map((line) => (
            <div key={line.variantId} className="flex justify-between py-3">
              <div>
                <p className="font-sans text-base text-sand">
                  {line.productName} × {line.quantity}
                </p>
                <p className="font-sans text-sm text-sand/50">
                  {line.size} · {line.color}
                </p>
              </div>
              <p className="font-sans text-base text-chrome-light">
                {formatNaira(line.unitPrice * line.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-sans text-base text-sand/70">
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-display text-xl text-sand">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
        <p className="mt-3 font-sans text-sm text-sand/50">
          Delivery fee not included — paid to the delivery partner on
          arrival, once we confirm your delivery cost by email.
        </p>
      </div>
    </div>
  );
}
