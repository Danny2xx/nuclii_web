import type { Metadata } from "next";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe,
  HeartHandshake,
  Link2,
  MapPin,
  MessageCircle,
  Network,
  ShieldCheck,
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
  title: "About | Nuclii",
  description:
    "Nuclii exists to make real-world hosting, discovery, and access easier, safer, and less dependent on social pressure.",
};

const messySystems = [
  "WhatsApp broadcasts",
  "Instagram stories",
  "DMs",
  "Flyers",
  "Word of mouth",
  "Google Forms",
  "Eventbrite links",
  "Private group chats",
] as const;

const beliefs = [
  {
    icon: HeartHandshake,
    title: "Real life still matters",
    description:
      "People want shared experiences offline, but discovery is often fragmented.",
  },
  {
    icon: Globe,
    title: "Hosting should not require popularity",
    description:
      "A good idea should not need thousands of followers before it can become a real experience.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy should be built in",
    description:
      "Discovery and attendance should not require unnecessary public exposure.",
  },
  {
    icon: Network,
    title: "Small communities can grow",
    description:
      "Small core groups can become larger systems when discovery, access, and coordination are structured.",
  },
] as const;

const ecosystem = [
  { icon: MapPin, label: "Attendees" },
  { icon: CalendarDays, label: "Hosts" },
  { icon: UsersRound, label: "Communities" },
  { icon: Network, label: "Societies" },
  { icon: BriefcaseBusiness, label: "Service providers" },
  { icon: HeartHandshake, label: "Talent" },
  { icon: Building2, label: "Venues" },
] as const;

export default function AboutPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(91,140,255,0.2),transparent_34rem)]" />
        <div className="nuclii-container relative grid min-h-[calc(88vh-8rem)] items-center gap-12 lg:grid-cols-[1fr_0.82fr]">
          <FadeIn className="max-w-3xl">
            <h1 className="nuclii-title">Built for real life.</h1>
            <p className="nuclii-copy mt-6 max-w-2xl">
              Nuclii exists to make real-world hosting, discovery, and access
              easier, safer, and less dependent on social pressure.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="/early-access">
                  Join Early Access
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#mission">Read the mission</a>
              </Button>
            </div>
          </FadeIn>

          <Reveal>
            <div className="nuclii-map-grid relative min-h-[31rem] overflow-hidden rounded-3xl border border-border bg-secondary/70 p-5 shadow-card">
              <div className="absolute left-[18%] top-[20%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />
              <div className="absolute right-[20%] top-[38%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />
              <div className="absolute bottom-[22%] left-[42%] size-3 rounded-full bg-primary shadow-blue ring-8 ring-primary/10" />

              <div className="relative z-10 mx-auto mt-8 max-w-sm rounded-[2rem] border border-white/15 bg-black p-2 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="overflow-hidden rounded-[1.55rem] border border-border bg-background">
                  <div className="border-b border-border bg-card px-5 py-5">
                    <p className="text-xs font-semibold text-primary">
                      Real-world discovery
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      From ideas to experiences
                    </h2>
                  </div>
                  <div className="space-y-3 p-5">
                    {["Host", "Book", "Reveal location", "QR access"].map(
                      (item) => (
                        <div
                          className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-4"
                          key={item}
                        >
                          <span className="text-sm font-medium">{item}</span>
                          <CheckCircle2
                            aria-hidden="true"
                            className="size-4 text-primary"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <FloatingElement
                className="absolute bottom-6 right-5 z-20 hidden w-56 sm:block"
                delay={0.5}
              >
                <Card className="bg-card/92 backdrop-blur">
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg">Less social pressure</CardTitle>
                    <CardDescription>
                      Discovery should not depend on who you already know.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </FloatingElement>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mission through ecosystem ─────────────────────────────────── */}
      <div>
        <SectionShell
          description="Real-world connection is fragmented, informal, and dependent on who you already know."
          eyebrow="Why Nuclii exists"
          id="mission"
          title="Real-world connection deserves better infrastructure."
        >
          <Reveal>
            <Card>
              <CardContent className="grid gap-6 p-6 sm:p-7 lg:grid-cols-3">
                {[
                  "Find your people offline.",
                  "Host without the operational chaos.",
                  "Build for safety, not vanity.",
                ].map((line) => (
                  <div className="flex gap-3" key={line}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-primary"
                    />
                    <p className="text-base font-semibold leading-7">{line}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Reveal>
        </SectionShell>

        <SectionShell
          className="bg-secondary/35"
          description="DMs, flyers, and group chats coordinate everything — but most people are never in the right ones at the right time."
          eyebrow="The problem"
          title="The best moments are often hidden in the wrong places."
        >
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <Card className="h-full">
                <CardHeader>
                  <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <MessageCircle aria-hidden="true" className="size-5" />
                  </div>
                  <CardTitle>Scattered systems create missed moments.</CardTitle>
                  <CardDescription>
                    Hosts over-coordinate. Attendees miss things. Private
                    gatherings lack structure without exposure.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2">
              {messySystems.map((system) => (
                <Reveal key={system}>
                  <div className="flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-card p-5">
                    <Link2
                      aria-hidden="true"
                      className="size-4 shrink-0 text-primary"
                    />
                    <p className="font-semibold">{system}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell
          description='Nuclii comes from "nucleus": small core units that can grow into larger systems.'
          eyebrow="The name"
          title="Small cores can become larger communities."
        >
          <Reveal>
            <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:p-10">
              <div className="relative z-10 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <Badge>Nucleus</Badge>
                  <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-5xl">
                    Nuclii is about the core of real-life activity.
                  </h2>
                </div>
                <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                  A workshop, society night, service slot, food pickup, private
                  gathering, or venue collaboration often starts small. Nuclii is
                  built for those small cores to become organised, discoverable,
                  and safe enough to grow.
                </p>
              </div>
            </div>
          </Reveal>
        </SectionShell>

        <SectionShell
          className="bg-secondary/35"
          eyebrow="Our beliefs"
          title="Calm, useful, privacy-aware by default."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beliefs.map(({ icon: Icon, title, description }) => (
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
          description="Every participant type in the Nuclii ecosystem plays a connected role. Attendees find and join. Hosts and societies create and manage. Venues provide the spaces. Service providers and talent plug into events. Partners and communities extend the reach. No part works in isolation."
          eyebrow="What we are building"
          title="Infrastructure for the real-life experience ecosystem."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map(({ icon: Icon, label }) => (
              <Reveal key={label}>
                <Card className="h-full">
                  <CardContent className="flex items-center gap-4 p-6 sm:p-7">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{label}</h3>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 px-6 py-5">
              <p className="text-sm font-semibold text-primary">Beta launch coming soon</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                Nuclii is preparing for beta launch — seeding early communities in cities where hosting and discovery behaviour already exists.
              </p>
            </div>
          </Reveal>
        </SectionShell>
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <SectionShell className="pb-20 sm:pb-24 lg:pb-32">
        <Reveal>
          <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-primary/25 nuclii-cta-gradient p-8 shadow-blue sm:p-10 lg:p-14">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-2xl font-semibold leading-tight sm:text-5xl">
                Help shape how real-world experiences begin.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Join early and help Nuclii make discovery, hosting, booking,
                and access feel easier, safer, and more built for real life.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="/early-access">
                    Join Early Access
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/contact">Get in Touch</a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}
