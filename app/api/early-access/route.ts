import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.NUCLII_EMAIL ?? "team@nuclii.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, string>;
    const { fullName, email, city, organisation, role, intendedUse } = body;

    if (!fullName?.trim() || !email?.trim() || !city?.trim() || !role || !intendedUse?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[Nuclii] RESEND_API_KEY not set — early access submission not sent:", body);
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    // Notify admin
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `Early Access — ${role}: ${fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:24px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">EARLY ACCESS</span>
          </div>
          <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">New early access application</h1>
          <p style="color:#a1a1aa;font-size:14px;margin:0 0 28px">Role: <strong style="color:#f7f7fa">${role}</strong></p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa;width:130px">Name</td><td style="padding:10px 0;font-weight:600">${fullName}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Email</td><td style="padding:10px 0;font-weight:600">${email}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">City</td><td style="padding:10px 0;font-weight:600">${city}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Organisation</td><td style="padding:10px 0;font-weight:600">${organisation || "—"}</td></tr>
            <tr style="border-bottom:1px solid #26282f"><td style="padding:10px 0;color:#a1a1aa">Role</td><td style="padding:10px 0;font-weight:600">${role}</td></tr>
            <tr><td style="padding:10px 0;color:#a1a1aa;vertical-align:top">Message</td><td style="padding:10px 0;line-height:1.6">${intendedUse}</td></tr>
          </table>
          <p style="margin:28px 0 0;font-size:12px;color:#a1a1aa">Submitted via nuclii.com/early-access</p>
        </div>
      `,
    });

    // Confirmation email to the applicant
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [email],
      subject: `We got your application, ${fullName.split(" ")[0]}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:36px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:24px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">EARLY ACCESS</span>
          </div>
          <h1 style="font-size:24px;font-weight:700;margin:0 0 14px;line-height:1.2">Application received.</h1>
          <p style="font-size:15px;color:#a1a1aa;margin:0 0 28px;line-height:1.7">
            Thanks for applying for early access to Nuclii as a <strong style="color:#f7f7fa">${role}</strong>. We've received your application and will be in touch when we're ready to onboard your role in your city.
          </p>
          <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:18px 20px;margin-bottom:28px">
            <p style="margin:0;font-size:13px;color:#a1a1aa;font-weight:600;letter-spacing:0.04em;text-transform:uppercase">What happens next</p>
            <p style="margin:10px 0 0;font-size:14px;color:#f7f7fa;line-height:1.7">We review applications manually and reach out directly. We'll contact you at this address when your spot is ready.</p>
          </div>
          <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px;margin-bottom:28px">
            <p style="margin:0;font-size:13px;color:#a1a1aa">Role applied for</p>
            <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#5b8cff">${role}</p>
          </div>
          <p style="margin:0;font-size:12px;color:#a1a1aa">
            — The Nuclii team<br/>
            <a href="https://nuclii-web.vercel.app" style="color:#5b8cff;text-decoration:none">nuclii-web.vercel.app</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Early access submission error:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
