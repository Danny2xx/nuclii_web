import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { FadeIn, Reveal } from "@/components/motion";
import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";

export const metadata: Metadata = {
  title: "About | Nuclii",
  description:
    "Nuclii exists to help people discover great things happening in the real world, and bring more people together, in person.",
};

const heroVideos = [
  "/videos/about/team1.mp4",
  "/videos/about/team2.mp4",
] as const;

const principles = [
  {
    number: "01",
    title: "real-world first",
    description: "we strengthen offline communities, not replace them.",
  },
  {
    number: "02",
    title: "curated with care",
    description: "quality over quantity in everything we surface.",
  },
  {
    number: "03",
    title: "community over audience",
    description: "we build for people, not vanity metrics.",
  },
  {
    number: "04",
    title: "privacy-first by design",
    description: "your data, your choices, always.",
  },
] as const;

const connections = [
  {
    title: "attendees",
    description: "discover events, communities, and real connections.",
  },
  {
    title: "hosts",
    description: "create, promote, and manage experiences.",
  },
  {
    title: "venues",
    description: "fill spaces and connect with the right audiences.",
  },
  {
    title: "talent",
    description: "get discovered, booked, and supported.",
  },
  {
    title: "communities",
    description: "bring people together around shared interests.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="nuclii-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85svh] items-end overflow-hidden sm:min-h-svh">
        <VideoBackgroundCarousel className="absolute inset-0" sources={heroVideos} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/55 to-[#0a0a0b]/10" />
        <div className="nuclii-container relative pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24">
          <FadeIn>
            <h1 className="nuclii-display lowercase text-white">about us.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/70 sm:text-lg">
              nuclii exists to help people discover great things happening in
              the real world, and bring more people together, in person.
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="nuclii-action-button group w-full justify-center border border-white bg-white lowercase !text-black hover:border-white hover:!text-white sm:w-auto"
                size="lg"
              >
                <TrackedAnchor
                  analyticsProperties={{
                    cta: "get_early_access",
                    location: "about_hero",
                  }}
                  href="/early-access"
                >
                  <span className="text-current">get early access</span>
                  <ArrowRight aria-hidden="true" className="!text-current" />
                </TrackedAnchor>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Why we exist ─────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
              why we exist
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
              <p>
                real connections are fragmented.
                <br />
                the best things happening in your city are often hidden in
                stories, group chats, flyers, forms, and word of mouth.
              </p>
              <p>
                attendees struggle to find what&apos;s actually happening.
                hosts struggle to reach the right people. venues struggle to
                fill spaces. talent struggles to get discovered.
              </p>
              <p>
                nuclii exists to make discovery, hosting, and access simpler,
                safer, and more human.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Our principles ───────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                our principles
              </h2>
              <div className="mt-8">
                {principles.map((principle) => (
                  <div className="nuclii-numbered-item" key={principle.number}>
                    <p className="nuclii-numbered-item__heading">
                      <span className="nuclii-numbered-item__number">
                        {principle.number}
                      </span>
                      {principle.title}
                    </p>
                    <p className="nuclii-numbered-item__description">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative row-span-2 overflow-hidden rounded-2xl border border-border">
                <Image
                  alt="Two people in conversation at a Nuclii gathering"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  src="/images/about-conversation.jpg"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                <Image
                  alt="Friends sharing a meal under string lights"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  src="/images/about-gathering.jpg"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                <Image
                  alt="A community group sitting together in a circle"
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  src="/images/about-circle.jpg"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What nuclii connects ─────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <h2 className="max-w-xl text-3xl font-extrabold lowercase sm:text-4xl">
                what nuclii connects
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                {connections.map((item) => (
                  <div
                    className="grid gap-1 border-t border-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-6"
                    key={item.title}
                  >
                    <p className="text-lg font-bold lowercase tracking-[-0.02em] sm:text-xl">
                      {item.title}
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative mt-12 aspect-[16/7] overflow-hidden rounded-2xl border border-border">
              <Image
                alt="A venue lit up for a Nuclii experience"
                className="object-cover"
                fill
                sizes="100vw"
                src="/images/venue.jpg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── For every first connection ───────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border sm:aspect-video lg:aspect-[4/5]">
              <Image
                alt="Someone discovering a creative experience in person"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                src="/images/talent.jpg"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h2 className="text-3xl font-extrabold lowercase sm:text-4xl">
                for every
                <br />
                first connection.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground sm:text-lg">
                <p>nuclii is not just about finding something to do.</p>
                <p>
                  it&apos;s about making real life easier to access.
                  we&apos;re building a connected ecosystem where people,
                  places, and opportunities can find each other without
                  relying on scattered DMs, screenshots, and word of mouth.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="nuclii-section border-t border-border">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="nuclii-display max-w-3xl lowercase">
              {"let's build something real together."}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-8 lg:pb-4">
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                nuclii is just getting started.
                <br />
                if you care about real connections, community, events,
                venues, talent, or culture, we&apos;d love to hear from you.
              </p>
              <div>
                <Button
                  asChild
                  className="nuclii-action-button group w-full justify-center border border-white bg-white lowercase !text-black hover:border-white hover:!text-white sm:w-auto"
                  size="lg"
                >
                  <TrackedAnchor
                    analyticsEvent={ANALYTICS_EVENTS.outboundLinkClicked}
                    analyticsProperties={{
                      cta: "get_in_touch",
                      location: "about_final_cta",
                    }}
                    href="mailto:hello@nuclii.co.uk"
                  >
                    <span className="text-current">get in touch</span>
                    <ArrowUpRight aria-hidden="true" className="!text-current" />
                  </TrackedAnchor>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
