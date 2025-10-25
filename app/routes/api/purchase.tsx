import { json } from '@remix-run/node'
import type { ActionArgs } from '@remix-run/node'
import items from '~/data/store-items.json'

export async function action({ request }: ActionArgs) {
  try {
    const body = await request.json()
    const { itemId, method } = body || {}
    if (!itemId || !method) return json({ message: 'Missing itemId or method' }, { status: 400 })

    const item = items.find(i => i.id === itemId)
    if (!item) return json({ message: 'Item not found' }, { status: 404 })

    // NOTE: This is a simulated purchase flow for demo purposes only.
    // Replace this section with real payment provider integration (Stripe, Cash App Pay, BitPay, etc.)

    // Example behavior per method
    if (method === 'card') {
      // Call your card provider (Stripe) here
      return json({ message: `Charged $${item.price_usd} to card (simulated)`, tx: `card-sim-${Date.now()}` })
    }

    if (method === 'cashapp') {
      // Cash App Pay integration would go here. Cash App provides APIs and webhooks you must implement server-side.
      return json({ message: `Cash App payment simulated for $${item.price_usd}`, tx: `cashapp-sim-${Date.now()}` })
    }

    if (method === 'bitcoin') {
      // For bitcoin payments, integrate with a gateway (BitPay, OpenNode, BTCPay) or accept on-chain payments and verify confirmations
      return json({ message: `BTC payment simulated for ${item.price_btc} BTC`, tx: `btc-sim-${Date.now()}` })
    }

    return json({ message: 'Unknown payment method' }, { status: 400 })
  } catch (err) {
    return json({ message: (err as Error).message || 'Server error' }, { status: 500 })
  }
}
