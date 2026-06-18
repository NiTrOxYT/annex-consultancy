import { NextResponse } from "next/server";
import { getEmailConfigStatus, verifySmtpConnection } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = getEmailConfigStatus();
    let smtpConnected = false;
    if (config.activeProvider === "brevo-smtp") {
      smtpConnected = await verifySmtpConnection();
    }

    return NextResponse.json({
      provider: config.activeProvider,
      sender: config.emailFrom,
      smtpConnected,
      environmentVariablesDetected: {
        BREVO_SMTP_HOST: config.hasBrevoSmtpHost,
        BREVO_SMTP_PORT: config.hasBrevoSmtpPort,
        BREVO_SMTP_USER: config.hasBrevoSmtpUser,
        BREVO_SMTP_PASS: config.hasBrevoSmtpPass,
        EMAIL_FROM: !!process.env.EMAIL_FROM
      }
    });
  } catch (err: any) {
    console.error("Failed to run email-debug endpoint:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
