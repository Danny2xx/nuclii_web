import type { Metadata } from "next";

import { FadeIn, Reveal } from "@/components/motion";
import { PhotoPlaceholder } from "@/components/media/photo-placeholder";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Early Access | Nuclii",
  description:
    "Apply for early access to Nuclii — host events, list your venue, offer your talent, or run your community's events before public launch.",
};

const TALLY_EARLY_ACCESS_URL = "https://tally.so/r/RGjlyp";

const steps = [
  {
    label: "what it is",
    description:
      "invite-based access before public launch — applications are reviewed personally.",
  },
  {
    label: "what you'll do",
    description:
      "create listings, list your venue, offer your talent, or run your community's events on the platform before it's public.",
  },
  {
    label: "what you get",
    description:
      "a direct line to the team and a say in what nuclii becomes before everyone else gets in.",
  },
] as const;

const roles = [
  {
    id: "attendees",
    label: "attendees",
    description:
      "invite-only access to events, meet the right people, and help shape what we build.",
  },
  {
    id: "hosts",
    label: "hosts",
    description:
      "tools, support, and early opportunities to grow your community and reach.",
  },
  {
    id: "",
    label: "venues",
    description:
      "curated exposure, new audiences, and flexible ways to activate your space.",
  },
  {
    id: "",
    label: "talent",
    description:
      "early access to gigs, collaborations, and a network that moves with you.",
  },
  {
    id: "",
    label: "collaborators",
    description:
      "partner with purpose, test ideas, and co-create real-world experiences.",
  },
] as const;

export default function EarlyAccessPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
          <FadeIn>
            <h1 className="nuclii-display lowercase">
              apply for
              <br />
              early access.
            </h1>
          </FadeIn>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
              <p className="text-lg font-bold text-foreground sm:text-xl">
                be part of nuclii before it&apos;s public.
              </p>
              {steps.map((step) => (
                <p key={step.label}>
                  <strong className="text-foreground">{step.label}:</strong>{" "}
                  {step.description}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Photo row ─────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
              <PhotoPlaceholder className="aspect-square rounded-2xl border border-border" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who you are and what you get ─────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                who you are and what you get:
              </h2>
              <div className="mt-8 space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
                {roles.map((role) => (
                  <p id={role.id || undefined} key={role.label}>
                    <strong className="text-foreground">{role.label}:</strong>{" "}
                    {role.description}
                  </p>
                ))}
                <p>
                  early access is your way in. contribute, give feedback, and
                  help build nuclii with the community.
                </p>
              </div>
              <Button
                asChild
                className="mt-10 w-fit lowercase"
                size="lg"
              >
                <a href={TALLY_EARLY_ACCESS_URL}>apply for early access</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
