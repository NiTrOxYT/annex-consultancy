import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const counselorId = searchParams.get("counselorId") || authResult.counselorId;

    if (!counselorId) {
      return NextResponse.json({ error: "Missing counselor reference" }, { status: 400 });
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);

    // Fetch all active reminders assigned to the counselor's leads
    const { data: reminders, error: fetchErr } = await db
      .from("eligibility_reminders")
      .select(`
        *,
        eligibility_leads!inner(id, name, phone, email, preferred_country, preferred_course, lead_score, priority, assigned_counselor_id)
      `)
      .eq("completed", false)
      .eq("eligibility_leads.assigned_counselor_id", counselorId)
      .order("due_at", { ascending: true });

    if (fetchErr) throw fetchErr;

    const overdue: any[] = [];
    const dueToday: any[] = [];
    const dueTomorrow: any[] = [];

    (reminders || []).forEach((rem: any) => {
      const due = new Date(rem.due_at);
      if (due < startOfToday) {
        overdue.push(rem);
      } else if (due >= startOfToday && due <= endOfToday) {
        dueToday.push(rem);
      } else if (due > endOfToday && due <= endOfTomorrow) {
        dueTomorrow.push(rem);
      }
    });

    return NextResponse.json({
      success: true,
      overdue,
      dueToday,
      dueTomorrow
    });
  } catch (err: any) {
    console.error("API GET Followups Today Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
