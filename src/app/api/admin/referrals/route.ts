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

    // ─── 1. Public Web Referrals ───────────────────────────────────────
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

    // ─── 2. Student Portal Referrals ──────────────────────────────────
    let portalList: any[] = [];
    try {
      const { data, error } = await db
        .from("referrals")
        .select("*, students(name, email, referral_code), referral_rewards(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        portalList = data.map((r: any) => ({
          ...r,
          // ALWAYS tag student portal rows as student_portal
          source: "student_portal",
          referrer_name: r.students?.name || "Student",
          referrer_email: r.students?.email || "",
          referrer_phone: "",
          referral_code: r.referral_code || r.students?.referral_code || "",
          student_name: r.referred_name,
          student_phone: r.referred_phone,
          student_email: r.referred_email,
          message: r.notes || ""
        }));
      }
    } catch (e: any) {
      console.warn("Portal referrals fetch note:", e.message);
    }

    // ─── Combine (public first, then student) ─────────────────────────
    // Keep IDs unique — no merging required since they come from separate tables
    const combined = [...publicList, ...portalList];

    // Apply Search Filter
    let filtered = combined;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((r: any) =>
        (r.referrer_name || "").toLowerCase().includes(q) ||
        (r.referrer_phone || "").toLowerCase().includes(q) ||
        (r.student_name || r.referred_name || "").toLowerCase().includes(q) ||
        (r.student_phone || r.referred_phone || "").toLowerCase().includes(q) ||
        (r.preferred_country || "").toLowerCase().includes(q)
      );
    }

    // Apply Status Filter
    if (statusFilter && statusFilter !== "All") {
      filtered = filtered.filter((r: any) => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort descending by creation date
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Analytics
    const totalReferrals = filtered.length;
    const pendingCount = filtered.filter((r: any) =>
      ["pending", "lead", "pending_contact"].includes((r.status || "").toLowerCase())
    ).length;
    const contactedCount = filtered.filter((r: any) =>
      ["contacted"].includes((r.status || "").toLowerCase())
    ).length;
    const convertedCount = filtered.filter((r: any) =>
      ["converted", "enrolled", "rewarded", "reward paid"].includes((r.status || "").toLowerCase())
    ).length;
    const rewardsPaidCount = filtered.filter((r: any) =>
      ["reward paid", "rewarded", "reward_paid"].includes((r.status || "").toLowerCase())
    ).length;
    const rewardsPaidTotal = rewardsPaidCount * 10000;
    const conversionRate = totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0;

    return NextResponse.json({
      success: true,
      referrals: filtered,
      analytics: {
        totalReferrals,
        pendingCount,
        contactedCount,
        convertedCount,
        rewardsPaidCount,
        rewardsPaid: rewardsPaidTotal,
        totalRewardsPaid: rewardsPaidTotal,
        conversionRate,
        activeReferrers: new Set(filtered.map((r: any) => r.referrer_name || r.referrer_phone)).size
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
    const { action, referralId, source, status, notes, assigned_counselor, reward_status } = body;

    if (!referralId) {
      return NextResponse.json({ error: "Missing referralId" }, { status: 400 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    if (assigned_counselor) updatePayload.assigned_counselor = assigned_counselor;
    if (reward_status) updatePayload.reward_status = reward_status;
    if (status === "Contacted") updatePayload.contacted = true;
    if (action === "delete") updatePayload.deleted = true;

    // Route to correct table based on source field
    if (source === "student_portal") {
      await db.from("referrals").update(updatePayload).eq("id", referralId);
    } else if (source === "public_website") {
      await db.from("public_referrals").update(updatePayload).eq("id", referralId);
    } else {
      // Fallback: try both
      await db.from("public_referrals").update(updatePayload).eq("id", referralId);
      await db.from("referrals").update(updatePayload).eq("id", referralId);
    }

    return NextResponse.json({ success: true, message: "Referral updated successfully" });
  } catch (err: any) {
    console.error("Admin referrals POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
