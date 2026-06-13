import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Gauge,
  ListChecks,
  LockKeyhole,
  MapPin,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Store,
  Ticket,
  UsersRound,
} from "lucide-react";

import { SectionShell } from "@/components/layout";
import { FadeIn, FloatingElement, Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "For Hosts | Nuclii",
  description:
    "Create events, workshops, appointments, pickups, private gatherings, and pop-ups with booking, capacity, access control, and privacy-aware tools.",
};

const hostTypes = [
  { icon: UsersRound, title: "Social event" },
  { icon: CalendarDays, title: "Workshop" },
  { icon: Clock3, title: "Appointment slots" },
  { icon: Store, title: "Pickup window" },
  { icon: LockKeyhole, title: "Private gathering" },
  { icon: ShoppingBag, title: "Pop-up market" },
  { icon: BarChart3, title: "Talent showcase" },
] as const;

const dashboardCards = [
  {
    icon: CalendarDays,
    label: "Upcoming listing",
    title: "Workshop draft",
    detail: "Booking, capacity, and reveal settings ready",
  },
  {
    icon: Gauge,
    label: "Capacity count",
    title: "18 / 40",
    detail: "Manage attendance before it becomes chaotic",
  },
  {
    icon: QrCode,
    label: "QR check-in",
    title: "Scanner mode",
    detail: "Validate entry or arrival with QR passes",
  },
  {
    icon: MapPin,
    label: "Location reveal mode",
    title: "After booking",
    detail: "Keep exact locations private until the right moment",
  },
  {
    icon: ShieldCheck,
    label: "Eligibility settings",
    title: "Age-aware",
    detail: "Set access context for the right audience",
  },
  {
    icon: ListChecks,
    label: "Interest Check status",
    title: "Collecting interest",
    detail: "Test demand before confirming the listing",
  },
  {
    icon: BarChart3,
    label: "Basic analytics",
    title: "Demand signals",
    detail: "See interest, bookings, and access activity clearly",
  },
] as const;

const accessTools = [
  {
    icon: Gauge,
    title: "Capacity caps",
    description:
      "Control attendance, slot limits, and booking availability before things become chaotic.",
  },
  {
    icon: Ticket,
    title: "RSVP and ticket setup",
    description:
      "Give attendees a clear way to book, RSVP, or hold access in one place.",
  },
  {
    icon: QrCode,
    title: "QR access",
    description:
      "Validate entry or arrival with QR passes without exposing unnecessary identity details.",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility rules",
    description:
      "Set age-aware, community-aware, or context-aware access expectations for each listing.",
  },
] as const;

const revealModes = [
  "Public location",
  "Area-only preview",
  "Reveal after booking",
  "Reveal close to the time",
] as const;

