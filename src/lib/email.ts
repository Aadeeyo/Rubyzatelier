import "server-only";
import { Resend } from "resend";
import { formatNaira } from "@/lib/utils";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "Rubyzatelier <onboarding@resend.dev>";

export interface DispatchEmailResult {
  sent: boolean;
  reason?: string;
}

export async function sendDispatchEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number }[];
  deliveryCost: number;
  courierName?: string | null;
  trackingInfo?: string | null;
  dispatchNotes?: string | null;
}): Promise<DispatchEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not configured — skipping dispatch email for order ${params.orderId}`,
    );
    return { sent: false, reason: "Email is not configured (RESEND_API_KEY missing)." };
  }

  const orderRef = params.orderId.slice(-8).toUpperCase();
  const itemsList = params.items
    .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
    .join("");

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; max-width: 560px; margin: 0 auto;">
      <h1 style="font-size: 22px; margin-bottom: 4px;">Rubyzatelier</h1>
      <p style="color: #666; margin-top: 0;">Order #${orderRef} is on its way</p>

      <p>Hi ${params.customerName.split(" ")[0]},</p>
      <p>Your order has been dispatched. Here are the delivery details:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #666;">Delivery cost</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${formatNaira(params.deliveryCost)}</td></tr>
        ${params.courierName ? `<tr><td style="padding: 6px 0; color: #666;">Courier</td><td style="padding: 6px 0; text-align: right;">${params.courierName}</td></tr>` : ""}
        ${params.trackingInfo ? `<tr><td style="padding: 6px 0; color: #666;">Tracking</td><td style="padding: 6px 0; text-align: right;">${params.trackingInfo}</td></tr>` : ""}
      </table>

      <p style="background: #fff4ed; border: 1px solid #f0d9c8; border-radius: 8px; padding: 12px 16px;">
        <strong>Please note:</strong> the delivery fee of ${formatNaira(params.deliveryCost)}
        is paid directly to the delivery partner upon arrival — it is not
        collected as part of your order payment.
      </p>

      ${params.dispatchNotes ? `<p>${params.dispatchNotes}</p>` : ""}

      <p style="margin-top: 20px;">Items in this order:</p>
      <ul>${itemsList}</ul>

      <p style="margin-top: 24px; color: #666;">Thank you for shopping with us — má rìn hò hò.</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: `Your Rubyzatelier order #${orderRef} has been dispatched`,
      html,
    });

    if (result.error) {
      console.error("[email] Resend returned an error:", result.error);
      return { sent: false, reason: result.error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send dispatch email:", err);
    return { sent: false, reason: err instanceof Error ? err.message : "Unknown error" };
  }
}
