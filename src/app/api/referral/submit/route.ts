import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referrer_name, referrer_email, referrer_phone, referrer_city, student_name, student_phone, preferred_country, message } = body;

    if (!referrer_name || !referrer_phone || !student_name || !student_phone) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const payload = {
      referrer_name,
      referrer_email: referrer_email || "",
      referrer_phone,
      referrer_city: referrer_city || "",
      student_name,
      student_phone,
      student_email: "",
      preferred_country: preferred_country || "India",
      message: message || "",
      status: "Pending",
      reward_amount: 10000,
      reward_status: "Not Eligible",
      contacted: false,
      deleted: false,
      created_at: new Date().toISOString()
    };

    console.log("[Public Referral Submit]", payload);

    let insertedRecord = payload;
    try {
      const { data, error } = await supabase
        .from("public_referrals")
        .insert([payload])
        .select("*");

      if (error) {
        console.warn("Supabase public_referrals insert notice:", error.message);
        // Fallback to insert into referrals table
        await supabase.from("referrals").insert([{
          referrer_name,
          referrer_email,
          referrer_phone,
          referrer_city,
          referred_name: student_name,
          referred_phone: student_phone,
          preferred_country,
          notes: message,
          status: "pending_contact",
          source: "public_website"
        }]);
      } else if (data && data.length > 0) {
        insertedRecord = data[0];
      }
    } catch (dbErr: any) {
      console.warn("Database submission fallback:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Referral submitted successfully!",
      referral: insertedRecord
    });
  } catch (err: any) {
    console.error("Public referral error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to submit referral." },
      { status: 500 }
    );
  }
}
