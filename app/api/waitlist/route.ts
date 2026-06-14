import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const TO_EMAIL = process.env.NUCLII_EMAIL ?? "team@nuclii.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      city?: string;
      role?: string;
      consent?: boolean;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const role = body.role?.trim() ?? "";
    const consent = body.consent === true;

    if (!name) {
      return NextResponse.json({ error: "please enter your name." }, { status: 400 });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "enter a valid email address." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: "please confirm you'd like to receive updates." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("[Nuclii] RESEND_API_KEY not set — waitlist signup not saved:", email);
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    const [firstName, ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ");

    // A contact already on the audience means this email already joined the waitlist
    if (AUDIENCE_ID) {
      const { data: existing } = await resend.contacts.get({ audienceId: AUDIENCE_ID, email });
      if (existing) {
        return NextResponse.json({ success: true, duplicate: true });
      }
    }

    // Save to Resend Audience so the full list is manageable and broadcastable
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName,
        lastName: lastName || undefined,
        unsubscribed: false,
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCity = escapeHtml(city) || "—";
    const safeRole = escapeHtml(role) || "—";

    // Notify admin
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: `Waitlist signup — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
          <div style="margin-bottom:20px">
            <span style="background:#5b8cff22;color:#5b8cff;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">WAITLIST</span>
          </div>
          <h1 style="font-size:20px;font-weight:700;margin:0 0 12px">New waitlist signup</h1>
          <p style="font-size:15px;color:#a1a1aa;margin:0 0 20px">Someone just joined the Nuclii waitlist.</p>
          <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">
            <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Name</p>
            <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeName}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Email</p>
            <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeEmail}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">City</p>
            <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeCity}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Role / interest</p>
            <p style="margin:0;font-size:16px;font-weight:600">${safeRole}</p>
          </div>
          <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">Submitted via nuclii.com — added to your Resend audience.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Waitlist signup error:", error);
    return NextResponse.json({ error: "something went wrong. please try again." }, { status: 500 });
  }
}
