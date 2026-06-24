import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { TrackedAnchor } from "@/components/analytics/tracked-link";
import { AudienceRows } from "@/components/home/audience-rows";
import { ExperienceLayersScroll } from "@/components/home/experience-layers-scroll";
import { ExperienceMap } from "@/components/home/experience-map";
import { FadeIn, MaskReveal, Reveal, RotatingWord } from "@/components/motion";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { Button } from "@/components/ui/button";

const heroVideos = [
  "/videos/nightlife.mp4",
  "/videos/pickup.mp4",
  "/videos/reveal.mp4",
  "/videos/society.mp4",
  "/videos/workshop.mp4",
] as const;

const experienceLayers = [
  {
    number: "01",
    title: "explorers",
    description:
      "find what is actually happening around you, without needing to be in the right group chat first.",
    image: "/images/attendee.jpg",
    alt: "Friends discovering a real-world experience together",
  },
  {
    number: "02",
    title: "organisers",
    description:
      "spin up a listing, manage interest, coordinate access, and bring people together with less chaos.",
    image: "/images/host.jpg",
    alt: "An organiser setting up a real-world experience",
  },
  {
    number: "03",
    title: "spaces",
    description:
      "open your room, rooftop, or studio to the people and communities who bring it to life.",
    image: "/images/venue.jpg",
    alt: "A space prepared for a real-world experience",
  },
  {
    number: "04",
    title: "creatives",
    description:
      "get discovered for showcases, performances, sessions, services, and collaborations.",
    image: "/images/talent.jpg",
    alt: "A creative showcasing their work at a real-world experience",
  },
] as const;

const audienceRows = [
  {
    number: "01",
    title: "attendees",
    description:
      "discover real things to do nearby without waiting for an invite or chasing a story post.",
  },
  {
    number: "02",
    title: "hosts",
    description:
      "publish with structure, manage demand, and keep the operational details in one place.",
  },
  {
    number: "03",
    title: "venues",
    description:
      "make your space easier for hosts, communities, and real-world activity to find.",
  },
  {
    number: "04",
    title: "talents",
    description:
      "turn showcases, creative services, sessions, and collaborations into discoverable experiences.",
  },
] as const;

export default function Home() {
  return (
    <main className="nuclii-page">
      <section className="relative min-h-[112svh] overflow-hidden" id="waitlist">
        <VideoBackgroundCarousel className="absolute inset-0" sources={heroVideos} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="nuclii-container relative z-10 flex min-h-[112svh] items-start pt-[50svh] md:items-end md:pb-[11rem] md:pt-0">
          <FadeIn className="w-full">
            <h1 className="max-w-[54rem] text-[clamp(3.25rem,7.6vw,7.25rem)] font-extrabold lowercase leading-[0.91] tracking-[-0.02em] text-white text-balance">
              find your next
              <br />
              <RotatingWord />
            </h1>
            <div className="mt-12 grid max-w-[68rem] gap-7 border-t border-white/15 pt-6 sm:mt-14 md:grid-cols-[minmax(18rem,27rem)_minmax(28rem,1fr)] md:items-start md:gap-10">
              <p className="max-w-[31rem] text-base font-normal lowercase leading-relaxed tracking-[-0.01em] text-white/68 sm:text-lg">
                every event starts here. discover, host, book, and access the
                real-world moments that usually get lost in chats, stories, and
                scattered links.
              </p>
              <WaitlistForm layout="hero" source="home hero" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-border px-[var(--container-x)] pb-20 pt-28 md:pb-48 md:pt-56">
        <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-24 md:gap-72">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1fr] md:items-start md:gap-20">
            <Reveal>
              <h2 className="text-3xl font-extrabold lowercase leading-tight tracking-[-0.03em] sm:text-5xl">
                why we exist
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="max-w-[42rem] space-y-5 text-base leading-relaxed tracking-[-0.02em] text-white/78 sm:text-xl">
                <p>
                  real life still runs on screenshots, group chats, stories,
                  private links, and word of mouth.
                </p>
                <p>
                  people do not lack ideas, communities, services, talent, or
                  places to gather. they lack one calm layer that turns those
                  moments into something people can discover, book, access, and
                  manage.
                </p>
                <p>
                  nuclii exists to make that layer feel simple enough for a
                  first host and serious enough for the communities, venues, and
                  partners around them.
                </p>
              </div>
            </Reveal>
          </div>

          <ExperienceLayersScroll layers={experienceLayers} />
        </div>
      </section>

      <section className="pb-24 md:pb-48">
        <div className="nuclii-container">
          <div className="grid gap-10 md:grid-cols-[minmax(0,28rem)_minmax(0,36rem)] md:items-end md:justify-center md:gap-24">
            <MaskReveal>
              <h2 className="text-[clamp(3.5rem,9vw,7.5rem)] font-black lowercase leading-[0.86] tracking-[-0.03em] text-balance">
                built for real life
              </h2>
            </MaskReveal>
            <Reveal delay={0.08}>
              <div className="space-y-7 text-base leading-relaxed tracking-[-0.02em] text-white/78 sm:text-xl">
                <p className="text-3xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                  not a feed. not a flyer wall. not another group chat.
                </p>
                <p>
                  nuclii is for the moments that need structure: society events,
                  workshops, food drops, appointment slots, pop-ups, private
                  gatherings, talent showcases, and venue-led experiences.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-36">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold lowercase leading-tight tracking-[-0.03em] sm:text-5xl">
                your city, on one map
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
                <p>
                  every workshop, pop-up, and gathering near you — surfaced the
                  moment it is happening, not buried in a feed.
                </p>
                <p className="text-base text-white/55 sm:text-lg">
                  exact locations stay private until you are in.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ExperienceMap />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-36">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold lowercase leading-tight tracking-[-0.03em] sm:text-5xl">
              who you are and what you get
            </h2>
          </Reveal>
          <AudienceRows rows={audienceRows} />
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-36">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <div>
              <h2 className="text-3xl font-extrabold lowercase leading-tight tracking-[-0.03em] sm:text-5xl">
                privacy by default
              </h2>
              <div className="mt-7 space-y-5 text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
                <p>
                  discovery should not require unnecessary public exposure.
                  hosting should not require public attendee lists.
                </p>
                <p>
                  exact locations, eligibility, and access can be handled with
                  more care, so people can show up in real life without turning
                  every moment into a social performance.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-white/10 sm:aspect-video lg:aspect-[5/4]">
              <Image
                alt="People meeting at a real-world community experience"
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, calc(100vw - 2rem)"
                src="/images/about-gathering.jpg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-36">
        <div className="nuclii-container grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="nuclii-display max-w-4xl lowercase">
              be part of the first nuclii community.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-8 lg:pb-4">
              <p className="text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
                join early and help shape how people discover, host, book,
                access, and coordinate real-world experiences.
              </p>
              <Button
                asChild
                className="nuclii-action-button group w-full justify-center border border-white bg-white px-5 lowercase !text-black hover:border-white hover:!text-white sm:w-fit sm:min-w-[13rem] sm:justify-between"
                size="lg"
              >
                <TrackedAnchor
                  analyticsProperties={{
                    cta: "join_waitlist",
                    location: "home_final_cta",
                  }}
                  href="#waitlist"
                >
                  <span className="text-current">join the waitlist</span>
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
