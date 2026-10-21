"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, X } from "lucide-react";

import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { captureAnalyticsEvent, getAnalyticsDistinctId } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import {
  AVAILABILITY,
  FILMED,
  HELP_WITH,
  OPTIONAL_TERMS,
  REQUIRED_TERMS,
  TALKING,
  WHAT_ARE_YOU,
  type HelpWith,
} from "@/lib/team-options";
import { cn } from "@/lib/utils";

// The Studio "join the team" pop-up: page 1 is about you, page 2 is the small
// print. A native <dialog> keeps focus inside it and closes on Escape.

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "h-11 w-full bg-white px-3.5 text-base text-black placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-black";
const labelClass = "text-sm font-semibold";

function Chip({
  on,
  onClick,
  children,
  role,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
  role?: "radio";
}) {
  return (
    <button
      aria-checked={role === "radio" ? on : undefined}
      aria-pressed={role === "radio" ? undefined : on}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 rounded-none px-3.5 py-1.5 text-left font-display text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
        on ? "bg-[var(--nuclii-lime)] text-black" : "bg-white text-black hover:bg-black/[0.06]",
      )}
      onClick={onClick}
      role={role}
      style={ticketPillStyle}
      type="button"
    >
      {on && <Check aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={3} />}
      {children}
    </button>
  );
}

