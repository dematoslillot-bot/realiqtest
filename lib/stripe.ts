// Client-side helpers for starting a Stripe Checkout.
export const REPORT_PRICE = 1.99;
export const PREMIUM_PRICE = 4.99;
export const CURRENCY = "eur";

export type Plan = "report" | "premium";

export async function startCheckout(plan: Plan, email?: string): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout");
  window.location.href = data.url;
}

export interface AccessInfo {
  hasAccess: boolean;
  report: boolean;
  premium: boolean;
  cancelAt: number | null;
  accessLink: string | null;
}

export async function fetchAccess(): Promise<AccessInfo> {
  try {
    const r = await fetch("/api/check-access", { cache: "no-store" });
    return await r.json();
  } catch {
    return { hasAccess: false, report: false, premium: false, cancelAt: null, accessLink: null };
  }
}
