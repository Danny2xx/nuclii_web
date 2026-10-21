import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { EVENT_KINDS, PARTNER_TYPES, REPLY_TIME, WAYS } from "@/lib/partner-options";
import { captureServerAnalyticsEvent } from "@/lib/server-analytics";

// The Partner page form. Emails each application to the team (PARTNER_EMAIL,
// or hello.nuclii@gmail.com) and sends the applicant a short confirmation.
// If they opted in to updates, they're also added to the Resend audience.

const TO_EMAIL = process.env.PARTNER_EMAIL ?? "hello.nuclii@gmail.com";
const FROM_EMAIL = process.env.NUCLII_FROM_EMAIL ?? "onboarding@resend.dev";
const AUDIENCE_ID = process.env.RESEND_UPDATES_AUDIENCE_ID ?? process.env.RESEND_AUDIENCE_ID ?? "";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let resendClient: Resend | null = null;
function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
const pick = (value: unknown, allowed: readonly string[]) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && allowed.includes(v)) : [];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const type = PARTNER_TYPES.find((t) => t.id === body.type);
    const organisation = clean(body.organisation, 160);
    const link = clean(body.link, 300);
    const area = clean(body.area, 80);
    const events = pick(body.events, EVENT_KINDS);
    const ways = pick(body.ways, WAYS);
    const idea = typeof body.idea === "string" ? body.idea.trim().slice(0, 600) : "";
    const ageConfirmed = body.ageConfirmed === true;
    const consent = body.consent === true;
    const analyticsDistinctId = clean(body.analyticsDistinctId, 180) || undefined;

    if (!name) return NextResponse.json({ error: "add your name." }, { status: 400 });
    if (!EMAIL_REGEX.test(email)) return NextResponse.json({ error: "enter a valid email address." }, { status: 400 });
    if (!type) return NextResponse.json({ error: "choose who you are." }, { status: 400 });
    if (!area) return NextResponse.json({ error: "add your area or postcode." }, { status: 400 });
    if (events.length === 0) return NextResponse.json({ error: "pick at least one kind of event." }, { status: 400 });
    if (!ageConfirmed) return NextResponse.json({ error: "please confirm you're 18 or older." }, { status: 400 });

    const resend = getResendClient();
    if (!resend) {
      console.error("[Nuclii] Partner form not configured (RESEND_API_KEY / PARTNER_EMAIL)");
      return NextResponse.json(
        { error: "we can't send this right now. email hello.nuclii@gmail.com and we'll pick it up." },
        { status: 503 },
      );
    }

    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Partner type", type.label],
      ["Organisation / handle", organisation || "—"],
      ["Link", link || "—"],
      ["Area / postcode", area],
      ["Events", events.join(", ")],
      ["How they'd like to work with us", ways.join(", ") || "—"],
      ["Idea", idea || "—"],
      ["Updates", consent ? "opted in" : "not opted in"],
    ];
    const table = rows
      .map(
        ([label, value]) =>
          `<p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">${label}</p><p style="margin:0 0 14px;font-size:15px;font-weight:600;white-space:pre-wrap">${escapeHtml(value)}</p>`,
      )
      .join("");

    // the team's copy is the one that matters; the applicant's confirmation can fail quietly
    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Partner application: ${type.label}: ${organisation || name}`,
      html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px"><h1 style="font-size:20px;margin:0 0 18px">New partner application</h1><div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">${table}</div><p style="margin:20px 0 0;font-size:12px;color:#a1a1aa">Reply to this email to answer them directly. We've told them to expect a reply within ${REPLY_TIME}.</p></div>`,
    });

    const followUps = await Promise.allSettled([
      resend.emails.send({
        from: `Nuclii <${FROM_EMAIL}>`,
        to: [email],
        replyTo: TO_EMAIL,
        subject: "we've got your nuclii partner application",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px"><h1 style="font-size:20px;margin:0 0 12px">thanks, ${escapeHtml(name.split(" ")[0])}.</h1><p style="font-size:15px;color:#a1a1aa;line-height:1.6;margin:0">we've got your application to partner with nuclii as ${escapeHtml(type.label)}. someone from the team will reply within ${REPLY_TIME}.</p></div>`,
      }),
      consent && AUDIENCE_ID
        ? resend.contacts.create({ audienceId: AUDIENCE_ID, email, firstName: name.split(" ")[0], unsubscribed: false })
        : Promise.resolve(null),
    ]);
    for (const result of followUps) {
      if (result.status === "rejected") console.error("[Nuclii] Partner follow-up error:", result.reason);
    }

    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.partnerApplicationReceived, analyticsDistinctId, {
      route: "/api/partner",
      partner_type: type.id,
      events: events.join(","),
      ways: ways.join(","),
      marketing_consent: consent,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Partner application error:", error);
    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.partnerApplicationFailed, undefined, {
      route: "/api/partner",
      reason: "unhandled_error",
    });
    return NextResponse.json({ error: "something went wrong. please try again." }, { status: 500 });
  }
}
