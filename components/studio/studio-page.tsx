"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Move } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { HeroMotionProvider, HeroMotionToggle, HeroVideo } from "@/components/home/hero-motion";
import { MotionToggleButton } from "@/components/motion/motion-playback";
import { motionToggleEdgeClassName } from "@/components/motion/motion-toggle-edge";
import { useLessMotion } from "@/components/motion/use-less-motion";
import { SocialLinks } from "@/components/social/SocialLinks";
import {
  comingUp,
  heroVideos,
  hosting,
  ideas,
  journal,
  mission,
  missionCta,
  teamPhotos,
  trailer,
  whyJoin,
} from "@/components/studio/studio-content";
import { JoinTeamDialog } from "@/components/studio/join-team-dialog";
import { MemoriesWall } from "@/components/studio/memories-wall";
import { ticketPillStyle } from "@/components/ui/ticket-pill";
import { captureAnalyticsEvent } from "@/lib/analytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";
import { HELP_WITH, type HelpWith } from "@/lib/team-options";
import { cn } from "@/lib/utils";

// /studio: team nuclii's own corner, on black. A video hero (about 60% of the
// screen) with the spray-painted "nuclii studio" tag across its bottom edge;
// a tilted lime about-us ticket; the line-up (posters you can drag about),
// ideas on sticky notes and a join-the-team flyer; and a white rail on the
// right with the trailer and what's coming up (or "catch-up" when nothing is).

const eyebrow = "text-xs font-semibold uppercase tracking-[0.08em] sm:text-sm";
const h2Class = "font-display text-[clamp(2rem,3.4vw,3rem)] !font-bold lowercase leading-[1.04] tracking-[-0.03em] !text-white";

// the current month, e.g. "OCT 2026"; worked out in the browser so a static
// page never shows the month it was built in
const monthLabel = () =>
  new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date()).toUpperCase();
const noSubscribe = () => () => {};

function useThisMonth() {
  return useSyncExternalStore(noSubscribe, monthLabel, () => "");
}

// ---------- about us: a tilted lime ticket ----------

