import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  Compass,
  Globe2,
  Handshake,
  Mail,
  MapPin,
  Network,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { SectionShell } from "@/components/layout";
import { FadeIn, Reveal } from "@/components/motion";
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
  title: "Investors | Nuclii",
  description:
    "Nuclii is building privacy-first infrastructure for real-world discovery, hosting, and access. Pre-seed stage.",
};

const thesisPoints = [
  {
    icon: Compass,
    title: "The problem is structural",
    description:
      "Real-world experiences are coordinated across WhatsApp, Instagram DMs, Google Forms, and Eventbrite — with no connective infrastructure. Discovery is fragmented. Hosting is chaotic. Access is unstructured.",
  },
  {
    icon: Globe2,
    title: "The timing is right",
    description:
      "Post-pandemic community rebuilding, rising distrust in social media algorithms, and a generation actively seeking offline connection have created structural demand for a better discovery and access layer.",
  },
  {
    icon: Network,
    title: "The model is ecosystem, not marketplace",
    description:
      "Nuclii connects attendees, hosts, societies, service providers, talent, venues, and partners into one structured system — not just a listing directory. Network effects compound across every participant type.",
  },
  {
    icon: MapPin,
    title: "Community-first launch strategy",
    description:
      "Nuclii is launching in cities where hosting and discovery behaviour already exists — concentrating early supply and demand in places where it can compound before expanding.",
  },
] as const;

const prelaunchFocus = [
  {
    icon: Building2,
    title: "Ecosystem seeding",
    description:
      "Collecting early demand and supply across attendees, hosts, societies, service providers, talent, venues, and partners before beta launch.",
  },
  {
    icon: Handshake,
    title: "Strategic conversations",
    description:
      "Speaking with investors, venue operators, community leaders, and strategic partners to shape the early network.",
  },
  {
    icon: ShieldCheck,
    title: "Trust-first positioning",
    description:
      "Building with privacy-first infrastructure, no public attendee lists, and location-reveal controls — creating a safety layer that differentiates from day one.",
  },
  {
    icon: TrendingUp,
    title: "Product-led growth foundation",
    description:
      "Investing in design quality, motion, and product experience before launch so early users encounter a product that feels finished, not scrappy.",
  },
] as const;

export default function InvestorsPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(91,140,255,0.18),transparent_34rem)]" />
        <div className="nuclii-container relative grid min-h-[calc(82vh-8rem)] items-center gap-12 lg:grid-cols-[1fr_0.78fr]">
          <FadeIn className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Pre-seed stage</Badge>
            </div>
            <h1 className="nuclii-title mt-6">
              The infrastructure layer for real-world discovery, hosting, and
              access.
            </h1>
            <p className="nuclii-copy mt-6 max-w-2xl">
              Nuclii is building the coordination layer for offline experiences
              — starting in cities where communities are already gathering, hosting, and looking for structure.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#investor-contact">
                  Request Information
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#thesis">Read the thesis</a>
              </Button>
            </div>
          </FadeIn>

          <Reveal>
            <div className="nuclii-map-grid rounded-3xl border border-border bg-secondary/70 p-5 shadow-card">
              <div className="relative z-10 space-y-4">
                {[
                  { label: "Stage", value: "Pre-seed" },
                  { label: "Launch focus", value: "Community-first cities" },
                  { label: "Model", value: "Ecosystem infrastructure" },
                  { label: "Status", value: "Open to conversations" },
                ].map(({ label, value }) => (
                  <div
                    className="flex items-center justify-between rounded-2xl border border-border bg-card/92 p-5 backdrop-blur"
                    key={label}
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Thesis ────────────────────────────────────────────────────── */}
      <SectionShell
        description="Real-world experiences are fragmented across DMs, links, feeds, flyers, and informal networks. Nuclii is building the infrastructure layer to make discovery, hosting, access, and coordination more structured — for everyone involved."
        eyebrow="The thesis"
        id="thesis"
        title="Offline experiences need better infrastructure."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {thesisPoints.map(({ icon: Icon, title, description }) => (
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

      {/* ── Pre-launch focus ──────────────────────────────────────────── */}
      <SectionShell
        className="bg-secondary/35"
        description="Nuclii's pre-launch work is focused on collecting early demand, attracting hosts and communities, seeding venues and talent, and building trust with investors and partners — all before beta."
        eyebrow="Pre-launch focus"
        title="Building the right foundations before launch."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {prelaunchFocus.map(({ icon: Icon, title, description }) => (
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

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <SectionShell
        description="Nuclii is an early-stage team with a strong product-led conviction and a clear thesis around real-world experience infrastructure."
        eyebrow="The team"
        title="Built by people who care about how real life works."
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:p-10">
              <div className="relative z-10">
                <Badge>Founding team</Badge>
                <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-4xl">
                  Early-stage and building with conviction.
                </h2>
                <p className="mt-5 text-base leading-8 text-muted-foreground">
                  Nuclii is founded on the belief that real-world experiences
                  deserve better infrastructure — not just better apps.
                  The team combines product, design, and community thinking to
                  build something people will actually use offline.
                </p>
                <div className="mt-8 flex gap-3">
                  <Button asChild size="sm">
                    <a href="#investor-contact">
                      Request introduction
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Mail aria-hidden="true" className="size-5" />
                </div>
                <CardTitle>Speak with the founders</CardTitle>
                <CardDescription>
                  Investor conversations are handled directly. Use the form
                  below to request a deck, schedule a call, or start a
                  conversation about strategic partnership.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <a href="#investor-contact">
                    Request investor information
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </SectionShell>

      {/* ── Investor contact ──────────────────────────────────────────── */}
      <SectionShell
        className="bg-secondary/35"
        description="Use this form to request a deck, ask about the round, or start a strategic conversation. All investor enquiries are handled directly."
        eyebrow="Investor contact"
        id="investor-contact"
        title="Start the conversation."
      >
        <Reveal>
          <InvestorContactForm />
        </Reveal>
      </SectionShell>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <SectionShell className="pb-20 sm:pb-24 lg:pb-32">
        <Reveal>
          <div className="nuclii-map-grid overflow-hidden rounded-3xl border border-primary/25 nuclii-cta-gradient p-8 shadow-blue sm:p-10 lg:p-14">
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-2xl font-semibold leading-tight sm:text-5xl">
                Talk to Nuclii about the future of real-world access.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Request a deck, ask about the round, or explore strategic
                partnership. All conversations are handled directly.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#investor-contact">
                    Request Investor Information
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/about">Read the mission</a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </SectionShell>
    </main>
  );
}

function InvestorContactForm() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">Investor enquiry</p>
        <h3 className="mt-2 text-xl font-semibold">Request information or start a conversation.</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Deck requests, round questions, and strategic partnership interest are all welcome.
          Fill in the form below or use the contact page if you prefer.
        </p>
      </div>
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary p-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail aria-hidden="true" className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Direct contact</p>
              <p className="mt-0.5 text-sm font-semibold">Use the contact page</p>
            </div>
          </div>
          <Button asChild className="w-full" size="lg">
            <a href="/contact#contact-form">
              Send investor enquiry
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            Select <strong>Investor</strong> as your enquiry type. Deck requests, round questions,
            and strategic partnership interest are all routed directly to the founding team.
          </p>
        </div>
        <div className="space-y-3">
          {[
            "Deck available on request",
            "Conversations handled directly",
            "Pre-seed stage",
            "Community-first launch strategy",
            "Open to strategic partnerships",
          ].map((point) => (
            <div
              className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/70 px-4 py-3"
              key={point}
            >
              <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-primary" />
              <p className="text-sm font-medium">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
