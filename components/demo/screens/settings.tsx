"use client";

import { useRef, useState } from "react";
import { EXPERIENCE_ROLES, type ExperienceRoleKey } from "@/lib/experience-roles";
import { naira, plansForRole, tierById } from "@/lib/demo/world";
import { celebrateWaitlistSignup } from "@/components/motion/success-confetti";
import { cn } from "@/lib/utils";
import { useWorld } from "../world-store";
import { useDemoRouter } from "../demo-router";
import { InitialsAvatar, ScreenSection, StatusChip } from "../primitives";
import { CheckIcon, ForwardIcon } from "../icons";
import { HostMark } from "../marks";

export function SettingsScreen({
  activeHat,
  onBecomeHost,
}: {
  activeHat: ExperienceRoleKey;
  onBecomeHost?: () => void;
}) {
  const { identity, state, dispatch, hatsOf } = useWorld();
  const { go } = useDemoRouter();
  const upgradeRef = useRef<HTMLButtonElement>(null);
  const [toggles, setToggles] = useState({ drops: true, reminders: true, digest: false });

  const personaId = identity?.kind === "persona" ? identity.persona.id : null;
  const displayName =
    identity?.kind === "persona" ? identity.persona.name : (identity?.guest.name ?? "you");
  const bio = identity?.kind === "persona" ? identity.persona.bio : "new to nuclii.";
  const avatarHue = identity?.kind === "persona" ? identity.persona.avatarHue : "#7A9E6E";

  const basePlanId = identity?.kind === "persona" ? identity.persona.planId : "explorer-free";
  const currentTierId = personaId ? (state.planOverrides[personaId] ?? basePlanId) : basePlanId;
  const current = tierById(currentTierId);
  const ladder = plansForRole(current?.role ?? activeHat);
  const canBecomeHost = personaId ? !hatsOf(personaId).includes("host") : false;

  const upgrade = (tierId: string) => {
    if (!personaId) return;
    dispatch({ type: "set-plan", personaId, tierId });
    void celebrateWaitlistSignup({
      anchor: upgradeRef.current,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-[2rem] font-extrabold lowercase leading-tight tracking-tight text-foreground">
        settings
      </h1>

      <ScreenSection title="profile">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4">
          <InitialsAvatar
            name={displayName}
            hue={avatarHue}
            image={identity?.kind === "persona" ? identity.persona.avatarImage : undefined}
            className="size-12 text-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">{displayName}</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{bio}</p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground/85 transition-colors duration-150 hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring"
          >
            edit
          </button>
        </div>
        {canBecomeHost && onBecomeHost && (
          <button
            type="button"
            onClick={onBecomeHost}
            className="group mt-2.5 flex w-full items-center gap-3.5 rounded-2xl bg-card px-4 py-3.5 text-left transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HostMark accent={EXPERIENCE_ROLES.host.signal} className="size-9 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-foreground">become a host</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                you&apos;ve been to enough of these — run your own.
              </span>
            </span>
            <ForwardIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
          </button>
        )}
      </ScreenSection>

      {ladder && (
        <ScreenSection title="plan & billing">
          <div className="space-y-2.5">
            {ladder.tiers.map((tier) => {
              const isCurrent = tier.id === (current?.tier.id ?? "explorer-free");
              return (
                <div
                  key={tier.id}
                  className={cn(
                    "rounded-2xl p-4",
                    isCurrent ? "bg-accent ring-1 ring-white/20" : "bg-card",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-bold text-foreground">
                      {tier.name}
                      {isCurrent && <StatusChip tone="accent" className="ml-2">your plan</StatusChip>}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {tier.price === 0 ? "free" : `${naira(tier.price)}/mo`}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{tier.tagline}</p>
                  <ul className="mt-2.5 space-y-1">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-foreground/80">
                        <CheckIcon className="size-3 shrink-0 text-muted-foreground" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && personaId && (
                    <button
                      ref={tier.highlight ? upgradeRef : undefined}
                      type="button"
                      onClick={() => upgrade(tier.id)}
                      className={cn(
                        "mt-3.5 h-9 w-full rounded-lg text-xs font-semibold transition-opacity duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        tier.highlight
                          ? "bg-primary text-primary-foreground hover:opacity-85"
                          : "border border-border text-foreground/85 hover:border-foreground/40",
                      )}
                    >
                      {tier.price === 0 ? "switch to free" : "start free trial"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-muted-foreground">
            illustrative pricing · no card needed in this simulation
          </p>
        </ScreenSection>
      )}

      <ScreenSection title="notifications">
        <div className="divide-y divide-white/6 overflow-hidden rounded-2xl bg-card">
          {(
            [
              ["drops", "event drops from people you follow"],
              ["reminders", "day-of reminders for your rsvps"],
              ["digest", "weekly what's-on digest"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5">
              <span className="text-sm text-foreground/90">{label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[key]}
                aria-label={label}
                onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))}
                className={cn(
                  "relative h-5.5 w-10 shrink-0 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  toggles[key] ? "bg-[var(--demo-accent)]" : "bg-foreground/20",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0.5 size-4.5 rounded-full bg-white transition-[left] duration-200 ease-out",
                    toggles[key] ? "left-5" : "left-0.5",
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </ScreenSection>

      <ScreenSection title="sandbox">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors duration-150 hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            reset the sandbox
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "sign-out" })}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors duration-150 hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            sign out
          </button>
          <button
            type="button"
            onClick={() => go({ name: "credits" })}
            className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors duration-150 hover:border-foreground/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            photo credits
          </button>
        </div>
        <p className="mt-2.5 text-xs leading-5 text-muted-foreground">
          a simulation of the full nuclii vision — we launch in lagos, host and attendee first.
        </p>
      </ScreenSection>
    </div>
  );
}
