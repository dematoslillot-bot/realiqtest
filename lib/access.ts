// Server-only helpers for paid access (one-time report + Premium subscription).
// Access cookies are HMAC-signed so they cannot be forged by setting a cookie by hand.
import crypto from "crypto";
import Stripe from "stripe";
import type { NextRequest } from "next/server";

export const REPORT_PRICE_CENTS = 99;    // one-time full report
export const PREMIUM_PRICE_CENTS = 499;  // Premium, per month
export const CURRENCY = "eur";

export const REPORT_COOKIE = "report_access";
export const PREMIUM_COOKIE = "premium_access";

export function stripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" });
}

function secret(): string {
  // Prefer a dedicated secret; fall back to a key derived from the Stripe secret key.
  const base = process.env.ACCESS_SECRET || process.env.STRIPE_SECRET_KEY || "";
  if (!base) throw new Error("Missing ACCESS_SECRET / STRIPE_SECRET_KEY");
  return crypto.createHash("sha256").update("realiqtest-access:" + base).digest("hex");
}

export function sign(value: string): string {
  const mac = crypto.createHmac("sha256", secret()).update(value).digest("base64url");
  return `${value}.${mac}`;
}

export function verify(token: string | undefined | null): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const value = token.slice(0, i);
  const expected = sign(value);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,           // lax so the cookie survives the redirect back from Stripe
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

// Cache subscription status for a few minutes so we don't call Stripe on every page view.
const subCache = new Map<string, { active: boolean; until: number; cancelAt: number | null }>();

export async function subscriptionStatus(subId: string) {
  const now = Date.now();
  const hit = subCache.get(subId);
  if (hit && hit.until > now) return hit;
  try {
    const sub = await stripeClient().subscriptions.retrieve(subId);
    const active = sub.status === "active" || sub.status === "trialing";
    const cancelAt = sub.cancel_at ? sub.cancel_at * 1000 : null;
    const entry = { active, until: now + 5 * 60_000, cancelAt };
    subCache.set(subId, entry);
    return entry;
  } catch {
    return { active: false, until: now, cancelAt: null };
  }
}

export function clearSubscriptionCache(subId: string) {
  subCache.delete(subId);
}

const legacyCache = new Map<string, boolean>();
async function legacyReportPaid(sessionId: string): Promise<boolean> {
  if (legacyCache.has(sessionId)) return legacyCache.get(sessionId)!;
  try {
    const sess = await stripeClient().checkout.sessions.retrieve(sessionId);
    const ok = sess.payment_status === "paid" && sess.metadata?.product === "premium_report";
    legacyCache.set(sessionId, ok);
    return ok;
  } catch {
    return false;
  }
}

export interface AccessState {
  report: boolean;     // paid the one-time report
  premium: boolean;    // active Premium subscription
  subscriptionId: string | null;
  cancelAt: number | null;
}

export async function getAccess(req: NextRequest): Promise<AccessState> {
  const reportVal = verify(req.cookies.get(REPORT_COOKIE)?.value);
  const premiumVal = verify(req.cookies.get(PREMIUM_COOKIE)?.value);

  let report = !!reportVal && reportVal.startsWith("r:");

  // Backward compatibility: cookies set before the signed format held the raw Checkout
  // session id. Accept them only after Stripe confirms that session was really paid.
  const rawReport = req.cookies.get(REPORT_COOKIE)?.value;
  if (!report && rawReport && /^cs_(live|test)_[A-Za-z0-9]+$/.test(rawReport)) {
    report = await legacyReportPaid(rawReport);
  }
  let premium = false;
  let subscriptionId: string | null = null;
  let cancelAt: number | null = null;

  if (premiumVal && premiumVal.startsWith("s:")) {
    subscriptionId = premiumVal.slice(2);
    const st = await subscriptionStatus(subscriptionId);
    premium = st.active;
    cancelAt = st.cancelAt;
  }
  return { report, premium, subscriptionId, cancelAt };
}
