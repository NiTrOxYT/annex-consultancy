import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// Resolve which client to use (service role client to bypass RLS, fallback to anon key)
const db = supabaseAdmin || supabase;

export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const trainingStudentId = searchParams.get("trainingStudentId");

    if (!studentId && !trainingStudentId) {
      // 1. Fetch global setting
      const { data: globalSetting, error: globalErr } = await db
        .from("system_settings")
        .select("value")
        .eq("key", "notifications_enabled")
        .maybeSingle();
      if (globalErr) throw globalErr;

      // 2. Fetch all history logs (limit to 200, with student/training_student details)
      const { data: history, error: histErr } = await db
        .from("notification_history")
        .select("*, students(name, email), training_students(student_name, student_email)")
        .order("sent_at", { ascending: false })
        .limit(200);
      if (histErr) throw histErr;

      return NextResponse.json({
        success: true,
        globalSetting: globalSetting || null,
        history: history || []
      });
    }

    const isTraining = !!trainingStudentId;
    const targetId = studentId || trainingStudentId;

    // 1. Fetch preferences
    const prefQuery = db.from("notification_preferences").select("*");
    if (isTraining) {
      prefQuery.eq("training_student_id", targetId);
    } else {
      prefQuery.eq("student_id", targetId);
    }
    const { data: prefs, error: prefErr } = await prefQuery.maybeSingle();
    if (prefErr) throw prefErr;

    // 2. Fetch history
    const histQuery = db.from("notification_history").select("*").order("sent_at", { ascending: false });
    if (isTraining) {
      histQuery.eq("training_student_id", targetId);
    } else {
      histQuery.eq("student_id", targetId);
    }
    const { data: history, error: histErr } = await histQuery;
    if (histErr) throw histErr;

    return NextResponse.json({
      success: true,
      preferences: prefs || null,
      history: history || []
    });
  } catch (err: any) {
    console.error("[API Admin GET Notifications Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "toggle-global") {
      const { enabled } = body;
      if (enabled === undefined) {
        return NextResponse.json({ error: "Missing enabled state" }, { status: 400 });
      }

      const { error } = await db
        .from("system_settings")
        .upsert([{ 
          key: "notifications_enabled", 
          value: String(enabled), 
          updated_at: new Date().toISOString() 
        }], { onConflict: "key" });

      if (error) throw error;
      return NextResponse.json({ success: true, message: `Global master switch is set to ${enabled}` });
    }

    if (action === "update-prefs") {
      const { studentId, trainingStudentId, key, value } = body;
      if (!studentId && !trainingStudentId) {
        return NextResponse.json({ error: "Missing studentId or trainingStudentId" }, { status: 400 });
      }
      if (!key) {
        return NextResponse.json({ error: "Missing preference key" }, { status: 400 });
      }

      const isTraining = !!trainingStudentId;
      const targetId = studentId || trainingStudentId;

      // Check if preference record exists
      const checkQuery = db.from("notification_preferences").select("*");
      if (isTraining) {
        checkQuery.eq("training_student_id", targetId);
      } else {
        checkQuery.eq("student_id", targetId);
      }
      const { data: existing, error: checkErr } = await checkQuery.maybeSingle();
      if (checkErr) throw checkErr;

      const payload: any = {
        [key]: value,
        updated_at: new Date().toISOString()
      };

      let error;
      if (existing) {
        const { error: err } = await db
          .from("notification_preferences")
          .update(payload)
          .eq("id", existing.id);
        error = err;
      } else {
        if (isTraining) {
          payload.training_student_id = targetId;
        } else {
          payload.student_id = targetId;
        }
        const { error: err } = await db
          .from("notification_preferences")
          .insert([payload]);
        error = err;
      }

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Student preferences updated successfully" });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("[API Admin POST Notifications Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
