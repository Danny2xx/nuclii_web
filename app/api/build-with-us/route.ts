import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.NUCLII_EMAIL ?? "team@nuclii.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string>;
    const { name, email, role, city, link, message } = body;

    if (!name?.trim() || !email?.trim() || !role || !city?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[Nuclii] RESEND_API_KEY not set — build-with-us submission not sent:", body);
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `Build With Us — ${role}: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:24px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">BUILD WITH US</span>
          </div>
          <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">New application</h1>
          <p style="color:#a1a1aa;font-size:14px;margin:0 0 28px">Role: <strong style="color:#f7f7fa">${role}</strong></p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa;width:130px">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Email</td><td style="padding:10px 0;font-weight:600">${email}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Role</td><td style="padding:10px 0;font-weight:600">${role}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">City</td><td style="padding:10px 0;font-weight:600">${city}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Portfolio / Link</td><td style="padding:10px 0;font-weight:600">${link || "—"}</td></tr>
            <tr><td style="padding:10px 0;color:#a1a1aa;vertical-align:top">Message</td><td style="padding:10px 0;line-height:1.6">${message}</td></tr>
          </table>
          <p style="margin:28px 0 0;font-size:12px;color:#a1a1aa">Submitted via nuclii.com/build-with-us</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Build with us submission error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
