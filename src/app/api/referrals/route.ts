import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const studentId = searchParams.get("studentId");

    // Case 1: Public validation of referral code
    if (code) {
      const { data: student, error } = await db
        .from("students")
        .select("id, name")
        .eq("referral_code", code.trim())
        .maybeSingle();

      if (error) {
        console.error("Error validating referral code:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!student) {
        return NextResponse.json({ success: true, valid: false });
      }

      return NextResponse.json({
        success: true,
        valid: true,
        referrerName: student.name,
        referrerId: student.id
      });
    }

    // Case 2: Fetch referrals history for a specific student dashboard
    if (studentId) {
      // Fetch matching referrals
      const { data: referrals, error: refErr } = await db
        .from("referrals")
        .select("*, referral_rewards(*)")
        .eq("referrer_student_id", studentId)
        .order("created_at", { ascending: false });

      if (refErr) throw refErr;

      return NextResponse.json({
        success: true,
        referrals: referrals || []
      });
    }

    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  } catch (err: any) {
    console.error("API GET Referrals Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      referrerCode, 
      referredName, 
      referredEmail, 
      referredPhone, 
      preferredCountry, 
      preferredIntake, 
      notes 
    } = body;

    if (!referrerCode || !referredName || !referredEmail || !preferredCountry || !preferredIntake) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate referrer code and fetch student ID
    const { data: referrer, error: refError } = await db
      .from("students")
      .select("id, name, email")
      .eq("referral_code", referrerCode.trim())
      .maybeSingle();

    if (refError || !referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    // 2. Prevent self-referral
    if (referredEmail.trim().toLowerCase() === referrer.email.toLowerCase()) {
      return NextResponse.json({ error: "You cannot refer yourself." }, { status: 400 });
    }

    // 3. Prevent duplicate active referrals for same referred email
    const { data: existingReferral } = await db
      .from("referrals")
      .select("id")
      .eq("referred_email", referredEmail.trim().toLowerCase())
      .maybeSingle();

    if (existingReferral) {
      return NextResponse.json({ error: "This student has already been referred." }, { status: 400 });
    }

    // 4. Create referrals record
    const { data: newReferral, error: insertErr } = await db
      .from("referrals")
      .insert([{
        referrer_student_id: referrer.id,
        referral_code: referrerCode.trim(),
        referred_name: referredName.trim(),
        referred_email: referredEmail.trim().toLowerCase(),
        referred_phone: referredPhone ? referredPhone.trim() : null,
        preferred_country: preferredCountry,
        preferred_intake: preferredIntake,
        status: "lead",
        reward_amount: 0,
        notes: notes ? notes.trim() : null
      }])
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 5. In-App Notifications Integration: Notify Referrer
    try {
      await db.from("student_notifications").insert([{
        student_id: referrer.id,
        title: "New Referral Submitted! 🎉",
        content: `Your referral for "${referredName}" was submitted. Track status under Referrals tab.`
      }]);
    } catch (notifErr) {
      console.warn("Failed to create student notification for referral:", notifErr);
    }

    // 6. Log Activity for the student
    try {
      await db.from("student_activity_logs").insert([{
        student_id: referrer.id,
        action: "Referral Submitted",
        details: `Referred: ${referredName} (${referredEmail})`
      }]);
    } catch (logErr) {
      console.warn("Failed to write activity log:", logErr);
    }

    return NextResponse.json({ success: true, referral: newReferral });
  } catch (err: any) {
    console.error("API POST Referrals Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
