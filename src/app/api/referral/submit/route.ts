import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const db = supabaseAdmin || supabase;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      referrer_name,
      referrer_email,
      referrer_phone,
      referrer_city,
      student_name,
      student_phone,
      student_email,
      preferred_country,
      message,
      referral_code // from URL ?ref= param, passed by client
    } = body;

    if (!referrer_name || !referrer_phone || !student_name || !student_phone) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // Source detection: validate referral_code against students table
    // ─────────────────────────────────────────────────────────────────
    let source: "student_portal" | "public_website" = "public_website";
    let referrerStudentId: string | null = null;

    if (referral_code) {
      try {
        const { data: studentRow, error } = await db
          .from("students")
          .select("id, name, referral_code")
          .eq("referral_code", referral_code.trim().toUpperCase())
          .maybeSingle();

        if (!error && studentRow) {
          source = "student_portal";
          referrerStudentId = studentRow.id;
          console.log(`[Referral] Valid student code ${referral_code} → student ${studentRow.id}`);
        } else {
          console.warn(`[Referral] Code ${referral_code} not found in students — treating as public`);
        }
      } catch (lookupErr: any) {
        console.warn("[Referral] Student lookup error:", lookupErr.message);
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // Route to correct table
    // ─────────────────────────────────────────────────────────────────
    if (source === "student_portal" && referrerStudentId) {
      // Save to `referrals` table (student referral system)
      const { data, error } = await db
        .from("referrals")
        .insert([{
          referrer_student_id: referrerStudentId,
          referral_code: referral_code.trim().toUpperCase(),
          referred_name: student_name,
          referred_email: student_email || "",
          referred_phone: student_phone,
          preferred_country: preferred_country || "India",
          preferred_intake: "Not Specified",
          status: "lead",
          reward_amount: 0,
          notes: message || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select("*");

      if (error) {
        console.error("[Referral] Student referral insert error:", error.message);
        return NextResponse.json({ success: false, message: "Failed to save referral." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Referral submitted successfully!",
        source: "student_portal",
        referral: data?.[0] || {}
      });
    }

    // Public web referral → save to `public_referrals`
    const payload = {
      referrer_name,
      referrer_email: referrer_email || "",
      referrer_phone,
      referrer_city: referrer_city || "",
      student_name,
      student_phone,
      student_email: student_email || "",
      preferred_country: preferred_country || "India",
      message: message || "",
      status: "Pending",
      reward_amount: 10000,
      reward_status: "Not Eligible",
      contacted: false,
      deleted: false,
      created_at: new Date().toISOString()
    };

    const { data, error } = await db
      .from("public_referrals")
      .insert([payload])
      .select("*");

    if (error) {
      console.error("[Referral] Public referral insert error:", error.message);
      return NextResponse.json({ success: false, message: "Failed to save referral." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Referral submitted successfully!",
      source: "public_website",
      referral: data?.[0] || payload
    });
  } catch (err: any) {
    console.error("Public referral error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to submit referral." },
      { status: 500 }
    );
  }
}
