import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const TO_EMAIL = process.env.NUCLII_EMAIL ?? "team@nuclii.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[Nuclii] RESEND_API_KEY not set — waitlist signup not saved:", email);
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    // Save to Resend Audience so the full list is manageable and broadcastable
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        unsubscribed: false,
      });
    }

    // Notify admin
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `Waitlist signup — ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:20px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">WAITLIST</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;margin:0 0 12px">New waitlist signup</h1>
          <p style="font-size:15px;color:#a1a1aa;margin:0 0 20px">Someone just joined the Nuclii waitlist.</p>
          <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">
            <p style="margin:0;font-size:14px;color:#a1a1aa">Email</p>
            <p style="margin:6px 0 0;font-size:16px;font-weight:600">${email}</p>
          </div>
          <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">Submitted via nuclii.com — added to your Resend audience.</p>
        </div>
      `,
    });

    // Confirmation email to the person who signed up
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [email],
      subject: `You're on the Nuclii waitlist`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:36px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:24px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">NUCLII</span>
          </div>
          <h1 style="font-size:24px;font-weight:700;margin:0 0 14px;line-height:1.2">You're on the list.</h1>
          <p style="font-size:15px;color:#a1a1aa;margin:0 0 28px;line-height:1.7">
            Thanks for joining the Nuclii waitlist. We're building infrastructure for real-world experiences — discovery, hosting, booking, and access — and you'll be among the first to know when we launch near you.
          </p>
          <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:18px 20px;margin-bottom:28px">
            <p style="margin:0;font-size:13px;color:#a1a1aa;font-weight:600;letter-spacing:0.04em;text-transform:uppercase">What happens next</p>
            <p style="margin:10px 0 0;font-size:14px;color:#f7f7fa;line-height:1.7">We'll reach out when we're ready to launch in your city. No spam — just the things that matter.</p>
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
    console.error("[Nuclii] Waitlist signup error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
