import { DemoDoorway } from "@/components/home/demo-doorway";
import { ExperienceLayersScroll } from "@/components/home/experience-layers-scroll";
import { FeaturePillars } from "@/components/home/feature-pillars";
import { Testimonials } from "@/components/home/testimonials";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { FadeIn, Reveal } from "@/components/motion";
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
      "find events, workshops, services, pickups and private moments around you without needing the right group chat.",
    image: "/homepage/explore.jpg",
    imagePosition: "50% 72%",
    alt: "Friends sitting together beside the sea",
  },
  {
    number: "02",
    title: EXPERIENCE_ROLES.host.label,
    description:
      "turn an idea into a listing, manage demand, coordinate access and bring the right people around the moment.",
    image: "/homepage/hosts.jpg",
    imagePosition: "50% 48%",
    alt: "An organiser planning an experience with their team",
  },
  {
    number: "03",
    title: EXPERIENCE_ROLES.venue.label,
    description:
      "show what your space can hold — capacity, atmosphere, availability and the kind of gatherings it was built for.",
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
        <VideoBackgroundCarousel
          className="absolute inset-0 [filter:saturate(0.62)_contrast(1.06)_brightness(0.76)]"
          sources={heroVideos}
        />
        <div className="absolute inset-0 bg-black/42" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_48%,rgba(91,140,255,0.11),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.56)_46%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-background/86 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="nuclii-container relative z-10 flex min-h-[100svh] items-end pb-[clamp(3.25rem,9vh,6rem)] pt-[max(7rem,16svh)] md:pt-[clamp(7rem,14vh,9rem)] lg:items-center">
          <FadeIn className="grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,31rem)] lg:gap-20 xl:gap-24">
            <div className="max-w-[45rem]">
              <p className="mb-5 text-sm font-bold lowercase tracking-normal text-white/70 sm:text-base">
                every event starts here
              </p>
              <h1 className="max-w-[17ch] text-[2.5rem] font-extrabold lowercase leading-[0.98] tracking-normal text-white text-balance sm:text-[3.3rem] lg:text-[3.85rem] xl:text-[4.25rem]">
                nuclii is a new way to discover events, pop-ups and
                experiences near you.
              </h1>

              <div className="mt-7 max-w-[38rem] border-t border-white/18 pt-5 sm:mt-8">
                <p className="text-base font-normal lowercase leading-[1.58] tracking-normal text-white/84 sm:text-lg">
                  find local events, pop-ups, venues and communities near you
                  — and, if you host, reach the right people. everything worth
                  going to, in one place.
                </p>
              </div>
            </div>

            <div className="w-full border-t border-white/18 pt-5 lg:ml-auto lg:max-w-[31rem] lg:border-l lg:border-t-0 lg:pl-10">
              <div className="mb-5">
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-lg font-extrabold lowercase leading-none tracking-normal text-white sm:text-xl">
                  <span>discover.</span>
                  <span>host.</span>
                  <span>collaborate.</span>
                </p>
                <p className="mt-3 max-w-[27rem] text-sm lowercase leading-6 text-white/64 text-pretty">
                  join the first wave and be first through the door when we
                  open.
                </p>
              </div>
              <WaitlistForm
                className="max-w-[31rem]"
                layout="hero"
                source="home hero"
                submitLabel="join waitlist"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        className="border-t border-border px-[var(--container-x)] pb-16 pt-16 md:pb-24 md:pt-24"
        data-analytics-section="home_experience_layers"
      >
        <div className="mx-auto w-full max-w-[92rem]">
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-[0.85fr_1fr] md:items-end md:gap-16">
            <Reveal>
              <SectionTitle className="text-[clamp(2.35rem,5vw,4.4rem)] leading-[1.03]">
                one platform for every side of the experience.
              </SectionTitle>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-4 text-base leading-relaxed tracking-[-0.02em] text-white/72 sm:text-xl">
                <p>
                  explorers find what is happening. hosts and organisers shape
                  demand. spaces, venues, talent and service providers become
                  easier to discover when the moment needs them.
                </p>
                <p className="text-base font-bold text-white/88 sm:text-lg">
                  that ecosystem is the product — not another social feed.
                </p>
              </div>
            </Reveal>
          </div>

          <ExperienceLayersScroll layers={experienceLayers} />
        </div>
      </section>

      <DemoDoorway />

      <section
        className="border-t border-border px-[var(--container-x)] pb-16 pt-20 md:pb-28 md:pt-28"
        data-analytics-section="home_why_we_exist"
      >
        <div className="mx-auto flex w-full max-w-[86rem] flex-col gap-16 md:gap-24">
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

      <FeaturePillars />
    </main>
  );
}
