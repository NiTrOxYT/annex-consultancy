import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export function getEmailConfigStatus() {
  const host = process.env.BREVO_SMTP_HOST;
  const port = process.env.BREVO_SMTP_PORT;
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || "notifications@annexconsultancy.com";

  const isSmtpConfigured = !!(host && port && user && pass);
  
  let activeProvider: "brevo-smtp" | "mock" = "mock";
  let reason = "";
  
  if (isSmtpConfigured) {
    activeProvider = "brevo-smtp";
    reason = "Brevo SMTP is configured and active.";
  } else {
    activeProvider = "mock";
    const missing = [];
    if (!host) missing.push("BREVO_SMTP_HOST");
    if (!port) missing.push("BREVO_SMTP_PORT");
    if (!user) missing.push("BREVO_SMTP_USER");
    if (!pass) missing.push("BREVO_SMTP_PASS");
    reason = `SMTP is not fully configured (missing: ${missing.join(", ")}). Falling back to local console Mock Mode.`;
  }
  
  return {
    hasBrevoSmtpHost: !!host,
    hasBrevoSmtpPort: !!port,
    hasBrevoSmtpUser: !!user,
    hasBrevoSmtpPass: !!pass,
    smtpPort: port || "587",
    emailFrom,
    activeProvider,
    reason,
  };
}

let transporter: nodemailer.Transporter | null = null;
let smtpConnected = false;

const config = getEmailConfigStatus();

if (config.activeProvider === "brevo-smtp") {
  const host = process.env.BREVO_SMTP_HOST!;
  const port = Number(process.env.BREVO_SMTP_PORT) || 587;
  const user = process.env.BREVO_SMTP_USER!;
  const pass = process.env.BREVO_SMTP_PASS!;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  transporter.verify()
    .then(() => {
      smtpConnected = true;
      console.log(`[EMAIL SMTP VERIFICATION] SUCCESS - SMTP connection verified successfully for user: ${user}`);
    })
    .catch((err: any) => {
      smtpConnected = false;
      console.error(`[EMAIL SMTP VERIFICATION] FAILED - SMTP connection verification failed: ${err.message}`);
    });
} else {
  console.log(`[EMAIL SMTP VERIFICATION] N/A - Mock Mode active due to missing configuration.`);
}

console.log("[EMAIL CONFIG STARTUP]");
console.log(`ACTUAL_SENDER_EMAIL: ${config.emailFrom}`);
console.log(`ACTIVE_PROVIDER: ${config.activeProvider}`);
console.log(`SMTP_VERIFICATION_STATUS: ${config.activeProvider === "brevo-smtp" ? "initiated" : "N/A - Mock Mode"}`);

export async function verifySmtpConnection(): Promise<boolean> {
  if (!transporter) return false;
  try {
    await transporter.verify();
    smtpConnected = true;
    return true;
  } catch (err: any) {
    smtpConnected = false;
    return false;
  }
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

  // Inject branding logo header in HTML body if standard container div matches
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://annex-consultancy.vercel.app"}/branding/annex-logo.png`;
  const headerHtml = `
    <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
      <img src="${logoUrl}" alt="ANNEX Logo" style="width: 48px; height: 48px; vertical-align: middle; margin-right: 8px;" />
      <span style="font-family: sans-serif; font-size: 20px; font-weight: bold; color: #0f172a; vertical-align: middle; letter-spacing: -0.5px; text-transform: uppercase;">ANNEX</span>
    </div>
  `;

  let brandedHtml = html;
  const containerPattern = /<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">/;
  if (containerPattern.test(html)) {
    brandedHtml = html.replace(containerPattern, (match) => match + headerHtml);
  }

  console.log(`[Diagnostic] Attempting email delivery to: ${to}, Subject: "${subject}", Provider: ${activeProvider}`);

  if (activeProvider === "mock") {
    console.log("---------- LOCAL EMAIL NOTIFICATION (MOCKED) ----------");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${brandedHtml}`);
    console.log("-------------------------------------------------------");
    console.log(`[Diagnostic] Email sent successfully (MOCKED) to: ${to}`);

    const messageId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Log in DB under Mock Mode
    try {
      await supabase.from("email_logs").insert([{
        recipient_email: to,
        subject,
        status: "delivered",
        message_id: messageId,
        error_details: "Mock Mode - No real transmission occurred"
      }]);
    } catch (dbErr: any) {
      console.error("[Diagnostic] Failed to log mock email to DB:", dbErr.message);
    }

    return { success: true, mocked: true, messageId, rawBody: "Mock Mode - No real transmission occurred" };
  }

  try {
    if (!transporter) {
      throw new Error("SMTP transporter not initialized");
    }

    const info = await transporter.sendMail({
      from: `Annex Consultancy Portal <${emailFrom}>`,
      to,
      subject,
      html: brandedHtml,
    });

    console.log(`[Diagnostic] Brevo SMTP email delivery successful!
Recipient: ${to}
Subject: "${subject}"
MessageId: ${info.messageId || "N/A"}`);

    // Log success in DB
    try {
      await supabase.from("email_logs").insert([{
        recipient_email: to,
        subject,
        status: "sent",
        message_id: info.messageId || null
      }]);
    } catch (dbErr: any) {
      console.error("[Diagnostic] Failed to log sent email to DB:", dbErr.message);
    }

    return { success: true, messageId: info.messageId, rawBody: JSON.stringify(info) };
  } catch (error: any) {
    console.error(`[Diagnostic] SMTP email sending threw exception to: ${to}. Error:`, error.message);

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

    return { success: false, error: error.message, rawBody: error.message };
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

// ── Career & Placement Training Email Functions ──────────────────────────────────

export async function sendCareerLeadNotification({
  leadName,
  leadEmail,
  leadPhone,
  serviceTitle,
  adminEmail,
}: {
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  serviceTitle: string;
  adminEmail: string;
}) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">💼 New Career Service Lead</h2>
      <p style="color: #475569; font-size: 14px;">A student has requested enrollment in a Training & Placement service.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Student Name:</strong> ${leadName}</p>
        <p style="margin: 0 0 8px 0;"><strong>Student Email:</strong> ${leadEmail}</p>
        <p style="margin: 0 0 8px 0;"><strong>Student Phone:</strong> ${leadPhone || "N/A"}</p>
        <p style="margin: 0 0 8px 0;"><strong>Requested Service:</strong> ${serviceTitle}</p>
        <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Career Platform lead system.</p>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `💼 New Lead: ${leadName} - ${serviceTitle}`,
    html,
  });
}

export async function sendCareerPortalActivationEmail({
  studentEmail,
  studentName,
  serviceTitle,
  password,
}: {
  studentEmail: string;
  studentName: string;
  serviceTitle: string;
  password: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/career-portal`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">🎉 Career Portal Access Activated!</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">Your enrollment request for <strong>${serviceTitle}</strong> has been approved. You can now access your Career Portal to view tasks, upload files, and message your consultant.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155; font-family: monospace;">
        <p style="margin: 0 0 8px 0;"><strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a></p>
        <p style="margin: 0 0 8px 0;"><strong>Username / Email:</strong> ${studentEmail}</p>
        <p style="margin: 0;"><strong>Temporary Password:</strong> ${password}</p>
      </div>
      
      <p style="color: #475569; font-size: 13px;">Please log in and update your details. We look forward to working on your career journey!</p>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Career Platform onboarding.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `🎉 Access Activated: Annex Career Services`,
    html,
  });
}

