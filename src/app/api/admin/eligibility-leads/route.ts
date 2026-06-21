import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

// GET: Fetch leads list with filters and search, or single lead detail
export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single lead detail fetch
    if (id) {
      const { data: lead, error: leadErr } = await db
        .from("eligibility_leads")
        .select(`
          *,
          assigned_counselor:counselors(id, full_name, email)
        `)
        .eq("id", id)
        .maybeSingle();

      if (leadErr) throw leadErr;
      if (!lead) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      // Fetch related records
      const { data: matches } = await db
        .from("eligibility_matches")
        .select("*")
        .eq("lead_id", id)
        .order("match_score", { ascending: false });

      const { data: reminders } = await db
        .from("eligibility_reminders")
        .select("*")
        .eq("lead_id", id)
        .order("due_at", { ascending: true });

      const { data: assignments } = await db
        .from("eligibility_assignments")
        .select(`
          *,
          old_counselor:counselors!eligibility_assignments_old_counselor_id_fkey(id, full_name),
          new_counselor:counselors!eligibility_assignments_new_counselor_id_fkey(id, full_name),
          assigned_by_counselor:counselors!eligibility_assignments_assigned_by_fkey(id, full_name)
        `)
        .eq("lead_id", id)
        .order("assigned_at", { ascending: false });

      const { data: activities } = await db
        .from("eligibility_activities")
        .select(`
          *,
          created_by_counselor:counselors(id, full_name)
        `)
        .eq("lead_id", id)
        .order("created_at", { ascending: false });

      const { data: notes } = await db
        .from("eligibility_notes")
        .select(`
          *,
          counselor:counselors(id, full_name)
        `)
        .eq("lead_id", id)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        success: true,
        lead,
        matches: matches || [],
        reminders: reminders || [],
        assignments: assignments || [],
        activities: activities || [],
        notes: notes || []
      });
    }

    // List view with filters
    const status = searchParams.get("status");
    const score = searchParams.get("score");
    const priority = searchParams.get("priority");
    const counselorId = searchParams.get("counselorId");
    const country = searchParams.get("country");
    const intake = searchParams.get("intake");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50"));
    const offset = (page - 1) * limit;

    let query = db
      .from("eligibility_leads")
      .select(`
        *,
        assigned_counselor:counselors(id, full_name, email)
      `, { count: "exact" });

    // Apply filters
    if (status) query = query.eq("lead_status", status);
    if (score) query = query.eq("lead_score", score);
    if (priority) query = query.eq("priority", priority);
    if (counselorId) query = query.eq("assigned_counselor_id", counselorId);
    if (country) query = query.eq("preferred_country", country);
    if (intake) query = query.eq("intake", intake);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Sort by created_at desc
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: leads, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      leads: leads || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (err: any) {
    console.error("API GET Eligibility Leads Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Single update or Bulk update of leads
export async function PATCH(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const currentCounselorId = authResult.counselorId || null;
    const body = await request.json();
    const { id, ids, lead_status, priority, assigned_counselor_id } = body;

    // A. Bulk action handling
    if (ids && Array.isArray(ids)) {
      if (ids.length === 0) {
        return NextResponse.json({ error: "No lead IDs provided" }, { status: 400 });
      }

      const updates: any = {};
      if (lead_status) updates.lead_status = lead_status;
      if (priority) updates.priority = priority;
      if (assigned_counselor_id !== undefined) updates.assigned_counselor_id = assigned_counselor_id || null;

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No fields to update provided" }, { status: 400 });
      }

      // For bulk updates, we iterate and perform updates to log histories correctly
      for (const leadId of ids) {
        // Fetch current state for assignment audit and first contact tracking
        const { data: currentLead } = await db
          .from("eligibility_leads")
          .select("assigned_counselor_id, lead_status, created_at, first_contacted_at, email")
          .eq("id", leadId)
          .single();

        if (!currentLead) continue;

        const leadUpdates: any = { ...updates };

        // Assignment History logging
        if (assigned_counselor_id !== undefined && currentLead.assigned_counselor_id !== assigned_counselor_id) {
          await db.from("eligibility_assignments").insert([{
            lead_id: leadId,
            old_counselor_id: currentLead.assigned_counselor_id,
            new_counselor_id: assigned_counselor_id || null,
            assigned_by: currentCounselorId
          }]);

          await db.from("eligibility_activities").insert([{
            lead_id: leadId,
            activity_type: "Counselor Assigned",
            description: `Lead reassigned in bulk.`,
            created_by: currentCounselorId
          }]);
        }

        // Response Time tracking
        if (lead_status === "Contacted" && currentLead.lead_status !== "Contacted" && !currentLead.first_contacted_at) {
          const nowStr = new Date().toISOString();
          leadUpdates.first_contacted_at = nowStr;
          leadUpdates.response_time_minutes = Math.round((new Date(nowStr).getTime() - new Date(currentLead.created_at).getTime()) / 60000);
          
          await db.from("eligibility_activities").insert([{
            lead_id: leadId,
            activity_type: "Status Changed",
            description: `Lead status updated to Contacted. Response time: ${leadUpdates.response_time_minutes} minutes.`,
            created_by: currentCounselorId
          }]);
        } else if (lead_status && currentLead.lead_status !== lead_status) {
          await db.from("eligibility_activities").insert([{
            lead_id: leadId,
            activity_type: "Status Changed",
            description: `Lead status updated to ${lead_status}.`,
            created_by: currentCounselorId
          }]);
        }

        // Conversion Cascade
        if (lead_status === "Converted" && currentLead.lead_status !== "Converted") {
          // Close reminders
          await db
            .from("eligibility_reminders")
            .update({
              completed: true,
              completed_at: new Date().toISOString(),
              completed_by: currentCounselorId,
              completion_note: "Auto-completed via Conversion"
            })
            .eq("lead_id", leadId)
            .eq("completed", false);

          // Update Referral status if exists
          await db
            .from("referrals")
            .update({ status: "enrolled", updated_at: new Date().toISOString() })
            .eq("referred_email", currentLead.email)
            .not("status", "eq", "rewarded");

          await db.from("eligibility_activities").insert([{
            lead_id: leadId,
            activity_type: "Converted",
            description: `Lead successfully converted! All pending reminders closed.`,
            created_by: currentCounselorId
          }]);
        }

        await db.from("eligibility_leads").update(leadUpdates).eq("id", leadId);
      }

      return NextResponse.json({ success: true, count: ids.length });
    }

    // B. Single update handling
    if (!id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }

    const { data: currentLead, error: currentErr } = await db
      .from("eligibility_leads")
      .select("assigned_counselor_id, lead_status, created_at, first_contacted_at, email")
      .eq("id", id)
      .maybeSingle();

    if (currentErr || !currentLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updates: any = {};
    if (lead_status) updates.lead_status = lead_status;
    if (priority) updates.priority = priority;
    if (assigned_counselor_id !== undefined) updates.assigned_counselor_id = assigned_counselor_id || null;

    // Assignment history logging
    if (assigned_counselor_id !== undefined && currentLead.assigned_counselor_id !== assigned_counselor_id) {
      await db.from("eligibility_assignments").insert([{
        lead_id: id,
        old_counselor_id: currentLead.assigned_counselor_id,
        new_counselor_id: assigned_counselor_id || null,
        assigned_by: currentCounselorId
      }]);

      await db.from("eligibility_activities").insert([{
        lead_id: id,
        activity_type: "Counselor Assigned",
        description: `Counselor reassigned by admin.`,
        created_by: currentCounselorId
      }]);
    }

    // Response time tracking
    if (lead_status === "Contacted" && currentLead.lead_status !== "Contacted" && !currentLead.first_contacted_at) {
      const nowStr = new Date().toISOString();
      updates.first_contacted_at = nowStr;
      updates.response_time_minutes = Math.round((new Date(nowStr).getTime() - new Date(currentLead.created_at).getTime()) / 60000);
      
      await db.from("eligibility_activities").insert([{
        lead_id: id,
        activity_type: "Status Changed",
        description: `Lead status updated to Contacted. Response time: ${updates.response_time_minutes} minutes.`,
        created_by: currentCounselorId
      }]);
    } else if (lead_status && currentLead.lead_status !== lead_status) {
      await db.from("eligibility_activities").insert([{
        lead_id: id,
        activity_type: "Status Changed",
        description: `Lead status updated to ${lead_status}.`,
        created_by: currentCounselorId
      }]);
    }

    // Conversion Cascade
    if (lead_status === "Converted" && currentLead.lead_status !== "Converted") {
      // Close reminders
      await db
        .from("eligibility_reminders")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          completed_by: currentCounselorId,
          completion_note: "Auto-completed via Conversion"
        })
        .eq("lead_id", id)
        .eq("completed", false);

      // Update Referral status if exists
      await db
        .from("referrals")
        .update({ status: "enrolled", updated_at: new Date().toISOString() })
        .eq("referred_email", currentLead.email)
        .not("status", "eq", "rewarded");

      await db.from("eligibility_activities").insert([{
        lead_id: id,
        activity_type: "Converted",
        description: `Lead successfully converted! All pending reminders closed.`,
        created_by: currentCounselorId
      }]);
    }

    // Perform database update
    const { error: updateErr } = await db
      .from("eligibility_leads")
      .update(updates)
      .eq("id", id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API PATCH Eligibility Leads Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
