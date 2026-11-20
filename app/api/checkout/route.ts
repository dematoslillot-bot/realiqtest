import { NextRequest, NextResponse } from "next/server";
import { stripeClient, REPORT_PRICE_CENTS, PREMIUM_PRICE_CENTS, CURRENCY } from "@/lib/access";

export const dynamic = "force-dynamic";

// POST { plan: "report" | "premium", email?: string }
export async function POST(req: NextRequest) {
  const stripe = stripeClient();
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;

  try {
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "premium" ? "premium" : "report";
    const email = typeof body.email === "string" && body.email.includes("@") ? body.email.trim() : undefined;

    if (plan === "premium") {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              recurring: { interval: "month" },
              product_data: {
                name: "RealIQTest Premium",
                description: "Full report and PDF certificate, daily brain challenge, monthly re-test with progress history. Cancel anytime.",
              },
              unit_amount: PREMIUM_PRICE_CENTS,
            },
            quantity: 1,
          },
        ],
        customer_email: email,
        success_url: `${base}/premium?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/results`,
        metadata: { product: "premium" },
        subscription_data: { metadata: { product: "premium" } },
        custom_text: {
          submit: {
            message: "€4.99 per month, renews every month until you cancel. Cancel anytime in one click from your Premium page.",
          },
        },
      });
      return NextResponse.json({ url: session.url });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "RealIQTest Full Report",
              description: "Exact IQ score, breakdown by cognitive area, career matches, improvement tips and PDF certificate. One-time payment.",
            },
            unit_amount: REPORT_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${base}/report?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/results`,
      metadata: { product: "premium_report" },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout error", error);
    return NextResponse.json({ error: "Payment processing error" }, { status: 500 });
  }
}
