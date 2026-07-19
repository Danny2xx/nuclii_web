"use client";

import Image from "next/image";
import { useState } from "react";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";
import { PERSONAS, tierById } from "@/lib/demo/world";
import { useWorld } from "./world-store";
import { InitialsAvatar, StatusChip } from "./primitives";
import { ForwardIcon } from "./icons";
import { SignUpFlow } from "./sign-up";

/** the lived-in one-liner under each persona door */
const PERSONA_LIFE: Record<string, string> = {
  maya: "vol. 9 on sale · vinyl & supper nearly full",
  sofia: "2 nights coming up · 6 events this month",
  priya: "2 booking requests waiting · a busy week ahead",
  jerome: "3 booking requests · 2 gigs confirmed",
};

export function SignInScreen() {
  const { dispatch } = useWorld();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [formNotice, setFormNotice] = useState(false);

  if (mode === "sign-up") {
    return <SignUpFlow onBack={() => setMode("sign-in")} />;
  }

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* left — brand + the "real" form */}
      <div className="flex flex-col justify-between gap-10 border-b border-white/6 bg-secondary/60 px-6 py-8 lg:w-[24rem] lg:shrink-0 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
        <div>
          <Image
            src="/logo/nuclii-green.png"
            alt="nuclii"
            width={92}
            height={28}
            className="h-6 w-auto"
          />
          <h1 className="mt-10 text-2xl font-extrabold lowercase tracking-tight text-foreground">
            welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            sign in to your nights, your events and your people.
          </p>

          <form
            className="mt-8 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setFormNotice(true);
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground/80">email</span>
              <input
                type="email"
                autoComplete="off"
                placeholder="you@example.com"
                className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground/80">
                password
              </span>
              <input
                type="password"
                autoComplete="off"
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </label>
            <button
              type="submit"
              className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              sign in
            </button>
            {formNotice && (
              <p className="rounded-lg bg-foreground/8 px-3 py-2 text-xs leading-5 text-foreground/80">
                this is the sandbox — real accounts open at launch. pick a demo pass on the
                right, or create a sandbox account.
              </p>
            )}
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold lowercase text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/16 bg-white/[0.03] text-sm font-semibold text-foreground transition-colors duration-150 hover:border-white/32 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            create your account
            <ForwardIcon className="size-4 text-muted-foreground transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
          </button>
          <p className="mt-2.5 text-center text-xs leading-5 text-muted-foreground">
            new to nuclii? pick your role and we&apos;ll tailor everything — takes a minute.
          </p>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          sandbox preview — the full version is in build.{" "}
          <span className="text-foreground/70">everything you do here stays on this device.</span>
        </p>
      </div>

      {/* right — the persona doors */}
      <div className="flex flex-1 items-center px-6 py-10 lg:px-14">
        <div className="mx-auto w-full max-w-[34rem]">
          <h2 className="text-base font-bold lowercase tracking-tight text-foreground">
            or step into a life already in motion
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            four people, one week in london. every side sees the same world differently.
          </p>

          <ul className="mt-6 space-y-2.5">
            {PERSONAS.map((persona) => {
              const role = EXPERIENCE_ROLES[persona.leadRole];
              const plan = tierById(persona.planId);
              return (
                <li key={persona.id}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "sign-in", personaId: persona.id })}
                    className="group flex w-full items-center gap-4 rounded-2xl bg-card px-4 py-4 text-left transition-[background-color,transform] duration-150 hover:bg-accent motion-safe:hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <InitialsAvatar
                      name={persona.name}
                      hue={persona.avatarHue}
                      image={persona.avatarImage}
                      className="size-11"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-bold text-foreground">{persona.name}</span>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold"
                          style={{ color: persona.avatarHue }}
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full"
                            style={{ background: persona.avatarHue }}
                          />
                          {"shortLabel" in role ? role.shortLabel : role.label}
                        </span>
                        {plan && plan.tier.price > 0 && (
                          <StatusChip tone="neutral">{plan.tier.name}</StatusChip>
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {PERSONA_LIFE[persona.id] ?? persona.bio}
                      </span>
                    </span>
                    <ForwardIcon className="size-4 shrink-0 text-foreground/40 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="mt-8 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            reset the sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
