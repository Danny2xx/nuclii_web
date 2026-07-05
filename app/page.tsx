import Image from "next/image";

import { ExperienceLayersScroll } from "@/components/home/experience-layers-scroll";
import { ExperienceMap } from "@/components/home/experience-map";
import { Testimonials } from "@/components/home/testimonials";
import { FadeIn, Reveal, RotatingWord } from "@/components/motion";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { SectionTitle } from "@/components/ui/marketing-typography";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

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
    title: EXPERIENCE_ROLES.explorer.label,
    description:
      "find what fits your taste, timing and location — from quiet workshops to packed rooms, new scenes and one-off nights.",
    image: "/homepage/explore.jpg",
    imagePosition: "50% 72%",
    alt: "Friends sitting together beside the sea",
  },
  {
    number: "02",
    title: EXPERIENCE_ROLES.host.label,
    description:
      "shape the idea, build demand, sell access and pull the right venue, talent and support around the moment.",
    image: "/homepage/hosts.jpg",
    imagePosition: "50% 48%",
    alt: "An organiser planning an experience with their team",
  },
  {
    number: "03",
    title: EXPERIENCE_ROLES.venue.label,
    description:
      "show what your space can hold — capacity, amenities, atmosphere, availability and the kind of gatherings it was built for.",
    image: "/homepage/venue.jpg",
    imagePosition: "48% 50%",
    alt: "A venue prepared for a gathering",
  },
  {
    number: "04",
    title: EXPERIENCE_ROLES.talent.label,
    description:
      "put your skill where organisers are already looking — food, decor, sound, styling, performance, workshops, media, craft and hands-on services.",
    image: "/homepage/talent.jpg",
    imagePosition: "72% 50%",
    alt: "A DJ performing at an outdoor gathering",
  },
] as const;

export default function Home() {
  return (
    <main className="nuclii-page">
      <section
        className="relative min-h-[100svh] overflow-hidden"
        data-analytics-section="home_hero_waitlist"
        id="waitlist"
      >
        <VideoBackgroundCarousel className="absolute inset-0" sources={heroVideos} />
        <div className="absolute inset-0 bg-black/36" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="nuclii-container relative z-10 flex min-h-[100svh] items-start pb-12 pt-[max(8.5rem,28svh)] sm:pt-[32svh] md:pb-[clamp(2rem,4vh,3.25rem)] md:pt-[clamp(7rem,14vh,9rem)]">
          <FadeIn className="w-full">
            <h1 className="max-w-[22rem] text-[clamp(2.35rem,9.6vw,2.85rem)] font-extrabold lowercase leading-[0.98] tracking-[-0.02em] text-white text-balance sm:max-w-[58rem] sm:text-[clamp(2.85rem,8vw,4.65rem)] md:text-[clamp(4rem,5.3vw,5.8rem)]">
              make the moment happen.
              <br />
              <RotatingWord />
              <br />
              make the memories last.
            </h1>
            <div className="mt-9 grid w-full min-w-0 max-w-[70rem] gap-6 border-t border-white/15 pt-5 sm:mt-10 md:grid-cols-[minmax(16rem,23rem)_minmax(28rem,38rem)] md:items-start md:gap-8">
              <div className="min-w-0 max-w-full sm:max-w-[28rem]">
                <div className="space-y-3">
                  <p className="text-lg font-bold lowercase tracking-[-0.01em] text-white sm:text-xl">
                    never miss what matters.
                  </p>
                  <p className="max-w-[20rem] text-base font-normal lowercase leading-[1.58] tracking-[-0.01em] text-white/70 break-words sm:max-w-none">
                    make new memories, create the rooms you crave, share the
                    spaces you&apos;ve curated, and nurture every connection
                    after. nuclii is here at every step.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/15 pt-4 sm:mt-9">
                  <p className="flex flex-wrap gap-x-3 gap-y-1 text-base font-extrabold lowercase tracking-[0.05em] text-white/95 sm:text-lg">
                    <span>discover.</span>
                    <span>host.</span>
                    <span>collaborate.</span>
                  </p>
                </div>
              </div>
              <WaitlistForm layout="hero" source="home hero" />
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        className="border-t border-border px-[var(--container-x)] pb-16 pt-28 md:pb-28 md:pt-56"
        data-analytics-section="home_why_we_exist"
      >
        <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-20 md:gap-36">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start md:gap-16">
            <Reveal>
              <SectionTitle className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.03]">
                great moments should not be hard to find, difficult to build,
                or easy to forget.
              </SectionTitle>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-6 text-base leading-relaxed tracking-[-0.02em] text-white/78 sm:text-xl md:border-l md:border-white/12 md:pl-12">
                <p>
                  too many moments are held together by scattered tools, private
                  links, screenshots, group chats and last-minute favours.
                </p>
                <p className="font-bold text-white">
                  nuclii brings the missing pieces into one place.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      <section
        className="px-[var(--container-x)] pb-20 pt-8 md:pb-48 md:pt-12"
        data-analytics-section="home_experience_layers"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <ExperienceLayersScroll layers={experienceLayers} />
        </div>
      </section>

      <section
        className="nuclii-section border-t border-border"
        data-analytics-section="home_map_preview"
      >
        <div className="nuclii-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <SectionTitle>
                a map for more than directions.
              </SectionTitle>
              <div className="mt-7 space-y-5 text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
                <p>
                  search by interest, date, area and vibe. nuclii turns events,
                  spaces and talent into map cards you can scan, compare and
                  save.
                </p>
                <p className="text-base text-white/55 sm:text-lg">
                  so you always know what&apos;s on, what fits, and what&apos;s
                  worth showing up for.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ExperienceMap />
          </Reveal>
        </div>
      </section>

      <section
        className="nuclii-section border-t border-border"
        data-analytics-section="home_privacy_by_default"
      >
        <div className="nuclii-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <div>
              <SectionTitle>
                privacy by default
              </SectionTitle>
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
    </main>
  );
}
