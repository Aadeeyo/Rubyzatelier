import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { BANK_TRANSFER } from "@/lib/site";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { variant: { include: { product: true } } } },
      address: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8">
      <p className="font-sans text-sm uppercase tracking-[0.3em] text-coral">
        Order placed
      </p>
      <h1 className="mt-2 font-display text-4xl text-sand">
        Thank you{order.address ? `, ${order.address.fullName.split(" ")[0]}` : ""}!
      </h1>
      <p className="mt-3 font-sans text-lg text-sand/60">
        Order #{order.id.slice(-8).toUpperCase()} is awaiting payment confirmation.
      </p>

      <div className="mt-8 rounded-xl border border-coral/30 bg-coral/5 p-6">
        <h2 className="font-display text-xl text-sand">Pay via bank transfer</h2>
        <dl className="mt-4 grid grid-cols-2 gap-y-2 font-sans text-base">
          <dt className="text-sand/50">Bank</dt>
          <dd className="text-sand">{BANK_TRANSFER.bankName}</dd>
          <dt className="text-sand/50">Account name</dt>
          <dd className="text-sand">{BANK_TRANSFER.accountName}</dd>
          <dt className="text-sand/50">Account number</dt>
          <dd className="tracking-widest text-sand">{BANK_TRANSFER.accountNumber}</dd>
          <dt className="text-sand/50">Amount</dt>
          <dd className="text-sand">{formatNaira(order.total)}</dd>
          <dt className="text-sand/50">Reference</dt>
          <dd className="text-sand">{order.paymentRef}</dd>
        </dl>
        <p className="mt-4 font-sans text-sm text-sand/50">
          Transfer the exact amount to the account above, using{" "}
          <strong className="text-sand">{order.paymentRef}</strong> as your
          transfer narration/reference. Your order will be marked paid once
          we confirm the transfer, and you&apos;ll get an email once that
          happens.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-ink-soft p-6">
        <h2 className="font-display text-xl text-sand">Delivery</h2>
        <p className="mt-2 font-sans text-sm text-sand/60">
          We&apos;ll arrange delivery once your payment is confirmed and
          email you the delivery cost and courier details. The delivery fee
          is paid directly to the delivery partner on arrival — it&apos;s
          not part of the amount above.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-sand">Items</h2>
        <div className="mt-3 flex flex-col divide-y divide-white/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 font-sans text-base">
              <span className="text-sand">
                {item.variant.product.name} × {item.quantity}
              </span>
              <span className="text-chrome-light">
                {formatNaira(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 font-display text-xl text-sand">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
