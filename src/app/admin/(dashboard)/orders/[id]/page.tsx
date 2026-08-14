import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/utils";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { DispatchForm } from "@/components/admin/dispatch-form";
import { MarkReadyForPickupForm } from "@/components/admin/mark-ready-for-pickup-form";

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
  const isReadyForPickup = order.status === "PICKED" || order.status === "DELIVERED";

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-espresso">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 font-sans text-espresso/50">
            Placed {order.createdAt.toLocaleString()} ·{" "}
            {order.deliveryMethod === "PICKUP" ? "Pickup" : "Home delivery"}
          </p>
        </div>
        <OrderStatusControl orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-cocoa/15 bg-cream p-6">
          <h2 className="font-display text-xl text-espresso">
            {order.deliveryMethod === "PICKUP" ? "Pickup details" : "Delivery address"}
          </h2>
          {order.deliveryMethod === "PICKUP" ? (
            <p className="mt-3 font-sans text-espresso/70">
              Pickup at <span className="text-espresso">Oriokuta, Ogijo</span>.
            </p>
          ) : order.address ? (
            <div className="mt-3 font-sans text-espresso/70">
              <p className="text-espresso">{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state}
              </p>
            </div>
          ) : (
            <p className="mt-3 font-sans text-espresso/50">No address on file.</p>
          )}
        </div>

        <div className="rounded-xl border border-cocoa/15 bg-cream p-6">
          <h2 className="font-display text-xl text-espresso">Payment (bank transfer)</h2>
          <dl className="mt-3 grid grid-cols-2 gap-y-2 font-sans text-espresso/70">
            <dt>Reference</dt>
            <dd className="text-espresso">{order.paymentRef ?? "—"}</dd>
            <dt>Status</dt>
            <dd className="text-espresso">{order.status.replaceAll("_", " ")}</dd>
          </dl>
          <p className="mt-3 font-sans text-sm text-espresso/40">
            Check your bank account for a transfer matching this reference,
            then mark the order Paid above — this sends the customer a
            payment confirmation email automatically.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-cocoa/15 bg-cream p-6">
        <h2 className="font-display text-xl text-espresso">
          {order.deliveryMethod === "PICKUP" ? "Pickup" : "Delivery"}
        </h2>

        {order.deliveryMethod === "PICKUP" ? (
          isReadyForPickup ? (
            <p className="mt-3 font-sans text-espresso/70">
              Marked ready for pickup.
            </p>
          ) : (
            <>
              <p className="mt-2 mb-4 font-sans text-sm text-espresso/50">
                Once the order is packed and waiting at Oriokuta, Ogijo,
                mark it ready to notify the customer by email.
              </p>
              <MarkReadyForPickupForm orderId={order.id} />
            </>
          )
        ) : isDispatched ? (
          <div className="mt-3 font-sans text-espresso/70">
            <dl className="grid grid-cols-2 gap-y-2 sm:max-w-md">
              <dt>Delivery cost</dt>
              <dd className="text-espresso">{formatNaira(order.deliveryCost ?? 0)}</dd>
              <dt>Courier</dt>
              <dd className="text-espresso">{order.courierName ?? "—"}</dd>
              <dt>Tracking</dt>
              <dd className="text-espresso">{order.trackingInfo ?? "—"}</dd>
              <dt>Dispatched</dt>
              <dd className="text-espresso">{order.dispatchedAt?.toLocaleString()}</dd>
            </dl>
            {order.dispatchNotes && (
              <p className="mt-3 italic text-espresso/60">&ldquo;{order.dispatchNotes}&rdquo;</p>
            )}
            <p className="mt-3 font-sans text-sm text-espresso/40">
              {order.dispatchEmailSentAt
                ? `Customer notified by email on ${order.dispatchEmailSentAt.toLocaleString()}.`
                : "The dispatch email was not sent — check your Resend configuration."}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 mb-4 font-sans text-sm text-espresso/50">
              Set the delivery cost and courier details, then notify the
              customer by email. The delivery fee is collected by the
              courier on arrival, separately from the order payment.
            </p>
            <DispatchForm orderId={order.id} />
          </>
        )}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-cocoa/15 bg-cream">
        <table className="w-full font-sans text-left">
          <thead>
            <tr className="border-b border-cocoa/15 text-sm uppercase tracking-widest text-cocoa">
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Qty</th>
              <th className="px-5 py-3">Unit price</th>
              <th className="px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-cocoa/10 last:border-0">
                <td className="px-5 py-3 text-espresso">
                  {item.variant.product.name} — {item.variant.size}
                  {item.variant.color ? `/${item.variant.color}` : ""}
                </td>
                <td className="px-5 py-3 text-espresso/70">{item.quantity}</td>
                <td className="px-5 py-3 text-espresso/70">{formatNaira(item.unitPrice)}</td>
                <td className="px-5 py-3 text-espresso/70">
                  {formatNaira(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-8 font-sans text-espresso/70">
        <div className="text-right">
          <p className="font-display text-xl text-espresso">
            Total: {formatNaira(order.total)}
          </p>
          {isDispatched && order.deliveryMethod === "HOME_DELIVERY" && (
            <p className="text-sm text-espresso/50">
              + {formatNaira(order.deliveryCost ?? 0)} delivery (paid on arrival)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
