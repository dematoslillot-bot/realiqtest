import { NextRequest, NextResponse } from "next/server";
import { getAccess, sign } from "@/lib/access";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const a = await getAccess(req);
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
  return NextResponse.json({
    hasAccess: a.report || a.premium,   // can see exact score + full report
    report: a.report,
    premium: a.premium,
    cancelAt: a.cancelAt,
    // Personal link to restore Premium on another device (only for the subscriber themselves)
    accessLink: a.premium && a.subscriptionId ? `${base}/api/restore?key=${encodeURIComponent(sign("s:" + a.subscriptionId))}` : null,
  });
}
