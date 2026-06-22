import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail, escapeHtml } from "@/lib/email";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }

    // 1. Fetch eligibility lead & counselor details
    const { data: lead, error: leadErr } = await db
      .from("eligibility_leads")
      .select(`
        *,
        assigned_counselor:counselors(id, full_name, email, phone)
      `)
      .eq("id", leadId)
      .maybeSingle();

    if (leadErr || !lead) {
      return NextResponse.json({ error: "Eligibility lead not found" }, { status: 404 });
    }

    const counselor = lead.assigned_counselor;
    const counselorId = counselor?.id || null;

    // 2. Check if shortlist request already exists
    const { data: existingRequest, error: checkErr } = await db
      .from("shortlist_requests")
      .select("*")
      .eq("lead_id", leadId)
      .maybeSingle();

    if (existingRequest) {
      // If it exists, return it to the client to avoid duplicates
      return NextResponse.json({
        success: true,
        message: "Shortlist request already exists",
        request: existingRequest,
        counselor: counselor ? {
          name: counselor.full_name,
          email: counselor.email,
          phone: counselor.phone
        } : null
      });
    }

    // 3. Create new shortlist request
    const { data: newRequest, error: insertErr } = await db
      .from("shortlist_requests")
      .insert([{
        lead_id: leadId,
        counselor_id: counselorId,
        status: "Requested",
        requested_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertErr || !newRequest) {
      throw insertErr || new Error("Failed to insert shortlist request");
    }

    // 4. Log activity "Shortlist Requested"
    await db.from("eligibility_activities").insert([{
      lead_id: leadId,
      activity_type: "Shortlist Requested",
      description: "Student requested counselor-reviewed university shortlist.",
      created_by: null
    }]);

    // 5. Notify assigned counselor via email
    if (counselor && counselor.email) {
      try {
        const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://annex-consultancy.vercel.app"}/admin/eligibility`;
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-bottom: 8px;">📋 New Shortlist Review Requested</h2>
            <p style="color: #475569; font-size: 14px;">Hello <strong>${escapeHtml(counselor.full_name)}</strong>,</p>
            <p style="color: #475569; font-size: 14px;">A student has submitted their profile on the Study Abroad Eligibility Calculator and requested a premium, counselor-reviewed university shortlist PDF.</p>
            
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
              <p style="margin: 0 0 8px 0;"><strong>Student Name:</strong> ${escapeHtml(lead.name)}</p>
              <p style="margin: 0 0 8px 0;"><strong>Preferred Country:</strong> ${escapeHtml(lead.preferred_country)}</p>
              <p style="margin: 0 0 8px 0;"><strong>Preferred Course:</strong> ${escapeHtml(lead.preferred_course)}</p>
              <p style="margin: 0 0 8px 0;"><strong>Academics:</strong> ${escapeHtml(lead.qualification)} (${lead.percentage}%)</p>
              <p style="margin: 0 0 8px 0;"><strong>Budget:</strong> ${lead.currency} ${Number(lead.budget).toLocaleString()}</p>
              <p style="margin: 0;"><strong>English Score:</strong> ${lead.test_type ? `${lead.test_type}: ${lead.test_score}` : "None"}</p>
            </div>
            
            <p style="color: #475569; font-size: 13px;">Please log in to the admin portal to review this lead's matched universities, customize the recommendations, generate the shortlist PDF, and mark it as delivered.</p>
            
            <div style="text-align: center; margin: 24px 0;">
              <a href="${portalUrl}" style="display: inline-block; background-color: #0B1F3A; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Open Leads Workspace
              </a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated counselor alert from the Annex Consultancy portal.</p>
          </div>
        `;

        await sendEmail({
          to: counselor.email,
          subject: `New Shortlist Request: ${lead.name} — Review Required`,
          html: emailHtml
        });
      } catch (mailErr: any) {
        console.error("Failed to notify counselor via email:", mailErr.message);
      }
    }

    // Future-ready webhook hooks or automated follow-up triggers go here:
    // webhook.dispatch('shortlist.requested', { leadId, counselorId, requestId: newRequest.id });

    return NextResponse.json({
      success: true,
      request: newRequest,
      counselor: counselor ? {
        name: counselor.full_name,
        email: counselor.email,
        phone: counselor.phone
      } : null
    });
  } catch (err: any) {
    console.error("API POST Shortlist Request Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
