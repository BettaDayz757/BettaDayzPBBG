import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Payment webhook skeleton
 * - Verify provider signature (Coinbase/BitPay/Cash App)
 * - Idempotency checks + record transaction
 * - Credit BettaBuckz after verification and subtract $5 fee
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  // TODO: verify webhook signature using provider-specific secret
  // const signature = req.headers["x-provider-signature"];
  // verifySignature(signature, req.rawBody);

  const evt = req.body;
  // Example: event contains { id, type, data: { amount, currency, metadata } }
  // Process events idempotently, e.g., store provider_tx_id and skip duplicates

  // For now return 200 so provider can replay while we wire verification
  res.status(200).json({ received: true, debug: { event: evt?.type || null } });
}