function Question({ label, children, optional }: { label: string; children: ReactNode; optional?: boolean }) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label} {optional && <span className="font-normal text-black/40">(optional)</span>}
      </legend>
      <div className="!mt-2.5 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function JoinTeamDialog({ open, role, onClose }: { open: boolean; role: HelpWith | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState<1 | 2>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [over18, setOver18] = useState<boolean | null>(null);
  const [student, setStudent] = useState<boolean | null>(null);
  const [uni, setUni] = useState("");
  const [socials, setSocials] = useState("");
  const [whatAreYou, setWhatAreYou] = useState<string[]>([]);
  // the role from the torn tab starts ticked (the dialog remounts each time it opens)
  const [helpWith, setHelpWith] = useState<string[]>(role ? [role] : []);
  const [talking, setTalking] = useState("");
  const [filmed, setFilmed] = useState("");
  const [availability, setAvailability] = useState("");
  const [idea, setIdea] = useState("");
  const [anythingElse, setAnythingElse] = useState("");
  const [terms, setTerms] = useState<boolean[]>(REQUIRED_TERMS.map(() => false));
  const [whatsapp, setWhatsapp] = useState(false);
  const [updates, setUpdates] = useState(false);

  // open/close the native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const toggle = (list: string[], set: (next: string[]) => void, value: string) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    if (status === "error") setStatus("idle");
  };

  const pageOneProblem = () =>
    !name.trim()
      ? "add your name."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? "enter a valid email address."
        : !phone.trim()
          ? "add your phone number."
          : !city.trim()
            ? "add your city."
            : over18 === null
              ? "let us know if you're 18 or over."
              : student === null
                ? "let us know if you're a student."
                : student && !uni.trim()
                  ? "add your uni."
                  : whatAreYou.length === 0
                    ? "pick at least one thing you are."
                    : helpWith.length === 0
                      ? "pick at least one thing to help with."
                      : !talking
                        ? "tell us how you are with new people."
                        : !filmed
                          ? "tell us how you feel about being filmed."
                          : !availability
                            ? "tell us how available you are."
                            : "";

  const next = () => {
    const problem = pageOneProblem();
    if (problem) {
      setStatus("error");
      setMessage(problem);
      return;
    }
    setStatus("idle");
    setPage(2);
    dialogRef.current?.querySelector("[data-scroll]")?.scrollTo({ top: 0 });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (page === 1) return next();
    if (status === "sending") return;
    if (!terms.every(Boolean)) {
      setStatus("error");
      setMessage("tick the four required boxes to join.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
          over18,
          student,
          uni,
          socials,
          whatAreYou,
          helpWith,
          talking,
          filmed,
          availability,
          idea,
          anythingElse,
          termsAccepted: true,
          whatsapp,
          updates,
          analyticsDistinctId: getAnalyticsDistinctId(),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "something went wrong. please try again.");
      setStatus("sent");
      captureAnalyticsEvent(ANALYTICS_EVENTS.teamApplicationSubmitted, { help_with: helpWith.join(",") });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "something went wrong. please try again.");
      captureAnalyticsEvent(ANALYTICS_EVENTS.teamApplicationFailed, {});
    }
  };

  const under18 = over18 === false;

  return (
    <dialog
      aria-labelledby="team-dialog-title"
      className="m-auto max-h-[min(92svh,52rem)] w-[min(40rem,calc(100vw-1.5rem))] overflow-hidden bg-[#F7F7FA] p-0 text-black shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] [color-scheme:light] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // a click on the backdrop (outside the panel) closes it
        if (event.target === dialogRef.current) onClose();
      }}
      ref={dialogRef}
    >
      <div className="flex max-h-[min(92svh,52rem)] flex-col">
        {/* header */}
        <div className="flex items-center justify-between gap-4 bg-[#0A0A0B] px-5 py-4 text-white sm:px-7">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--nuclii-lime)]">
              {status === "sent" ? "done" : `${page} of 2 · ${page === 1 ? "about you" : "the small print"}`}
            </p>
            <h2 className="!mt-1 font-display text-xl !font-bold lowercase !text-white" id="team-dialog-title">
              join the team
            </h2>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nuclii-lime)]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        {/* progress */}
        <div aria-hidden="true" className="h-1 bg-black/10">
          <div
            className="h-full bg-[var(--nuclii-lime)] transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: status === "sent" ? "100%" : page === 1 ? "50%" : "100%" }}
          />
        </div>

        {status === "sent" ? (
          <div className="px-5 py-10 sm:px-7" role="status">
            <p className="font-display text-3xl font-bold lowercase">you&apos;re in, {name.split(" ")[0]}.</p>
            <p className="!mt-3 text-base text-black/60">
              Thanks for putting your hand up. We&apos;ve sent a confirmation to {email} and we&apos;ll be in touch.
            </p>
            <button
              className="!mt-8 inline-flex h-11 items-center rounded-none bg-[#0A0A0B] px-6 font-display text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              onClick={onClose}
              style={ticketPillStyle}
              type="button"
            >
              close
            </button>
          </div>
        ) : (
          <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={submit}>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7" data-scroll>
              {page === 1 ? (
                <div className="flex flex-col gap-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>Name</span>
                      <input autoComplete="name" className={fieldClass} onChange={(e) => setName(e.target.value)} value={name} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>Email</span>
                      <input
                        autoComplete="email"
                        className={fieldClass}
                        inputMode="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        value={email}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>Phone number</span>
                      <input
                        autoComplete="tel"
                        className={fieldClass}
                        inputMode="tel"
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        value={phone}
                      />
                      <span className="text-xs text-black/45">only used to reach you about the team</span>
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className={labelClass}>City</span>
                      <input
                        autoComplete="address-level2"
                        className={fieldClass}
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                      />
                    </label>
                  </div>

                  <Question label="Are you 18 or over?">
                    <Chip on={over18 === true} onClick={() => setOver18(true)} role="radio">
                      yes
                    </Chip>
                    <Chip on={over18 === false} onClick={() => setOver18(false)} role="radio">
                      no
                    </Chip>
                  </Question>

                  {under18 ? (
                    <p className="bg-white p-5 text-base">
                      nuclii is 18+ for now, so we can&apos;t add you yet, but we appreciate the love.
                    </p>
                  ) : (
                    <>
                      <Question label="Are you a student?">
                        <Chip on={student === true} onClick={() => setStudent(true)} role="radio">
                          yes
                        </Chip>
                        <Chip on={student === false} onClick={() => setStudent(false)} role="radio">
                          no
                        </Chip>
                      </Question>
                      {student && (
                        <label className="-mt-2 flex flex-col gap-1.5">
                          <span className={labelClass}>Which uni?</span>
                          <input className={fieldClass} onChange={(e) => setUni(e.target.value)} value={uni} />
                        </label>
                      )}

                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>
                          Your Instagram or TikTok <span className="font-normal text-black/40">(optional)</span>
                        </span>
                        <input
                          className={fieldClass}
                          onChange={(e) => setSocials(e.target.value)}
                          placeholder="@"
                          value={socials}
                        />
                        <span className="text-xs text-black/45">helps us get a feel for you. no followers needed.</span>
                      </label>

                      <Question label="What are you? Pick all that apply.">
                        {WHAT_ARE_YOU.map((option) => (
                          <Chip key={option} on={whatAreYou.includes(option)} onClick={() => toggle(whatAreYou, setWhatAreYou, option)}>
                            {option}
                          </Chip>
                        ))}
                      </Question>
                      <Question label="What do you want to help with? Pick all that apply.">
                        {HELP_WITH.map((option) => (
                          <Chip key={option} on={helpWith.includes(option)} onClick={() => toggle(helpWith, setHelpWith, option)}>
                            {option}
                          </Chip>
                        ))}
                      </Question>

                      <p className="!mt-2 border-t-2 border-dashed border-black/15 pt-5 font-display text-lg font-bold lowercase">
                        a bit about you
                      </p>
                      <Question label="How comfortable are you talking to new people?">
                        {TALKING.map((option) => (
                          <Chip key={option} on={talking === option} onClick={() => setTalking(option)} role="radio">
                            {option}
                          </Chip>
                        ))}
                      </Question>
                      <Question label="Happy to be filmed for nuclii content?">
                        {FILMED.map((option) => (
                          <Chip key={option} on={filmed === option} onClick={() => setFilmed(option)} role="radio">
                            {option}
                          </Chip>
                        ))}
                      </Question>
                      <Question label="How available are you?">
                        {AVAILABILITY.map((option) => (
                          <Chip key={option} on={availability === option} onClick={() => setAvailability(option)} role="radio">
                            {option}
                          </Chip>
                        ))}
                      </Question>
                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>
                          One campaign idea nuclii should do. Nothing is too insane.{" "}
                          <span className="font-normal text-black/40">(optional)</span>
                        </span>
                        <textarea
                          className={cn(fieldClass, "h-20 resize-none py-2.5")}
                          maxLength={600}
                          onChange={(e) => setIdea(e.target.value)}
                          value={idea}
                        />
                      </label>
                      <label className="flex flex-col gap-1.5">
                        <span className={labelClass}>
                          Anything else we should know? <span className="font-normal text-black/40">(optional)</span>
                        </span>
                        <textarea
                          className={cn(fieldClass, "h-20 resize-none py-2.5")}
                          maxLength={600}
                          onChange={(e) => setAnythingElse(e.target.value)}
                          value={anythingElse}
                        />
                      </label>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <p className="text-base text-black/65">
                    We share some campaigns, drops and ideas before they&apos;re public. Nothing scary, just don&apos;t
                    leak, copy or cut around the team.
                  </p>
                  <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Required</legend>
                    {REQUIRED_TERMS.map((term, index) => (
                      <label className="!mt-1 flex items-start gap-3 bg-white p-3.5 text-sm leading-relaxed" key={term}>
                        <input
                          checked={terms[index]}
                          className="!mt-0.5 size-5 shrink-0 accent-black"
                          onChange={(e) => {
                            setTerms((current) => current.map((v, i) => (i === index ? e.target.checked : v)));
                            if (status === "error") setStatus("idle");
                          }}
                          type="checkbox"
                        />
                        {term}
                      </label>
                    ))}
                  </fieldset>
                  <fieldset className="flex flex-col gap-3">
                    <legend className={labelClass}>Optional</legend>
                    <label className="!mt-1 flex items-start gap-3 p-1 text-sm leading-relaxed">
                      <input
                        checked={whatsapp}
                        className="!mt-0.5 size-5 shrink-0 accent-black"
                        onChange={(e) => setWhatsapp(e.target.checked)}
                        type="checkbox"
                      />
                      {OPTIONAL_TERMS.whatsapp}
                    </label>
                    <label className="flex items-start gap-3 p-1 text-sm leading-relaxed">
                      <input
                        checked={updates}
                        className="!mt-0.5 size-5 shrink-0 accent-black"
                        onChange={(e) => setUpdates(e.target.checked)}
                        type="checkbox"
                      />
                      {OPTIONAL_TERMS.updates}
                    </label>
                  </fieldset>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex flex-wrap items-center gap-3 border-t border-black/10 bg-white px-5 py-4 sm:px-7">
              {page === 2 && (
                <button
                  className="h-11 px-2 text-sm font-semibold text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  onClick={() => {
                    setPage(1);
                    setStatus("idle");
                  }}
                  type="button"
                >
                  back
                </button>
              )}
              <p aria-live="polite" className="min-w-0 flex-1 text-sm font-medium text-[#C2361B]">
                {status === "error" ? message : ""}
              </p>
              <button
                className="inline-flex h-11 items-center rounded-none bg-[#0A0A0B] px-7 font-display text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                disabled={under18 || status === "sending"}
                style={ticketPillStyle}
                type="submit"
              >
                {page === 1 ? "next" : status === "sending" ? "sending…" : "join"}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

export { JoinTeamDialog };
