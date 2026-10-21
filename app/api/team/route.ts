import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { captureServerAnalyticsEvent } from "@/lib/server-analytics";
import { AVAILABILITY, FILMED, HELP_WITH, TALKING, WHAT_ARE_YOU } from "@/lib/team-options";

// The Studio "join the team" pop-up. Emails each application to the team
// (TEAM_EMAIL) and sends the applicant a short confirmation. If they opted in
// to updates, they're also added to the Resend audience.

const TO_EMAIL = process.env.TEAM_EMAIL ?? "hello.nuclii@gmail.com";
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
const long = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const pick = (value: unknown, allowed: readonly string[]) =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && allowed.includes(v)) : [];
const one = (value: unknown, allowed: readonly string[]) =>
  typeof value === "string" && allowed.includes(value) ? value : "";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const phone = clean(body.phone, 40);
    const city = clean(body.city, 80);
    const student = body.student === true;
    const uni = student ? clean(body.uni, 120) : "";
    const socials = clean(body.socials, 160);
    const whatAreYou = pick(body.whatAreYou, WHAT_ARE_YOU);
    const helpWith = pick(body.helpWith, HELP_WITH);
    const talking = one(body.talking, TALKING);
    const filmed = one(body.filmed, FILMED);
    const availability = one(body.availability, AVAILABILITY);
    const idea = long(body.idea, 600);
    const anythingElse = long(body.anythingElse, 600);
    const termsAccepted = body.termsAccepted === true;
    const whatsapp = body.whatsapp === true;
    const updates = body.updates === true;
    const analyticsDistinctId = clean(body.analyticsDistinctId, 180) || undefined;

    const missing =
      !name || !EMAIL_REGEX.test(email) || !phone || !city || (student && !uni) || whatAreYou.length === 0;
    if (missing || helpWith.length === 0 || !talking || !filmed || !availability) {
      return NextResponse.json({ error: "some answers are missing. go back and check page 1." }, { status: 400 });
    }
    if (body.over18 !== true) return NextResponse.json({ error: "nuclii is 18+ for now." }, { status: 400 });
    if (!termsAccepted) return NextResponse.json({ error: "tick the four required boxes to join." }, { status: 400 });

    const resend = getResendClient();
    if (!resend) {
      console.error("[Nuclii] Join-the-team form not configured (RESEND_API_KEY)");
      return NextResponse.json(
        { error: "we can't send this right now. email hello.nuclii@gmail.com and we'll pick it up." },
        { status: 503 },
      );
    }

    const rows: [string, string][] = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["City", city],
      ["Student", student ? `yes, ${uni}` : "no"],
      ["Socials", socials || "—"],
      ["What they are", whatAreYou.join(", ")],
      ["Want to help with", helpWith.join(", ")],
      ["Talking to new people", talking],
      ["Being filmed", filmed],
      ["Availability", availability],
      ["Campaign idea", idea || "—"],
      ["Anything else", anythingElse || "—"],
      ["WhatsApp group", whatsapp ? "yes, add them if selected" : "no"],
      ["Updates", updates ? "opted in" : "not opted in"],
    ];
    const table = rows
      .map(
        ([label, value]) =>
          `<p style="margin:0 0 4px;font-size:13px;color:#a1a1aa">${label}</p><p style="margin:0 0 14px;font-size:15px;font-weight:600;white-space:pre-wrap">${escapeHtml(value)}</p>`,
      )
      .join("");

    await resend.emails.send({
      from: `Nuclii <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `First wave: ${name} (${helpWith.join(", ")})`,
      html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px"><h1 style="font-size:20px;margin:0 0 18px">New join-the-team application</h1><div style="background:#18191d;border:1px solid #26282f;border-radius:12px;padding:16px 20px">${table}</div><p style="margin:20px 0 0;font-size:12px;color:#a1a1aa">They've agreed to the four required terms. Reply to this email to answer them directly.</p></div>`,
    });

    const followUps = await Promise.allSettled([
      resend.emails.send({
        from: `Nuclii <${FROM_EMAIL}>`,
        to: [email],
        replyTo: TO_EMAIL,
        subject: "you're on the nuclii first wave list",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:28px 24px;background:#0a0a0b;color:#f7f7fa;border-radius:16px"><h1 style="font-size:20px;margin:0 0 12px">you're in, ${escapeHtml(name.split(" ")[0])}.</h1><p style="font-size:15px;color:#a1a1aa;line-height:1.6;margin:0">thanks for putting your hand up for the nuclii first wave. we'll be in touch.</p></div>`,
      }),
      updates && AUDIENCE_ID
        ? resend.contacts.create({ audienceId: AUDIENCE_ID, email, firstName: name.split(" ")[0], unsubscribed: false })
        : Promise.resolve(null),
    ]);
    for (const result of followUps) {
      if (result.status === "rejected") console.error("[Nuclii] Join-the-team follow-up error:", result.reason);
    }

    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.teamApplicationReceived, analyticsDistinctId, {
      route: "/api/team",
      help_with: helpWith.join(","),
      student,
      whatsapp,
      marketing_consent: updates,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Nuclii] Join-the-team error:", error);
    await captureServerAnalyticsEvent(ANALYTICS_EVENTS.teamApplicationFailed, undefined, {
      route: "/api/team",
      reason: "unhandled_error",
    });
    return NextResponse.json({ error: "something went wrong. please try again." }, { status: 500 });
  }
}
