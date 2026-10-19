import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { captureServerAnalyticsEvent } from "@/lib/server-analytics";

// The footer's "stay updated!" mailing list. Separate from the waitlist: no
// role or age step, no early-access email and no waitlist count; it only adds
// the email to the Resend audience as opted in to updates. Set
// RESEND_UPDATES_AUDIENCE_ID to keep it in its own audience; otherwise it
// shares the waitlist audience.

const AUDIENCE_ID = process.env.RESEND_UPDATES_AUDIENCE_ID ?? process.env.RESEND_AUDIENCE_ID ?? "";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; analyticsDistinctId?: string };
    const email = body.email?.trim().slice(0, 254) ?? "";
    const analyticsDistinctId = body.analyticsDistinctId?.trim().slice(0, 180) || undefined;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "enter a valid email address." }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend || !AUDIENCE_ID) {
      console.warn("[Nuclii] Resend not configured, updates signup not saved");
      await captureServerAnalyticsEvent(ANALYTICS_EVENTS.updatesSignupReceived, analyticsDistinctId, {
        route: "/api/updates",
        outcome: "accepted_without_resend",
      });
      return NextResponse.json({ success: true, warn: "no_key" });
    }

    const { data: existing } = await resend.contacts.get({ audienceId: AUDIENCE_ID, email });
    if (existing) {
      // already on the list: make sure they're opted in to updates now
      if (existing.unsubscribed) {
        await resend.contacts.update({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
      }
    } else {
      await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
    }

    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.updatesSignupReceived, analyticsDistinctId, {
      route: "/api/updates",
      outcome: existing ? "existing_contact" : "new",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Updates signup error:", error);
    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.updatesSignupFailed, undefined, {
      route: "/api/updates",
      reason: "unhandled_error",
    });
    return NextResponse.json({ error: "something went wrong. please try again." }, { status: 500 });
  }
}
