import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import Stripe from "stripe";
import items from "~/data/store-items.json";

const stripeSecret = process.env.STRIPE_SECRET || "";
const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

export async function action({ request }: ActionArgs) {
  try {
    const body = await request.json();
    const { itemId } = body || {};
    if (!itemId) return json({ error: "Missing itemId" }, { status: 400 });

    const item = items.find((i: any) => i.id === itemId);
    if (!item) return json({ error: "Item not found" }, { status: 404 });

    if (!stripeSecret) {
      return json({ error: "Stripe not configured on server" }, { status: 500 });
    }

    const domain = process.env.SITE_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round((item.price_usd || 0) * 100),
            product_data: {
              name: item.title,
              description: item.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/?checkout=cancel`,
    });

    return json({ url: session.url });
  } catch (err) {
    return json({ error: (err as Error).message || "Server error" }, { status: 500 });
  }
}
