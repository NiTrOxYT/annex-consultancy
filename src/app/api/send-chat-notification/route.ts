import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendStudentMessageEmail, sendCounselorMessageEmail, getEmailConfigStatus } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, senderType, studentId, messageContent, counselorName, messageId } = body;

    if (action === "health") {
      const { activeProvider } = getEmailConfigStatus();
      let provider = "Mocked (Local Console)";
      if (activeProvider === "brevo-smtp") {
        provider = "Brevo SMTP";
      }
      console.log(`[Diagnostic] Health check: email provider is configured as "${provider}"`);
      return NextResponse.json({ success: true, provider });
    }

    if (!senderType || !studentId || !messageContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch student info from Supabase (including assigned counselor)
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        name,
        email,
        counselor,
        counselor_id,
        counselors (
          full_name,
          email
        )
      `)
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found in database" }, { status: 404 });
    }

    let emailResult;
    let recipientEmail = student.email;

    if (senderType === "student") {
      const assignedCounselor = student.counselors as any;
      const counselorEmail = assignedCounselor?.email || process.env.EMAIL_TO_COUNSELOR || "counselor@annexconsultancy.com";
      recipientEmail = counselorEmail;
      
      console.log(`[Diagnostic] Student ${student.name} sent message. Directing email to assigned counselor: ${counselorEmail}`);
      emailResult = await sendStudentMessageEmail({
        studentName: student.name,
        studentEmail: student.email,
        messageContent,
        counselorEmail,
      });
    } else {
      const assignedCounselor = student.counselors as any;
      const name = counselorName || assignedCounselor?.full_name || student.counselor || "Annex Counselor";
      
      console.log(`[Diagnostic] Counselor ${name} sent reply to student: ${student.email}`);
      emailResult = await sendCounselorMessageEmail({
        counselorName: name,
        messageContent,
        studentEmail: student.email,
      });
    }

    // Insert log to message_notifications database for audit
    try {
      let finalMessageId = messageId;
      if (!finalMessageId) {
        const { data: latestMsg } = await supabase
          .from("student_messages")
          .select("id")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestMsg) {
          finalMessageId = latestMsg.id;
        }
      }

      if (finalMessageId) {
        await supabase.from("message_notifications").insert([{
          message_id: finalMessageId,
          notification_type: "email",
          recipient_email: recipientEmail,
          status: emailResult?.success ? "sent" : "failed",
          error_details: emailResult?.success ? null : (emailResult?.error || "Notification Failed")
        }]);
      }
    } catch (dbErr) {
      console.error("Failed to insert message notification log:", dbErr);
    }

    if (!emailResult?.success) {
      return NextResponse.json({
        success: false,
        error: emailResult?.error || "Email delivery failed",
        emailResult
      });
    }

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    console.error("API send-chat-notification failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

