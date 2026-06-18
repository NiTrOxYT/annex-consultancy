import { NextResponse } from "next/server";
import { getEmailConfigStatus } from "@/lib/email";

// Ensure this route is dynamic and fetches fresh environment configuration on call
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = getEmailConfigStatus();
    return NextResponse.json(config);
  } catch (err: any) {
    console.error("Failed to retrieve email config status:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