function AboutTicket() {
  return (
    <section
      aria-labelledby="about-heading"
      className="group relative bg-[var(--nuclii-lime)] text-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] [rotate:-2deg] hover:[rotate:0deg] motion-reduce:transition-none"
      style={{ ...ticketPillStyle, fontSize: "2rem" }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex items-center border-b-2 border-dashed border-black/30 px-6 py-4 sm:w-[22%] sm:border-b-0 sm:border-r-2 sm:px-5 sm:py-8">
          <h2
            className="font-display text-sm !font-bold uppercase tracking-[0.08em] !text-black sm:[writing-mode:vertical-rl] sm:rotate-180"
            id="about-heading"
          >
            about us
          </h2>
        </div>
        <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8">
          {mission.map((paragraph, index) => (
            <p
              className={cn(
                "font-display text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.35] tracking-[-0.01em]",
                index === 0 ? "font-medium" : "!mt-4 font-bold",
              )}
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
          <TrackedLink
            analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
            analyticsProperties={{ cta: "tap_in", location: "studio_about" }}
            className="!mt-6 inline-flex h-12 items-center gap-2 rounded-none bg-[#0A0A0B] px-6 font-display text-base font-semibold lowercase !text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nuclii-lime)] motion-reduce:transform-none"
            href={missionCta.href}
            style={ticketPillStyle}
          >
            {missionCta.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}

// ---------- the line-up: posters you can drag about ----------

function Poster({
  poster,
  constraints,
  still,
}: {
  poster: (typeof hosting)[number];
  constraints: RefObject<HTMLDivElement | null>;
  still: boolean;
}) {
  const dragged = useRef(false);
  return (
    <motion.li
      className="relative w-full cursor-grab touch-pan-y active:cursor-grabbing"
      drag={!still}
      dragConstraints={constraints}
      dragElastic={0.15}
      dragMomentum={false}
      onDragEnd={() => window.setTimeout(() => (dragged.current = false), 0)}
      onDragStart={() => (dragged.current = true)}
      style={{ rotate: poster.tilt }}
      whileDrag={{ scale: 1.04, rotate: 0, zIndex: 10 }}
    >
      <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 size-3.5 -translate-x-1/2 rounded-full bg-[#F04A23] shadow" />
      <div className="bg-white p-3 pb-4 text-black shadow-[0_24px_40px_-24px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#141416]">
          <Image alt="" className="pointer-events-none object-cover" draggable={false} fill sizes="(min-width: 1024px) 15rem, 45vw" src={poster.image} />
        </div>
        <p className="!mt-3 font-display text-base font-bold lowercase leading-tight sm:text-lg">{poster.title}</p>
        <p className="!mt-1 text-sm text-black/55">
          {poster.when} · {poster.where}
        </p>
        <TrackedLink
          analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
          analyticsProperties={{ cta: "studio_event", label: poster.title, location: "studio_lineup" }}
          className="!mt-3 inline-flex h-9 items-center gap-1.5 rounded-none bg-[var(--nuclii-lime)] px-3.5 font-display text-sm font-semibold !text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          href={routes.events}
          onClickCapture={(event) => {
            if (dragged.current) event.preventDefault();
          }}
          style={ticketPillStyle}
        >
          see the event
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </TrackedLink>
      </div>
    </motion.li>
  );
}

// "I'd come" is just for fun for now: nothing is saved and there are no counts
function IdeaNote({ idea, still }: { idea: (typeof ideas)[number]; still: boolean }) {
  const [joined, setJoined] = useState(false);
  return (
    <li
      className="flex min-h-[11rem] flex-col justify-between bg-[#D6F46C] p-5 text-black shadow-[0_18px_30px_-20px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:rotate-0 motion-reduce:transition-none"
      style={{ rotate: `${idea.tilt}deg` }}
    >
      <p className="font-display text-lg font-bold lowercase leading-snug">{idea.title}</p>
      <button
        aria-pressed={joined}
        className={cn(
          "!mt-4 inline-flex h-9 items-center gap-1.5 self-start rounded-none px-3.5 font-display text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black",
          joined ? "bg-[#0A0A0B] text-white" : "bg-white text-black hover:bg-black/10",
        )}
        onClick={() => setJoined((v) => !v)}
        style={ticketPillStyle}
        type="button"
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5"
            exit={still ? { opacity: 0 } : { opacity: 0, y: -6 }}
            initial={still ? { opacity: 0 } : { opacity: 0, y: 6 }}
            key={joined ? "in" : "out"}
            transition={{ duration: 0.18 }}
          >
            {joined ? (
              <>
                <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> you&apos;re in
              </>
            ) : (
              "I'd come"
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </li>
  );
}

// ---------- join the team ----------

// a pile of team moments you can throw about
function PhotoPile({ still }: { still: boolean }) {
  const pileRef = useRef<HTMLDivElement>(null);
  return (
    <div aria-hidden="true" className="relative h-[13rem] sm:h-[15rem]" ref={pileRef}>
      {teamPhotos.map((photo, index) => (
        <motion.div
          className="absolute top-4 w-[var(--pw)] cursor-grab bg-white p-2 pb-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] [--pw:38%] active:cursor-grabbing sm:[--pw:26%]"
          drag={!still}
          dragConstraints={pileRef}
          dragElastic={0.2}
          key={photo.src}
          // spread evenly so the last photo ends at the right edge
          style={{ left: `calc((100% - var(--pw)) * ${index / (teamPhotos.length - 1)})`, rotate: photo.tilt, zIndex: index }}
          whileDrag={{ scale: 1.06, zIndex: 20 }}
        >
          <div className="relative aspect-square overflow-hidden bg-[#141416]">
            <Image alt="" className="pointer-events-none object-cover" draggable={false} fill sizes="12rem" src={photo.src} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Tearing a tab off opens the join-the-team pop-up with that role ticked.
// Tabs grow back once the pop-up closes.
function Flyer({ still }: { still: boolean }) {
  const [torn, setTorn] = useState<HelpWith | null>(null);
  const [open, setOpen] = useState(false);
  // a fresh form each time it opens
  const [openCount, setOpenCount] = useState(0);

  const tear = (role: HelpWith) => {
    setTorn(role);
    setOpen(true);
    setOpenCount((n) => n + 1);
    captureAnalyticsEvent(ANALYTICS_EVENTS.teamFormOpened, { role, location: "studio_flyer" });
  };

  return (
    <>
      <div className="relative bg-white text-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]" style={{ rotate: "-0.8deg" }}>
        <span aria-hidden="true" className="absolute -top-3 left-8 h-6 w-20 rotate-[-6deg] bg-white/70 shadow-sm" />
        <span aria-hidden="true" className="absolute -top-3 right-10 h-6 w-20 rotate-[5deg] bg-white/70 shadow-sm" />
        <div className="px-6 pb-6 pt-9 sm:px-10">
          <p className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
            help
            <br />
            wanted.
          </p>
          <p className="!mt-4 max-w-[30rem] text-base leading-relaxed text-black/65">Pick your thing and tear off a tab.</p>
        </div>
        <ul aria-label="Roles" className="flex border-t-2 border-dashed border-black/25">
          {HELP_WITH.map((role) => (
            <li className="relative h-40 flex-1 border-l-2 border-dashed border-black/25 first:border-l-0" key={role}>
              <AnimatePresence>
                {torn !== role && (
                  <motion.span
                    className="absolute inset-0"
                    exit={still ? { opacity: 0 } : { y: 160, rotate: 18, opacity: 0, transition: { duration: 0.7, ease: "easeIn" } }}
                    initial={false}
                  >
                    <button
                      aria-haspopup="dialog"
                      className="flex size-full items-center justify-center bg-white px-0.5 transition-colors hover:bg-[var(--nuclii-lime)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black"
                      onClick={() => tear(role)}
                      type="button"
                    >
                      <span className="whitespace-nowrap font-display text-[0.7rem] font-bold uppercase tracking-[0.06em] [writing-mode:vertical-rl] sm:text-sm">
                        {role}
                      </span>
                      <span className="sr-only"> (join the team as {role})</span>
                    </button>
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
      <JoinTeamDialog
        key={openCount}
        onClose={() => {
          setOpen(false);
          setTorn(null);
        }}
        open={open}
        role={torn}
      />
    </>
  );
}

// ---------- the rail: trailer, then coming up (or catch-up) ----------

// The trailer sits paused on its first frame. The play/pause button in its
// corner plays it through once (sound off) or pauses it; when it ends it goes
// back to the start. Tapping the clip itself opens TikTok.
function Trailer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="relative">
      <a
        className="group relative block aspect-[4/5] overflow-hidden bg-[#141416] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black lg:aspect-auto lg:h-[min(13rem,19svh)]"
        href={trailer.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <video
          aria-hidden="true"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          muted
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
          }}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          playsInline
          preload="metadata"
          ref={videoRef}
          src={`${trailer.src}#t=0.1`}
        />
        <span className="sr-only">{trailer.label} (opens in a new tab)</span>
      </a>
      <MotionToggleButton className="absolute bottom-1 right-1" label="trailer" onToggle={toggle} playing={playing} />
    </div>
  );
}

function Rail() {
  return (
    <div className="bg-white p-5 text-black [color-scheme:light]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[1.9rem] !font-bold lowercase leading-none tracking-[-0.03em] !text-black">journal</h2>
        <a
          className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-black/70 underline-offset-2 hover:text-black hover:underline"
          href={trailer.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {trailer.label}
        </a>
      </div>
      <div className="!mt-3">
        <Trailer />
      </div>

      {comingUp ? (
        <div className="!mt-7">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-base font-bold lowercase">coming up</p>
            <TrackedLink
              analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
              analyticsProperties={{ label: "events", location: "studio_rail" }}
              className="text-sm font-semibold text-black/70 hover:text-black"
              href={routes.events}
            >
              events
            </TrackedLink>
          </div>
          <div className="relative !mt-2 aspect-[4/5] overflow-hidden bg-[#141416] lg:aspect-auto lg:h-[min(24rem,33svh)]">
            <Image alt="" className="object-cover" fill sizes="20rem" src={comingUp.image} />
            {comingUp.prize && (
              <span
                className="absolute bottom-3 left-3 bg-[var(--nuclii-lime)] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.05em] text-black shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] [rotate:-3deg]"
                style={ticketPillStyle}
              >
                {comingUp.prize}
              </span>
            )}
          </div>
          <p className="!mt-3 font-display text-lg font-bold lowercase leading-tight">{comingUp.title}</p>
          <p className="!mt-1 text-sm text-black/60">
            {comingUp.category} · {comingUp.when}
          </p>
          <p className="text-sm text-black/60">{comingUp.where}</p>
          <TrackedLink
            analyticsEvent={ANALYTICS_EVENTS.ctaClicked}
            analyticsProperties={{ cta: "register_interest", label: comingUp.title, location: "studio_rail" }}
            className="!mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-none bg-[var(--nuclii-lime)] font-display text-sm font-bold uppercase tracking-[0.06em] !text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            href={routes.events}
            style={ticketPillStyle}
          >
            register interest
          </TrackedLink>
        </div>
      ) : (
        <div className="!mt-7">
          <p className="font-display text-base font-bold lowercase">catch-up</p>
          <ol className="!mt-2 flex flex-col divide-y divide-black/10">
            {journal.map((entry) => (
              <li className="py-3" key={entry.title}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-black/45">{entry.date}</p>
                <p className="!mt-1 font-display text-base font-bold lowercase leading-snug">{entry.title}</p>
                <p className="!mt-0.5 text-sm leading-relaxed text-black/60">{entry.line}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ---------- the page ----------

function StudioPage() {
  const lessMotion = useLessMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const month = useThisMonth();

  return (
    <main className="bg-[#0A0A0B] text-white">
      {/* hero, with the spray tag across its bottom edge */}
      <div className="relative">
        <section
          aria-label="nuclii studio"
          className="relative h-[min(60svh,42rem)] min-h-[24rem] overflow-hidden"
          data-analytics-section="studio_hero"
        >
          <HeroMotionProvider>
            {/* black and white here (a CSS filter, so the same clip stays in
                colour on the home page) */}
            <HeroVideo className="absolute inset-0 grayscale" sources={heroVideos} />
            {/* a dark wash over the footage */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            <HeroMotionToggle className={`absolute bottom-3 z-10 ${motionToggleEdgeClassName}`} />
          </HeroMotionProvider>
        </section>
        {/* the tag lines up with the content column below, at any screen width;
            the small negative margin offsets the spray's own soft edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-[var(--container-x)]">
          <h1 className="!mx-auto w-full max-w-[88rem]">
            <Image
              alt="nuclii studio"
              className="-ml-[5%] h-auto w-[108%] max-w-[52rem] sm:-ml-[4%] sm:w-[min(100%,52rem)] lg:w-[68%] lg:max-w-none"
              height={401}
              priority
              sizes="(min-width: 1024px) 55rem, 95vw"
              src="/logo/nuclii-studio-spray.webp"
              width={1600}
            />
          </h1>
        </div>
      </div>

      <div className="px-[var(--container-x)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(4.5rem,9vw,8rem)]">
        <div className="mx-auto grid w-full max-w-[88rem] gap-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14 2xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="flex min-w-0 flex-col gap-[clamp(4rem,8vw,6rem)]">
            <AboutTicket />

            {/* the rail sits here on phones and tablets */}
            <div className="lg:hidden">
              <Rail />
            </div>

            {/* the line-up */}
            <section aria-labelledby="lineup-heading" data-analytics-section="studio_lineup">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-3">
                <h2 className={cn(eyebrow, "!text-white")} id="lineup-heading">
                  the line up
                </h2>
                <span className={cn(eyebrow, "text-white/60")}>
                  {month}
                </span>
              </div>
              {!lessMotion && (
                <p className="!mt-3 flex items-center gap-1.5 text-sm text-white/45">
                  <Move aria-hidden="true" className="size-4" /> move the posters about
                </p>
              )}
              <div className="!mt-5" ref={boardRef}>
                <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-7">
                  {hosting.map((poster) => (
                    <Poster constraints={boardRef} key={poster.title} poster={poster} still={lessMotion} />
                  ))}
                </ul>
              </div>
            </section>

            {/* ideas */}
            <section aria-labelledby="ideas-heading" data-analytics-section="studio_ideas">
              <div className="border-b border-white/15 pb-3">
                <h2 className={cn(eyebrow, "!text-white")} id="ideas-heading">
                  thinking of hosting
                </h2>
              </div>
              <ul className="!mt-6 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-4">
                {ideas.map((idea) => (
                  <IdeaNote idea={idea} key={idea.title} still={lessMotion} />
                ))}
              </ul>
            </section>

            {/* the memories wall */}
            <section aria-labelledby="wall-heading" data-analytics-section="studio_wall">
              <div className="border-b border-white/15 pb-3">
                <h2 className={cn(eyebrow, "!text-white")} id="wall-heading">
                  the memories wall
                </h2>
              </div>
              <div className="!mt-6">
                <MemoriesWall />
              </div>
            </section>

            {/* join the team */}
            <section aria-labelledby="team-heading" className="scroll-mt-28" data-analytics-section="studio_team" id="team">
              <h2 className={h2Class} id="team-heading">
                join the team.
              </h2>
              <p className="!mt-4 max-w-[36rem] font-display text-[clamp(1.15rem,1.8vw,1.45rem)] leading-snug text-white/75">
                {whyJoin}
              </p>
              <div className="!mt-6">
                <PhotoPile still={lessMotion} />
              </div>
              <div className="!mt-4">
                <Flyer still={lessMotion} />
              </div>
            </section>

            {/* other bits */}
            <section aria-label="More from studio" className="grid gap-4 sm:grid-cols-2">
              <TrackedLink
                analyticsEvent={ANALYTICS_EVENTS.navigationClicked}
                analyticsProperties={{ label: "partner", location: "studio_bits" }}
                className="group flex flex-col justify-between bg-[#18191D] p-6 !text-white transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                href={routes.partner}
              >
                <span className="font-display text-2xl font-bold lowercase leading-tight">want to co-host with us?</span>
                <span className="!mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--nuclii-lime)]">
                  partner with us <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </TrackedLink>
              <div className="flex flex-col justify-between bg-[#18191D] p-6">
                <span className="font-display text-2xl font-bold lowercase leading-tight">say hi, we&apos;re @wearenuclii</span>
                <div className="!mt-6 flex items-center gap-3">
                  <SocialLinks buttonSize="size-10" className="gap-2" iconSize="size-[1.1rem]" />
                  <ArrowUpRight aria-hidden="true" className="size-4 text-white/30" />
                </div>
              </div>
            </section>
          </div>

          {/* the rail, on desktop */}
          <aside aria-label="Journal" className="hidden lg:block">
            {/* media in the rail scales with screen height, so it always fits */}
            <div className="sticky top-24">
              <Rail />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export { StudioPage };
