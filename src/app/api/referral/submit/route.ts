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

    const newReferral = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      referrer_name,
      referrer_email: referrer_email || "",
      referrer_phone,
      referrer_city: referrer_city || "",
      referred_name: student_name,
      referred_phone: student_phone,
      referred_email: "",
      preferred_country: preferred_country || "India",
      notes: message || "Public website submission",
      status: "pending_contact",
      created_at: new Date().toISOString()
    };

    console.log("[Public Referral Submission]", newReferral);

    try {
      await supabase.from("referrals").insert([newReferral]);
    } catch (dbErr: any) {
      console.warn("DB insert fallback:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Referral submitted successfully!",
      referral: newReferral
    });
  } catch (err: any) {
    console.error("Referral submit API error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to submit referral." },
      { status: 500 }
    );
  }
}
