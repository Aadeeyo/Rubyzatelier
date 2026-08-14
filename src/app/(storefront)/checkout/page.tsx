"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira, cn } from "@/lib/utils";
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

type DeliveryMethod = "HOME_DELIVERY" | "PICKUP";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(lines);
  const total = subtotal;

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("HOME_DELIVERY");
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
        <h1 className="font-display text-3xl text-espresso">Nothing to check out</h1>
        <p className="mt-3 font-sans text-lg text-espresso/60">
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
      deliveryMethod,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      ...(deliveryMethod === "HOME_DELIVERY"
        ? { line1: form.line1, line2: form.line2, city: form.city, state: form.state }
        : {}),
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

  const inputClass =
    "rounded-lg border border-cocoa/25 bg-ivory px-4 py-3 font-sans text-lg text-espresso outline-none focus:border-terracotta";

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 py-14 sm:px-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="font-display text-3xl text-espresso">Checkout</h1>

        <div>
          <span className="font-sans text-sm uppercase tracking-widest text-espresso/60">
            Delivery method
          </span>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            {(
              [
                { value: "HOME_DELIVERY", label: "Home delivery" },
                { value: "PICKUP", label: "Pickup — Oriokuta, Ogijo" },
              ] as const
            ).map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setDeliveryMethod(option.value)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-left font-sans text-base transition-colors",
                  deliveryMethod === option.value
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-cocoa/25 text-espresso/70 hover:border-terracotta",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <input
          required
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className={inputClass}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass}
        />

        {deliveryMethod === "HOME_DELIVERY" ? (
          <>
            <input
              required
              placeholder="Address line 1"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="Address line 2 (optional)"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className={inputClass}
            />
            <div className="flex gap-4">
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={cn("flex-1", inputClass)}
              />
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={cn("flex-1", inputClass)}
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-cream p-4 font-sans text-base text-espresso/70">
            Pick up your order at <span className="font-semibold text-espresso">Oriokuta, Ogijo</span>,
            available immediately after payment is confirmed.
          </div>
        )}

        {error && <p className="font-sans text-base text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 rounded-full bg-terracotta px-8 py-4 font-sans text-lg text-ivory transition-transform hover:scale-[1.01] disabled:opacity-50"
        >
          {submitting ? "Placing order…" : `Place order — ${formatNaira(total)}`}
        </button>
        <p className="text-center font-sans text-sm text-espresso/50">
          You&apos;ll receive our bank transfer details to complete payment
          (bank transfer only).{" "}
          {deliveryMethod === "HOME_DELIVERY"
            ? "Delivery is arranged after payment — we'll email you the delivery cost and courier details, payable directly to the delivery partner on arrival."
            : "Your order will be ready for pickup as soon as payment is confirmed."}
        </p>
      </form>

      <div className="rounded-xl border border-cocoa/15 bg-cream p-6">
        <h2 className="font-display text-2xl text-espresso">Order Summary</h2>
        <div className="mt-4 flex flex-col divide-y divide-cocoa/15">
          {lines.map((line) => (
            <div key={line.variantId} className="flex justify-between py-3">
              <div>
                <p className="font-sans text-base text-espresso">
                  {line.productName} × {line.quantity}
                </p>
                <p className="font-sans text-sm text-espresso/50">
                  {line.size}
                  {line.color ? ` · ${line.color}` : ""}
                </p>
              </div>
              <p className="font-sans text-base text-espresso">
                {formatNaira(line.unitPrice * line.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-cocoa/15 pt-4 font-sans text-base text-espresso/70">
          <span>Subtotal</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-cocoa/15 pt-3 font-display text-xl text-espresso">
          <span>Total</span>
          <span>{formatNaira(total)}</span>
        </div>
        <p className="mt-3 font-sans text-sm text-espresso/50">
          {deliveryMethod === "HOME_DELIVERY"
            ? "Delivery fee not included — paid to the delivery partner on arrival, once we confirm your delivery cost by email."
            : "No delivery fee — pick up at Oriokuta, Ogijo."}
        </p>
      </div>
    </div>
  );
}
