"use client";

import { useState } from "react";
import { EXPERIENCE_ROLES, type ExperienceRoleKey } from "@/lib/experience-roles";
import { plansForRole } from "@/lib/demo/world";
import { useWorld } from "./world-store";
import { BackIcon, CheckIcon } from "./icons";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "supper clubs",
  "nightlife",
  "live music",
  "workshops",
  "markets",
  "pickup sports",
  "wellness",
  "talks & film",
];

const ROLE_QUESTION: Record<ExperienceRoleKey, { title: string; options: string[] }> = {
  explorer: { title: "what are you into?", options: INTERESTS },
  host: {
    title: "what do you run — or want to?",
    options: ["dinners & suppers", "club nights", "workshops", "socials & mixers", "sports", "screenings"],
  },
  venue: {
    title: "what kind of space is it?",
    options: ["bar / restaurant", "studio", "warehouse / arch", "rooftop / outdoor", "gallery", "community hall"],
  },
  talent: {
    title: "what's your craft?",
    options: ["dj / selector", "live music", "food & catering", "photo / video", "design & decor", "workshops"],
  },
};

/**
 * The role-fork onboarding: everyone gives a name, picks a hat, answers one
 * role-specific question — supply roles get a look at the plan ladder before
 * landing in their dashboard.
 */
export function SignUpFlow({ onBack }: { onBack: () => void }) {
  const { dispatch } = useWorld();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [role, setRole] = useState<ExperienceRoleKey | null>(null);
  const [picks, setPicks] = useState<string[]>([]);

  const steps = role === "explorer" || role === null ? 3 : 4;
  const rolePlans = role ? plansForRole(role) : undefined;

  const finish = () =>
    dispatch({
      type: "sign-up",
      guest: { name: name.trim() || "you", area: area.trim() || "london", role: role ?? "explorer", interests: picks },
    });

  return (
    <div className="flex min-h-dvh items-start justify-center px-6 py-12 sm:items-center">
      <div className="w-full max-w-[26rem]">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 0 ? onBack() : setStep(step - 1))}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <BackIcon className="size-4" />
            back
          </button>
          <ol aria-label={`step ${step + 1} of ${steps}`} className="flex items-center gap-1.5">
            {Array.from({ length: steps }).map((_, i) => (
              <li
                key={i}
                aria-hidden="true"
                className={cn(
                  "h-1 rounded-full transition-all duration-200",
                  i === step ? "w-6 bg-foreground" : "w-2.5 bg-foreground/25",
                )}
              />
            ))}
          </ol>
        </div>

        {step === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) setStep(1);
            }}
          >
            <h1 className="text-2xl font-extrabold lowercase tracking-tight text-foreground">
              first, the basics
            </h1>
            <div className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground/80">
                  your name
                </span>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="alex"
                  className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground/80">
                  where are you?
                </span>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="peckham, london"
                  className="h-11 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-foreground/45 outline-none transition-colors duration-150 focus-visible:border-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="mt-6 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              continue
            </button>
          </form>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-extrabold lowercase tracking-tight text-foreground">
              what brings you to nuclii?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              you can add the other hats any time.
            </p>
            <ul className="mt-6 space-y-2.5">
              {(Object.keys(EXPERIENCE_ROLES) as ExperienceRoleKey[]).map((key) => {
                const r = EXPERIENCE_ROLES[key];
                const copy: Record<ExperienceRoleKey, string> = {
                  explorer: "find what's happening near you",
                  host: "run events and gather your people",
                  venue: "put your space to work",
                  talent: "get booked for what you do best",
                };
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => {
                        setRole(key);
                        setPicks([]);
                        setStep(2);
                      }}
                      className="flex w-full items-center gap-3.5 rounded-2xl bg-card px-4 py-3.5 text-left transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span
                        aria-hidden="true"
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: r.signal }}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-foreground">
                          {"shortLabel" in r ? r.shortLabel : r.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">{copy[key]}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {step === 2 && role && (
          <div>
            <h1 className="text-2xl font-extrabold lowercase tracking-tight text-foreground">
              {ROLE_QUESTION[role].title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">pick as many as you like.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {ROLE_QUESTION[role].options.map((option) => {
                const selected = picks.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setPicks((prev) =>
                        selected ? prev.filter((p) => p !== option) : [...prev, option],
                      )
                    }
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground/85 hover:border-foreground/40",
                    )}
                  >
                    {selected && <CheckIcon className="size-3.5" />}
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={picks.length === 0}
              onClick={() => (role === "explorer" ? finish() : setStep(3))}
              className="mt-8 h-11 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-85 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {role === "explorer" ? "start exploring" : "continue"}
            </button>
          </div>
        )}

        {step === 3 && role && rolePlans && (
          <div>
            <h1 className="text-2xl font-extrabold lowercase tracking-tight text-foreground">
              pick your plan
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              early-access pricing. start free — change any time.
            </p>
            <ul className="mt-6 space-y-2.5">
              {rolePlans.tiers.map((tier) => (
                <li key={tier.id}>
                  <button
                    type="button"
                    onClick={finish}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      tier.highlight ? "bg-accent ring-1 ring-white/20" : "bg-card",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-foreground">{tier.name}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                        {tier.tagline}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-foreground">
                      {tier.price === 0 ? "free" : `£${tier.price}/mo`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
