import type { Metadata } from "next";

import { JoinForm } from "@/components/join/join-form";
import { WaitlistTicker } from "@/components/join/waitlist-ticker";
import { VideoBackgroundCarousel } from "@/components/media/video-background-carousel";
import { FadeIn } from "@/components/motion";
import { PageTitle } from "@/components/ui/marketing-typography";
import { EXPERIENCE_ROLES } from "@/lib/experience-roles";

const ACCENT = EXPERIENCE_ROLES.explorer.partnerAccent;

const title = "Join Early Access | Nuclii";
const description =
  "Join the first wave of Nuclii — UK early access for discovering, hosting and accessing real-world experiences without followers, group chats or social pressure.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "/join",
    images: [
      {
        url: "/homepage/venue.jpg",
        width: 1200,
        height: 800,
        alt: "A venue prepared for a real-world Nuclii experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/homepage/venue.jpg"],
  },
};

const BACKGROUND_VIDEOS = [
  "/joinwaitlist_videos/art.mp4",
  "/joinwaitlist_videos/football.mp4",
  "/joinwaitlist_videos/friends%20chilling.mp4",
  "/joinwaitlist_videos/games%20night.mp4",
  "/joinwaitlist_videos/house%20party.mp4",
  "/joinwaitlist_videos/pop%20up.mp4",
  "/joinwaitlist_videos/snaptik_7559390501611244822_v3.mp4",
  "/joinwaitlist_videos/13734741_3840_2160_30fps.mp4",
  "/joinwaitlist_videos/6145424-uhd_2160_3840_24fps.mp4",
] as const;

export default function JoinPage() {
  return (
    <main className="nuclii-page">
      <section
        className="relative min-h-[100svh] overflow-hidden px-[var(--container-x)] pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.75rem))] sm:pt-28 lg:pb-20"
        data-analytics-section="join_entry"
      >
        <VideoBackgroundCarousel
          className="absolute inset-0"
          cycleMs={6000}
          playbackRate={1.25}
          randomize
          sources={BACKGROUND_VIDEOS}
        />
        <div className="absolute inset-0 bg-black/50" />
        {/* Centered spotlight: darkens behind the hero + form, lets the video breathe at the edges. */}
        <div className="absolute inset-0 bg-[radial-gradient(78%_62%_at_50%_42%,rgba(10,10,11,0.82)_0%,rgba(10,10,11,0.34)_62%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/66 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-2xl flex-col items-center justify-start sm:min-h-[calc(100svh-10rem)] sm:justify-center">
          <FadeIn className="flex w-full flex-col items-center text-center">
            <WaitlistTicker />

            <PageTitle className="mt-5 text-[clamp(2.45rem,14vw,3.7rem)] text-white sm:mt-6 sm:text-[clamp(2.5rem,6vw,4.5rem)]">
              <span className="block">you&apos;re still</span>
              <span className="block" style={{ color: ACCENT }}>
                early!
              </span>
            </PageTitle>

            <p className="mt-4 max-w-[32rem] text-balance text-[0.95rem] leading-[1.55] text-white/72 sm:mt-5 sm:text-lg">
              nuclii is the home for real experiences, hidden spaces,
              pop-ups and the people making your city feel alive. get in
              before we open.
            </p>
          </FadeIn>

          <FadeIn className="mt-5 w-full sm:mt-7" delay={0.08}>
            <JoinForm />
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
