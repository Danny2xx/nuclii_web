"use client";

import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { celebrateWaitlistSignup } from "@/components/motion/success-confetti";
import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  ShareIcon,
  SparkCheckIcon,
  SpinnerIcon,
} from "@/components/ui/icons";
import { useIsClient } from "@/components/motion/use-is-client";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  ANALYTICS_EVENTS,
  captureAnalyticsEvent,
  getAnalyticsDistinctId,
} from "@/lib/analytics";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nuclii-waitlist-joined";

const ROLE_OPTIONS = [
  { value: "", label: "choose your path" },
  { value: EXPERIENCE_ROLES.explorer.value, label: EXPERIENCE_ROLES.explorer.formLabel },
  { value: EXPERIENCE_ROLES.host.value, label: EXPERIENCE_ROLES.host.formLabel },
  { value: "society-community", label: "society / community" },
  { value: "service-provider", label: "service provider" },
  { value: EXPERIENCE_ROLES.talent.value, label: EXPERIENCE_ROLES.talent.formLabel },
  { value: EXPERIENCE_ROLES.venue.value, label: EXPERIENCE_ROLES.venue.formLabel },
  { value: "partner", label: "partner" },
  { value: "investor", label: "investor" },
  { value: "team-contributor", label: "team / contributor" },
  { value: "other", label: "something else" },
] as const;

type RoleValue = (typeof ROLE_OPTIONS)[number]["value"];
export type FilledRoleValue = Exclude<RoleValue, "">;

export type WaitlistRoleChoice = {
  value: FilledRoleValue;
  label: string;
  hint: string;
  accent: string;
  icon: ComponentType<{ className?: string; accent?: string }>;
};

type WaitlistFormProps = {
  className?: string;
  /** When true, a brief reduced-motion-safe celebration fires after a new signup. */
  celebrateOnSuccess?: boolean;
  defaultRole?: FilledRoleValue;
  duplicateMessage?: string;
  /** When set, the success state shows an "explore" unlock CTA to this href. */
  exploreHref?: string;
  exploreLabel?: string;
  /** Fires when the form enters / leaves its joined (success) state. */
  onJoinedChange?: (joined: boolean) => void;
  onRoleChange?: (role: FilledRoleValue) => void;
  layout?: "default" | "hero";
  roleChoices?: readonly WaitlistRoleChoice[];
  selectedRole?: FilledRoleValue;
  /** When false, launch-update consent is offered but does not block signup. */
  requireConsent?: boolean;
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
  if (localStorage.getItem(STORAGE_KEY) === "true" || localStorage.getItem(storageKey) === "true") {
    return true;
  }

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(`${STORAGE_KEY}:`) && localStorage.getItem(key) === "true") {
      return true;
    }
  }

  return false;
}

function markJoinedWaitlist(storageKey: string) {
  localStorage.setItem(STORAGE_KEY, "true");
  localStorage.setItem(storageKey, "true");
}

function clearJoinedWaitlist() {
  const sourceKeys: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(`${STORAGE_KEY}:`)) {
      sourceKeys.push(key);
    }
  }

  localStorage.removeItem(STORAGE_KEY);
  sourceKeys.forEach((key) => localStorage.removeItem(key));
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
  "block min-h-12 w-full min-w-0 bg-transparent px-4 pb-3 text-base text-white outline-none transition placeholder:text-white/50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm";
const FIELD_SHELL_CLASS =
  "group/field relative min-w-0 flex-1 overflow-hidden bg-black/20 transition-colors duration-200 focus-within:bg-white/[0.045]";
