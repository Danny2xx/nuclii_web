import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { FadeIn, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";

const photoRow = [
  { src: "/images/attendee.jpg", alt: "An attendee at a Nuclii event" },
  { src: "/images/host.jpg", alt: "A host managing a Nuclii listing" },
  { src: "/images/venue.jpg", alt: "A venue hosting a Nuclii experience" },
  { src: "/images/talent.jpg", alt: "Talent showcasing their work" },
] as const;

export const metadata: Metadata = {
  title: "Early Access | Nuclii",
  description:
    "Apply for early access to Nuclii: host events, list your venue, offer your talent, or run your community's events before public launch.",
};

const steps = [
  {
    label: "what it is",
    description:
      "invite-based access before public launch. applications are reviewed personally.",
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
    id: "venues",
    label: "venues",
    description:
      "curated exposure, new audiences, and flexible ways to activate your space.",
  },
  {
    id: "talent",
    label: "talent",
    description:
      "early access to gigs, collaborations, and a network that moves with you.",
  },
  {
    id: "collaborators",
    label: "collaborators",
    description:
      "partner with purpose, test ideas, and co-create real-world experiences.",
  },
] as const;

export default function EarlyAccessPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pb-24"
        data-analytics-section="early_access_hero_form"
      >
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
              <div className="pt-2" id="early-access-form">
                <WaitlistForm
                  source="early access"
                  submitLabel="apply for early access"
                  successMessage="application received. we'll review it and reach out when nuclii opens near you."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Photo row ─────────────────────────────────────────────────── */}
      <section
        className="nuclii-section border-t border-border"
        data-analytics-section="early_access_photo_row"
      >
        <div className="nuclii-container">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {photoRow.map((photo) => (
                <div
                  className="relative aspect-square overflow-hidden rounded-2xl border border-border"
                  key={photo.src}
                >
                  <Image
                    alt={photo.alt}
                    className="object-cover"
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    src={photo.src}
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who you are and what you get ─────────────────────────────── */}
      <section
        className="nuclii-section border-t border-border"
        data-analytics-section="early_access_roles"
      >
        <div className="nuclii-container">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                who early access is for
              </h2>
              <div className="mt-8">
                {roles.map((role) => (
                  <div
                    className="grid gap-1 border-t border-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-6"
                    id={role.id || undefined}
                    key={role.label}
                  >
                    <p className="text-lg font-bold lowercase tracking-[-0.02em] sm:text-xl">
                      {role.label}
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                early access is your way in. contribute, give feedback, and
                help build nuclii with the community.
              </p>
              <Button
                asChild
                className="nuclii-action-button group mt-8 w-full justify-center border border-white bg-white lowercase !text-black hover:border-white hover:!text-white sm:w-auto"
                size="lg"
              >
                <TrackedAnchor
                  analyticsProperties={{
                    cta: "apply_for_early_access",
                    location: "early_access_roles_section",
                  }}
                  href="#early-access-form"
                >
                  <span className="text-current">apply for early access</span>
                  <ArrowRight aria-hidden="true" className="!text-current" />
                </TrackedAnchor>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
