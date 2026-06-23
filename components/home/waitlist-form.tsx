"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";
import { Button } from "@/components/ui/button";
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

const FIELD_CLASS =
  "block min-h-12 w-full min-w-0 bg-transparent px-4 pb-3 text-base text-white outline-none transition placeholder:text-white/60 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:bg-white/[0.06] sm:text-sm";
const LABEL_CLASS = "block px-4 pt-2.5 text-[11px] font-semibold lowercase tracking-wide text-white/70";
const CHECKBOX_CLASS =
  "mt-0.5 size-4 shrink-0 rounded-none border-white/40 bg-black/50 accent-white disabled:cursor-not-allowed disabled:opacity-60";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("please enter your name.");
      return;
    }
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setError("enter a valid email address.");
      return;
    }
    if (!role) {
      setError("choose the path that best describes you.");
      return;
    }
    if (!ageConfirmed) {
      setError("please confirm you're 16 or older.");
      return;
    }
    if (!consent) {
      setError("please confirm you'd like to receive updates.");
      return;
    }

    setIsSubmitting(true);
    setError("");

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
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "something went wrong.");
      }

      const data = await response.json() as { duplicate?: boolean };
      localStorage.setItem(storageKey, "true");
      setJustJoined(data.duplicate ? "duplicate" : "new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong. please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const alreadyOnList = isClient && hasJoinedWaitlist(storageKey);

  function resetJoinedState() {
    localStorage.removeItem(storageKey);
    setJustJoined(null);
  }

  if (justJoined !== null || alreadyOnList) {
    const isDuplicate = justJoined === "duplicate" || (justJoined === null && alreadyOnList);

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`flex max-w-xl flex-col gap-3 border-t border-white/25 pt-4 text-sm text-white ${className}`}
        initial={{ opacity: 0, y: 8 }}
      >
        <div className="flex items-start gap-2.5 font-semibold">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            {isDuplicate
              ? duplicateMessage
              : successMessage}
          </span>
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
        className="space-y-3"
        noValidate
        onSubmit={handleSubmit}
      >
        <div
          className={cn(
            "grid overflow-hidden border border-white/25 bg-black/55 transition focus-within:border-white/70",
            heroLayout ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.1fr]",
          )}
        >
          <div className="min-w-0 flex-1 border-b border-white/10 sm:border-b-0 sm:border-r">
            <label className={LABEL_CLASS} htmlFor={nameId}>name</label>
            <input
              autoComplete="name"
              className={FIELD_CLASS}
              disabled={isSubmitting}
              id={nameId}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="priya shah"
              required
              type="text"
              value={name}
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className={LABEL_CLASS} htmlFor={emailId}>email</label>
            <input
              autoComplete="email"
              className={FIELD_CLASS}
              disabled={isSubmitting}
              id={emailId}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="priya@email.com"
              required
              type="email"
              value={email}
            />
          </div>
          {!heroLayout && (
            <div className="min-w-0 flex-1 border-t border-white/10 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
              <label className={LABEL_CLASS} htmlFor={roleId}>joining as</label>
              <select
                className={`${FIELD_CLASS} appearance-none text-white [&>option]:bg-black [&>option]:text-white`}
                disabled={isSubmitting}
                id={roleId}
                onChange={(e) => { setRole(e.target.value as RoleValue); setError(""); }}
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
            <label className="flex min-h-11 items-start gap-2 text-xs leading-5 text-white/70">
              <input
                checked={ageConfirmed}
                className={CHECKBOX_CLASS}
                disabled={isSubmitting}
                onChange={(e) => { setAgeConfirmed(e.target.checked); setError(""); }}
                required
                type="checkbox"
              />
              <span>i confirm i&apos;m 16 or older.</span>
            </label>
            <label className="flex min-h-11 items-start gap-2 text-xs leading-5 text-white/70">
              <input
                checked={consent}
                className={CHECKBOX_CLASS}
                disabled={isSubmitting}
                onChange={(e) => { setConsent(e.target.checked); setError(""); }}
                required
                type="checkbox"
              />
              <span>
                yes, email me about nuclii beta access and launch updates.
              </span>
            </label>
          </div>
          <Button
            className={
              heroLayout
                ? "nuclii-action-button group min-h-14 w-full justify-between border border-white bg-white px-5 text-base lowercase !text-black hover:border-white hover:!text-white disabled:!text-black disabled:hover:bg-white"
                : "w-full lowercase sm:w-auto"
            }
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            <span className="text-current">{isSubmitting ? "sending..." : submitLabel}</span>
            {isSubmitting ? (
              <Loader2 aria-hidden="true" className="!text-current motion-safe:animate-spin" />
            ) : (
              <ArrowRight aria-hidden="true" className="!text-current" />
            )}
          </Button>
        </div>
      </form>

      {error && (
        <p className="text-sm font-semibold text-destructive" id={errorId} role="alert">{error}</p>
      )}
    </div>
  );
}

export { WaitlistForm };
