"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { captureAnalyticsEvent, getAnalyticsDistinctId } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done" | "error";

// The footer's mailing list: one email field. Subscribing is the opt-in, and
// the line under the field says so (with the privacy policy) before anyone
// submits.
function StayUpdated() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    // catch obvious typos here instead of a round trip
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("enter a valid email address.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, analyticsDistinctId: getAnalyticsDistinctId() }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "something went wrong. please try again.");
      setStatus("done");
      captureAnalyticsEvent(ANALYTICS_EVENTS.updatesSignupCompleted, { location: "footer" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "something went wrong. please try again.");
      captureAnalyticsEvent(ANALYTICS_EVENTS.updatesSignupFailed, { location: "footer" });
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.06em] text-white/40" id={`${id}-title`}>
        stay updated!
      </p>
      <p className="!mt-4 text-sm leading-relaxed text-white/60">Launch news and what&apos;s on in Birmingham.</p>

      {status === "done" ? (
        <p className="!mt-4 flex items-center gap-2 text-sm font-semibold text-white" role="status">
          <span className="flex size-5 items-center justify-center rounded-full bg-[var(--nuclii-lime)] text-black">
            <Check aria-hidden="true" className="size-3" strokeWidth={3} />
          </span>
          you&apos;re on the list.
        </p>
      ) : (
        <form aria-labelledby={`${id}-title`} className="!mt-4" noValidate onSubmit={submit}>
          <div className="flex h-11 max-w-[20rem] bg-white/[0.08] focus-within:ring-2 focus-within:ring-ring">
            <label className="sr-only" htmlFor={`${id}-email`}>
              Email address
            </label>
            <input
              aria-describedby={`${id}-note ${id}-message`}
              aria-invalid={status === "error"}
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
              id={`${id}-email`}
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
              type="email"
              value={email}
            />
            <button
              aria-label="Subscribe"
              className={cn(
                "flex w-11 shrink-0 items-center justify-center bg-[var(--nuclii-lime)] text-black transition-opacity hover:opacity-90 focus-visible:outline-none",
                status === "sending" && "opacity-60",
              )}
              disabled={status === "sending"}
              type="submit"
            >
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.25} />
            </button>
          </div>
          <p className="!mt-2 text-xs leading-relaxed text-white/40" id={`${id}-note`}>
            By subscribing you agree to get emails from nuclii. Unsubscribe any time. See our{" "}
            <a className="underline underline-offset-2 hover:text-white" href="/privacy">
              privacy policy
            </a>
            .
          </p>
          <p aria-live="polite" className="!mt-1 text-xs text-[#FF8A7A]" id={`${id}-message`}>
            {message}
          </p>
        </form>
      )}
    </div>
  );
}

export { StayUpdated };
