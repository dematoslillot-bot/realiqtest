import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// In-memory rate limiter: 1 insert per IP per 60 seconds
const ipLastInsert = new Map<string, number>();

const VALID_COUNTRY = /^[A-Z]{0,3}$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const last = ipLastInsert.get(ip) ?? 0;
  if (now - last < 60_000) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { score?: unknown; country?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const score = Number(body.score);
  const country = String(body.country ?? "").toUpperCase().slice(0, 3);

  if (!Number.isInteger(score) || score < 60 || score > 148) {
    return NextResponse.json({ error: "Invalid score" }, { status: 400 });
  }
  if (!VALID_COUNTRY.test(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from("scores").insert({ score, country });
  if (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  ipLastInsert.set(ip, now);

  // Prune old entries to avoid unbounded growth
  if (ipLastInsert.size > 10_000) {
    const cutoff = now - 120_000;
    for (const [k, v] of ipLastInsert) {
      if (v < cutoff) ipLastInsert.delete(k);
    }
  }

  return NextResponse.json({ ok: true });
}
