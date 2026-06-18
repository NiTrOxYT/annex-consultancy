import { supabase } from "@/lib/supabase";

export function getEmailConfigStatus() {
  const hasBrevo = !!process.env.BREVO_API_KEY;
  const hasResend = !!process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "notifications@annexconsultancy.com";
  
  let activeProvider: "brevo" | "resend" | "mock" = "mock";
  let reason = "";
  
  if (hasBrevo) {
    activeProvider = "brevo";
    reason = "Brevo API key is configured and active.";
  } else if (hasResend) {
    activeProvider = "resend";
    reason = "BREVO_API_KEY is missing. Falling back to RESEND_API_KEY.";
  } else {
    activeProvider = "mock";
    reason = "Both BREVO_API_KEY and RESEND_API_KEY are missing. Falling back to local console Mock Mode.";
  }
  
  return {
    hasBrevoApiKey: hasBrevo,
    hasResendApiKey: hasResend,
    emailFrom,
    activeProvider,
    reason,
  };
}

// Global initialization logs
const { hasBrevoApiKey, hasResendApiKey, emailFrom, activeProvider, reason } = getEmailConfigStatus();
console.log("[EMAIL CONFIG]");
console.log(`BREVO_API_KEY: ${hasBrevoApiKey ? "detected" : "missing"}`);
console.log(`RESEND_API_KEY: ${hasResendApiKey ? "detected" : "missing"}`);
console.log(`EMAIL_FROM: ${emailFrom}`);
console.log(`ACTIVE_PROVIDER: ${activeProvider}`);
if (reason) {
  console.log(`REASON: ${reason}`);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { activeProvider, emailFrom } = getEmailConfigStatus();
  console.log(`[Diagnostic] Attempting email delivery to: ${to}, Subject: "${subject}", Provider: ${activeProvider}`);

  if (activeProvider === "mock") {
    console.log("---------- LOCAL EMAIL NOTIFICATION (MOCKED) ----------");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("-------------------------------------------------------");
    console.log(`[Diagnostic] Email sent successfully (MOCKED) to: ${to}`);

    // Log in DB under Mock Mode
    try {
      await supabase.from("email_logs").insert([{
        recipient_email: to,
        subject,
        status: "delivered",
        message_id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        error_details: "Mock Mode - No real transmission occurred"
      }]);
    } catch (dbErr: any) {
      console.error("[Diagnostic] Failed to log mock email to DB:", dbErr.message);
    }

    return { success: true, mocked: true, messageId: `mock-${Date.now()}` };
  }

  if (activeProvider === "brevo") {
    const brevoKey = process.env.BREVO_API_KEY;
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: emailFrom, name: "Annex Consultancy Portal" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Diagnostic] Brevo email delivery failed!
Recipient: ${to}
Subject: "${subject}"
Status: ${response.status} ${response.statusText}
Error Body: ${errorText}`);

        // Log failure in DB
        try {
          await supabase.from("email_logs").insert([{
            recipient_email: to,
            subject,
            status: "failed",
            error_details: `Brevo API Error (${response.status}): ${errorText}`
          }]);
        } catch (dbErr: any) {
          console.error("[Diagnostic] Failed to log failed email to DB:", dbErr.message);
        }

        return { success: false, error: `Brevo API Error (${response.status}): ${errorText}`, rawBody: errorText };
      }

      const data = await response.json();
      console.log(`[Diagnostic] Brevo email delivery successful!
Recipient: ${to}
Subject: "${subject}"
Status: ${response.status}
MessageId: ${data.messageId || "N/A"}`);

      // Log success in DB
      try {
        await supabase.from("email_logs").insert([{
          recipient_email: to,
          subject,
          status: "sent",
          message_id: data.messageId || null
        }]);
      } catch (dbErr: any) {
        console.error("[Diagnostic] Failed to log sent email to DB:", dbErr.message);
      }

      return { success: true, messageId: data.messageId, rawBody: JSON.stringify(data) };
    } catch (error: any) {
      console.error(`[Diagnostic] Email sending threw exception to: ${to}. Error:`, error.message);

      // Log exception in DB
      try {
        await supabase.from("email_logs").insert([{
          recipient_email: to,
          subject,
          status: "failed",
          error_details: error.message
        }]);
      } catch (dbErr: any) {
        console.error("[Diagnostic] Failed to log exception email to DB:", dbErr.message);
      }

      return { success: false, error: error.message };
    }
  }

  // Else must be resend provider
  const resendKey = process.env.RESEND_API_KEY;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Annex Consultancy Portal <${emailFrom}>`,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Diagnostic] Resend email delivery failed!
Recipient: ${to}
Subject: "${subject}"
Status: ${response.status} ${response.statusText}
Error Body: ${errorText}`);

      // Log failure in DB
      try {
        await supabase.from("email_logs").insert([{
          recipient_email: to,
          subject,
          status: "failed",
          error_details: `Resend API Error (${response.status}): ${errorText}`
        }]);
      } catch (dbErr: any) {
        console.error("[Diagnostic] Failed to log failed email to DB:", dbErr.message);
      }

      return { success: false, error: `Resend API Error (${response.status}): ${errorText}`, rawBody: errorText };
    }

    const data = await response.json();
    console.log(`[Diagnostic] Resend email delivery successful!
