import { ChevronDown } from "lucide-react";

import { FadeIn, Reveal, RotatingWord } from "@/components/motion";
import { FAQ } from "@/components/home/faq";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { WhoItsForScroll } from "@/components/home/who-its-for-scroll";
import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { Button } from "@/components/ui/button";

const heroVideos = [
  "/videos/nightlife.mp4",
  "/videos/pickup.mp4",
  "/videos/reveal.mp4",
  "/videos/society.mp4",
  "/videos/workshop.mp4",
] as const;

const roles = [
  {
    number: "01",
    title: "attendees",
    description:
      "find what's happening near you — without needing to be in the right group chat.",
    image: "/images/attendee.jpg",
  },
  {
    number: "02",
    title: "hosts",
    description:
      "create listings, manage capacity, and coordinate access without the operational chaos.",
    image: "/images/host.jpg",
  },
  {
    number: "03",
    title: "talent",
    description:
      "get discovered for showcases, bookings, and live collaborations near you.",
    image: "/images/talent.jpg",
  },
  {
    number: "04",
    title: "venues",
    description:
      "connect with hosts and communities looking for the right space, and manage bookings without the back-and-forth.",
    image: "/images/venue.jpg",
  },
] as const;

const howItWorks = [
  {
    number: "01",
    title: "discover",
    description:
      "browse what's happening near you, filtered by city, category, and who's hosting.",
  },
  {
    number: "02",
    title: "host or join",
    description:
      "create a listing or request access in minutes — no spreadsheets, no dm chains.",
  },
  {
    number: "03",
    title: "show up",
    description:
      "qr access and privacy controls mean you get in without public lists or social pressure.",
  },
] as const;

const safetyPoints = [
  {
    number: "01",
    title: "no public attendee lists",
    description: "people can discover and attend without public pressure.",
  },
  {
    number: "02",
    title: "location reveal controls",
    description: "hosts keep exact locations private until the right moment.",
  },
  {
    number: "03",
    title: "qr access",
    description:
      "check-in confirms access without exposing unnecessary details.",
  },
] as const;

export default function Home() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden sm:min-h-screen" id="waitlist">
        <VideoBackgroundCarousel className="absolute inset-0" sources={heroVideos} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="nuclii-container relative pb-16 pt-32 sm:pb-20 lg:pb-24">
          <FadeIn>
            <h1 className="nuclii-display lowercase text-white">
              every
              <br />
              <RotatingWord />
              <br />
              starts here.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
              discover and host real-world experiences near you, without
              followers, group chats, or social pressure.
            </p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
          </FadeIn>
        </div>
        <FadeIn className="absolute inset-x-0 bottom-6 hidden justify-center sm:flex" delay={0.6}>
          <div className="flex flex-col items-center gap-2 text-xs text-white/50">
            <span className="lowercase tracking-wide">scroll</span>
            <ChevronDown aria-hidden="true" className="size-4 animate-bounce" />
          </div>
        </FadeIn>
      </section>

      {/* ── Why nuclii exists ─────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
              why nuclii exists
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
              <p>
                real life still runs on screenshots and group chats.
                <br />
                finding something to do, getting into the right place, and
                hosting without chaos all still depend on scattered DMs,
                stories, forms, and spreadsheets.
              </p>
              <p>
                nuclii brings discovery, hosting, and access into one place —
                so you can find what&apos;s happening, get in, and host
                without the back-and-forth.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <Reveal>
            <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
              how it works
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 lg:gap-12">
            {howItWorks.map((step, index) => (
              <Reveal delay={index * 0.1} key={step.number}>
                <div className="nuclii-numbered-item">
                  <p className="nuclii-numbered-item__heading">
                    <span className="nuclii-numbered-item__number">
                      {step.number}
                    </span>
                    {step.title}
                  </p>
                  <p className="nuclii-numbered-item__description">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <WhoItsForScroll roles={roles} />
        </div>
      </section>

      {/* ── Safety and privacy ───────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                safety and privacy
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <p>
                  nuclii is built for real experiences, without unnecessary
                  exposure.
                </p>
                <p>
                  privacy is not a setting. it is how nuclii works by default.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              {safetyPoints.map((point) => (
                <div className="nuclii-numbered-item" key={point.number}>
                  <p className="nuclii-numbered-item__heading">
                    <span className="nuclii-numbered-item__number">
                      {point.number}
                    </span>
                    {point.title}
                  </p>
                  <p className="nuclii-numbered-item__description">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <FAQ />

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="nuclii-display max-w-3xl lowercase">
              be part of the nuclii community.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8 lg:pb-4">
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                be one of the first in — help shape how people discover,
                host, and access real-world experiences near them.
              </p>
              <Button asChild className="w-fit lowercase" size="lg">
                <a href="#waitlist">join the waitlist</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
