import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendStudentMessageEmail, sendCounselorMessageEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderType, studentId, messageContent, counselorName } = body;

    if (!senderType || !studentId || !messageContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch student info from Supabase
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("name, email, counselor")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found in database" }, { status: 404 });
    }

    let emailResult;
    if (senderType === "student") {
      const counselorEmail = process.env.EMAIL_TO_COUNSELOR || "counselor@annexconsultancy.com";
      emailResult = await sendStudentMessageEmail({
        studentName: student.name,
        studentEmail: student.email,
        messageContent,
        counselorEmail,
      });
    } else {
      const name = counselorName || student.counselor || "Annex Counselor";
      emailResult = await sendCounselorMessageEmail({
        counselorName: name,
        messageContent,
        studentEmail: student.email,
      });
    }

    // Insert log to database for notifications audit
    try {
      const { data: latestMsg } = await supabase
        .from("student_messages")
        .select("id")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestMsg) {
        await supabase.from("message_notifications").insert([{
          message_id: latestMsg.id,
          notification_type: "email",
          recipient_email: senderType === "student" ? (process.env.EMAIL_TO_COUNSELOR || "counselor@annexconsultancy.com") : student.email,
          status: emailResult?.success ? "sent" : "failed",
          error_details: emailResult?.success ? null : (emailResult?.error || "Notification Failed")
        }]);
      }
    } catch (dbErr) {
      console.error("Failed to insert message notification log:", dbErr);
    }

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    console.error("API send-chat-notification failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
