"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, Check } from "lucide-react";

import { useLessMotion } from "@/components/motion/use-less-motion";
import { benefits, partnerLooks } from "@/components/partner/partner-content";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { captureAnalyticsEvent, getAnalyticsDistinctId } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { EVENT_KINDS, PARTNER_TYPES, REPLY_TIME, WAYS, type PartnerTypeId } from "@/lib/partner-options";
import { cn } from "@/lib/utils";

// /partner: working with the nuclii team directly. Pick who you are at the top
// and the page shows what partnering looks like for you (and pre-selects it in
// the form). The form builds a live "partner pass" ticket as you fill it in,
// which gets stamped when it's sent. Applications are emailed to the team.

const ease = [0.32, 0.72, 0, 1] as const;
const eyebrow = "text-xs font-semibold uppercase tracking-[0.06em] sm:text-sm";
const sectionX = "px-[var(--container-x)]";
const inner = "mx-auto w-full max-w-[80rem]";
const h2Class = "font-display text-[clamp(2.1rem,3.6vw,3.25rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em]";

type Status = "idle" | "sending" | "sent" | "error";

const labelOf = (id: PartnerTypeId) => PARTNER_TYPES.find((t) => t.id === id)!.label;

// a ticket-shaped toggle used for every pick on the page
function Chip({
  on,
  onClick,
  children,
  tone = "dark",
  role,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "dark" | "light";
  role?: "radio";
}) {
  return (
    <button
      aria-checked={role === "radio" ? on : undefined}
      aria-pressed={role === "radio" ? undefined : on}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-none px-4 py-2 text-left font-display text-sm font-semibold transition-[background-color,transform] duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none motion-reduce:active:scale-100",
        on
          ? "bg-[var(--nuclii-lime)] text-black"
          : tone === "dark"
            ? "bg-white/[0.08] text-white hover:bg-white/[0.16]"
            : "bg-white text-black hover:bg-black/[0.06]",
      )}
      onClick={onClick}
      role={role}
      style={ticketPillStyle}
      type="button"
    >
      {on && <Check aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />}
      {children}
    </button>
  );
}

// ---------- the live partner pass ----------

