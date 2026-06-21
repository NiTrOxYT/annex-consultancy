import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

// GET: Retrieve notes for a lead
export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId parameter" }, { status: 400 });
    }

    const { data: notes, error: fetchErr } = await db
      .from("eligibility_notes")
      .select(`
        *,
        counselor:counselors(id, full_name, email)
      `)
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (fetchErr) throw fetchErr;

    return NextResponse.json({
      success: true,
      notes: notes || []
    });
  } catch (err: any) {
    console.error("API GET Eligibility Notes Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add a note to a lead
export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const currentCounselorId = authResult.counselorId || null;
    const body = await request.json();
    const { leadId, note } = body;

    if (!leadId || !note || note.trim() === "") {
      return NextResponse.json({ error: "Missing leadId or note content" }, { status: 400 });
    }

    // Insert note
    const { data: newNote, error: insertErr } = await db
      .from("eligibility_notes")
      .insert([{
        lead_id: leadId,
        counselor_id: currentCounselorId,
        note: note.trim()
      }])
      .select(`
        *,
        counselor:counselors(id, full_name, email)
      `)
      .single();

    if (insertErr || !newNote) throw insertErr || new Error("Failed to insert note");

    // Insert activity log
    const noteSummary = note.length > 50 ? `${note.substring(0, 50)}...` : note;
    await db.from("eligibility_activities").insert([{
      lead_id: leadId,
      activity_type: "Note Added",
      description: `Note added by counselor: "${noteSummary}"`,
      created_by: currentCounselorId
    }]);

    return NextResponse.json({
      success: true,
      note: newNote
    });
  } catch (err: any) {
    console.error("API POST Eligibility Note Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
