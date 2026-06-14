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

const FIELD_CLASS =
  "min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/45 focus-visible:bg-white/5";

function WaitlistForm() {
  const isClient = useIsClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        <div className="flex flex-col border border-white/20 bg-black/30 backdrop-blur-sm transition focus-within:border-primary/60 sm:flex-row">
          <input
            aria-label="Name"
            autoComplete="name"
            className={`${FIELD_CLASS} border-b border-white/10 sm:border-b-0 sm:border-r`}
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
          <Button
            className="m-1.5 shrink-0"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? "joining…" : "join the waitlist"}
          </Button>
        </div>
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input
            checked={consent}
            className="size-4 shrink-0 rounded-none border-white/30 bg-black/30 accent-primary"
            onChange={(e) => { setConsent(e.target.checked); setError(""); }}
            type="checkbox"
          />
          yes, email me when nuclii launches near me. no spam, ever.
        </label>
      </form>

      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}
    </div>
  );
}

export { WaitlistForm };
