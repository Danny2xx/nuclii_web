import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { captureServerAnalyticsEvent } from "@/lib/server-analytics";

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";
const TO_EMAIL = process.env.NUCLII_EMAIL ?? "team@nuclii.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_LABELS: Record<string, string> = {
  attendee: "attendee",
  host: "host",
  "society-community": "society / community",
  "service-provider": "service provider",
  "talent-creative": "talent / creative",
  "venue-business": "venue / business",
  partner: "partner",
  investor: "investor",
  "team-contributor": "team / contributor",
};

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanPlainText(value: string | undefined, maxLength: number) {
  return (value ?? "").replace(/[\r\n]+/g, " ").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      role?: string;
      ageConfirmed?: boolean;
      consent?: boolean;
      source?: string;
      analyticsDistinctId?: string;
    };

    const name = cleanPlainText(body.name, 120);
    const email = body.email?.trim() ?? "";
    const role = body.role?.trim() ?? "";
    const roleLabel = ROLE_LABELS[role];
    const ageConfirmed = body.ageConfirmed === true;
    const consent = body.consent === true;
    const source = cleanPlainText(body.source, 80) || "waitlist";
    const analyticsDistinctId = cleanPlainText(body.analyticsDistinctId, 180) || undefined;

    const analyticsBase = {
      route: "/api/waitlist",
      source,
      role: role || "not_selected",
      role_label: roleLabel,
      has_name: Boolean(name),
      age_confirmed: ageConfirmed,
      marketing_consent: consent,
      resend_audience_configured: Boolean(AUDIENCE_ID),
    };

    if (!email || !EMAIL_REGEX.test(email)) {
      await captureServerAnalyticsEvent(
        ANALYTICS_EVENTS.waitlistSignupRejected,
        analyticsDistinctId,
        { ...analyticsBase, reason: "invalid_email" },
      );
      return NextResponse.json({ error: "enter a valid email address." }, { status: 400 });
    }

    if (!roleLabel) {
      await captureServerAnalyticsEvent(
        ANALYTICS_EVENTS.waitlistSignupRejected,
        analyticsDistinctId,
        { ...analyticsBase, reason: "invalid_role" },
      );
      return NextResponse.json({ error: "choose the path that best describes you." }, { status: 400 });
    }

    if (!ageConfirmed) {
      await captureServerAnalyticsEvent(
        ANALYTICS_EVENTS.waitlistSignupRejected,
        analyticsDistinctId,
        { ...analyticsBase, reason: "missing_age_confirmation" },
      );
      return NextResponse.json({ error: "please confirm you're 18 or older." }, { status: 400 });
    }

    if (!consent) {
      await captureServerAnalyticsEvent(
        ANALYTICS_EVENTS.waitlistSignupRejected,
        analyticsDistinctId,
        { ...analyticsBase, reason: "missing_marketing_consent" },
      );
      return NextResponse.json({ error: "please confirm you'd like to receive updates." }, { status: 400 });
    }

    const resend = getResendClient();

    if (!resend) {
      await captureServerAnalyticsEvent(
        ANALYTICS_EVENTS.waitlistSignupReceived,
        analyticsDistinctId,
        { ...analyticsBase, outcome: "accepted_without_resend" },
      );
      console.warn("[Nuclii] RESEND_API_KEY not set, waitlist signup not saved:", source);
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    const [firstName, ...rest] = name.split(/\s+/);
    const lastName = rest.join(" ");

    // A contact already on the audience means this email already joined the waitlist
    if (AUDIENCE_ID) {
      const { data: existing } = await resend.contacts.get({ audienceId: AUDIENCE_ID, email });
      if (existing) {
        await captureServerAnalyticsEvent(
          ANALYTICS_EVENTS.waitlistSignupReceived,
          analyticsDistinctId,
          { ...analyticsBase, outcome: "duplicate" },
        );
        return NextResponse.json({ success: true, duplicate: true });
      }
    }

    // Save to Resend Audience so the full list is manageable and broadcastable
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        unsubscribed: false,
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeFirstName = escapeHtml(firstName);
    const safeRole = escapeHtml(roleLabel);
    const safeSource = escapeHtml(source);

    // The contact is already saved at this point, so don't fail the signup
    // over an email hiccup (e.g. sending domain not yet verified).
    const emailResult = await Promise.allSettled([
      // Notify admin
      resend.emails.send({
        from: `Nuclii <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        subject: `Waitlist signup (${source}): ${name || email}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
            <div style="margin-bottom:20px">
              <span style="background:#ffffff1a;color:#f7f7fa;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">WAITLIST</span>
            </div>
            <h1 style="font-size:20px;font-weight:700;margin:0 0 12px">New waitlist signup</h1>
            <p style="font-size:15px;color:#a1a1aa;margin:0 0 20px">Someone just joined the Nuclii waitlist.</p>
            <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Name</p>
              <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeName || "—"}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Email</p>
              <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeEmail}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Joining as</p>
              <p style="margin:0 0 14px;font-size:16px;font-weight:600">${safeRole}</p>
              <p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">Source</p>
              <p style="margin:0;font-size:16px;font-weight:600">${safeSource}</p>
            </div>
            <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">Submitted via nuclii.com, added to your Resend audience.</p>
          </div>
        `,
      }),
      // Confirm to subscriber
      resend.emails.send({
        from: `Nuclii <${FROM_EMAIL}>`,
        to: [email],
        replyTo: TO_EMAIL,
        subject: "you're on the nuclii waitlist",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px">
            <div style="margin-bottom:20px">
              <span style="background:#ffffff1a;color:#f7f7fa;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:0.04em">WAITLIST</span>
            </div>
            <h1 style="font-size:20px;font-weight:700;margin:0 0 12px">you're on the list, ${safeFirstName}.</h1>
            <p style="font-size:15px;color:#a1a1aa;line-height:1.6;margin:0 0 20px">
              every workshop, pop-up, and meetup starts here. we'll email you the moment nuclii launches near you, no spam, just the first look.
            </p>
            <div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">
              <p style="margin:0;font-size:14px;color:#d4d4d8;line-height:1.6">
                nuclii helps you discover and host real-world experiences near you, without followers, group chats, or social pressure.
              </p>
            </div>
            <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">you're receiving this because you joined the waitlist at nuclii.com.</p>
          </div>
        `,
      }),
    ]);

    for (const result of emailResult) {
      if (result.status === "rejected") {
        console.error("[Nuclii] Waitlist email error:", result.reason);
      }
    }

    await captureServerAnalyticsEvent(
      ANALYTICS_EVENTS.waitlistSignupReceived,
      analyticsDistinctId,
      { ...analyticsBase, outcome: "new" },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Waitlist signup error:", error);
    await captureServerAnalyticsEvent(
      ANALYTICS_EVENTS.waitlistSignupFailed,
      undefined,
      { route: "/api/waitlist", reason: "unhandled_error" },
    );
    return NextResponse.json({ error: "something went wrong. please try again." }, { status: 500 });
  }
}
