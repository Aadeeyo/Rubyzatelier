import "server-only";
import { Resend } from "resend";
import { formatNaira } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "Rubyzatelier <onboarding@resend.dev>";

export interface EmailResult {
  sent: boolean;
  reason?: string;
}

async function send(params: { to: string; subject: string; html: string; logKey: string }): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not configured — skipping email for ${params.logKey}`);
    return { sent: false, reason: "Email is not configured (RESEND_API_KEY missing)." };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (result.error) {
      console.error("[email] Resend returned an error:", result.error);
      return { sent: false, reason: result.error.message };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return { sent: false, reason: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Shared branded shell for every email - dark header band with the logo
 * (matching the site's hero treatment), an ivory body card, terracotta
 * accents. Table-based layout throughout for Outlook/Gmail compatibility.
 */
function emailShell(params: {
  preheader: string;
  bodyHtml: string;
  unsubscribeEmail?: string;
}): string {
  const footer = params.unsubscribeEmail
    ? `Thank you for being part of Rubyzatelier.<br />
       <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(params.unsubscribeEmail)}" style="color:#a78665;">Unsubscribe from these emails</a>`
    : `Thank you for shopping with us — we can't wait to see you again.`;

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${params.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4dcd0;">
            <tr>
              <td align="center" style="background:#2b231e;padding:32px 24px;">
                <img src="${SITE_URL}/apple-icon" width="56" height="56" alt="Rubyzatelier" style="display:block;margin:0 auto 12px;border-radius:50%;" />
                <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:28px;color:#f3ede3;">Rubyzatelier</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;font-family:Georgia,'Times New Roman',serif;color:#3e3026;font-size:16px;line-height:1.6;">
                ${params.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;border-top:1px solid #e4dcd0;font-family:Georgia,'Times New Roman',serif;font-size:12px;color:#a78665;line-height:1.6;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#b56b45;color:#f8f5f0;text-decoration:none;padding:12px 28px;border-radius:999px;font-family:Georgia,'Times New Roman',serif;font-size:16px;">${label}</a>`;
}

function firstName(name: string): string {
  return name.trim().split(" ")[0] || "there";
}

export async function sendPaymentConfirmedEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number }[];
  total: number;
}): Promise<EmailResult> {
  const orderRef = params.orderId.slice(-8).toUpperCase();
  const itemsList = params.items
    .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 4px;color:#b56b45;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Payment confirmed — order #${orderRef}</p>
    <p>Hi ${firstName(params.customerName)},</p>
    <p>We've confirmed your payment of <strong>${formatNaira(params.total)}</strong>. Your order is now being processed.</p>
    <p style="margin-top:20px;">Items in this order:</p>
    <ul>${itemsList}</ul>
    <p>We'll email you again once your order is dispatched (or ready for pickup), with the next details you need.</p>
  `;

  return send({
    to: params.to,
    subject: `Payment confirmed for your Rubyzatelier order #${orderRef}`,
    html: emailShell({ preheader: `Payment confirmed for order #${orderRef}`, bodyHtml }),
    logKey: `order ${params.orderId}`,
  });
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
}): Promise<EmailResult> {
  const orderRef = params.orderId.slice(-8).toUpperCase();
  const itemsList = params.items
    .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 4px;color:#b56b45;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Order #${orderRef} is on its way</p>
    <p>Hi ${firstName(params.customerName)},</p>
    <p>Your order has been dispatched. Here are the delivery details:</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      <tr><td style="padding:6px 0;color:#a78665;">Delivery cost</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${formatNaira(params.deliveryCost)}</td></tr>
      ${params.courierName ? `<tr><td style="padding:6px 0;color:#a78665;">Courier</td><td style="padding:6px 0;text-align:right;">${params.courierName}</td></tr>` : ""}
      ${params.trackingInfo ? `<tr><td style="padding:6px 0;color:#a78665;">Tracking</td><td style="padding:6px 0;text-align:right;">${params.trackingInfo}</td></tr>` : ""}
    </table>

    <p style="background:#f3ede3;border:1px solid #e4dcd0;border-radius:8px;padding:12px 16px;">
      <strong>Please note:</strong> the delivery fee of ${formatNaira(params.deliveryCost)}
      is paid directly to the delivery partner upon arrival — it is not
      collected as part of your order payment.
    </p>

    ${params.dispatchNotes ? `<p>${params.dispatchNotes}</p>` : ""}

    <p style="margin-top:20px;">Items in this order:</p>
    <ul>${itemsList}</ul>
  `;

  return send({
    to: params.to,
    subject: `Your Rubyzatelier order #${orderRef} has been dispatched`,
    html: emailShell({ preheader: `Order #${orderRef} is on its way`, bodyHtml }),
    logKey: `order ${params.orderId}`,
  });
}

