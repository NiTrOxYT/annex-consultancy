import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";
import PDFDocument from "pdfkit";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

// Helper to escape HTML tags for logs/emails
function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// GET: List shortlist requests
export async function GET(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const counselorId = searchParams.get("counselorId");

    let query = db
      .from("shortlist_requests")
      .select(`
        *,
        lead:eligibility_leads(*),
        counselor:counselors(id, full_name, email)
      `);

    if (status && status !== "All") {
      query = query.eq("status", status);
    }
    if (counselorId && counselorId !== "All") {
      query = query.eq("counselor_id", counselorId);
    }

    query = query.order("requested_at", { ascending: false });

    const { data: requests, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      requests: requests || []
    });
  } catch (err: any) {
    console.error("API GET Shortlist Requests Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Generate PDF for a request
export async function POST(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const currentCounselorId = authResult.counselorId || null;
    const body = await request.json();
    const { requestId, leadId } = body;

    if (!requestId || !leadId) {
      return NextResponse.json({ error: "Missing requestId or leadId" }, { status: 400 });
    }

    // 1. Fetch Lead details with counselor
    const { data: lead, error: leadErr } = await db
      .from("eligibility_leads")
      .select(`
        *,
        counselor:counselors(id, full_name, email, phone)
      `)
      .eq("id", leadId)
      .single();

    if (leadErr || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // 2. Fetch matched universities
    const { data: matches, error: matchesErr } = await db
      .from("eligibility_matches")
      .select("*")
      .eq("lead_id", leadId)
      .order("match_score", { ascending: false });

    if (matchesErr) throw matchesErr;

    // Load full details for universities in matches
    const uniIds = matches?.map(m => m.university_id) || [];
    const { data: universitiesList } = await db
      .from("universities")
      .select("*")
      .in("id", uniIds);

    const universitiesMap = new Map(universitiesList?.map(u => [u.id, u]) || []);

    // 3. Compile PDF using PDFKit
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Draw Layout & Colors
      const navyColor = "#0B1F3A";
      const goldColor = "#D4AF37";
      const slateColor = "#334155";
      const lightBg = "#F8FAFC";
      const borderGray = "#E2E8F0";

      // Helper for headers
      const drawHeader = () => {
        // Draw top header bar
        doc.rect(40, 40, 515, 60).fill(navyColor);
        doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(18).text("ANNEX CONSULTANCY", 60, 52);
        doc.fillColor(goldColor).font("Helvetica").fontSize(10).text("PERSONALIZED UNIVERSITY SHORTLIST", 60, 75);
        doc.y = 120;
      };

      // Helper for footers
      const drawFooter = (pageNum: number, totalPages: number) => {
        doc.strokeColor(borderGray).lineWidth(0.5).moveTo(40, 800).lineTo(555, 800).stroke();
        doc.fillColor("#94A3B8").font("Helvetica").fontSize(8)
          .text("Annex Consultancy — Global Overseas Education", 40, 810)
          .text(`Page ${pageNum} of ${totalPages}`, 500, 810, { align: "right" });
      };

      // Page 1
      drawHeader();

      // Student summary details grid
      doc.fillColor(navyColor).font("Helvetica-Bold").fontSize(12).text("STUDENT PROFILE DETAILS", 40, doc.y);
      doc.strokeColor(goldColor).lineWidth(1.5).moveTo(40, doc.y + 5).lineTo(555, doc.y + 5).stroke();
      doc.y += 15;

      // Student summary details container
      doc.rect(40, doc.y, 515, 95).fill(lightBg);
      doc.strokeColor(borderGray).lineWidth(1).rect(40, doc.y, 515, 95).stroke();

      doc.fillColor(slateColor).font("Helvetica-Bold").fontSize(9);
      doc.text("Student Name:", 60, doc.y + 15).font("Helvetica").text(lead.name, 150, doc.y + 15);
      doc.font("Helvetica-Bold").text("Preferred Country:", 310, doc.y + 15).font("Helvetica").text(lead.preferred_country, 410, doc.y + 15);
      
      doc.font("Helvetica-Bold").text("Preferred Course:", 60, doc.y + 35).font("Helvetica").text(lead.preferred_course, 150, doc.y + 35);
      doc.font("Helvetica-Bold").text("Acas Intake:", 310, doc.y + 35).font("Helvetica").text(lead.intake, 410, doc.y + 35);
      
      doc.font("Helvetica-Bold").text("Academics:", 60, doc.y + 55).font("Helvetica").text(`${lead.qualification} (${lead.percentage}%)`, 150, doc.y + 55);
      doc.font("Helvetica-Bold").text("Test Score:", 310, doc.y + 55).font("Helvetica").text(lead.test_type ? `${lead.test_type}: ${lead.test_score}` : "Not Taken", 410, doc.y + 55);

      doc.font("Helvetica-Bold").text("Target Budget:", 60, doc.y + 75).font("Helvetica").text(`${lead.currency} ${Number(lead.budget).toLocaleString()}`, 150, doc.y + 75);
      doc.font("Helvetica-Bold").text("Report Date:", 310, doc.y + 75).font("Helvetica").text(new Date().toLocaleDateString(), 410, doc.y + 75);

      doc.y += 120;

      // Match List Section
      doc.fillColor(navyColor).font("Helvetica-Bold").fontSize(12).text("RECOMMENDED UNIVERSITY LIST", 40, doc.y);
      doc.strokeColor(goldColor).lineWidth(1.5).moveTo(40, doc.y + 5).lineTo(555, doc.y + 5).stroke();
      doc.y += 20;

      let cardIndex = 0;
      const displayMatches = matches?.slice(0, 5) || [];

      displayMatches.forEach((m) => {
        const uni = universitiesMap.get(m.university_id);
        
        // Add page break if needed
        if (doc.y > 600) {
          doc.addPage();
          drawHeader();
          doc.y += 10;
        }

        // Draw university card container
        const cardTop = doc.y;
        doc.rect(40, cardTop, 515, 140).fill(lightBg);
        doc.strokeColor(borderGray).lineWidth(1).rect(40, cardTop, 515, 140).stroke();

        // Left vertical indicator
        doc.rect(40, cardTop, 5, 140).fill(m.admission_chance === "Safe" ? "#10B981" : m.admission_chance === "Target" ? "#F59E0B" : "#EF4444");

        // University Name & Location
        doc.fillColor(navyColor).font("Helvetica-Bold").fontSize(11).text(m.university_name_snapshot, 60, cardTop + 12);
        doc.fillColor(slateColor).font("Helvetica-Oblique").fontSize(8.5).text(`${uni?.city || ""}, ${uni?.country || lead.preferred_country}`, 60, cardTop + 26);

        // Score badges
        doc.fillColor(goldColor).font("Helvetica-Bold").fontSize(9.5).text(`Match Score: ${m.match_score}%`, 380, cardTop + 12, { align: "right", width: 155 });
        doc.fillColor(slateColor).font("Helvetica").fontSize(8.5).text(`Chance: ${m.admission_chance}`, 380, cardTop + 26, { align: "right", width: 155 });

        // University specific details
        doc.fillColor(slateColor).font("Helvetica-Bold").fontSize(8.5);
        doc.text("Tuition Fee:", 60, cardTop + 45).font("Helvetica").text(uni?.total_fees || "Check Website", 140, cardTop + 45);
        doc.font("Helvetica-Bold").text("Scholarship:", 60, cardTop + 58).font("Helvetica").text(m.scholarship_estimate || "Bursaries Available", 140, cardTop + 58);
        doc.font("Helvetica-Bold").text("Requirements:", 60, cardTop + 71).font("Helvetica").text(uni?.cutoff || "Minimum qualification cutoffs apply", 140, cardTop + 71);
        doc.font("Helvetica-Bold").text("Deadline:", 60, cardTop + 84).font("Helvetica").text(uni?.application_deadline || "Rolling Intakes", 140, cardTop + 84);

        // Highlight recommended notes box
        const recommendText = uni?.description || `We recommend ${m.university_name_snapshot} based on its excellent ${lead.preferred_course} placements rate, course specifications, and positive matching with your ${lead.qualification} credentials.`;
        doc.rect(60, cardTop + 98, 475, 32).fill("#FFFFFF");
        doc.strokeColor(borderGray).lineWidth(0.5).rect(60, cardTop + 98, 475, 32).stroke();
        doc.rect(60, cardTop + 98, 3, 32).fill(goldColor);
        doc.fillColor(slateColor).font("Helvetica-Oblique").fontSize(7.5).text(recommendText, 72, cardTop + 104, { width: 450, height: 22, ellipsis: true });

        doc.y = cardTop + 155;
        cardIndex++;
      });

      // Page Break for Counselor section
      doc.addPage();
      drawHeader();

      // Counselor section title
      doc.fillColor(navyColor).font("Helvetica-Bold").fontSize(12).text("YOUR ASSIGNED EDUCATION COUNSELOR", 40, doc.y);
      doc.strokeColor(goldColor).lineWidth(1.5).moveTo(40, doc.y + 5).lineTo(555, doc.y + 5).stroke();
      doc.y += 15;

      const counselorName = lead.counselor?.full_name || "Annex Counselor Team";
      const counselorEmail = lead.counselor?.email || "admissions@annexconsultancy.com";
      const counselorPhone = lead.counselor?.phone || "+977 1 4545450";
      const counselorWhatsApp = lead.counselor?.phone ? `https://wa.me/${lead.counselor.phone.replace(/[^0-9]/g, "")}` : "https://wa.me/9779800000000";

      // Draw Counselor info board
      doc.rect(40, doc.y, 515, 120).fill(lightBg);
      doc.strokeColor(borderGray).lineWidth(1).rect(40, doc.y, 515, 120).stroke();

      doc.fillColor(navyColor).font("Helvetica-Bold").fontSize(13).text(counselorName, 60, doc.y + 20);
      doc.fillColor(slateColor).font("Helvetica").fontSize(9).text("Assigned Study Abroad Counselor", 60, doc.y + 36);

      doc.font("Helvetica-Bold").fontSize(9).text("Email Address:", 60, doc.y + 60).font("Helvetica").text(counselorEmail, 150, doc.y + 60);
      doc.font("Helvetica-Bold").fontSize(9).text("Phone Connection:", 60, doc.y + 75).font("Helvetica").text(counselorPhone, 150, doc.y + 75);
      doc.font("Helvetica-Bold").fontSize(9).text("Direct WhatsApp:", 60, doc.y + 90).font("Helvetica").text("Send a message directly for instant updates", 150, doc.y + 90);

      doc.y += 150;

      // CTA Box
      doc.rect(40, doc.y, 515, 80).fill(navyColor);
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(13).text("READY TO APPLY? BOOK A FREE CONSULTATION NOW", 60, doc.y + 22);
      doc.fillColor(goldColor).font("Helvetica").fontSize(9).text("Contact your counselor to start university applications, scholarship setups, and visa document verification.", 60, doc.y + 42);

      // Loop through all pages to draw footers
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        drawFooter(i + 1, range.count);
      }

      doc.end();
    });

    // 4. Upload buffer to Supabase Storage (public student-files bucket)
    const filePath = `shortlists/${leadId}.pdf`;
    const { data: storageData, error: uploadErr } = await db.storage
      .from("student-files")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadErr) {
      throw uploadErr;
    }

    // Get Public URL
    const { data: { publicUrl } } = db.storage
      .from("student-files")
      .getPublicUrl(filePath);

    // 5. Update shortlist request status in database
    const { error: updateErr } = await db
      .from("shortlist_requests")
      .update({
        status: "Generated",
        pdf_url: publicUrl,
        generated_at: new Date().toISOString()
      })
      .eq("id", requestId);

    if (updateErr) throw updateErr;

    // 6. Log activity
    await db.from("eligibility_activities").insert([{
      lead_id: leadId,
      activity_type: "Shortlist PDF Generated",
      description: `Counselor generated shortlist PDF.`,
      created_by: currentCounselorId
    }]);

    // Future-ready hooks for automated delivery:
    // email.send({ to: lead.email, attachment: pdfBuffer });
    // whatsapp.send({ to: lead.phone, url: publicUrl });

    return NextResponse.json({
      success: true,
      pdfUrl: publicUrl
    });
  } catch (err: any) {
    console.error("API POST Generate Shortlist PDF Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update request status
export async function PATCH(request: Request) {
  try {
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const currentCounselorId = authResult.counselorId || null;
    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing requestId or status" }, { status: 400 });
    }

    // Check existing request
    const { data: currentReq, error: reqErr } = await db
      .from("shortlist_requests")
      .select("lead_id, status")
      .eq("id", requestId)
      .single();

    if (reqErr || !currentReq) {
      return NextResponse.json({ error: "Shortlist request not found" }, { status: 404 });
    }

    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === "Delivered") {
      updates.delivered_at = new Date().toISOString();
    }

    // Update in database
    const { error: updateErr } = await db
      .from("shortlist_requests")
      .update(updates)
      .eq("id", requestId);

    if (updateErr) throw updateErr;

    // Log activity
    if (status === "Delivered") {
      await db.from("eligibility_activities").insert([{
        lead_id: currentReq.lead_id,
        activity_type: "Shortlist PDF Delivered",
        description: "Shortlist PDF was delivered to student.",
        created_by: currentCounselorId
      }]);
    } else {
      await db.from("eligibility_activities").insert([{
        lead_id: currentReq.lead_id,
        activity_type: "Status Changed",
        description: `Shortlist request status updated to ${status}.`,
        created_by: currentCounselorId
      }]);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API PATCH Shortlist Request Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
