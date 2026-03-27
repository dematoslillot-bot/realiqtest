export const REPORT_PRICE = 9.99;
export const CURRENCY = "eur";

export interface PaymentResult {
  success: boolean;
  error?: string;
}

// This runs on the server (API route)
export async function createCheckoutSession(email: string): Promise<{ url: string }> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json();
}

// Verify payment on the server
export async function verifyPayment(sessionId: string): Promise<boolean> {
  const res = await fetch(`/api/verify?session_id=${sessionId}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.paid === true;
}