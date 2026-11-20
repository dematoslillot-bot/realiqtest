import { NextRequest, NextResponse } from "next/server";
import { stripeClient, clearSubscriptionCache, verify, PREMIUM_COOKIE } from "@/lib/access";

export const dynamic = "force-dynamic";

// POST — opens the Stripe customer portal (cancel, change card, invoices).
export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
  const val = verify(req.cookies.get(PREMIUM_COOKIE)?.value);
  if (!val || !val.startsWith("s:")) {
    return NextResponse.json({ error: "No subscription found on this device" }, { status: 401 });
  }
  try {
    const stripe = stripeClient();
    const subId = val.slice(2);
    const sub = await stripe.subscriptions.retrieve(subId);
    const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    clearSubscriptionCache(subId);
    const portal = await stripe.billingPortal.sessions.create({ customer, return_url: `${base}/premium` });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("portal error", error);
    return NextResponse.json({ error: "Could not open subscription settings" }, { status: 500 });
  }
}
