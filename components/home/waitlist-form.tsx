"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  ShareIcon,
  SparkCheckIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { useIsClient } from "@/components/motion/use-is-client";
import { Button } from "@/components/ui/button";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
  getAnalyticsDistinctId,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nuclii-waitlist-joined";

const ROLE_OPTIONS = [
  { value: "", label: "choose your path" },
  { value: "attendee", label: "attendee" },
  { value: "host", label: "host" },
  { value: "society-community", label: "society / community" },
  { value: "service-provider", label: "service provider" },
  { value: "talent-creative", label: "talent / creative" },
  { value: "venue-business", label: "venue / business" },
  { value: "partner", label: "partner" },
  { value: "investor", label: "investor" },
  { value: "team-contributor", label: "team / contributor" },
] as const;

type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];
type FilledRoleValue = Exclude<RoleValue, "">;

type WaitlistFormProps = {
  className?: string;
  defaultRole?: FilledRoleValue;
  duplicateMessage?: string;
  layout?: "default" | "hero";
  source?: string;
  submitLabel?: string;
  successMessage?: string;
};

function normalizeSource(source?: string) {
  return (source ?? "home waitlist").trim().replace(/\s+/g, " ").slice(0, 80) || "home waitlist";
}

function getStorageKey(source: string) {
  const slug = source.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${STORAGE_KEY}:${slug || "home-waitlist"}`;
}

function hasJoinedWaitlist(storageKey: string) {
  return localStorage.getItem(storageKey) === "true";
}

function getOrCreateRefCode() {
  if (typeof window === "undefined") return "";
  let code = window.localStorage.getItem("nuclii-ref");
  if (!code) {
    code = Math.random().toString(36).slice(2, 8);
    window.localStorage.setItem("nuclii-ref", code);
  }
  return code;
}

const FIELD_CLASS =
  "block min-h-12 w-full min-w-0 bg-transparent px-4 pb-3 text-base text-white outline-none transition placeholder:text-white/60 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:bg-white/[0.06] sm:text-sm";
const LABEL_CLASS = "block px-4 pt-2.5 text-[11px] font-semibold lowercase tracking-wide text-white/70";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custom checkbox with a spring-pop box and a drawn-in check stroke.
function AnimatedCheckbox({
  checked,
  children,
  disabled,
  onChange,
}: {
  checked: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-start gap-2.5 text-xs leading-5 text-white/70 transition-colors hover:text-white/90">
      <input
        checked={checked}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        required
        type="checkbox"
      />
      <motion.span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[6px] border transition-colors duration-200",
          checked ? "border-white bg-white" : "border-white/40 bg-black/50 group-hover:border-white/70",
        )}
        whileTap={{ scale: 0.82 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              animate={{ opacity: 1 }}
              className="size-3 text-black"
              exit={{ opacity: 0 }}
              fill="none"
              initial={{ opacity: 0 }}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <motion.path
                animate={{ pathLength: 1 }}
                d="m4.5 12.5 4.8 4.8L19.5 6.7"
                initial={{ pathLength: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>
      <span>{children}</span>
    </label>
  );
}

function analyticsReason(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "unknown";
}

function WaitlistForm({
  className = "",
  defaultRole,
  duplicateMessage = "you're already on the list. we'll reach out when nuclii launches.",
  layout = "default",
  source,
  submitLabel = "join the waitlist",
  successMessage = "you're on the list. we'll reach out when nuclii launches.",
}: WaitlistFormProps) {
  const isClient = useIsClient();
  const id = useId();
  const sourceLabel = normalizeSource(source);
  const storageKey = getStorageKey(sourceLabel);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleValue>(defaultRole ?? (layout === "hero" ? "attendee" : ""));
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [justJoined, setJustJoined] = useState<"new" | "duplicate" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const roleId = `${id}-role`;
  const errorId = `${id}-error`;
  const heroLayout = layout === "hero";

  const [copied, setCopied] = useState(false);
  // Stable per-visitor referral code (placeholder until backend attribution lands).
  const refCode = isClient ? getOrCreateRefCode() : "";
  const canNativeShare =
    isClient &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const shareUrl = refCode
    ? `https://nuclii.co.uk/?ref=${refCode}`
    : "https://nuclii.co.uk";
  const shareText =
    "i just joined the nuclii waitlist — every event starts here. join me:";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const formStarted = useRef(false);
  const formCompleted = useRef(false);
  const submitAttempted = useRef(false);
  const abandonmentProperties = useRef<{
    source: string;
    layout: string;
    role: string;
    has_email: boolean;
    has_name: boolean;
    age_confirmed: boolean;
    marketing_consent: boolean;
    submit_attempted: boolean;
  } | null>(null);

  function analyticsBaseProperties() {
    return {
      source: sourceLabel,
      layout,
      role: role || "not_selected",
      has_email: Boolean(email.trim()),
      has_name: Boolean(name.trim()),
    };
  }

  function trackFormStarted(trigger: string) {
    if (formStarted.current) return;

    formStarted.current = true;
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistFormStarted, {
      ...analyticsBaseProperties(),
      trigger,
    });
  }

  function setValidationError(message: string, reason: string) {
    setError(message);
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistFormError, {
      ...analyticsBaseProperties(),
      phase: "client_validation",
      reason,
    });
  }

  useEffect(() => {
    abandonmentProperties.current = {
      source: sourceLabel,
      layout,
      role: role || "not_selected",
      has_email: Boolean(email.trim()),
      has_name: Boolean(name.trim()),
      age_confirmed: ageConfirmed,
      marketing_consent: consent,
      submit_attempted: submitAttempted.current,
    };
  }, [ageConfirmed, consent, email, layout, name, role, sourceLabel]);

  useEffect(() => {
    return () => {
      if (!formStarted.current || formCompleted.current) return;

      captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistFormAbandoned, {
        ...(abandonmentProperties.current ?? {}),
        reason: "component_unmounted",
      });
    };
  }, []);

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistReferralCopied, {
        ...analyticsBaseProperties(),
        channel: "copy",
      });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; the link is still selectable */
    }
  }

  function nativeShare() {
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistShareClicked, {
      ...analyticsBaseProperties(),
      channel: "native_share",
    });
    navigator.share?.({ title: "nuclii", text: shareText, url: shareUrl }).catch(() => {});
  }

  // Celebrate a genuinely new signup with a single restrained confetti burst —
  // brand white plus the hero's neon accents. Reduced-motion users are skipped.
  useEffect(() => {
    if (justJoined !== "new" || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 38,
        ticks: 200,
        origin: { y: 0.75 },
        colors: ["#ffffff", "#39FF14", "#4D8DFF", "#FF5FD2", "#FFD84D"],
        disableForReducedMotion: true,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [justJoined]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    trackFormStarted("submit");

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setValidationError("enter a valid email address.", "invalid_email");
      return;
    }
    if (!role) {
      setValidationError("choose the path that best describes you.", "missing_role");
      return;
    }
    if (!ageConfirmed) {
      setValidationError("please confirm you're 18 or older.", "missing_age_confirmation");
      return;
    }
    if (!consent) {
      setValidationError("please confirm you'd like to receive updates.", "missing_marketing_consent");
      return;
    }

    setIsSubmitting(true);
    setError("");
    submitAttempted.current = true;
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistSubmitAttempted, {
      ...analyticsBaseProperties(),
      age_confirmed: ageConfirmed,
      marketing_consent: consent,
    });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          ageConfirmed,
          consent,
          source: sourceLabel,
          analyticsDistinctId: getAnalyticsDistinctId(),
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "something went wrong.");
      }

      const data = await response.json() as { duplicate?: boolean };
      captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistSignupCompleted, {
        ...analyticsBaseProperties(),
        outcome: data.duplicate ? "duplicate" : "new",
      });
      formCompleted.current = true;
      localStorage.setItem(storageKey, "true");
      setJustJoined(data.duplicate ? "duplicate" : "new");
    } catch (err) {
      const message = err instanceof Error ? err.message : "something went wrong. please try again.";
      captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistFormError, {
        ...analyticsBaseProperties(),
        phase: "api",
        reason: analyticsReason(message),
      });
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const alreadyOnList = isClient && hasJoinedWaitlist(storageKey);

  function resetJoinedState() {
    captureAnalyticsEvent(ANALYTICS_EVENTS.ctaClicked, {
      ...analyticsBaseProperties(),
      cta: "join_with_different_email",
      location: "waitlist_success",
    });
    formCompleted.current = false;
    formStarted.current = false;
    submitAttempted.current = false;
    localStorage.removeItem(storageKey);
    setJustJoined(null);
  }

  if (justJoined !== null || alreadyOnList) {
    const isDuplicate = justJoined === "duplicate" || (justJoined === null && alreadyOnList);

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`flex max-w-xl flex-col gap-4 rounded-2xl border border-white/16 bg-black/35 p-4 text-sm text-white ${className}`}
        initial={{ opacity: 0, y: 8 }}
      >
        <div className="flex items-start gap-2.5 font-semibold">
          <motion.span
            animate={{ scale: 1, rotate: 0 }}
            className="mt-0.5 shrink-0 text-primary"
            initial={{ scale: 0, rotate: -30 }}
            transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.1 }}
          >
            <SparkCheckIcon className="size-4" />
          </motion.span>
          <span>{isDuplicate ? duplicateMessage : successMessage}</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
          <div>
            <p className="font-semibold text-white">skip the line.</p>
            <p className="mt-1 text-xs leading-5 text-white/65">
              invite friends — the more who join through your link, the sooner
              you get in.
            </p>
          </div>
          <div className="flex items-stretch gap-2">
            <input
              aria-label="your referral link"
              className="ph-no-capture min-w-0 flex-1 rounded-xl border border-white/15 bg-black/40 px-3 text-xs text-white/85 outline-none focus-visible:border-white/45"
              onFocus={(e) => e.currentTarget.select()}
              readOnly
              value={shareUrl}
            />
            <button
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white bg-white px-3 py-2 text-xs font-semibold lowercase text-black transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={copyShareLink}
              type="button"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex"
                  exit={{ scale: 0.5, opacity: 0 }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  key={copied ? "done" : "copy"}
                  transition={{ duration: 0.18 }}
                >
                  {copied ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                </motion.span>
              </AnimatePresence>
              {copied ? "copied" : "copy"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white"
              href={whatsappUrl}
              onClick={() => {
                captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistShareClicked, {
                  ...analyticsBaseProperties(),
                  channel: "whatsapp",
                });
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              whatsapp
            </a>
            <a
              className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white"
              href={xUrl}
              onClick={() => {
                captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistShareClicked, {
                  ...analyticsBaseProperties(),
                  channel: "x",
                });
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              x
            </a>
            {canNativeShare && (
              <button
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-1.5 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={nativeShare}
                type="button"
              >
                <ShareIcon className="size-3.5" />
                share
              </button>
            )}
          </div>
        </div>

        <button
          className="w-fit text-xs font-semibold text-white/65 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={resetJoinedState}
          type="button"
        >
          join with a different email
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`w-full max-w-2xl space-y-3 ${className}`}>
      <form
        aria-describedby={error ? errorId : undefined}
        className="ph-no-capture space-y-3"
        noValidate
        onSubmit={handleSubmit}
      >
        <div
          className={cn(
            "grid overflow-hidden rounded-2xl border border-white/25 bg-black/55 transition focus-within:border-white/70",
            heroLayout ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]",
          )}
        >
          <div className="min-w-0 flex-1 border-b border-white/10 sm:border-b-0 sm:border-r">
            <label className={LABEL_CLASS} htmlFor={emailId}>email</label>
            <input
              autoComplete="email"
              className={`${FIELD_CLASS} ph-no-capture`}
              disabled={isSubmitting}
              id={emailId}
              onChange={(e) => { trackFormStarted("email"); setEmail(e.target.value); setError(""); }}
              placeholder="john.doe@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className={LABEL_CLASS} htmlFor={nameId}>
              name <span className="font-normal text-white/40">(optional)</span>
            </label>
            <input
              autoComplete="name"
              className={`${FIELD_CLASS} ph-no-capture`}
              disabled={isSubmitting}
              id={nameId}
              onChange={(e) => { trackFormStarted("name"); setName(e.target.value); setError(""); }}
              placeholder="john doe"
              type="text"
              value={name}
            />
          </div>
          {!heroLayout && (
            <div className="min-w-0 flex-1 border-t border-white/10 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
              <label className={LABEL_CLASS} htmlFor={roleId}>joining as</label>
              <select
                className={`${FIELD_CLASS} ph-no-capture appearance-none text-white [&>option]:bg-black [&>option]:text-white`}
                disabled={isSubmitting}
                id={roleId}
                onChange={(e) => {
                  const nextRole = e.target.value as RoleValue;
                  trackFormStarted("role");
                  setRole(nextRole);
                  setError("");
                  if (nextRole) {
                    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistRoleSelected, {
                      source: sourceLabel,
                      layout,
                      role: nextRole,
                    });
                  }
                }}
                required
                value={role}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className={heroLayout ? "grid gap-4" : "grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"}>
          <div className="space-y-2">
            <AnimatedCheckbox
              checked={ageConfirmed}
              disabled={isSubmitting}
              onChange={(checked) => {
                trackFormStarted("age_confirmation");
                setAgeConfirmed(checked);
                setError("");
                captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistRequirementToggled, {
                  ...analyticsBaseProperties(),
                  field: "age_confirmation",
                  checked,
                });
              }}
            >
              i confirm i&apos;m 18 or older.
            </AnimatedCheckbox>
            <AnimatedCheckbox
              checked={consent}
              disabled={isSubmitting}
              onChange={(checked) => {
                trackFormStarted("marketing_consent");
                setConsent(checked);
                setError("");
                captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistRequirementToggled, {
                  ...analyticsBaseProperties(),
                  field: "marketing_consent",
                  checked,
                });
              }}
            >
              yes, email me about nuclii beta access and launch updates.
            </AnimatedCheckbox>
          </div>
          <Button
            className={
              heroLayout
                ? "nuclii-action-button group min-h-12 w-full max-w-[22rem] justify-between border border-white bg-white px-4 text-sm lowercase !text-black hover:border-white hover:!text-white disabled:!text-black disabled:hover:bg-white sm:max-w-[24rem] sm:px-5"
                : "w-full lowercase sm:w-auto"
            }
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            <span className="text-current">{isSubmitting ? "sending..." : submitLabel}</span>
            {isSubmitting ? (
              <SpinnerIcon className="size-4 !text-current motion-safe:animate-spin" />
            ) : (
              <ArrowRightIcon className="size-4 !text-current transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            animate={{ opacity: 1, x: [0, -8, 7, -5, 4, 0] }}
            className="text-sm font-semibold text-destructive"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            id={errorId}
            initial={{ opacity: 0 }}
            role="alert"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export { WaitlistForm };
