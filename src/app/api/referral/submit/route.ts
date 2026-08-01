import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referrer_name, referrer_email, referrer_phone, referrer_city, student_name, student_phone, preferred_country, message } = body;

    if (!referrer_name || !referrer_phone || !student_name || !student_phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    console.log("[Public Referral Submission]", {
      referrer_name,
      referrer_email,
      referrer_phone,
      referrer_city,
      student_name,
      student_phone,
      preferred_country,
      message,
      timestamp: new Date().toISOString()
    });

    // Optionally insert into student_referrals or referrals table if available
    try {
      await supabase.from("referrals").insert([{
        referrer_name,
        referrer_email,
        referrer_phone,
        referrer_city,
        referred_name: student_name,
        referred_phone: student_phone,
        preferred_country: preferred_country || "India",
        notes: message || "Public website submission",
        status: "pending_contact",
        created_at: new Date().toISOString()
      }]);
    } catch (dbErr: any) {
      console.warn("Database insert skipped or schema fallback:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Referral submitted successfully! Our team will get in touch shortly."
    });
  } catch (err: any) {
    console.error("Referral submit API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to submit referral." },
      { status: 500 }
    );
  }
}
