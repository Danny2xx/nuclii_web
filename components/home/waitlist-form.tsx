"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { useIsClient } from "@/components/motion/use-is-client";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "nuclii-waitlist-joined";

function hasJoinedWaitlist() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

const ROLE_OPTIONS = [
  { value: "attendee", label: "attendee" },
  { value: "host", label: "host" },
  { value: "talent", label: "talent" },
  { value: "venue", label: "venue" },
  { value: "community", label: "society / community" },
  { value: "other", label: "other" },
] as const;

const FIELD_CLASS =
  "min-w-0 rounded-none border border-white/20 bg-black/30 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/45 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/35";

function WaitlistForm() {
  const isClient = useIsClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [consent, setConsent] = useState(false);
  const [justJoined, setJustJoined] = useState<"new" | "duplicate" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("enter a valid email address.");
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
          city: city.trim(),
          role,
          consent,
        }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "something went wrong.");
      }

      const data = await response.json() as { duplicate?: boolean };
      localStorage.setItem(STORAGE_KEY, "true");
      setJustJoined(data.duplicate ? "duplicate" : "new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong. please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const alreadyOnList = isClient && hasJoinedWaitlist();

  if (justJoined !== null || alreadyOnList) {
    const isDuplicate = justJoined === "duplicate" || (justJoined === null && alreadyOnList);

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 text-sm font-semibold text-white"
        initial={{ opacity: 0, y: 8 }}
      >
        <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-primary" />
        {isDuplicate
          ? "you're already on the waitlist. we'll reach out when nuclii launches."
          : "you're on the list. we'll reach out when nuclii launches."}
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <form className="space-y-3" noValidate onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            aria-label="Name"
            autoComplete="name"
            className={FIELD_CLASS}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="your name"
            type="text"
            value={name}
          />
          <input
            aria-label="Email address"
            autoComplete="email"
            className={FIELD_CLASS}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="your email"
            type="email"
            value={email}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            aria-label="City"
            autoComplete="address-level2"
            className={FIELD_CLASS}
            onChange={(e) => setCity(e.target.value)}
            placeholder="city (optional)"
            type="text"
            value={city}
          />
          <select
            aria-label="Role or interest"
            className={FIELD_CLASS}
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option className="text-foreground" value="">
              role / interest (optional)
            </option>
            {ROLE_OPTIONS.map((option) => (
              <option className="text-foreground" key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs text-white/60">
            <input
              checked={consent}
              className="size-4 shrink-0 rounded-none border-white/30 bg-black/30 accent-primary"
              onChange={(e) => { setConsent(e.target.checked); setError(""); }}
              type="checkbox"
            />
            yes, email me when nuclii launches near me.
          </label>
          <Button
            className="shrink-0"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? "joining…" : "join the waitlist"}
          </Button>
        </div>
      </form>

      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}

      <p className="text-xs text-white/45">
        no spam. first look when we launch.
      </p>
    </div>
  );
}

export { WaitlistForm };
