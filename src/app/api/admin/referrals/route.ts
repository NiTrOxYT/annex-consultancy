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
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("search");

    // 1. Fetch Public Referrals table
    let publicList: any[] = [];
    try {
      const { data, error } = await db
        .from("public_referrals")
        .select("*")
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      if (!error && data) {
        publicList = data.map((r: any) => ({
          ...r,
          source: "public_website",
          referred_name: r.student_name,
          referred_phone: r.student_phone,
          referred_email: r.student_email,
          status: r.status || "Pending"
        }));
      }
    } catch (e: any) {
      console.warn("Public referrals fetch note:", e.message);
    }

    // 2. Fetch Student Portal Referrals table
    let portalList: any[] = [];
    try {
      const { data, error } = await db
        .from("referrals")
        .select("*, students(name, email), referral_rewards(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        portalList = data.map((r: any) => ({
          ...r,
          source: r.source || (r.referrer_name ? "public_website" : "student_portal"),
          referrer_name: r.referrer_name || r.students?.name || "Student Referral",
          referrer_email: r.referrer_email || r.students?.email || "",
          referrer_phone: r.referrer_phone || "",
          student_name: r.referred_name,
          student_phone: r.referred_phone,
          student_email: r.referred_email,
          message: r.notes || ""
        }));
      }
    } catch (e: any) {
      console.warn("Portal referrals fetch note:", e.message);
    }

    // Merge lists by ID
    const combinedMap = new Map();
    publicList.forEach((r: any) => combinedMap.set(r.id, r));
    portalList.forEach((r: any) => combinedMap.set(r.id, r));
    let combined = Array.from(combinedMap.values());

    // Apply Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter((r: any) =>
        (r.referrer_name || "").toLowerCase().includes(q) ||
        (r.referrer_phone || "").toLowerCase().includes(q) ||
        (r.student_name || r.referred_name || "").toLowerCase().includes(q) ||
        (r.student_phone || r.referred_phone || "").toLowerCase().includes(q) ||
        (r.preferred_country || "").toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter && statusFilter !== "All") {
      combined = combined.filter((r: any) => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort descending by creation date
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Analytics Metrics
    const totalReferrals = combined.length;
    const pendingCount = combined.filter((r: any) => r.status === "Pending" || r.status === "lead" || r.status === "pending_contact").length;
    const contactedCount = combined.filter((r: any) => r.status === "Contacted" || r.status === "contacted").length;
    const convertedCount = combined.filter((r: any) => r.status === "Converted" || r.status === "enrolled" || r.status === "rewarded").length;
    const rewardsPaidCount = combined.filter((r: any) => r.status === "Reward Paid" || r.status === "rewarded" || r.status === "reward_paid").length;
    const rewardsPaidTotal = rewardsPaidCount * 10000;

    const conversionRate = totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0;

    return NextResponse.json({
      success: true,
      referrals: combined,
      analytics: {
        totalReferrals,
        pendingCount,
        contactedCount,
        convertedCount,
        rewardsPaidCount,
        rewardsPaid: rewardsPaidTotal,
        totalRewardsPaid: rewardsPaidTotal,
        conversionRate,
        activeReferrers: new Set(combined.map((r: any) => r.referrer_name || r.referrer_phone)).size
      }
    });
  } catch (err: any) {
    console.error("Admin referrals GET error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch referrals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const body = await request.json();
    const { action, referralId, status, notes, assigned_counselor, reward_status } = body;

    if (!referralId) {
      return NextResponse.json({ error: "Missing referralId" }, { status: 400 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (notes) updatePayload.notes = notes;
    if (assigned_counselor) updatePayload.assigned_counselor = assigned_counselor;
    if (reward_status) updatePayload.reward_status = reward_status;
    if (status === "Contacted") updatePayload.contacted = true;
    if (action === "delete") updatePayload.deleted = true;

    // Update public_referrals
    try {
      await db.from("public_referrals").update(updatePayload).eq("id", referralId);
    } catch (e: any) {
      console.warn("Update public_referrals fallback:", e.message);
    }

    // Update referrals
    try {
      await db.from("referrals").update(updatePayload).eq("id", referralId);
    } catch (e: any) {
      console.warn("Update referrals fallback:", e.message);
    }

    return NextResponse.json({ success: true, message: "Referral updated successfully" });
  } catch (err: any) {
    console.error("Admin referrals POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
