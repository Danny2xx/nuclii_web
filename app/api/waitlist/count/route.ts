import { NextResponse } from "next/server";

import { getWaitlistCount } from "@/lib/waitlist-count";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getWaitlistCount();
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45" } },
  );
}
