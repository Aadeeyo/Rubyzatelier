/**
 * Zenta virtual account payment integration.
 *
 * Real API docs/credentials have not been provided yet. Until they are, this
 * module returns a clearly-marked mock virtual account so the checkout flow
 * can be built and tested end-to-end. Swap the body of
 * `createZentaVirtualAccountCharge` for a real API call once credentials
 * (ZENTA_API_BASE_URL / ZENTA_API_KEY) are available — the call signature
 * and return shape are what the rest of the app depends on, so callers
 * should not need to change.
 */

export interface ZentaVirtualAccountCharge {
  reference: string;
  virtualAccountNumber: string;
  bankName: string;
  accountName: string;
  amount: number;
  expiresAt: Date;
  isMock: boolean;
}

export function isZentaConfigured(): boolean {
  return Boolean(process.env.ZENTA_API_KEY && process.env.ZENTA_API_BASE_URL);
}

export async function createZentaVirtualAccountCharge(params: {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
}): Promise<ZentaVirtualAccountCharge> {
  if (!isZentaConfigured()) {
    return {
      reference: `MOCK-${params.orderId}`,
      virtualAccountNumber: "0000000000",
      bankName: "Zenta (mock — not yet configured)",
      accountName: "Rubyzatelier Ltd",
      amount: params.amount,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      isMock: true,
    };
  }

  throw new Error(
    "Zenta live API integration is not yet implemented — provide API docs to wire this up.",
  );
}
