import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { 
  sendMissingDocumentsReminderEmail, 
  sendConsultationReminderEmail 
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Secret or Admin Password for Authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    const isAuthorized = 
      (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
      (adminPassword && authHeader === `Bearer ${adminPassword}`) ||
      request.headers.get("x-vercel-cron") === "true"; // Vercel Cron header flag

    if (!isAuthorized) {
      console.warn("[Cron Debug] Unauthorized attempt to trigger scheduler endpoint.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check Global Master Switch in system_settings
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
      console.warn("[Cron Warning] Failed to read system_settings, fallback to enabled=true. Error:", err.message);
    }

    if (!notificationsEnabled) {
      console.log("[Cron Info] Automated notifications are globally disabled via system_settings.");
      return NextResponse.json({ success: true, message: "Notifications globally disabled." });
    }

    const logActivity: string[] = [];

    // ----------------------------------------------------
    // TRIGGER 1: MISSING DOCUMENTS REMINDER
    // ----------------------------------------------------
    try {
      // Required document types to check for standard students
      const standardRequiredTypes = ["Passport", "Academic Certificates", "SOP", "LOR"];

      // Fetch all Active students
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id, name, email, status")
        .eq("status", "Active");

      if (!studentsError && students) {
        for (const student of students) {
          // Check preferences
          const { data: prefs } = await supabase
            .from("notification_preferences")
            .select("missing_documents_enabled, all_notifications_enabled")
            .eq("student_id", student.id)
            .maybeSingle();

          // Enabled by default if preferences table is empty or missing
          const docRemindersEnabled = prefs ? (prefs.missing_documents_enabled && prefs.all_notifications_enabled) : true;
          if (!docRemindersEnabled) continue;

          // Check 24h Cooldown
          const { data: pastNotifs } = await supabase
            .from("notification_history")
            .select("id")
            .eq("student_id", student.id)
            .eq("notification_type", "missing_documents")
            .gt("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          const cooldownActive = pastNotifs && pastNotifs.length > 0;
          if (cooldownActive) continue;

          // Query student documents
          const { data: docs } = await supabase
            .from("student_documents")
            .select("document_type, status")
            .eq("student_id", student.id);

          const uploadedTypes = docs ? docs.map(d => d.document_type) : [];
          const rejectedDocs = docs ? docs.filter(d => d.status === "Requires Correction" || d.status === "Rejected").map(d => d.document_type) : [];

          const missingDocs: string[] = [];
          for (const reqType of standardRequiredTypes) {
            if (!uploadedTypes.includes(reqType)) {
              missingDocs.push(reqType);
            } else if (rejectedDocs.includes(reqType)) {
              missingDocs.push(`${reqType} (Requires Correction)`);
            }
          }

          if (missingDocs.length > 0) {
            console.log(`[Cron Info] Student ${student.name} (${student.email}) has missing docs:`, missingDocs);
            const emailResult = await sendMissingDocumentsReminderEmail({
              recipientEmail: student.email,
              studentName: student.name,
              missingDocs,
              isTraining: false
            });

            // Log history
            await supabase.from("notification_history").insert([{
              student_id: student.id,
              notification_type: "missing_documents",
              subject: "⚠️ Action Required: Missing Documents for Your Application",
              status: emailResult.success ? "sent" : "failed",
              error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
            }]);

            logActivity.push(`Sent Missing Documents alert to standard student: ${student.email}`);
          }
        }
      }

      // Fetch all Active Career training students
      const { data: trainingStudents, error: trainingError } = await supabase
        .from("training_students")
        .select("id, student_name, student_email, status")
        .eq("status", "Active");

      if (!trainingError && trainingStudents) {
        for (const student of trainingStudents) {
          const { data: prefs } = await supabase
            .from("notification_preferences")
            .select("missing_documents_enabled, all_notifications_enabled")
            .eq("training_student_id", student.id)
            .maybeSingle();

          const docRemindersEnabled = prefs ? (prefs.missing_documents_enabled && prefs.all_notifications_enabled) : true;
          if (!docRemindersEnabled) continue;

          // Cooldown check
          const { data: pastNotifs } = await supabase
            .from("notification_history")
            .select("id")
            .eq("training_student_id", student.id)
            .eq("notification_type", "missing_documents")
            .gt("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .limit(1);

          const cooldownActive = pastNotifs && pastNotifs.length > 0;
          if (cooldownActive) continue;

          // Query training documents
          const { data: docs } = await supabase
            .from("training_documents")
            .select("title")
            .eq("student_id", student.id);

          const uploadedTitles = docs ? docs.map(d => d.title.toLowerCase()) : [];
          
          // Require at least a CV/Resume
          const missingDocs: string[] = [];
          const hasResume = uploadedTitles.some(t => t.includes("cv") || t.includes("resume") || t.includes("bio"));
          if (!hasResume) {
            missingDocs.push("CV / Resume");
          }

          if (missingDocs.length > 0) {
            console.log(`[Cron Info] Career student ${student.student_name} (${student.student_email}) has missing docs:`, missingDocs);
            const emailResult = await sendMissingDocumentsReminderEmail({
              recipientEmail: student.student_email,
              studentName: student.student_name,
              missingDocs,
              isTraining: true
            });

            await supabase.from("notification_history").insert([{
              training_student_id: student.id,
              notification_type: "missing_documents",
              subject: "⚠️ Action Required: Missing Documents for Your Application",
              status: emailResult.success ? "sent" : "failed",
              error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
            }]);

            logActivity.push(`Sent Missing Documents alert to career student: ${student.student_email}`);
          }
        }
      }
    } catch (docErr: any) {
      console.error("[Cron Error] Missing documents processing failed:", docErr.message);
    }

    // ----------------------------------------------------
    // TRIGGER 2: CONSULTATION REMINDER (Upcoming meetings)
    // ----------------------------------------------------
    try {
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Query upcoming meetings
      const { data: meetings, error: meetingsError } = await supabase
        .from("meetings")
        .select("*, students(*), training_students(*)")
        .gte("scheduled_at", now.toISOString())
        .lte("scheduled_at", twentyFourHoursLater.toISOString());

      if (!meetingsError && meetings) {
        for (const meeting of meetings) {
          const student = meeting.students;
          const trainingStudent = meeting.training_students;
          
          if (!student && !trainingStudent) continue;

          const isTraining = !!trainingStudent;
          const studentId = student?.id;
          const trainingId = trainingStudent?.id;
          const recipientEmail = student?.email || trainingStudent?.student_email;
          const recipientName = student?.name || trainingStudent?.student_name;

          if (!recipientEmail || !recipientName) continue;

          // Check preferences
          let consultationEnabled = true;
          if (studentId) {
            const { data: prefs } = await supabase
              .from("notification_preferences")
              .select("consultation_enabled, all_notifications_enabled")
              .eq("student_id", studentId)
              .maybeSingle();
            if (prefs) {
              consultationEnabled = prefs.consultation_enabled && prefs.all_notifications_enabled;
            }
          } else if (trainingId) {
            const { data: prefs } = await supabase
              .from("notification_preferences")
              .select("consultation_enabled, all_notifications_enabled")
              .eq("training_student_id", trainingId)
              .maybeSingle();
            if (prefs) {
              consultationEnabled = prefs.consultation_enabled && prefs.all_notifications_enabled;
            }
          }

          if (!consultationEnabled) continue;

          // 24h Cooldown check: prevent sending duplicate consultation reminders for the SAME meeting
          const cooldownQuery = supabase
            .from("notification_history")
            .select("id")
            .eq("notification_type", "consultation")
            .eq("subject", `🔔 Reminder: Upcoming Consultation - ${meeting.title}`)
            .gt("sent_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

          if (studentId) {
            cooldownQuery.eq("student_id", studentId);
          } else {
            cooldownQuery.eq("training_student_id", trainingId);
          }

          const { data: pastReminders } = await cooldownQuery;
          const isReminded = pastReminders && pastReminders.length > 0;
          if (isReminded) continue;

          // Send reminder
          console.log(`[Cron Info] Dispatching consultation reminder for: "${meeting.title}" to ${recipientEmail}`);
          const emailResult = await sendConsultationReminderEmail({
            recipientEmail,
            studentName: recipientName,
            meetingTitle: meeting.title,
            scheduledAt: new Date(meeting.scheduled_at).toLocaleString(),
            meetingLink: meeting.meeting_link,
            isTraining
          });

          // Log history
          const insertPayload: any = {
            notification_type: "consultation",
            subject: `🔔 Reminder: Upcoming Consultation - ${meeting.title}`,
            status: emailResult.success ? "sent" : "failed",
            error_message: emailResult.success ? null : (emailResult.error || "Email failed to send")
          };

          if (studentId) insertPayload.student_id = studentId;
          if (trainingId) insertPayload.training_student_id = trainingId;

          await supabase.from("notification_history").insert([insertPayload]);
          logActivity.push(`Sent Consultation Reminder for "${meeting.title}" to: ${recipientEmail}`);
        }
      }
    } catch (meetErr: any) {
      console.error("[Cron Error] Consultation reminder processing failed:", meetErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Cron execution finished.",
      activityLogs: logActivity
    });
  } catch (err: any) {
    console.error("[Cron Failure] Global handler catch:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
