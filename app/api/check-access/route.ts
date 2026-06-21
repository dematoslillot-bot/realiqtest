import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("report_access");
  return NextResponse.json({ hasAccess: !!cookie?.value });
}
