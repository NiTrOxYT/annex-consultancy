import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { 
  sendVisaStatusUpdateEmail, 
  sendMissingDocumentsReminderEmail,
  sendConsultationReminderEmail 
} from "@/lib/email";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verify Admin Session
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      console.warn("[API Warning] Unauthorized attempt to call send-student-notification API");
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const body = await request.json();
    const { studentId, trainingStudentId, action, details } = body;

    if (!studentId && !trainingStudentId) {
      return NextResponse.json({ error: "Missing required fields: studentId or trainingStudentId" }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ error: "Missing required field: action" }, { status: 400 });
    }

    const isTraining = !!trainingStudentId;
    const targetStudentId = studentId || trainingStudentId;

    // 2. Check Global Master Switch in system_settings (unless manual override)
    let notificationsEnabled = true;
    try {
      const { data: settingData, error: settingError } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "notifications_enabled")
        .maybeSingle();

      if (!settingError && settingData) {
        notificationsEnabled = settingData.value === "true";
      }
    } catch (err: any) {
      console.warn("[API Warning] Failed to read system_settings: ", err.message);
    }

    const isManual = details?.manual === true;
    if (!notificationsEnabled && !isManual) {
      return NextResponse.json({ success: true, message: "Notifications globally disabled." });
    }

    // 3. Fetch student details based on cohort type
    let studentName = "";
    let studentEmail = "";

    if (isTraining) {
      const { data: trainingStudent, error: trainingErr } = await supabase
        .from("training_students")
        .select("id, student_name, student_email")
        .eq("id", targetStudentId)
        .single();
      
      if (trainingErr || !trainingStudent) {
        return NextResponse.json({ error: "Training student not found" }, { status: 404 });
      }
      studentName = trainingStudent.student_name;
      studentEmail = trainingStudent.student_email;
    } else {
      const { data: student, error: studentErr } = await supabase
        .from("students")
        .select("id, name, email")
        .eq("id", targetStudentId)
        .single();

      if (studentErr || !student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
      studentName = student.name;
      studentEmail = student.email;
    }

    // 4. Action: Visa Status Update (Standard Student only)
    if (action === "visa-status-updated") {
      if (isTraining) {
        return NextResponse.json({ error: "Visa updates are not applicable to training students" }, { status: 400 });
      }
      const { status, note } = details || {};
      if (!status) {
        return NextResponse.json({ error: "Missing visa status detail" }, { status: 400 });
      }

      // Check student notification preferences (unless manual override)
      if (!isManual) {
        let visaUpdatesEnabled = true;
        try {
          const { data: prefs } = await supabase
            .from("notification_preferences")
            .select("visa_updates_enabled, all_notifications_enabled")
            .eq("student_id", targetStudentId)
            .maybeSingle();

          if (prefs) {
            visaUpdatesEnabled = prefs.visa_updates_enabled && prefs.all_notifications_enabled;
          }
        } catch (prefErr: any) {
          console.warn("[API Warning] Failed to fetch preferences. Default to enabled.");
        }

        if (!visaUpdatesEnabled) {
          return NextResponse.json({ success: true, message: "Visa updates notification disabled by student preference." });
        }

        // Check 24-hour Cooldown
        const subjectText = `✈️ Visa Application Update - Status: ${status}`;
        try {
          const { data: pastNotifs } = await supabase
            .from("notification_history")
            .select("id")
            .eq("student_id", targetStudentId)
            .eq("notification_type", "visa_update")
            .eq("subject", subjectText)
            .gt("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          if (pastNotifs && pastNotifs.length > 0) {
            return NextResponse.json({ success: true, message: "Notification suppressed: Cooldown active." });
          }
        } catch (cooldownErr: any) {
          console.warn("[API Warning] Cooldown check failed. Proceeding.");
        }
      }

      const subjectText = `✈️ Visa Application Update - Status: ${status}`;
      console.log(`[API Info] Sending visa update email to ${studentEmail}`);
      const emailResult = await sendVisaStatusUpdateEmail({
        recipientEmail: studentEmail,
        studentName,
        status,
        details: note,
      });

      // Log in history
      await supabase.from("notification_history").insert([{
        student_id: targetStudentId,
        notification_type: "visa_update",
        subject: subjectText,
        status: emailResult.success ? "sent" : "failed",
        error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
      }]);

      if (!emailResult.success) {
        return NextResponse.json({ success: false, error: emailResult.error || "Email failed to send" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Visa update email sent successfully." });
    }

    // 5. Action: Missing Documents Reminder
    if (action === "missing-documents-reminder") {
      let missingDocs: string[] = [];

      if (isTraining) {
        const { data: docs } = await supabase
          .from("training_documents")
          .select("title")
          .eq("student_id", targetStudentId);

        const uploadedTitles = docs ? docs.map(d => d.title.toLowerCase()) : [];
        const hasResume = uploadedTitles.some(t => t.includes("cv") || t.includes("resume") || t.includes("bio"));
        if (!hasResume) {
          missingDocs.push("CV / Resume");
        }
      } else {
        const standardRequiredTypes = ["Passport", "Academic Certificates", "SOP", "LOR"];
        const { data: docs } = await supabase
          .from("student_documents")
          .select("document_type, status")
          .eq("student_id", targetStudentId);

        const uploadedTypes = docs ? docs.map(d => d.document_type) : [];
        const rejectedDocs = docs ? docs.filter(d => d.status === "Requires Correction" || d.status === "Rejected").map(d => d.document_type) : [];

        for (const reqType of standardRequiredTypes) {
          if (!uploadedTypes.includes(reqType)) {
            missingDocs.push(reqType);
          } else if (rejectedDocs.includes(reqType)) {
            missingDocs.push(`${reqType} (Requires Correction)`);
          }
        }
      }

      if (missingDocs.length === 0) {
        return NextResponse.json({ success: true, message: "No missing documents found for this candidate." });
      }

      const subjectText = "⚠️ Action Required: Missing Documents for Your Application";
      const emailResult = await sendMissingDocumentsReminderEmail({
        recipientEmail: studentEmail,
        studentName,
        missingDocs,
        isTraining
      });

      const historyRecord: any = {
        notification_type: "missing_documents",
        subject: subjectText,
        status: emailResult.success ? "sent" : "failed",
        error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
      };
      if (isTraining) {
        historyRecord.training_student_id = targetStudentId;
      } else {
        historyRecord.student_id = targetStudentId;
      }

      await supabase.from("notification_history").insert([historyRecord]);

      if (!emailResult.success) {
        return NextResponse.json({ success: false, error: emailResult.error || "Email failed to send" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Missing documents reminder sent successfully." });
    }

    // 6. Action: Consultation Reminder
    if (action === "consultation-reminder") {
      let { meetingId } = details || {};
      let meetingData: any = null;

      if (meetingId) {
        const { data: meeting } = await supabase
          .from("meetings")
          .select("*")
          .eq("id", meetingId)
          .single();
        meetingData = meeting;
      } else {
        // Find most recent upcoming meeting
        const meetingQuery = supabase
          .from("meetings")
          .select("*")
          .order("scheduled_at", { ascending: false })
          .limit(1);
        
        if (isTraining) {
          meetingQuery.eq("training_student_id", targetStudentId);
        } else {
          meetingQuery.eq("student_id", targetStudentId);
        }
        
        const { data: mtgs } = await meetingQuery;
        if (mtgs && mtgs.length > 0) {
          meetingData = mtgs[0];
        }
      }

      if (!meetingData) {
        return NextResponse.json({ error: "No consultation meetings found for this student." }, { status: 404 });
      }

      const subjectText = `🔔 Reminder: Upcoming Consultation - ${meetingData.title}`;
      const emailResult = await sendConsultationReminderEmail({
        recipientEmail: studentEmail,
        studentName,
        meetingTitle: meetingData.title,
        scheduledAt: new Date(meetingData.scheduled_at).toLocaleString(),
        meetingLink: meetingData.meeting_link || undefined,
        isTraining
      });

      const historyRecord: any = {
        notification_type: "consultation",
        subject: subjectText,
        status: emailResult.success ? "sent" : "failed",
        error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
      };
      if (isTraining) {
        historyRecord.training_student_id = targetStudentId;
      } else {
        historyRecord.student_id = targetStudentId;
      }

      await supabase.from("notification_history").insert([historyRecord]);

      if (!emailResult.success) {
        return NextResponse.json({ success: false, error: emailResult.error || "Email failed to send" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Consultation reminder email sent successfully." });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("[API Failure] send-student-notification endpoint error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
