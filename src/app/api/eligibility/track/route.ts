import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, session_id } = body;

    if (!event_type || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["preview_viewed", "results_unlocked"].includes(event_type)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    // Insert log row
    const { error } = await db
      .from("eligibility_preview_logs")
      .insert([{
        session_id,
        event_type,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("Failed to log eligibility event to database:", error);
      // Fail gracefully so client tracking does not break UX
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API POST Track Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