Recipient: ${to}
Subject: "${subject}"
Status: ${response.status}
MessageId: ${data.id || "N/A"}`);

    // Log success in DB
    try {
      await supabase.from("email_logs").insert([{
        recipient_email: to,
        subject,
        status: "sent",
        message_id: data.id || null
      }]);
    } catch (dbErr: any) {
      console.error("[Diagnostic] Failed to log sent email to DB:", dbErr.message);
    }

    return { success: true, messageId: data.id, rawBody: JSON.stringify(data) };
  } catch (error: any) {
    console.error(`[Diagnostic] Email sending threw exception to: ${to}. Error:`, error.message);

    // Log exception in DB
    try {
      await supabase.from("email_logs").insert([{
        recipient_email: to,
        subject,
        status: "failed",
        error_details: error.message
      }]);
    } catch (dbErr: any) {
      console.error("[Diagnostic] Failed to log exception email to DB:", dbErr.message);
    }

    return { success: false, error: error.message };
  }
}


export async function sendStudentMessageEmail({
  studentName,
  studentEmail,
  messageContent,
  counselorEmail,
}: {
  studentName: string;
  studentEmail: string;
  messageContent: string;
  counselorEmail: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">New Chat Message from Student</h2>
      <p style="color: #475569; font-size: 14px;">A new message has been posted on the Annex Student Portal.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Student Name:</strong> ${studentName}</p>
        <p style="margin: 0 0 8px 0;"><strong>Student Email:</strong> ${studentEmail}</p>
        <p style="margin: 0 0 16px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p style="margin: 0 0 4px 0;"><strong>Message:</strong></p>
        <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #0f172a; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${messageContent}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">
          Open Admin Portal
        </a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: counselorEmail,
    subject: `New Student Message - ${studentName}`,
    html,
  });
}

export async function sendCounselorMessageEmail({
  counselorName,
  messageContent,
  studentEmail,
}: {
  counselorName: string;
  messageContent: string;
  studentEmail: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/student-login`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">New Message From Your Counselor</h2>
      <p style="color: #475569; font-size: 14px;">Hello,</p>
      <p style="color: #475569; font-size: 14px;">You have received a new message from your counselor, <strong>${counselorName}</strong>.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #0f172a; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${messageContent}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">
          Access Student Portal
        </a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: "New Message From Your Counselor",
    html,
  });
}

// ── Meeting Email Functions ──────────────────────────────────────

export async function sendMeetingScheduledEmail({
  studentEmail,
  studentName,
  meetingTitle,
  meetingDate,
  meetingTime,
  meetingLink,
  counselorName,
  meetingType,
  duration,
}: {
  studentEmail: string;
  studentName: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingLink?: string;
  counselorName: string;
  meetingType: string;
  duration: number;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/student-login`;
  const linkBlock = meetingLink
    ? `<div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Meeting</a>
      </div>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">📅 New Meeting Scheduled</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">A new meeting has been scheduled for you by your counselor.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Meeting:</strong> ${meetingTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${meetingTime}</p>
        <p style="margin: 0 0 8px 0;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${meetingType}</p>
        <p style="margin: 0;"><strong>Counselor:</strong> ${counselorName}</p>
      </div>
      
      ${linkBlock}
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Access Student Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `New Meeting Scheduled - ${meetingTitle}`,
    html,
  });
}

export async function sendMeetingUpdatedEmail({
  studentEmail,
  studentName,
  meetingTitle,
  meetingDate,
  meetingTime,
  meetingLink,
  counselorName,
  meetingType,
  duration,
}: {
  studentEmail: string;
  studentName: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingLink?: string;
  counselorName: string;
  meetingType: string;
  duration: number;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/student-login`;
  const linkBlock = meetingLink
    ? `<div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Meeting</a>
      </div>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">🔄 Meeting Updated</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">Your scheduled meeting has been updated by your counselor. Please review the new details below.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Meeting:</strong> ${meetingTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${meetingTime}</p>
        <p style="margin: 0 0 8px 0;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${meetingType}</p>
        <p style="margin: 0;"><strong>Counselor:</strong> ${counselorName}</p>
      </div>
      
      ${linkBlock}
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Access Student Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Meeting Updated - ${meetingTitle}`,
    html,
  });
}

export async function sendMeetingCancelledEmail({
  studentEmail,
  studentName,
  meetingTitle,
  meetingDate,
  meetingTime,
  counselorName,
}: {
  studentEmail: string;
  studentName: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  counselorName: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/student-login`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">❌ Meeting Cancelled</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">The following meeting has been cancelled by your counselor. Please contact your counselor if you have any questions.</p>
      
      <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border: 1px solid #fecaca; margin: 20px 0; font-size: 14px; color: #991b1b;">
        <p style="margin: 0 0 8px 0;"><strong>Meeting:</strong> ${meetingTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${meetingTime}</p>
        <p style="margin: 0;"><strong>Counselor:</strong> ${counselorName}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Access Student Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Meeting Cancelled - ${meetingTitle}`,
    html,
  });
}

export async function sendMeetingReminderEmail({
  studentEmail,
  studentName,
  meetingTitle,
  meetingDate,
  meetingTime,
  meetingLink,
  counselorName,
  meetingType,
}: {
  studentEmail: string;
  studentName: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingLink?: string;
  counselorName: string;
  meetingType: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/student-login`;
  const linkBlock = meetingLink
    ? `<div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Meeting Now</a>
      </div>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">⏰ Meeting Reminder — Starting Soon!</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">Your meeting is starting within the next hour. Please be ready!</p>
      
      <div style="background-color: #fffbeb; padding: 16px; border-radius: 8px; border: 1px solid #fde68a; margin: 20px 0; font-size: 14px; color: #92400e;">
        <p style="margin: 0 0 8px 0;"><strong>Meeting:</strong> ${meetingTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${meetingTime}</p>
        <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${meetingType}</p>
        <p style="margin: 0;"><strong>Counselor:</strong> ${counselorName}</p>
      </div>
      
      ${linkBlock}
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Access Student Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Student Portal system.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `Reminder: ${meetingTitle} — Starting Soon!`,
    html,
  });
}
