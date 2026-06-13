"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { MagneticButton } from "@/components/ui/magnetic-button";

// ─── Swap these for real numbers when you have them ───────────────────────────
const METRICS = [
  { value: "400+",    label: "on the list"  },
  { value: "8",       label: "cities"       },
  { value: "4",       label: "role types"   },
] as const;
// ─────────────────────────────────────────────────────────────────────────────

const PHRASES = [
  "your@email.com",
  "host@yourevent.com",
  "talent@creative.co.uk",
  "community@society.co.uk",
];

function HeroEmailCapture() {
  const [email, setEmail]             = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [focused, setFocused]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    if (focused || submitted) return;

    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const phrase = PHRASES[phraseIdx];

      if (deleting) {
        charIdx--;
        setPlaceholder(phrase.slice(0, charIdx));
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % PHRASES.length;
          timer = setTimeout(tick, 480);
          return;
        }
        timer = setTimeout(tick, 32);
      } else {
        charIdx++;
        setPlaceholder(phrase.slice(0, charIdx));
        if (charIdx === phrase.length) {
          timer = setTimeout(() => { deleting = true; tick(); }, 2000);
          return;
        }
        timer = setTimeout(tick, 68);
      }
    }

    tick();
    return () => clearTimeout(timer);
  }, [focused, submitted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2.5 text-sm font-semibold text-foreground"
        initial={{ opacity: 0, y: 8 }}
      >
        <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-primary" />
        You&apos;re on the list. We&apos;ll reach out when Nuclii launches.
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-3">
      <form
        className="flex items-center gap-2"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="flex flex-1 items-center rounded-full border border-border bg-background/80 px-4 py-2.5 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <input
            aria-label="Email address"
            autoComplete="email"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/55"
            onBlur={() => setFocused(false)}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onFocus={() => setFocused(true)}
            placeholder={focused ? "your@email.com" : placeholder}
            type="email"
            value={email}
          />
        </div>
        <MagneticButton strength={0.2}>
          <button
            className="shrink-0 inline-flex items-center justify-center gap-1 rounded-full bg-[#0a0a0b] px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-[#1c1c22] hover:shadow-[0_0_44px_rgba(91,140,255,0.48),0_8px_24px_rgba(0,0,0,0.22)] hover:animate-[nuclii-btn-pulse_2s_ease-in-out_infinite] disabled:opacity-60 hover:[&_svg]:translate-x-0.5 [&_svg]:transition-transform [&_svg]:duration-200"
            disabled={isSubmitting}
            style={{ color: "#ffffff" }}
            type="submit"
          >
            {isSubmitting ? "Joining…" : "Notify me"}
            {!isSubmitting && <ArrowRight aria-hidden="true" className="size-3.5" />}
          </button>
        </MagneticButton>
      </form>

      {error && (
        <p className="text-xs text-destructive" role="alert">{error}</p>
      )}

      {/* Metrics + no-spam in one compact row */}
      <div className="flex items-center gap-4">
        {METRICS.map(({ value, label }, index) => (
          <div key={label} className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-foreground">{value}</span>
              <span className="text-[0.65rem] text-muted-foreground/55">{label}</span>
            </div>
            {index < METRICS.length - 1 && (
              <div className="h-4 w-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <p className="text-[0.65rem] text-muted-foreground/45">
        No spam. First look when we launch.
      </p>
    </div>
  );
}

export { HeroEmailCapture };
