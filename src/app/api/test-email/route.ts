import { NextResponse } from "next/server";
import { sendEmail, getEmailConfigStatus } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing recipient 'email' field in request body" }, { status: 400 });
    }

    const config = getEmailConfigStatus();

    const testHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">🧪 Annex System Test Email</h2>
        <p style="color: #475569; font-size: 14px;">This is a test notification verifying that the Annex Consultancy Mailing Engine is working correctly.</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; margin: 20px 0; font-size: 14px; color: #334155;">
          <p style="margin: 0 0 8px 0;"><strong>Recipient:</strong> ${email}</p>
          <p style="margin: 0 0 8px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p style="margin: 0;"><strong>Active Provider:</strong> ${config.activeProvider.toUpperCase()}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Annex Consultancy Diagnostic Tool</p>
      </div>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: "🧪 Test Email - Annex Consultancy Portal",
      html: testHtml
    });

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        error: emailResult.error || "Failed to dispatch test email",
        responseBody: emailResult.rawBody || null
      }, { status: 500 });
    }

    console.log(`[Diagnostic] Test email dispatched successfully to: ${email}. MessageId: ${emailResult.messageId || "N/A"}`);
    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId || "mock-id",
      mocked: !!(emailResult as any).mocked,
      responseBody: emailResult.rawBody || null
    });
  } catch (err: any) {
    console.error("API test-email failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
