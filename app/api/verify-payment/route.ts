import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });

  try {
    const { session_id } = await req.json();

    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json({ paid: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (
      session.payment_status === "paid" &&
      session.status === "complete" &&
      session.metadata?.product === "premium_report"
    ) {
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false, error: "Payment not completed" });
  } catch (error: any) {
    return NextResponse.json({ paid: false, error: error.message }, { status: 500 });
  }
}
