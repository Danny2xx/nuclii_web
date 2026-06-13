import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import { EarlyAccessForm } from "@/components/forms/early-access-form";
import { RoleJourneyTabs } from "@/components/home/role-journey-tabs";
import { SectionShell } from "@/components/layout";
import { FadeIn, FloatingElement, Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const metadata: Metadata = {
  title: "Early Access | Nuclii",
  description:
    "Join the first wave of Nuclii as an attendee, host, society, service provider, talent, venue, partner, or investor.",
};

// Maps URL ?role= param to the form's internal role value
const ROLE_MAP: Record<string, string> = {
  attendee:     "attendee",
  host:         "host",
  society:      "society/community",
  talent:       "talent/creative",
  collaborator: "team/contributor",
};

export default async function EarlyAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role ? (ROLE_MAP[role] ?? "") : "";

  return (
    <main className="nuclii-page">
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(91,140,255,0.2),transparent_34rem)]" />
        <div className="nuclii-container relative grid min-h-[calc(92vh-8rem)] items-center gap-12 lg:grid-cols-[1fr_0.78fr]">
          <FadeIn className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge>Early access open</Badge>
              <Badge variant="outline">Limited spots</Badge>
            </div>
            <h1 className="nuclii-title mt-6">
              Join the first wave of Nuclii.
            </h1>
            <p className="nuclii-copy mt-6 max-w-2xl">
              Whether you want to discover, host, organise, or showcase — there
              is a path here for you.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#early-access-form">
                  Join Early Access
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#early-access-form">Choose your role</a>
              </Button>
            </div>
          </FadeIn>

          <Reveal>
            <div className="nuclii-map-grid relative min-h-[32rem] overflow-hidden rounded-3xl border border-border bg-secondary/70 p-5 shadow-card">
              <div className="absolute left-[18%] top-[22%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />
              <div className="absolute right-[24%] top-[34%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />
              <div className="absolute bottom-[24%] left-[42%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />

              <div className="relative z-10 mx-auto mt-4 max-w-sm rounded-[2rem] border border-white/15 bg-black p-2 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="overflow-hidden rounded-[1.55rem] border border-border bg-background">
                  <div className="border-b border-border bg-card px-5 py-5">
                    <p className="text-xs font-semibold text-primary">
                      Early Access
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      Tell us where you fit
                    </h2>
                  </div>
                  <div className="space-y-3 p-5">
                    {["attendee", "host", "society/community"].map((role) => (
                      <div
                        className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-4"
                        key={role}
                      >
                        <span className="text-sm font-medium">{role}</span>
                        <MapPin aria-hidden="true" className="size-4 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <FloatingElement
                className="absolute bottom-7 right-5 z-20 hidden w-56 sm:block"
                delay={0.4}
              >
                <Card className="bg-card/92 backdrop-blur">
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg">No public attendee lists</CardTitle>
                    <CardDescription>
                      Privacy-first discovery from the start.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FloatingElement>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Role journeys — understand before you commit ─────────────── */}
      <SectionShell
        className="bg-secondary/35"
        description="Nuclii works differently depending on who you are. Explore your path before you apply."
        eyebrow="How it works"
        title="One platform, four journeys."
      >
        <Reveal>
          <RoleJourneyTabs />
        </Reveal>
      </SectionShell>

      <SectionShell
        description="Pick the role closest to you and the signup adapts around that journey."
        eyebrow="Choose your path"
        id="early-access-form"
        title="Join the first wave in the way that fits you."
      >
        <EarlyAccessForm initialRole={initialRole} />
      </SectionShell>

      <SectionShell
        description="Here is what to expect once you have submitted your interest."
        eyebrow="What happens next"
        title="Your place in the first wave."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              step: "01",
              title: "You're on the list",
              description:
                "Your early access interest is registered. We review every application personally.",
            },
            {
              icon: Users,
              step: "02",
              title: "We select the first wave",
              description:
                "Selected early users, hosts, societies, and communities are contacted directly before beta launch.",
            },
            {
              icon: Clock,
              step: "03",
              title: "Beta access confirmed",
              description:
                "You'll receive beta access details, onboarding steps, and a direct line to the Nuclii team.",
            },
          ].map(({ icon: Icon, step, title, description }) => (
            <Reveal key={step}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <span className="text-2xl font-extrabold text-muted-foreground/25">
                      {step}
                    </span>
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}