function PartnerPass({
  name,
  type,
  area,
  events,
  ways,
  sent,
  still,
}: {
  name: string;
  type: PartnerTypeId;
  area: string;
  events: string[];
  ways: string[];
  sent: boolean;
  still: boolean;
}) {
  const pop = still ? false : { opacity: 0, scale: 0.8 };
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="flex bg-[#0A0A0B] text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
        style={{ ...ticketPillStyle, fontSize: "1.8rem" }}
      >
        <div className="min-w-0 flex-1 p-6 text-base">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--nuclii-lime)]">
            nuclii partner pass
          </p>
          <p className={cn("!mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.02em]", !name && "text-white/30")}>
            {name || "your name"}
          </p>
          <p className="!mt-1 text-sm text-white/60">
            {labelOf(type)}
            {area ? ` · ${area}` : ""}
          </p>

          <div className="!mt-5 flex min-h-8 flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {events.length === 0 && (
                <motion.span animate={{ opacity: 1 }} className="text-sm text-white/30" exit={{ opacity: 0 }} initial={false} key="none">
                  your events will show here
                </motion.span>
              )}
              {events.map((event) => (
                <motion.span
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 px-2 py-1 text-xs font-semibold"
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={pop}
                  key={event}
                  layout={!still}
                  transition={{ duration: 0.25, ease }}
                >
                  {event}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          {ways.length > 0 && <p className="!mt-3 text-xs leading-relaxed text-white/50">{ways.join(" · ")}</p>}
        </div>
        <div className="flex w-[22%] shrink-0 flex-col items-center justify-center gap-1 border-l-2 border-dotted border-white/25 font-display">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/45">admit</span>
          <span className="text-2xl font-extrabold">01</span>
        </div>
      </div>

      {/* the stamp, once it's sent */}
      <AnimatePresence>
        {sent && (
          <motion.span
            animate={{ opacity: 1, scale: 1, rotate: -10 }}
            className="absolute -right-2 -top-5 bg-[var(--nuclii-lime)] px-4 py-2 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]"
            initial={still ? false : { opacity: 0, scale: 1.8, rotate: -18 }}
            style={ticketPillStyle}
            transition={{ duration: 0.4, ease: [0.2, 1.4, 0.4, 1] }}
          >
            sent
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- the page ----------

function PartnerPage() {
  const id = useId();
  const lessMotion = useLessMotion();
  const [type, setType] = useState<PartnerTypeId>("society");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [link, setLink] = useState("");
  const [area, setArea] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [ways, setWays] = useState<string[]>([]);
  const [idea, setIdea] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // an error clears as soon as the visitor changes anything
  const clearError = () => {
    if (status === "error") setStatus("idle");
  };

  const toggle = (list: string[], set: (next: string[]) => void, value: string) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    clearError();
  };

  const pickType = (next: PartnerTypeId, location: string) => {
    setType(next);
    clearError();
    captureAnalyticsEvent(ANALYTICS_EVENTS.partnerTypePicked, { partner_type: next, location });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const problem = !name.trim()
      ? "add your name."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? "enter a valid email address."
        : !area.trim()
          ? "add your area or postcode."
          : events.length === 0
            ? "pick at least one kind of event."
            : !ageConfirmed
              ? "please confirm you're 18 or older."
              : "";
    if (problem) {
      setStatus("error");
      setMessage(problem);
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          type,
          organisation,
          link,
          area,
          events,
          ways,
          idea,
          ageConfirmed,
          consent,
          analyticsDistinctId: getAnalyticsDistinctId(),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "something went wrong. please try again.");
      setStatus("sent");
      captureAnalyticsEvent(ANALYTICS_EVENTS.partnerApplicationSubmitted, { partner_type: type });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "something went wrong. please try again.");
      captureAnalyticsEvent(ANALYTICS_EVENTS.partnerApplicationFailed, { partner_type: type });
    }
  };

  const look = partnerLooks[type];
  const field =
    "h-12 w-full bg-white px-4 text-base text-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-black";
  const fieldLabel = "text-sm font-semibold";

  return (
    <main>
      {/* who are you? */}
      <section
        aria-labelledby="partner-heading"
        className={cn("bg-[#0A0A0B] pb-[clamp(4rem,8vw,6.5rem)] pt-[clamp(8rem,16vw,12rem)] text-white", sectionX)}
        data-analytics-section="partner_hero"
      >
        <div className={cn(inner, "grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16")}>
          <div>
            <p className={cn(eyebrow, "text-white/55")}>partner with us</p>
            <h1
              className="!mt-6 font-display text-[clamp(2.75rem,6vw,5.5rem)] !font-bold lowercase leading-[0.98] tracking-[-0.04em] !text-white"
              id="partner-heading"
            >
              let&apos;s make something together.
            </h1>
            <p className="!mt-6 max-w-[34rem] text-base leading-relaxed text-white/70 sm:text-lg">
              Work with the nuclii team directly: co-host, get featured, get recommended. Tell us who you are and
              we&apos;ll reply within {REPLY_TIME}.
            </p>

            <p className={cn(eyebrow, "!mt-10 text-white/45")}>who are you?</p>
            <div aria-label="Who are you?" className="!mt-3 flex flex-wrap gap-2.5" role="radiogroup">
              {PARTNER_TYPES.map((t) => (
                <Chip key={t.id} on={type === t.id} onClick={() => pickType(t.id, "hero")} role="radio">
                  {t.label}
                  {"soon" in t && t.soon && (
                    <span className={cn("text-[0.65rem] uppercase tracking-[0.08em]", type === t.id ? "text-black/55" : "text-white/45")}>
                      soon
                    </span>
                  )}
                </Chip>
              ))}
            </div>
          </div>

          {/* what it looks like for you */}
          <div className="relative min-h-[18rem] lg:pt-24" aria-live="polite">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-7 text-black sm:p-8"
                exit={lessMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                initial={lessMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                key={type}
                style={{ ...ticketPillStyle, fontSize: "1.8rem" }}
                transition={{ duration: 0.35, ease }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-black/45">
                  for {labelOf(type)}
                </p>
                <p className="!mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold lowercase leading-tight tracking-[-0.02em]">
                  {look.headline}
                </p>
                <ul className="!mt-5 flex flex-col gap-3 text-base">
                  {look.points.map((point) => (
                    <li className="flex items-start gap-3" key={point}>
                      <span className="!mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--nuclii-lime)]">
                        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  className="!mt-7 inline-flex h-11 items-center gap-2 rounded-none bg-[#0A0A0B] px-5 font-display text-sm font-semibold !text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href="#apply"
                  style={ticketPillStyle}
                >
                  {type === "brand" ? "register interest" : "apply to partner"}
                  <ArrowDown aria-hidden="true" className="size-4" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* what partners get */}
      <section
        aria-labelledby="benefits-heading"
        className={cn("bg-[#F7F7FA] py-[clamp(4rem,8vw,7rem)] text-black", sectionX)}
        data-analytics-section="partner_benefits"
      >
        <div className={inner}>
          <h2 className={cn(h2Class, "!text-black")} id="benefits-heading">
            what partners get.
          </h2>
          <ul className="!mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ title, line, icon: Icon }, index) => (
              <li
                className="group flex flex-col bg-white p-6 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:rotate-[-0.6deg] motion-reduce:transition-none motion-reduce:hover:transform-none"
                key={title}
                style={{ ...ticketPillStyle, fontSize: "1.3rem" }}
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center bg-[#0A0A0B] text-[var(--nuclii-lime)] transition-colors duration-300 group-hover:bg-[var(--nuclii-lime)] group-hover:text-black">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="text-xs font-semibold text-black/30">{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="!mt-5 font-display text-lg font-bold lowercase leading-tight">{title}</span>
                <span className="!mt-2 text-sm leading-relaxed text-black/60">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* how it works */}
      <section
        aria-labelledby="how-heading"
        className={cn("bg-[#0A0A0B] py-[clamp(4rem,8vw,6.5rem)] text-white", sectionX)}
        data-analytics-section="partner_how"
      >
        <div className={inner}>
          <h2 className={cn(h2Class, "!text-white")} id="how-heading">
            how it works.
          </h2>
          <ol className="!mt-10 grid gap-3 md:grid-cols-3">
            {[
              ["tell us who you are", "pick your type and the events you'd like to make. two minutes, tops."],
              ["we reply", `someone from the team gets back to you within ${REPLY_TIME}.`],
              ["we plan the first thing together", "an event, a Studio night, a feature: whatever fits you best."],
            ].map(([title, line], index) => (
              <li className="flex flex-col bg-white/[0.06] p-6" key={title} style={{ ...ticketPillStyle, fontSize: "1.3rem" }}>
                <span className="font-display text-4xl font-extrabold text-[var(--nuclii-lime)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="!mt-4 font-display text-lg font-bold lowercase">{title}</span>
                <span className="!mt-2 text-sm leading-relaxed text-white/60">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* the form, and the pass it builds */}
      <section
        aria-labelledby="apply-heading"
        className={cn("scroll-mt-20 bg-[#F7F7FA] py-[clamp(4rem,8vw,7rem)] text-black [color-scheme:light]", sectionX)}
        data-analytics-section="partner_apply"
        id="apply"
      >
        <div className={cn(inner, "grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16")}>
          <div>
            <h2 className={cn(h2Class, "!text-black")} id="apply-heading">
              {type === "brand" ? "register your interest." : "apply to partner."}
            </h2>
            <p className="!mt-4 max-w-[32rem] text-base leading-relaxed text-black/60 sm:text-lg">
              Fill it in and watch your pass come together. We&apos;ll reply within {REPLY_TIME}.
            </p>

            {status === "sent" ? (
              <div className="!mt-10 max-w-[32rem] bg-white p-7" role="status">
                <p className="font-display text-2xl font-bold lowercase">thanks, {name.split(" ")[0]}. it&apos;s with us.</p>
                <p className="!mt-2 text-base text-black/60">
                  We&apos;ve sent a confirmation to {email}. Someone from the team will reply within {REPLY_TIME}.
                </p>
              </div>
            ) : (
              <form
                aria-labelledby="apply-heading"
                className="!mt-10 flex flex-col gap-7"
                noValidate
                onChange={clearError}
                onSubmit={submit}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className={fieldLabel}>Name</span>
                    <input autoComplete="name" className={field} onChange={(e) => setName(e.target.value)} required value={name} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={fieldLabel}>Email</span>
                    <input
                      autoComplete="email"
                      className={field}
                      inputMode="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      value={email}
                    />
                  </label>
                </div>

                <fieldset>
                  <legend className={fieldLabel}>I&apos;m a…</legend>
                  <div className="!mt-3 flex flex-wrap gap-2" role="radiogroup">
                    {PARTNER_TYPES.map((t) => (
                      <Chip key={t.id} on={type === t.id} onClick={() => pickType(t.id, "form")} role="radio" tone="light">
                        {t.label}
                        {"soon" in t && t.soon ? " (soon)" : ""}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="flex flex-col gap-2">
                    <span className={fieldLabel}>
                      Organisation or handle <span className="font-normal text-black/40">(optional)</span>
                    </span>
                    <input className={field} onChange={(e) => setOrganisation(e.target.value)} value={organisation} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={fieldLabel}>
                      Instagram or website <span className="font-normal text-black/40">(optional)</span>
                    </span>
                    <input className={field} inputMode="url" onChange={(e) => setLink(e.target.value)} value={link} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={fieldLabel}>Area or postcode</span>
                    <input
                      autoComplete="postal-code"
                      className={field}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. B5"
                      required
                      value={area}
                    />
                  </label>
                </div>

                <fieldset>
                  <legend className={fieldLabel}>Events you&apos;d like to collaborate on</legend>
                  <div className="!mt-3 flex flex-wrap gap-2">
                    {EVENT_KINDS.map((kind) => (
                      <Chip key={kind} on={events.includes(kind)} onClick={() => toggle(events, setEvents, kind)} tone="light">
                        {kind}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className={fieldLabel}>
                    How you&apos;d like to work with us <span className="font-normal text-black/40">(optional)</span>
                  </legend>
                  <div className="!mt-3 flex flex-wrap gap-2">
                    {WAYS.map((way) => (
                      <Chip key={way} on={ways.includes(way)} onClick={() => toggle(ways, setWays, way)} tone="light">
                        {way}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <label className="flex flex-col gap-2">
                  <span className={fieldLabel}>
                    Your idea, in a line or two <span className="font-normal text-black/40">(optional)</span>
                  </span>
                  <textarea
                    className={cn(field, "h-28 resize-none py-3")}
                    maxLength={600}
                    onChange={(e) => setIdea(e.target.value)}
                    value={idea}
                  />
                </label>

                <div className="flex flex-col gap-3 text-sm">
                  <label className="flex items-start gap-3">
                    <input
                      checked={ageConfirmed}
                      className="!mt-0.5 size-5 shrink-0 accent-black"
                      onChange={(e) => setAgeConfirmed(e.target.checked)}
                      type="checkbox"
                    />
                    I&apos;m 18 or older.
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      checked={consent}
                      className="!mt-0.5 size-5 shrink-0 accent-black"
                      onChange={(e) => setConsent(e.target.checked)}
                      type="checkbox"
                    />
                    Send me nuclii updates too. Unsubscribe any time.
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    className="inline-flex h-12 items-center gap-2 rounded-none bg-[#0A0A0B] px-7 font-display text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                    disabled={status === "sending"}
                    style={ticketPillStyle}
                    type="submit"
                  >
                    {status === "sending" ? "sending…" : type === "brand" ? "register interest" : "send my application"}
                  </button>
                  <p aria-live="polite" className="text-sm font-medium text-[#C2361B]" id={`${id}-message`}>
                    {status === "error" ? message : ""}
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start lg:pt-24">
            <PartnerPass
              area={area}
              events={events}
              name={name}
              sent={status === "sent"}
              still={lessMotion}
              type={type}
              ways={ways}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export { PartnerPage };
