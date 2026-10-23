import { AppTeaserSection } from "@/components/home/app-teaser-section";
import { ConceptSection } from "@/components/home/concept-section";
import { ExploreSequence } from "@/components/home/explore-sequence";
import { FaqSection } from "@/components/home/faq-section";
import { GlobeSection } from "@/components/home/globe-section";
import { CircleSection } from "@/components/home/circle-section";
import { ControlSection } from "@/components/home/control-section";
import { CreateLookSection } from "@/components/home/create-look-section";
import { LineupSection } from "@/components/home/lineup-section";
import { Prewarm } from "@/components/motion/prewarm";
import { StackedSlides } from "@/components/motion/stacked-slides";
import {
  HeroMotionProvider,
  HeroMotionToggle,
  HeroVideo,
} from "@/components/home/hero-motion";
import { ArrowRight } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { FadeIn } from "@/components/motion";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { routes } from "@/lib/routes";

const heroVideos = [
  "/videos/videos_web2/movie.mp4",
  "/videos/videos_web2/party.mp4",
  "/videos/videos_web2/matchday.mp4",
  "/videos/videos_web2/football.mp4",
  "/videos/videos_web2/pickup.mp4",
  "/videos/videos_web2/runclub.mp4",
  "/videos/videos_web2/large_group.mp4",
  "/videos/videos_web2/study.mp4",
] as const;

// the ticket's stub: a dashed perforation, then an arrow
function TicketStub() {
  return (
    <span aria-hidden="true" className="flex items-center gap-3 max-sm:gap-2.5">
      <span className="h-6 border-l-2 border-dotted border-black/45 max-sm:h-5" />
      <ArrowRight className="size-4 max-sm:size-3.5" strokeWidth={2.25} />
    </span>
  );
}

const heroCtaClassName =
  "inline-flex h-11 min-w-[8.5rem] shrink-0 items-center justify-between gap-3 rounded-none pl-5 pr-3.5 font-display text-base font-semibold lowercase max-sm:h-9 max-sm:min-w-[7rem] max-sm:gap-2.5 max-sm:pl-4 max-sm:pr-3 max-sm:text-sm sm:min-w-[9rem] !text-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none";

export default function Home() {
  return (
    <main className="nuclii-page">
      {/* loads and decodes each section just before it scrolls in */}
      <Prewarm />
      <section
        className="relative min-h-[100svh] overflow-hidden"
        data-analytics-section="home_hero_waitlist"
        id="waitlist"
      >
        <HeroMotionProvider>
          {/* the clips have their speed-up built in (re-encoded at 720p), so they play at 1x */}
          <HeroVideo
            className="absolute inset-0"
            playbackRate={1}
            poster="/videos/videos_web2/movie-poster.jpg"
            sources={heroVideos}
          />
          {/* light scrims keep the footage bright, darkening only behind the nav and copy */}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* full-width with a fluid gutter (not the capped container) so the copy stays anchored
              to the same edges as the nav and toggle on wide screens */}
          <div className="relative z-10 flex min-h-[100svh] w-full items-end px-[var(--container-x)] lg:px-[clamp(3rem,5.5vw,7rem)] pb-[clamp(3.25rem,9vh,6rem)] pt-[max(7rem,16svh)] md:pt-[clamp(7rem,14vh,9rem)] lg:pb-[clamp(5.5rem,10vh,7rem)]">
            <FadeIn className="w-full">
              <h1 className="mt-1 text-[2.75rem] font-semibold lowercase leading-none tracking-[-0.02em] text-white text-balance sm:text-[3.75rem] lg:text-[4rem] xl:text-[clamp(4.5rem,4.5vw,6rem)]">
                more than memories
              </h1>

              {/* copy sits just above the CTA row's baseline, as in the layout reference */}
              <div className="mt-3 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                <p className="min-w-0 max-w-[30em] font-display text-base font-normal leading-[1.5] tracking-normal text-white/90 sm:text-lg lg:mb-12 xl:text-[clamp(1.25rem,1.2vw,1.625rem)] xl:leading-[1.4]">
                  <span className="max-sm:block">
                    Turn any idea into an experience, fill the room with the people it&apos;s for.
                  </span>{" "}
                  Then, do it again.
                </p>

                <div className="flex shrink-0 items-center gap-2.5 lg:mr-16">
                  <TrackedLink
                    analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
                    analyticsProperties={{ cta: "explore", location: "home_hero" }}
                    className="inline-flex h-11 shrink-0 items-center justify-center rounded-none bg-white px-6 font-display text-base font-semibold lowercase max-sm:h-9 max-sm:px-4 max-sm:text-sm !text-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
                    href={routes.explore}
                    style={ticketPillStyle}
                  >
                    explore
                  </TrackedLink>
                  <TrackedLink
                    analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
                    analyticsProperties={{ cta: "create", location: "home_hero" }}
                    className={`${heroCtaClassName} bg-[var(--nuclii-lime)]`}
                    href={routes.create}
                    style={ticketPillStyle}
                  >
                    create
                    <TicketStub />
                  </TrackedLink>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* bottom-right utility spot, lined up with the nav's right edge */}
          <HeroMotionToggle className={`absolute bottom-1.5 z-10 lg:bottom-9 ${motionToggleEdgeClassName}`} />
        </HeroMotionProvider>
      </section>

      <ConceptSection />

      <GlobeSection />

      {/* testing: scroll sequence in place of <ExploreSection /> — swap back to undo */}
      <ExploreSequence />

      {/* the "make" story: four steps that stack over each other as you
          scroll (was the pinned <MakeChapter /> — swap back to undo) */}
      <StackedSlides>
        <CreateLookSection />
        <ControlSection />
        <LineupSection />
        <CircleSection />
      </StackedSlides>

      <AppTeaserSection />

      <FaqSection />
    </main>
  );
}
