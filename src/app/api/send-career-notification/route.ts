import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  sendCareerLeadNotification,
  sendCareerPortalActivationEmail,
  sendCareerTaskAssignedEmail,
  sendCareerTaskCompletedEmail,
  sendCareerMeetingScheduledEmail,
  sendCareerMessageEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentId, details } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required field: action" }, { status: 400 });
    }

    let emailResult;

    // 1. LEAD NOTIFICATION: When a lead is generated
    if (action === "lead") {
      const { leadName, leadEmail, leadPhone, serviceTitle } = details || {};
      if (!leadName || !leadEmail || !serviceTitle) {
        return NextResponse.json({ error: "Missing details for lead notification" }, { status: 400 });
      }

      // Email the administrative email (or fallback)
      const adminEmail = process.env.EMAIL_FROM || "admin@annexconsultancy.com";

      emailResult = await sendCareerLeadNotification({
        leadName,
        leadEmail,
        leadPhone,
        serviceTitle,
        adminEmail,
      });

      return NextResponse.json({ success: true, emailResult });
    }

    // For all other actions, we expect studentId to be present to query training_students
    if (!studentId) {
      return NextResponse.json({ error: "Missing required field: studentId" }, { status: 400 });
    }

    // Query training student details, their service, and their assigned consultant
    const { data: student, error: studentError } = await supabase
      .from("training_students")
      .select(`
        id,
        student_name,
        student_email,
        student_phone,
        status,
        training_services (
          title
        ),
        counselors (
          full_name,
          email
        )
      `)
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Training student not found" }, { status: 404 });
    }

    const serviceTitle = (student.training_services as any)?.title || "Career Placement Service";
    const consultant = student.counselors as any;
    const consultantName = consultant?.full_name || "Annex Career Advisor";
    const consultantEmail = consultant?.email || process.env.EMAIL_FROM || "noreply.annexconsultancy@gmail.com";

    // 2. ACTIVATED: Onboarding credentials email
    if (action === "activated") {
      const { password } = details || {};
      if (!password) {
        return NextResponse.json({ error: "Missing password detail for activation" }, { status: 400 });
      }

      emailResult = await sendCareerPortalActivationEmail({
        studentName: student.student_name,
        studentEmail: student.student_email,
        serviceTitle,
        password,
      });
    }

    // 3. TASK ASSIGNED
    else if (action === "task-assigned") {
      const { taskTitle, dueDate } = details || {};
      if (!taskTitle) {
        return NextResponse.json({ error: "Missing taskTitle detail" }, { status: 400 });
      }

      emailResult = await sendCareerTaskAssignedEmail({
        studentName: student.student_name,
        studentEmail: student.student_email,
        taskTitle,
        dueDate,
        consultantName,
      });
    }

    // 4. TASK COMPLETED
    else if (action === "task-completed") {
      const { taskTitle } = details || {};
      if (!taskTitle) {
        return NextResponse.json({ error: "Missing taskTitle detail" }, { status: 400 });
      }

      emailResult = await sendCareerTaskCompletedEmail({
        consultantEmail,
        studentName: student.student_name,
        taskTitle,
      });
    }

    // 5. MEETING SCHEDULED
    else if (action === "meeting-scheduled") {
      const { meetingTitle, scheduledAt, meetingLink, meetingType, durationMinutes } = details || {};
      if (!meetingTitle || !scheduledAt) {
        return NextResponse.json({ error: "Missing meetingTitle or scheduledAt details" }, { status: 400 });
      }

      const dt = new Date(scheduledAt);
      const meetingDate = dt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const meetingTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      emailResult = await sendCareerMeetingScheduledEmail({
        studentName: student.student_name,
        studentEmail: student.student_email,
        meetingTitle,
        meetingDate,
        meetingTime,
        meetingLink,
        consultantName,
        meetingType: meetingType || "Google Meet",
        duration: durationMinutes || 30,
      });
    }

    // 6. MESSAGE NOTIFICATION
    else if (action === "message") {
      const { messageContent, senderType } = details || {};
      if (!messageContent || !senderType) {
        return NextResponse.json({ error: "Missing messageContent or senderType details" }, { status: 400 });
      }

      const isStudent = senderType === "student";
      const recipientEmail = isStudent ? consultantEmail : student.student_email;
      const senderName = isStudent ? student.student_name : consultantName;

      emailResult = await sendCareerMessageEmail({
        recipientEmail,
        senderName,
        messageContent,
        isStudent,
      });
    }

    else {
      return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

    if (emailResult && !emailResult.success) {
      return NextResponse.json({
        success: false,
        error: emailResult.error || "Email sending failed",
        emailResult
      });
    }

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    console.error("API /api/send-career-notification failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