export async function sendReadyForPickupEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number }[];
}): Promise<EmailResult> {
  const orderRef = params.orderId.slice(-8).toUpperCase();
  const itemsList = params.items
    .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 4px;color:#b56b45;text-transform:uppercase;letter-spacing:0.15em;font-size:12px;">Order #${orderRef} is ready for pickup</p>
    <p>Hi ${firstName(params.customerName)},</p>
    <p>Your order is ready to collect at <strong>Oriokuta, Ogijo</strong>.</p>
    <p style="margin-top:20px;">Items in this order:</p>
    <ul>${itemsList}</ul>
  `;

  return send({
    to: params.to,
    subject: `Your Rubyzatelier order #${orderRef} is ready for pickup`,
    html: emailShell({ preheader: `Order #${orderRef} is ready for pickup`, bodyHtml }),
    logKey: `order ${params.orderId}`,
  });
}

export async function sendWelcomeEmail(params: { to: string }): Promise<EmailResult> {
  const bodyHtml = `
    <p>Welcome to Rubyzatelier.</p>
    <p>We're so glad you're here. You'll be the first to know about new
    collections, styling inspiration, and the moments worth dressing for.</p>
    <p>In the meantime, explore our Edits — Office, Sunday, Date, and
    Celebration — each one curated for a different part of your life.</p>
    <p style="margin-top:24px;">${button(`${SITE_URL}/shop`, "Shop the Collection")}</p>
  `;

  return send({
    to: params.to,
    subject: "Welcome to Rubyzatelier",
    html: emailShell({
      preheader: "Welcome to Rubyzatelier — bringing elegant fashion closer to home.",
      bodyHtml,
      unsubscribeEmail: params.to,
    }),
    logKey: `welcome ${params.to}`,
  });
}

export async function sendCheckInEmail(params: {
  to: string;
  customerName: string;
}): Promise<EmailResult> {
  const bodyHtml = `
    <p>Hi ${firstName(params.customerName)},</p>
    <p>It's been a little while since your last visit, and we wanted to
    check in. New pieces have joined the Edits since you were last here.</p>
    <p>If there's ever anything we can help with — sizing, an old order,
    anything at all — just reply to this email.</p>
    <p style="margin-top:24px;">${button(`${SITE_URL}/shop`, "See What's New")}</p>
  `;

  return send({
    to: params.to,
    subject: "We've missed you",
    html: emailShell({
      preheader: "New pieces have joined the Edits since your last visit.",
      bodyHtml,
      unsubscribeEmail: params.to,
    }),
    logKey: `check-in ${params.to}`,
  });
}

export async function sendRepeatCustomerEmail(params: {
  to: string;
  customerName: string;
}): Promise<EmailResult> {
  const bodyHtml = `
    <p>Hi ${firstName(params.customerName)},</p>
    <p>We noticed you've shopped with us twice this month, and honestly?
    That means a lot.</p>
    <p>Thank you for trusting us with your wardrobe, again and again. Rubyzatelier
    exists because of women like you.</p>
  `;

  return send({
    to: params.to,
    subject: "You're becoming one of our favorites",
    html: emailShell({
      preheader: "Thank you for shopping with us again.",
      bodyHtml,
      unsubscribeEmail: params.to,
    }),
    logKey: `repeat-customer ${params.to}`,
  });
}

const MILESTONE_COPY: Record<5 | 10 | 20, { subject: string; line: string }> = {
  5: {
    subject: "5 orders and counting — thank you",
    line: "You've now placed 5 orders with us.",
  },
  10: {
    subject: "Double digits: 10 orders with Rubyzatelier",
    line: "You've now placed 10 orders with us — double digits.",
  },
  20: {
    subject: "20 orders — you're part of our story",
    line: "You've now placed 20 orders with us.",
  },
};

export async function sendMilestoneThankYouEmail(params: {
  to: string;
  customerName: string;
  milestone: 5 | 10 | 20;
}): Promise<EmailResult> {
  const copy = MILESTONE_COPY[params.milestone];

  const bodyHtml = `
    <p>Hi ${firstName(params.customerName)},</p>
    <p>${copy.line} We wanted to pause and say thank you.</p>
    <p>Rubyzatelier exists because women outside major fashion hubs deserve
    affordable elegance without sacrificing time and money. Every time you
    choose us, you're part of why we get to keep doing this.</p>
    <p>Thank you for being one of the women who make Rubyzatelier possible.</p>
  `;

  return send({
    to: params.to,
    subject: copy.subject,
    html: emailShell({
      preheader: copy.line,
      bodyHtml,
      unsubscribeEmail: params.to,
    }),
    logKey: `milestone-${params.milestone} ${params.to}`,
  });
}