function HostDashboardPreview({ compact = false }: { compact?: boolean }) {
  const cards = compact ? dashboardCards.slice(0, 4) : dashboardCards;

  return (
    <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-border bg-secondary/70 p-5 shadow-card">
      <div className="relative z-10 rounded-2xl border border-border bg-background/88 p-4">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">Host dashboard</p>
            <h2 className="mt-2 text-xl font-semibold">Manage the listing</h2>
          </div>
          <Badge variant="outline">Preview</Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ icon: Icon, label, title, detail }) => (
            <div
              className="rounded-2xl border border-border bg-card p-3 transition hover:border-primary/45 sm:p-4"
              key={label}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary">{label}</p>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                </div>
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground sm:mt-4 sm:text-sm">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HostsPage() {
  return (
    <main className="nuclii-page">
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(91,140,255,0.2),transparent_34rem)]" />
        <div className="nuclii-container relative grid min-h-[calc(88vh-8rem)] items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <FadeIn className="max-w-3xl">
            <h1 className="nuclii-title">
              Host without the operational chaos.
            </h1>
            <p className="nuclii-copy mt-6 max-w-2xl">
              Create events, workshops, appointments, pickups, private
              gatherings, and pop-ups with booking, capacity, access control,
              and privacy-aware tools.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="/early-access?role=host">
                  Become an Early Host
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#host-tools">Preview host tools</a>
              </Button>
            </div>
          </FadeIn>

          <Reveal>
            <div className="relative">
              <HostDashboardPreview compact />
              <FloatingElement
                className="absolute -bottom-6 right-4 hidden w-56 sm:block"
                delay={0.4}
              >
                <Card className="bg-card/92 backdrop-blur">
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg">Interest Check</CardTitle>
                    <CardDescription>
                      Test demand before you commit.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FloatingElement>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell
        eyebrow="What hosts can create"
        title="More than events."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hostTypes.map(({ icon: Icon, title }) => (
            <Reveal key={title}>
              <Card className="h-full">
                <CardContent className="flex min-h-28 items-center gap-4 p-6 sm:p-7">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        className="bg-secondary/35"
        eyebrow="Host dashboard preview"
        id="host-tools"
        title="A calmer control room for real-world hosting."
      >
        <Reveal>
          <HostDashboardPreview />
        </Reveal>
      </SectionShell>

      <SectionShell
        description="Not sure if people will come? Run an interest check first, collect demand, then confirm the listing when you are ready."
        eyebrow="Interest Check"
        title="Test demand before you commit."
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ListChecks aria-hidden="true" className="size-5" />
                </div>
                <CardTitle>Validate the idea first.</CardTitle>
                <CardDescription>
                  Collect demand before committing to a full listing.
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>

          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                  <p className="text-xs font-semibold text-primary">
                    Interest Check status
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">Collecting interest</h3>
                </div>
                <Eye aria-hidden="true" className="size-5 text-primary" />
              </div>
              <div className="mt-6 space-y-4">
                {["Set concept", "Collect demand", "Confirm listing"].map(
                  (step, index) => (
                    <div className="flex items-center gap-3" key={step}>
                      <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="font-medium">{step}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell
        className="bg-secondary/35"
        eyebrow="Access controls"
        title="Capacity, RSVP, ticketing, and QR access."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accessTools.map(({ icon: Icon, title, description }) => (
            <Reveal key={title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        description="Choose whether locations are public, area-only, revealed after booking, or revealed close to the time."
        eyebrow="Location reveal"
        title="Privacy-aware settings for different kinds of listings."
      >
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="nuclii-map-grid min-h-[26rem] overflow-hidden rounded-3xl border border-border bg-secondary/70 p-5 shadow-card">
              <div className="relative z-10 mx-auto max-w-md rounded-[2rem] border border-white/15 bg-black p-2">
                <div className="overflow-hidden rounded-[1.55rem] border border-border bg-background">
                  <div className="border-b border-border bg-card px-5 py-5">
                    <p className="text-xs font-semibold text-primary">
                      Location reveal mode
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                      Reveal after booking
                    </h3>
                  </div>
                  <div className="space-y-3 p-5">
                    {revealModes.map((mode) => (
                      <div
                        className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-4"
                        key={mode}
                      >
                        <span className="text-sm font-medium">{mode}</span>
                        {mode === "Reveal after booking" ? (
                          <CheckCircle2
                            aria-hidden="true"
                            className="size-4 text-primary"
                          />
                        ) : (
                          <LockKeyhole
                            aria-hidden="true"
                            className="size-4 text-muted-foreground"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <MapPin aria-hidden="true" className="size-5" />
                </div>
                <CardTitle>Protect context without hiding the experience.</CardTitle>
                <CardDescription>
                  Different reveal modes for different sensitivities — public, area-only, post-booking, or timed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-border bg-secondary p-5">
                  <p className="text-sm font-semibold">No unnecessary exposure</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Access can be coordinated with QR passes and eligibility
                    settings while keeping attendee identity and location detail
                    handled carefully.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell className="pb-20 sm:pb-24 lg:pb-32">
        <Reveal>
          <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-primary/25 nuclii-cta-gradient p-8 shadow-blue sm:p-10 lg:p-14">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-2xl font-semibold leading-tight sm:text-5xl">
                Bring structure to your next real-world experience.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Apply as an early host and help Nuclii shape tools for events,
                workshops, services, pickups, private gatherings, and pop-ups.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="/early-access?role=host">
                    Apply as an Early Host
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/contact#contact-form">Ask a hosting question</a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
