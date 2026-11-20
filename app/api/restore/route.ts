import { NextRequest, NextResponse } from "next/server";
import { verify, cookieOptions, PREMIUM_COOKIE, subscriptionStatus } from "@/lib/access";

export const dynamic = "force-dynamic";

// GET /api/restore?key=... — personal link that restores Premium on a new device.
export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
  const key = req.nextUrl.searchParams.get("key");
  const val = verify(key);
  if (!val || !val.startsWith("s:")) return NextResponse.redirect(`${base}/premium?restore=invalid`);
  const st = await subscriptionStatus(val.slice(2));
  if (!st.active) return NextResponse.redirect(`${base}/premium?restore=inactive`);
  const res = NextResponse.redirect(`${base}/premium`);
  res.cookies.set(PREMIUM_COOKIE, key!, cookieOptions);
  return res;
}
