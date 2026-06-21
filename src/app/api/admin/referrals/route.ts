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

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: "SUPABASE_SERVICE_ROLE_KEY is required to process administrative operations." 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // 1. Query Referrals List
    let referralsQuery = db
      .from("referrals")
      .select("*, students(name, email), referral_rewards(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "All") {
      referralsQuery = referralsQuery.eq("status", status);
    }

    const { data: referralsList, error: listErr } = await referralsQuery;
    if (listErr) throw listErr;

    // Apply search filters client side for flexibility (search on referred or referrer name)
    let filteredList = referralsList || [];
    if (search) {
      const q = search.toLowerCase();
      filteredList = filteredList.filter(r => 
        r.referred_name.toLowerCase().includes(q) ||
        r.referred_email.toLowerCase().includes(q) ||
        (r.students?.name || "").toLowerCase().includes(q) ||
        (r.students?.email || "").toLowerCase().includes(q)
      );
    }

    // 2. Fetch Raw Data for Analytics calculations
    const { data: allReferrals, error: allErr } = await db
      .from("referrals")
      .select("*, students(name, email), referral_rewards(*)");

    if (allErr) throw allErr;

    const list = allReferrals || [];
    const totalReferrals = list.length;

    // Enrollments count = status enrolled or status rewarded
    const enrollments = list.filter(r => r.status === "enrolled" || r.status === "rewarded").length;
    const conversionRate = totalReferrals > 0 ? Math.round((enrollments / totalReferrals) * 100) : 0;

    // Sum of paid rewards
    const { data: rewardsPaidList } = await db.from("referral_rewards").select("reward_amount");
    const rewardsPaid = (rewardsPaidList || []).reduce((sum, r) => sum + Number(r.reward_amount), 0);

    // Active Referrers (distinct student counts)
    const activeReferrersSet = new Set(list.map(r => r.referrer_student_id));
    const activeReferrers = activeReferrersSet.size;

    // Monthly Trend Calculations (last 6 months)
    const monthlyMap = new Map<string, number>();
    list.forEach(r => {
      const date = new Date(r.created_at);
      const key = date.toLocaleString("en-US", { month: "short", year: "2-digit" });
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
    });

    const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, count]) => ({
      month,
      count
    })).slice(-6); // Last 6 months

    // Funnel Stage Calculations
    const STAGES = ["lead", "contacted", "application_started", "offer_received", "visa_approved", "enrolled", "rewarded"];
    const funnelStages = STAGES.map(stage => {
      // Funnel shows count of referrals that reached OR passed this stage
      const count = list.filter(r => {
        const rIndex = STAGES.indexOf(r.status);
        const stageIndex = STAGES.indexOf(stage);
        return rIndex >= stageIndex;
      }).length;

      const percentage = totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0;

      return {
        stage: stage.charAt(0).toUpperCase() + stage.slice(1).replace("_", " "),
        count,
        percentage
      };
    });

    // Top Referrers calculations
    const referrerMap = new Map<string, { name: string; email: string; count: number; rewards: number }>();
    list.forEach(r => {
      if (!r.students) return;
      const key = r.referrer_student_id;
      const ref = referrerMap.get(key) || {
        name: r.students.name,
        email: r.students.email,
        count: 0,
        rewards: 0
      };

      ref.count += 1;
      ref.rewards += Number(r.reward_amount || 0);
      referrerMap.set(key, ref);
    });

    const topReferrers = Array.from(referrerMap.values())
      .map(r => ({
        referrerName: r.name,
        referrerEmail: r.email,
        referralsCount: r.count,
        rewardsTotal: r.rewards
      }))
      .sort((a, b) => b.referralsCount - a.referralsCount)
      .slice(0, 5); // Limit to top 5

    return NextResponse.json({
      success: true,
      referrals: filteredList,
      analytics: {
        totalReferrals,
        activeReferrers,
        enrollments,
        conversionRate,
        rewardsPaid,
        monthlyTrend,
        funnelStages,
        topReferrers
      }
    });
  } catch (err: any) {
    console.error("API GET Admin Referrals Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: "SUPABASE_SERVICE_ROLE_KEY is required to change statuses or approve rewards." 
      }, { status: 500 });
    }

    const body = await request.json();
    const { action } = body;

    // Action A: Change Referral Status
    if (action === "update-status") {
      const { referralId, status } = body;
      if (!referralId || !status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      // Fetch active referral
      const { data: referral, error: fetchErr } = await db
        .from("referrals")
        .select("*")
        .eq("id", referralId)
        .single();

      if (fetchErr || !referral) {
        return NextResponse.json({ error: "Referral not found" }, { status: 404 });
      }

      // Update status
      const { error: updateErr } = await db
        .from("referrals")
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", referralId);

      if (updateErr) throw updateErr;

      // Handle custom event notification triggers
      if (status === "enrolled") {
        await db.from("student_notifications").insert([{
          student_id: referral.referrer_student_id,
          title: "Referral Enrolled! 🎓",
          content: `Your referred candidate "${referral.referred_name}" has officially enrolled. You are now eligible to receive your reward!`
        }]);
      } else {
        await db.from("student_notifications").insert([{
          student_id: referral.referrer_student_id,
          title: "Referral Status Update",
          content: `Referred student "${referral.referred_name}" is now set to status: ${status.replace("_", " ")}.`
        }]);
      }

      // Activity logs
      await db.from("student_activity_logs").insert([{
        student_id: referral.referrer_student_id,
        action: "Referral Status Transitioned",
        details: `Referred: ${referral.referred_name}, Status: ${status}`
      }]);

      return NextResponse.json({ success: true, message: "Referral status updated successfully" });
    }

    // Action B: Issue Reward
    if (action === "issue-reward") {
      const { referralId, rewardAmount, rewardType, notes } = body;
      if (!referralId || !rewardAmount) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const amount = Number(rewardAmount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: "Reward amount must be a positive number" }, { status: 400 });
      }

      // Fetch referral
      const { data: referral, error: fetchErr } = await db
        .from("referrals")
        .select("*")
        .eq("id", referralId)
        .single();

      if (fetchErr || !referral) {
        return NextResponse.json({ error: "Referral not found" }, { status: 404 });
      }

      // Verify reward eligibility (enrolled or already rewarded is allowed)
      if (referral.status !== "enrolled" && referral.status !== "rewarded") {
        return NextResponse.json({ 
          error: `Referrals must be in Enrolled status before rewards can be approved. Current status is: ${referral.status}` 
        }, { status: 400 });
      }

      // Insert reward row (upsert/insert check since referral_id is unique)
      const { error: rewardErr } = await db
        .from("referral_rewards")
        .insert([{
          referral_id: referralId,
          reward_type: rewardType || "Cash",
          reward_amount: amount,
          notes: notes || null
        }]);

      if (rewardErr) {
        if (rewardErr.message.includes("unique")) {
          return NextResponse.json({ error: "A reward has already been issued for this referral." }, { status: 400 });
        }
        throw rewardErr;
      }

      // Update reward amount and status to rewarded on referrals table
      const { error: updateErr } = await db
        .from("referrals")
        .update({
          status: "rewarded",
          reward_amount: amount,
          updated_at: new Date().toISOString()
        })
        .eq("id", referralId);

      if (updateErr) throw updateErr;

      // In-app notifications
      await db.from("student_notifications").insert([{
        student_id: referral.referrer_student_id,
        title: "Referral Reward Approved! 🎁",
        content: `Your reward of $${amount} has been issued for referring "${referral.referred_name}"!`
      }]);

      // Activity logs
      await db.from("student_activity_logs").insert([{
        student_id: referral.referrer_student_id,
        action: "Referral Reward Issued",
        details: `Reward Amount: $${amount}, Referred: ${referral.referred_name}`
      }]);

      return NextResponse.json({ success: true, message: "Referral reward approved and issued successfully" });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("API POST Admin Referrals Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
