import { NextRequest, NextResponse } from "next/server";
import { stripeClient, sign, cookieOptions, REPORT_COOKIE, PREMIUM_COOKIE, clearSubscriptionCache } from "@/lib/access";

export const dynamic = "force-dynamic";

// POST { session_id } — called after Stripe redirects back. Sets a signed access cookie.
export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id || typeof session_id !== "string" || !session_id.startsWith("cs_")) {
      return NextResponse.json({ paid: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripeClient().checkout.sessions.retrieve(session_id);

    if (session.status !== "complete") {
      return NextResponse.json({ paid: false, error: "Payment not completed" });
    }

    // Premium subscription
    if (session.mode === "subscription" && session.metadata?.product === "premium" && session.subscription) {
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
      clearSubscriptionCache(subId);
      const res = NextResponse.json({ paid: true, plan: "premium" });
      res.cookies.set(PREMIUM_COOKIE, sign("s:" + subId), cookieOptions);
      return res;
    }

    // One-time report
    if (session.mode === "payment" && session.payment_status === "paid" && session.metadata?.product === "premium_report") {
      const res = NextResponse.json({ paid: true, plan: "report" });
      res.cookies.set(REPORT_COOKIE, sign("r:" + session.id), cookieOptions);
      return res;
    }

    return NextResponse.json({ paid: false, error: "Payment not completed" });
  } catch (error) {
    console.error("verify error", error);
    return NextResponse.json({ paid: false, error: "Payment verification error" }, { status: 500 });
  }
}
