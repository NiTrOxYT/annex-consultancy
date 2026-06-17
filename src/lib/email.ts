export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "notifications@annexconsultancy.com";

  if (!resendKey && !brevoKey) {
    console.log("---------- LOCAL EMAIL NOTIFICATION (MOCKED) ----------");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("-------------------------------------------------------");
    return { success: true, mocked: true };
  }

  try {
    if (resendKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API Error: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } else if (brevoKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: fromEmail, name: "Annex Consultancy Portal" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API Error: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    }
  } catch (error: any) {
    console.error("Email sending failed:", error);
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