const LABEL_CLASS = "block px-4 pt-2.5 text-[12px] font-semibold lowercase tracking-wide text-white/72";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custom checkbox with a spring-pop box and a drawn-in check stroke.
function AnimatedCheckbox({
  checked,
  children,
  disabled,
  invalid,
  onChange,
  required = true,
}: {
  checked: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-3 text-sm leading-5 text-white/78 transition-colors hover:text-white">
      <input
        aria-invalid={invalid || undefined}
        checked={checked}
        className="peer sr-only"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        required={required}
        type="checkbox"
      />
      <motion.span
        aria-hidden="true"
        className={cn(
          "relative grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          checked ? "border-white bg-white" : "border-white/55 bg-black/50 group-hover:border-white/80",
          invalid && !checked && "border-destructive",
        )}
        tabIndex={-1}
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
  celebrateOnSuccess = false,
  defaultRole,
  duplicateMessage = "you're already on the list. we'll reach out when nuclii launches.",
  exploreHref,
  exploreLabel = "explore nuclii",
  onJoinedChange,
  onRoleChange,
  layout = "default",
  roleChoices,
  selectedRole,
  requireConsent = true,
  source,
  submitLabel = "join early access",
  successMessage = "you're on the list. we'll reach out when nuclii launches.",
}: WaitlistFormProps) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const id = useId();
  const sourceLabel = normalizeSource(source);
  const storageKey = getStorageKey(sourceLabel);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [internalRole, setInternalRole] = useState<RoleValue>(
    defaultRole ?? (roleChoices?.length ? "" : layout === "hero" ? "attendee" : ""),
  );
  const role = selectedRole ?? internalRole;
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [justJoined, setJustJoined] = useState<"new" | "duplicate" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"email" | "role" | "age" | "consent" | "form" | null>(null);
  const [shareNote, setShareNote] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const nameId = `${id}-name`;
  const emailId = `${id}-email`;
  const roleId = `${id}-role`;
  const errorId = `${id}-error`;
  const heroLayout = layout === "hero";
  const segmentedRoles = Boolean(roleChoices?.length);
  const selectedChoice = roleChoices?.find((choice) => choice.value === role);

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
    "i just joined nuclii early access — every event starts here. join me:";
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

  function clearFormError() {
    setError("");
    setErrorField(null);
  }

  function updateRole(nextRole: RoleValue) {
    trackFormStarted("role");
    if (selectedRole === undefined) setInternalRole(nextRole);
    clearFormError();

    if (!nextRole) return;

    onRoleChange?.(nextRole);
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistRoleSelected, {
      source: sourceLabel,
      layout,
      role: nextRole,
    });
  }

  function setValidationError(
    message: string,
    reason: string,
    field: "email" | "role" | "age" | "consent" | "form",
  ) {
    setError(message);
    setErrorField(field);
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
      setShareNote("copied — send it to someone who should be in the first wave.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareNote("copy is unavailable here. you can select the link manually.");
    }
  }

  function nativeShare() {
    captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistShareClicked, {
      ...analyticsBaseProperties(),
      channel: "native_share",
    });
    navigator.share?.({ title: "nuclii", text: shareText, url: shareUrl }).catch(() => {
      setShareNote("sharing was cancelled. your link is still ready below.");
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    trackFormStarted("submit");

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setValidationError("enter a valid email address.", "invalid_email", "email");
      return;
    }
    if (!role) {
      setValidationError("choose the path that best describes you.", "missing_role", "role");
      return;
    }
    if (!ageConfirmed) {
      setValidationError("please confirm you're 18 or older.", "missing_age_confirmation", "age");
      return;
    }
    if (requireConsent && !consent) {
      setValidationError("please confirm you'd like to receive updates.", "missing_marketing_consent", "consent");
      return;
    }

    setIsSubmitting(true);
    clearFormError();
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
      markJoinedWaitlist(storageKey);
      if (celebrateOnSuccess) {
        void celebrateWaitlistSignup({
          accent: selectedChoice?.accent,
          anchor: formRef.current,
          reduceMotion: reduce,
        });
      }
      setJustJoined(data.duplicate ? "duplicate" : "new");
    } catch (err) {
      const message = err instanceof Error ? err.message : "something went wrong. please try again.";
      captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistFormError, {
        ...analyticsBaseProperties(),
        phase: "api",
        reason: analyticsReason(message),
      });
      setError(message);
      setErrorField("form");
    } finally {
      setIsSubmitting(false);
    }
  }

  const alreadyOnList = isClient && hasJoinedWaitlist(storageKey);

  useEffect(() => {
    onJoinedChange?.(justJoined !== null || alreadyOnList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justJoined, alreadyOnList]);

  function resetJoinedState() {
    captureAnalyticsEvent(ANALYTICS_EVENTS.ctaClicked, {
      ...analyticsBaseProperties(),
      cta: "join_with_different_email",
      location: "waitlist_success",
    });
    formCompleted.current = false;
    formStarted.current = false;
    submitAttempted.current = false;
    clearJoinedWaitlist();
    setJustJoined(null);
  }

  if (justJoined !== null || alreadyOnList) {
    const isDuplicate = justJoined === "duplicate" || (justJoined === null && alreadyOnList);

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`flex max-w-xl flex-col gap-4 rounded-2xl border border-white/16 bg-black/35 p-4 text-sm text-white sm:p-5 ${className}`}
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
            <p className="font-semibold text-white">bring someone with you.</p>
            <p className="mt-1 text-xs leading-5 text-white/65">
              share Nuclii with a friend, host, venue or maker who should see
              it early too.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 min-[420px]:flex-row">
            <input
              aria-label="your referral link"
              className="ph-no-capture min-h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/40 px-3 text-xs text-white/85 outline-none focus-visible:border-white/45"
              onFocus={(e) => e.currentTarget.select()}
              readOnly
              value={shareUrl}
            />
            <button
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white bg-white px-3 py-2 text-xs font-semibold lowercase text-black transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
          {shareNote && (
            <p aria-live="polite" className="text-xs font-medium lowercase text-white/62">
              {shareNote}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <a
              className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-3 py-2 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-3 py-2 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium lowercase text-white/80 transition hover:border-white/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={nativeShare}
                type="button"
              >
                <ShareIcon className="size-3.5" />
                share
              </button>
            )}
          </div>
        </div>

        {exploreHref && (
          <a
            className="group inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-white px-5 text-sm font-semibold lowercase !text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(0,0,0,0.55)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
            href={exploreHref}
            onClick={() => {
              // Remember they've entered, so a future gate can let them straight through.
              document.cookie = `nuclii-entered=1; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`;
              captureAnalyticsEvent(ANALYTICS_EVENTS.ctaClicked, {
                ...analyticsBaseProperties(),
                cta: "explore_after_join",
                location: "waitlist_success",
              });
            }}
          >
            {exploreLabel}
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}

        <button
          className="inline-flex min-h-11 w-fit items-center text-xs font-semibold text-white/65 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={resetJoinedState}
          type="button"
        >
          join with a different email
        </button>
      </motion.div>
    );
  }

  return (
    <div className={`w-full max-w-2xl space-y-3 ${className}`} ref={formRef}>
      <form
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "ph-no-capture",
          segmentedRoles
            ? heroLayout
              ? "space-y-3.5 sm:space-y-4"
              : "space-y-5"
            : "space-y-3",
        )}
        noValidate
        onSubmit={handleSubmit}
      >
        {segmentedRoles && roleChoices && (
          <fieldset
            aria-describedby={errorField === "role" ? errorId : undefined}
            className={cn("space-y-3.5", heroLayout && "space-y-2.5 sm:space-y-3")}
          >
            <legend className={cn("text-sm font-semibold lowercase text-white/80", heroLayout && "w-full text-center")}>
              i&apos;m here to...
            </legend>
            <div
              className={cn(
                "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap",
                heroLayout && roleChoices.length === 3 && "grid-cols-1 min-[420px]:grid-cols-3",
                heroLayout && "sm:justify-center",
              )}
            >
              {roleChoices.map((choice) => {
                const Icon = choice.icon;
                const selected = role === choice.value;

                return (
                  <button
                    aria-pressed={selected}
                    className={cn(
                      "group relative min-h-12 overflow-hidden rounded-xl border border-white/12 bg-white/[0.02] transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      heroLayout ? "px-2.5 py-2.5 sm:px-4" : "px-4 py-3 sm:px-5",
                      heroLayout && choice.value === "other" && "col-span-2 sm:col-span-1",
                      errorField === "role" && "border-destructive/70",
                    )}
                    disabled={isSubmitting}
                    key={choice.value}
                    onClick={() => updateRole(choice.value)}
                    type="button"
                  >
                    {selected && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        layoutId={`${id}-active-role`}
                        style={{
                          backgroundColor: `${choice.accent}1f`,
                          boxShadow: `inset 0 0 0 1px ${choice.accent}`,
                        }}
                        transition={{
                          duration: reduce ? 0 : 0.22,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                    {!selected && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        style={{
                          backgroundColor: `${choice.accent}12`,
                          boxShadow: `inset 0 0 0 1px ${choice.accent}5c`,
                        }}
                      />
                    )}
                    <span className="relative flex min-w-0 items-center justify-center gap-2">
                      <motion.span
                        animate={{ scale: selected ? 1 : 0.94 }}
                        className="grid shrink-0 place-items-center"
                        style={{ opacity: selected ? 1 : 0.72 }}
                        transition={{
                          duration: reduce ? 0 : 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Icon
                          accent={choice.accent}
                          className={heroLayout ? "size-8" : "size-9"}
                        />
                      </motion.span>
                      <span
                        className={cn(
                          "min-w-0 font-bold lowercase leading-tight",
                          heroLayout ? "text-[13px]" : "text-sm",
                        )}
                        style={{ color: selected ? choice.accent : "rgba(255,255,255,0.7)" }}
                      >
                        {choice.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <AnimatePresence initial={false} mode="wait">
              {selectedChoice && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("max-w-xl text-xs leading-5 text-white/68 text-pretty sm:text-sm sm:leading-6", heroLayout && "mx-auto text-center")}
                  exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                  initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                  key={selectedChoice.value}
                  transition={{
                    duration: reduce ? 0 : 0.18,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {selectedChoice.hint}
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>
        )}

        <div
          className={cn(
            "grid overflow-hidden border transition-[border-color,box-shadow] duration-200",
            heroLayout
              ? "rounded-2xl border-white/24 bg-black/44 focus-within:border-white/62 focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.18)]"
              : "rounded-[1.35rem] border-white/18 bg-black/52 focus-within:border-white/52 focus-within:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]",
            heroLayout || segmentedRoles
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]",
          )}
        >
          <div className={cn(FIELD_SHELL_CLASS, "border-b border-white/10 sm:border-b-0 sm:border-r")}>
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 transition-opacity duration-200 group-focus-within/field:opacity-100",
                errorField === "email" && "via-destructive opacity-100",
              )}
            />
            <label className={LABEL_CLASS} htmlFor={emailId}>email</label>
            <input
              aria-describedby={errorField === "email" ? errorId : undefined}
              aria-invalid={errorField === "email" || undefined}
              autoComplete="email"
              className={`${FIELD_CLASS} ph-no-capture`}
              disabled={isSubmitting}
              id={emailId}
              onChange={(e) => {
                trackFormStarted("email");
                setEmail(e.target.value);
                clearFormError();
              }}
              placeholder="john.doe@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className={FIELD_SHELL_CLASS}>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 transition-opacity duration-200 group-focus-within/field:opacity-100"
            />
            <label className={LABEL_CLASS} htmlFor={nameId}>
              name <span className="font-normal text-white/55">(optional)</span>
            </label>
            <input
              autoComplete="name"
              className={`${FIELD_CLASS} ph-no-capture`}
              disabled={isSubmitting}
              id={nameId}
              onChange={(e) => {
                trackFormStarted("name");
                setName(e.target.value);
                clearFormError();
              }}
              placeholder="john doe"
              type="text"
              value={name}
            />
          </div>
          {!heroLayout && !segmentedRoles && (
            <div className={cn(FIELD_SHELL_CLASS, "border-t border-white/10 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0")}>
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-0 transition-opacity duration-200 group-focus-within/field:opacity-100",
                  errorField === "role" && "via-destructive opacity-100",
                )}
              />
              <label className={LABEL_CLASS} htmlFor={roleId}>joining as</label>
              <select
                className={`${FIELD_CLASS} ph-no-capture appearance-none text-white [&>option]:bg-black [&>option]:text-white`}
                disabled={isSubmitting}
                id={roleId}
                onChange={(e) => updateRole(e.target.value as RoleValue)}
                aria-describedby={errorField === "role" ? errorId : undefined}
                aria-invalid={errorField === "role" || undefined}
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
        <div
          className={cn(
            heroLayout
              ? segmentedRoles
                ? "flex flex-col items-stretch gap-3 sm:items-center sm:gap-3.5"
                : "flex flex-col items-stretch gap-4"
              : "grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
          )}
        >
          <div className={cn("space-y-1", heroLayout && "w-full", heroLayout && segmentedRoles && "max-w-xl sm:max-w-none")}>
            <AnimatedCheckbox
              checked={ageConfirmed}
              disabled={isSubmitting}
              invalid={errorField === "age"}
              onChange={(checked) => {
                trackFormStarted("age_confirmation");
                setAgeConfirmed(checked);
                clearFormError();
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
              invalid={errorField === "consent"}
              onChange={(checked) => {
                trackFormStarted("marketing_consent");
                setConsent(checked);
                clearFormError();
                captureAnalyticsEvent(ANALYTICS_EVENTS.waitlistRequirementToggled, {
                  ...analyticsBaseProperties(),
                  field: "marketing_consent",
                  checked,
                });
              }}
              required={requireConsent}
            >
              email me about Nuclii beta access and launch updates
              {!requireConsent && " (optional)"}.
            </AnimatedCheckbox>
          </div>
          <MagneticButton
            aria-busy={isSubmitting || undefined}
            accentColor={segmentedRoles ? selectedChoice?.accent ?? "#ffffff" : "#ffffff"}
            className={
              heroLayout && segmentedRoles
                ? "min-h-[3.25rem] w-full justify-center px-5 text-[15px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] disabled:opacity-60"
                : heroLayout
                  ? "min-h-14 w-full justify-center px-5 text-[15px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] disabled:opacity-60 sm:px-6"
                  : segmentedRoles
                    ? "w-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] sm:min-w-64 sm:w-auto"
                    : "w-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] sm:w-auto"
            }
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            <span className="relative text-current">
              {isSubmitting ? "sending..." : submitLabel}
            </span>
            {isSubmitting ? (
              <SpinnerIcon className="relative size-4 !text-current motion-safe:animate-spin" />
            ) : (
              <ArrowRightIcon className="relative size-4 !text-current transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </MagneticButton>
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
