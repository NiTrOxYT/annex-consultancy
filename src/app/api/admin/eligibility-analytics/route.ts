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

    // 1. Fetch all counselors
    const { data: counselors, error: cErr } = await db
      .from("counselors")
      .select("id, full_name, email")
      .eq("is_active", true);
    if (cErr) throw cErr;

    // 2. Fetch all eligibility leads
    const { data: leads, error: lErr } = await db
      .from("eligibility_leads")
      .select("id, email, lead_status, lead_score, priority, assigned_counselor_id, response_time_minutes, utm_source, created_at");
    if (lErr) throw lErr;

    // 3. Fetch all active (incomplete) reminders
    const { data: activeReminders, error: rErr } = await db
      .from("eligibility_reminders")
      .select("id, lead_id, due_at")
      .eq("completed", false);
    if (rErr) throw rErr;

    // 4. Fetch all enrolled students emails to compute enrollment rate
    const { data: enrolledStudents, error: sErr } = await db
      .from("students")
      .select("email")
      .eq("current_stage", "Enrolled");
    if (sErr) throw sErr;

    const enrolledEmailsSet = new Set((enrolledStudents || []).map(s => s.email.toLowerCase()));

    // Fetch preview logs for conversion tracking
    const { data: previewLogs, error: previewErr } = await db
      .from("eligibility_preview_logs")
      .select("session_id, event_type");

    let previewViewedCount = 0;
    let resultsUnlockedCount = 0;
    let previewConversionRate = 0;

    if (!previewErr && previewLogs) {
      const viewedSessions = new Set();
      const unlockedSessions = new Set();

      previewLogs.forEach(log => {
        if (log.event_type === "preview_viewed") viewedSessions.add(log.session_id);
        if (log.event_type === "results_unlocked") unlockedSessions.add(log.session_id);
      });

      previewViewedCount = viewedSessions.size;
      resultsUnlockedCount = unlockedSessions.size;
      previewConversionRate = previewViewedCount > 0 
        ? Math.round((resultsUnlockedCount / previewViewedCount) * 100) 
        : 0;
    }

    // --- AGGREGATIONS ---

    // A. Funnel Metrics
    const totalLeads = leads?.length || 0;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let unqualifiedLeads = 0;
    let convertedLeads = 0;

    leads?.forEach(l => {
      switch (l.lead_status) {
        case "New": newLeads++; break;
        case "Contacted": contactedLeads++; break;
        case "Qualified": qualifiedLeads++; break;
        case "Unqualified": unqualifiedLeads++; break;
        case "Converted": convertedLeads++; break;
      }
    });

    const funnel = {
      total: totalLeads,
      new: newLeads,
      contacted: contactedLeads,
      qualified: qualifiedLeads,
      unqualified: unqualifiedLeads,
      converted: convertedLeads,
      conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
      previewViewedCount,
      resultsUnlockedCount,
      previewConversionRate
    };

    // B. Response Time Metrics
    let totalRespTime = 0;
    let respTimeCount = 0;
    const counselorRespTimes: { [counselorId: string]: { totalTime: number; count: number } } = {};

    leads?.forEach(l => {
      if (l.response_time_minutes !== null && l.response_time_minutes !== undefined) {
        const time = Number(l.response_time_minutes);
        totalRespTime += time;
        respTimeCount++;

        if (l.assigned_counselor_id) {
          if (!counselorRespTimes[l.assigned_counselor_id]) {
            counselorRespTimes[l.assigned_counselor_id] = { totalTime: 0, count: 0 };
          }
          counselorRespTimes[l.assigned_counselor_id].totalTime += time;
          counselorRespTimes[l.assigned_counselor_id].count++;
        }
      }
    });

    const avgResponseTime = respTimeCount > 0 ? Math.round(totalRespTime / respTimeCount) : 0;

    let fastestCounselor: string | null = null;
    let fastestTime = Infinity;
    let slowestCounselor: string | null = null;
    let slowestTime = -Infinity;

    counselors?.forEach(c => {
      const stats = counselorRespTimes[c.id];
      if (stats && stats.count > 0) {
        const avg = stats.totalTime / stats.count;
        if (avg < fastestTime) {
          fastestTime = avg;
          fastestCounselor = c.full_name;
        }
        if (avg > slowestTime) {
          slowestTime = avg;
          slowestCounselor = c.full_name;
        }
      }
    });

    const responseTimes = {
      average: avgResponseTime,
      fastest: fastestCounselor ? { name: fastestCounselor, time: Math.round(fastestTime) } : null,
      slowest: slowestCounselor ? { name: slowestCounselor, time: Math.round(slowestTime) } : null
    };

    // C. Counselor Workloads Widget
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    // Map reminders to lead IDs
    const reminderCountsByLead: { [leadId: string]: { overdue: number; today: number } } = {};
    activeReminders?.forEach(rem => {
      const dueTime = new Date(rem.due_at).getTime();
      if (!reminderCountsByLead[rem.lead_id]) {
        reminderCountsByLead[rem.lead_id] = { overdue: 0, today: 0 };
      }
      if (dueTime < startOfToday) {
        reminderCountsByLead[rem.lead_id].overdue++;
      } else if (dueTime >= startOfToday && dueTime <= endOfToday) {
        reminderCountsByLead[rem.lead_id].today++;
      }
    });

    const workloadMap: { [counselorId: string]: { totalActive: number; hotLeads: number; overdue: number; today: number } } = {};
    counselors?.forEach(c => {
      workloadMap[c.id] = { totalActive: 0, hotLeads: 0, overdue: 0, today: 0 };
    });

    leads?.forEach(l => {
      if (l.assigned_counselor_id && workloadMap[l.assigned_counselor_id]) {
        const isActive = ["New", "Contacted", "Qualified"].includes(l.lead_status);
        if (isActive) {
          workloadMap[l.assigned_counselor_id].totalActive++;
          if (l.lead_score === "Hot") {
            workloadMap[l.assigned_counselor_id].hotLeads++;
          }
          const rems = reminderCountsByLead[l.id];
          if (rems) {
            workloadMap[l.assigned_counselor_id].overdue += rems.overdue;
            workloadMap[l.assigned_counselor_id].today += rems.today;
          }
        }
      }
    });

    const counselorWorkloads = counselors?.map(c => ({
      id: c.id,
      name: c.full_name,
      email: c.email,
      ...workloadMap[c.id]
    })) || [];

    // D. Lead Source Quality Analytics
    // Standardize sources
    const standardizeSource = (src: string | null) => {
      if (!src) return "Direct";
      const s = src.toLowerCase();
      if (s.includes("google")) return "Google";
      if (s.includes("facebook") || s.includes("fb")) return "Facebook";
      if (s.includes("instagram") || s.includes("ig")) return "Instagram";
      if (s.includes("referral") || s.includes("refer")) return "Referral";
      if (s.includes("organic") || s.includes("seo") || s.includes("search")) return "Organic SEO";
      return "Direct"; // fallback for direct or others
    };

    const sourceStats: { [src: string]: { count: number; converted: number; enrolled: number } } = {
      "Google": { count: 0, converted: 0, enrolled: 0 },
      "Facebook": { count: 0, converted: 0, enrolled: 0 },
      "Instagram": { count: 0, converted: 0, enrolled: 0 },
      "Referral": { count: 0, converted: 0, enrolled: 0 },
      "Organic SEO": { count: 0, converted: 0, enrolled: 0 },
      "Direct": { count: 0, converted: 0, enrolled: 0 }
    };

    leads?.forEach(l => {
      const src = standardizeSource(l.utm_source);
      if (!sourceStats[src]) {
        sourceStats[src] = { count: 0, converted: 0, enrolled: 0 };
      }
      sourceStats[src].count++;
      
      if (l.lead_status === "Converted") {
        sourceStats[src].converted++;
      }
      if (enrolledEmailsSet.has(l.email.toLowerCase())) {
        sourceStats[src].enrolled++;
      }
    });

    const sourceQuality = Object.keys(sourceStats).map(source => {
      const stats = sourceStats[source];
      return {
        source,
        leadCount: stats.count,
        conversionRate: stats.count > 0 ? Math.round((stats.converted / stats.count) * 100) : 0,
        enrollmentRate: stats.count > 0 ? Math.round((stats.enrolled / stats.count) * 100) : 0
      };
    });

    // Shortlist requests analytics
    const { data: shortlistRequests } = await db
      .from("shortlist_requests")
      .select(`
        *,
        lead:eligibility_leads(preferred_country, preferred_course, lead_status)
      `);

    const sRequests = shortlistRequests || [];
    const totalRequests = sRequests.length;
    const generatedRequests = sRequests.filter(r => r.status === "Generated" || r.status === "Delivered" || r.generated_at).length;
    const deliveredRequests = sRequests.filter(r => r.status === "Delivered" || r.delivered_at).length;
    const deliveryRate = totalRequests > 0 ? Math.round((deliveredRequests / totalRequests) * 100) : 0;

    const convertedRequests = sRequests.filter(r => r.lead?.lead_status === "Converted").length;
    const consultationConversionRate = totalRequests > 0 ? Math.round((convertedRequests / totalRequests) * 100) : 0;

    const countryCounts: { [key: string]: number } = {};
    const courseCounts: { [key: string]: number } = {};
    sRequests.forEach(r => {
      if (r.lead) {
        const country = r.lead.preferred_country || "Unknown";
        const course = r.lead.preferred_course || "Unknown";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
        courseCounts[course] = (courseCounts[course] || 0) + 1;
      }
    });

    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topCourses = Object.entries(courseCounts)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const shortlistAnalytics = {
      totalRequests,
      generatedRequests,
      deliveredRequests,
      deliveryRate,
      consultationConversionRate,
      topCountries,
      topCourses
    };

    return NextResponse.json({
      success: true,
      funnel,
      responseTimes,
      counselorWorkloads,
      sourceQuality,
      shortlistAnalytics
    });
  } catch (err: any) {
    console.error("API GET Eligibility Analytics Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