export async function sendCareerTaskAssignedEmail({
  studentEmail,
  studentName,
  taskTitle,
  dueDate,
  consultantName,
}: {
  studentEmail: string;
  studentName: string;
  taskTitle: string;
  dueDate?: string;
  consultantName: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/career-portal`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">📝 New Task Assigned</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">A new task has been assigned to you by your consultant, <strong>${consultantName}</strong>.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Task Title:</strong> ${taskTitle}</p>
        <p style="margin: 0;"><strong>Due Date:</strong> ${dueDate || "No deadline set"}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View in Career Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Career Platform notifications.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `📝 New Task Assigned: ${taskTitle}`,
    html,
  });
}

export async function sendCareerTaskCompletedEmail({
  consultantEmail,
  studentName,
  taskTitle,
}: {
  consultantEmail: string;
  studentName: string;
  taskTitle: string;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">✅ Task Submitted / Completed</h2>
      <p style="color: #475569; font-size: 14px;">Hello,</p>
      <p style="color: #475569; font-size: 14px;">The student <strong>${studentName}</strong> has completed/submitted the following task for your review.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0;"><strong>Task Title:</strong> ${taskTitle}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Open Admin Dashboard</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Career Platform notifications.</p>
    </div>
  `;

  return sendEmail({
    to: consultantEmail,
    subject: `✅ Task Completed: ${studentName} - ${taskTitle}`,
    html,
  });
}

export async function sendCareerMeetingScheduledEmail({
  studentEmail,
  studentName,
  meetingTitle,
  meetingDate,
  meetingTime,
  meetingLink,
  consultantName,
  meetingType,
  duration,
}: {
  studentEmail: string;
  studentName: string;
  meetingTitle: string;
  meetingDate: string;
  meetingTime: string;
  meetingLink?: string;
  consultantName: string;
  meetingType: string;
  duration: number;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/career-portal`;
  const linkBlock = meetingLink
    ? `<div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Meeting</a>
      </div>`
    : "";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">📅 New Career Session Scheduled</h2>
      <p style="color: #475569; font-size: 14px;">Hello ${studentName},</p>
      <p style="color: #475569; font-size: 14px;">A new meeting has been scheduled for you by your career consultant.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0 0 8px 0;"><strong>Meeting:</strong> ${meetingTitle}</p>
        <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${meetingDate}</p>
        <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${meetingTime}</p>
        <p style="margin: 0 0 8px 0;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${meetingType}</p>
        <p style="margin: 0;"><strong>Consultant:</strong> ${consultantName}</p>
      </div>
      
      ${linkBlock}
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Access Career Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Career Platform notifications.</p>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `📅 New Meeting Scheduled - ${meetingTitle}`,
    html,
  });
}

export async function sendCareerMessageEmail({
  recipientEmail,
  senderName,
  messageContent,
  isStudent,
}: {
  recipientEmail: string;
  senderName: string;
  messageContent: string;
  isStudent: boolean;
}) {
  const portalUrl = isStudent
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`
    : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/career-portal`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">✉️ New Career Chat Message</h2>
      <p style="color: #475569; font-size: 14px;">You have received a new message from <strong>${senderName}</strong> on the career consultancy portal.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
        <p style="margin: 0; white-space: pre-wrap; font-style: italic; color: #0f172a; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">${messageContent}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply in Portal</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">This is an automated notification from the Annex Career Platform system.</p>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject: `✉️ New Message from ${senderName}`,
    html,
  });
}
