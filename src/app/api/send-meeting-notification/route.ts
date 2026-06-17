import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  sendMeetingScheduledEmail,
  sendMeetingUpdatedEmail,
  sendMeetingCancelledEmail,
  sendMeetingReminderEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, meetingId, studentId, meetingData } = body;

    // ── Reminder action: Find upcoming meetings within 1 hour ──
    if (action === "send-reminders") {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      const { data: upcomingMeetings, error: fetchErr } = await supabase
        .from("meetings")
        .select(`
          *,
          students ( name, email ),
          counselors ( full_name )
        `)
        .eq("status", "Scheduled")
        .gte("scheduled_at", now.toISOString())
        .lte("scheduled_at", oneHourLater.toISOString());

      if (fetchErr) throw fetchErr;

      let sentCount = 0;
      for (const meeting of upcomingMeetings || []) {
        const student = meeting.students as any;
        const counselor = meeting.counselors as any;
        if (!student?.email) continue;

        const dt = new Date(meeting.scheduled_at);
        await sendMeetingReminderEmail({
          studentEmail: student.email,
          studentName: student.name,
          meetingTitle: meeting.title,
          meetingDate: dt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          meetingTime: dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          meetingLink: meeting.meeting_link || undefined,
          counselorName: counselor?.full_name || "Annex Counselor",
          meetingType: meeting.meeting_type,
        });
        sentCount++;
      }

      return NextResponse.json({ success: true, remindersSent: sentCount });
    }

    // ── Standard meeting notification ──
    if (!action || !studentId) {
      return NextResponse.json({ error: "Missing required fields (action, studentId)" }, { status: 400 });
    }

    // Fetch student info
    const { data: student, error: studentErr } = await supabase
      .from("students")
      .select(`
        name,
        email,
        counselor,
        counselor_id,
        counselors ( full_name, email )
      `)
      .eq("id", studentId)
      .single();

    if (studentErr || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const counselor = student.counselors as any;
    const counselorName = counselor?.full_name || student.counselor || "Annex Counselor";

    // Reconstruct meeting details
    const dt = meetingData?.scheduled_at ? new Date(meetingData.scheduled_at) : new Date();
    const meetingDate = dt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const meetingTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    let emailResult;

    if (action === "scheduled") {
      emailResult = await sendMeetingScheduledEmail({
        studentEmail: student.email,
        studentName: student.name,
        meetingTitle: meetingData?.title || "Counseling Session",
        meetingDate,
        meetingTime,
        meetingLink: meetingData?.meeting_link || undefined,
        counselorName,
        meetingType: meetingData?.meeting_type || "Google Meet",
        duration: meetingData?.duration_minutes || 30,
      });
    } else if (action === "updated") {
      emailResult = await sendMeetingUpdatedEmail({
        studentEmail: student.email,
        studentName: student.name,
        meetingTitle: meetingData?.title || "Counseling Session",
        meetingDate,
        meetingTime,
        meetingLink: meetingData?.meeting_link || undefined,
        counselorName,
        meetingType: meetingData?.meeting_type || "Google Meet",
        duration: meetingData?.duration_minutes || 30,
      });
    } else if (action === "cancelled") {
      emailResult = await sendMeetingCancelledEmail({
        studentEmail: student.email,
        studentName: student.name,
        meetingTitle: meetingData?.title || "Counseling Session",
        meetingDate,
        meetingTime,
        counselorName,
      });
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, emailResult });
  } catch (error: any) {
    console.error("API send-meeting-notification failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
