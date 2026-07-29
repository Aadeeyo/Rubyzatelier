import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { DispatchForm } from "@/components/admin/dispatch-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });
  if (!order) notFound();

  const isDispatched = order.dispatchedAt !== null;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-sand">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 font-sans text-sand/50">
            Placed {order.createdAt.toLocaleString()}
          </p>
        </div>
        <OrderStatusControl orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-ink-soft p-6">
          <h2 className="font-display text-xl text-sand">Delivery address</h2>
          {order.address ? (
            <div className="mt-3 font-sans text-sand/70">
              <p className="text-sand">{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state}
              </p>
            </div>
          ) : (
            <p className="mt-3 font-sans text-sand/50">No address on file.</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-ink-soft p-6">
          <h2 className="font-display text-xl text-sand">Payment (Zenta)</h2>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 font-sans text-sand/70">
            <dt>Reference</dt>
            <dd className="text-sand">{order.paymentRef ?? "—"}</dd>
            <dt>Virtual account</dt>
            <dd className="text-sand">{order.virtualAccountNumber ?? "—"}</dd>
            <dt>Bank</dt>
            <dd className="text-sand">{order.virtualAccountBank ?? "—"}</dd>
          </dl>
          <p className="mt-3 font-sans text-sm text-sand/40">
            No live Zenta webhook is configured yet — confirm transfers
            manually and update the status above once payment is received.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-ink-soft p-6">
        <h2 className="font-display text-xl text-sand">Delivery</h2>
        {isDispatched ? (
          <div className="mt-3 font-sans text-sand/70">
            <dl className="grid grid-cols-2 gap-y-2 sm:max-w-md">
              <dt>Delivery cost</dt>
              <dd className="text-sand">{formatNaira(order.deliveryCost ?? 0)}</dd>
              <dt>Courier</dt>
              <dd className="text-sand">{order.courierName ?? "—"}</dd>
              <dt>Tracking</dt>
              <dd className="text-sand">{order.trackingInfo ?? "—"}</dd>
              <dt>Dispatched</dt>
              <dd className="text-sand">{order.dispatchedAt?.toLocaleString()}</dd>
            </dl>
            {order.dispatchNotes && (
              <p className="mt-3 italic text-sand/60">&ldquo;{order.dispatchNotes}&rdquo;</p>
            )}
            <p className="mt-3 font-sans text-sm text-sand/40">
              {order.dispatchEmailSentAt
                ? `Customer notified by email on ${order.dispatchEmailSentAt.toLocaleString()}.`
                : "The dispatch email was not sent — check your Resend configuration."}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 mb-4 font-sans text-sm text-sand/50">
              Set the delivery cost and courier details, then notify the
              customer by email. The delivery fee is collected by the
              courier on arrival, not through Zenta.
            </p>
            <DispatchForm orderId={order.id} />
          </>
        )}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-ink-soft">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-chrome">
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Qty</th>
              <th className="px-5 py-3">Unit price</th>
              <th className="px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 text-sand">
                  {item.variant.product.name} — {item.variant.size}/{item.variant.color}
                </td>
                <td className="px-5 py-3 text-sand/70">{item.quantity}</td>
                <td className="px-5 py-3 text-sand/70">{formatNaira(item.unitPrice)}</td>
                <td className="px-5 py-3 text-sand/70">
                  {formatNaira(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-8 font-sans text-sand/70">
        <div className="text-right">
          <p className="font-display text-xl text-sand">
            Total: {formatNaira(order.total)}
          </p>
          {isDispatched && (
            <p className="text-sm text-sand/50">
              + {formatNaira(order.deliveryCost ?? 0)} delivery (paid on arrival)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
