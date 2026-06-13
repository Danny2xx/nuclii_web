import {
  ArrowRight,
  Map,
  QrCode,
  UsersRound,
} from "lucide-react";

import { HomeEcosystemCanvas } from "@/components/home/home-ecosystem-canvas";
import { FAQ } from "@/components/home/faq";
import { FadeIn, Reveal } from "@/components/motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Button } from "@/components/ui/button";

const safetyPoints = [
  {
    icon: UsersRound,
    title: "No public attendee lists",
    description: "People can discover and attend without public pressure.",
  },
  {
    icon: Map,
    title: "Location reveal controls",
    description: "Hosts keep exact locations private until the right moment.",
  },
  {
    icon: QrCode,
    title: "QR access",
    description: "Check-in confirms access without exposing unnecessary details.",
  },
] as const;

const roles = [
  {
    label: "Attendees",
    sentence: "Find what's happening near you — without needing to be in the right group chat.",
    href: "/early-access?role=attendee",
  },
  {
    label: "Hosts",
    sentence: "Create listings, manage capacity, and coordinate access without the operational chaos.",
    href: "/early-access?role=host",
  },
  {
    label: "Societies",
    sentence: "Give your community a structured place to gather, organise, and grow.",
    href: "/early-access?role=society",
  },
  {
    label: "Talent",
    sentence: "Get discovered for showcases, bookings, and live collaborations near you.",
    href: "/early-access?role=talent",
  },
] as const;

function Numbered({ index }: { index: number }) {
  return (
    <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-primary/70">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

export default function Home() {
  return (
    <main className="nuclii-page">

      {/* ── Hero + reel + map ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(91,140,255,0.08),transparent_40rem)]" />
        <FadeIn>
          <HomeEcosystemCanvas />
        </FadeIn>
      </section>

      {/* ── Why Nuclii exists ────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <div className="max-w-2xl">
              <p className="nuclii-eyebrow mb-5">Why Nuclii exists</p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Real life still runs on screenshots and group chats.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Finding something to do, getting into the right place, and
                hosting without chaos all still depend on scattered DMs,
                stories, forms, and spreadsheets. Nuclii brings discovery,
                hosting, and access into one place — built for how people
                actually move through real life.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-y border-border">
        <div className="nuclii-container">
          <Reveal>
            <p className="nuclii-eyebrow mb-10">Built for real life</p>
          </Reveal>
          <div className="divide-y divide-border">
            {roles.map(({ label, sentence, href }, index) => (
              <Reveal delay={index * 0.06} key={label}>
                <div className="group flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6 sm:py-7">
                  <Numbered index={index} />
                  <span className="w-28 shrink-0 text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-primary sm:text-2xl">
                    {label}
                  </span>
                  <p className="flex-1 text-base leading-7 text-muted-foreground sm:text-lg">
                    {sentence}
                  </p>
                  <Button asChild size="sm" variant="outline" className="shrink-0 self-start sm:self-auto">
                    <a href={href}>
                      Join early
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety ────────────────────────────────────────────────────── */}
      <section className="nuclii-section">
        <div className="nuclii-container">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <p className="nuclii-eyebrow mb-5">Safety and privacy</p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Built for real experiences, without unnecessary exposure.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                Privacy is not a setting. It is how Nuclii works by default.
              </p>
            </div>
          </Reveal>
          <div className="divide-y divide-border">
            {safetyPoints.map(({ icon: Icon, title, description }, index) => (
              <Reveal delay={index * 0.06} key={title}>
                <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6 sm:py-7">
                  <Numbered index={index} />
                  <div className="flex items-center gap-3 sm:w-72 sm:shrink-0">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-4" />
                    </div>
                    <h3 className="text-lg font-semibold leading-tight sm:text-xl">
                      {title}
                    </h3>
                  </div>
                  <p className="flex-1 text-base leading-7 text-muted-foreground sm:text-lg">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">
                Be part of the first Nuclii community.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                Join early and help shape how people discover, host, and
                access real-world experiences.
              </p>
              <p className="mt-3 text-sm font-medium text-primary/80">
                Preparing for beta launch
              </p>
              <div className="mt-8">
                <MagneticButton>
                  <Button asChild size="lg">
                    <a href="/early-access">
                      Join Early Access
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
