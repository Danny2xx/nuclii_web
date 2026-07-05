"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";

import { unlockEvents, type UnlockState } from "@/app/events/actions";
import { Button } from "@/components/ui/button";

const INITIAL: UnlockState = {};

export function EventsGate() {
  const [state, action, pending] = useActionState(unlockEvents, INITIAL);

  return (
    <div className="mx-auto w-full max-w-[26rem] text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-white/80">
        <Lock aria-hidden="true" className="size-5" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold lowercase tracking-[-0.02em] sm:text-4xl">
        events
      </h1>
      <p className="mt-3 text-base leading-7 text-white/65">
        something&apos;s coming. enter the password to take an early look.
      </p>

      <form action={action} className="mt-8 flex flex-col items-stretch gap-3">
        <input
          aria-invalid={state.error ? true : undefined}
          aria-label="events password"
          autoComplete="off"
          autoFocus
          className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-center text-sm lowercase text-white outline-none transition placeholder:text-white/40 focus:border-white/55 focus:bg-white/[0.05]"
          name="password"
          placeholder="password"
          type="password"
        />
        <Button
          className="w-full lowercase"
          disabled={pending}
          size="lg"
          type="submit"
        >
          {pending ? "checking…" : "unlock"}
        </Button>
      </form>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm lowercase text-[#FF6B6B]">
        {state.error ?? ""}
      </p>
    </div>
  );
}
