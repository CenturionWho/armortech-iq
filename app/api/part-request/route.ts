import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Part quote requests are temporarily unavailable here. Please contact service@armortechrepair.com.",
    },
    { status: 503 }
  );
}
